const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc  Get reviews for a product
// @route GET /api/products/:productId/reviews
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc  Create review (must have purchased product)
// @route POST /api/products/:productId/reviews
const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Verify purchase
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      isPaid: true,
      'orderItems.product': productId,
    });
    if (!hasPurchased) {
      return res.status(403).json({ message: 'You can only review products you have purchased' });
    }

    const exists = await Review.findOne({ user: req.user._id, product: productId });
    if (exists) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
    });
    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// @desc  Delete review (owner or admin)
// @route DELETE /api/products/:productId/reviews/:reviewId
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    await Review.calcAverageRating(req.params.productId);
    res.json({ message: 'Review removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductReviews, createReview, deleteReview };
