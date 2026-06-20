const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc  Create order + Stripe payment intent
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify prices and stock server-side — never trust client-sent prices
    const itemsWithPrices = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product || !product.isActive) throw new Error(`Product not found`);
        const sizeEntry = product.sizes.find((s) => s.size === item.size);
        if (!sizeEntry || sizeEntry.stock < item.qty) {
          throw new Error(`Insufficient stock for ${product.name} size ${item.size}`);
        }
        return {
          product: product._id,
          name: product.name,
          size: item.size,
          color: item.color || null,
          qty: item.qty,
          price: product.discountPrice && product.discountPrice < product.price
            ? product.discountPrice
            : product.price,
          image: product.images[0] || null,
        };
      })
    );

    const itemsPrice = Number(
      itemsWithPrices.reduce((acc, i) => acc + i.price * i.qty, 0).toFixed(2)
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
    const totalPrice = Number((itemsPrice + shippingPrice).toFixed(2));

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: 'usd',
      metadata: { userId: req.user._id.toString() },
    });

    const order = await Order.create({
      user: req.user._id,
      orderItems: itemsWithPrices,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      itemsPrice,
      shippingPrice,
      totalPrice,
      stripePaymentIntentId: paymentIntent.id,
    });

    // Decrement stock atomically
    await Promise.all(
      itemsWithPrices.map((item) =>
        Product.updateOne(
          { _id: item.product, 'sizes.size': item.size },
          { $inc: { 'sizes.$.stock': -item.qty, soldCount: item.qty } }
        )
      )
    );

    res.status(201).json({ order, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

// @desc  Confirm order as paid (called by client after Stripe confirms)
// @route PUT /api/orders/:id/pay
const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc  Get single order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// --- Admin ---

// @desc  Get all orders with optional status filter and pagination
// @route GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc  Dashboard analytics — revenue chart + metric cards + best sellers
// @route GET /api/orders/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const days = Number(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [revenueData, totals, productCount, customerCount, bestSellers] = await Promise.all([
      Order.aggregate([
        { $match: { isPaid: true, paidAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { isPaid: true } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
          },
        },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Product.find({ isActive: true })
        .sort({ soldCount: -1 })
        .limit(5)
        .select('name soldCount images price discountPrice'),
    ]);

    res.json({
      revenueData,
      totalRevenue: totals[0]?.totalRevenue || 0,
      totalOrders: totals[0]?.totalOrders || 0,
      totalProducts: productCount,
      totalCustomers: customerCount,
      bestSellers,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
  updateOrderToPaid,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
};
