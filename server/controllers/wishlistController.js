const User = require('../models/User');

// @desc  Get user's wishlist
// @route GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'wishlist',
      'name price discountPrice images category ratings numReviews'
    );
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

// @desc  Add product to wishlist (idempotent)
// @route POST /api/wishlist/:productId
const addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist', 'name price discountPrice images category ratings numReviews');
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

// @desc  Remove product from wishlist
// @route DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.productId } },
      { new: true }
    ).populate('wishlist', 'name price discountPrice images category ratings numReviews');
    res.json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
