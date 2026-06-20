const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { uploadToCloudinary } = require('../config/cloudinary');

const LOW_STOCK_THRESHOLD = 5;

// @desc  Get all products (with filters, sort, pagination)
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword, category, subCategory, size, color,
      minPrice, maxPrice, sort, page = 1, limit = 12, featured,
    } = req.query;

    const filter = { isActive: true };
    if (keyword) filter.$text = { $search: keyword };
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (color) filter.colors = { $in: [color] };
    if (size) filter['sizes.size'] = size;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (featured === 'true') filter.isFeatured = true;

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { ratings: -1 },
      popular: { soldCount: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc  Create product (admin)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const images = req.files?.length
      ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer).then((r) => r.secure_url)))
      : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc  Update product (admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const newImages = req.files?.length
      ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer).then((r) => r.secure_url)))
      : [];
    const updatedData = { ...req.body };
    if (newImages.length > 0) updatedData.images = newImages;
    if (typeof updatedData.sizes === 'string') updatedData.sizes = JSON.parse(updatedData.sizes);
    if (typeof updatedData.colors === 'string') updatedData.colors = JSON.parse(updatedData.colors);

    const updated = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true, runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete product (admin — soft delete)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

// @desc  Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc  Get low-stock products (admin)
// @route GET /api/products/low-stock
const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isActive: true,
      'sizes.stock': { $lte: LOW_STOCK_THRESHOLD },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getLowStockProducts,
};
