const User = require('../models/User');
const Order = require('../models/Order');

// @desc  Get all users (admin)
// @route GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments({}),
    ]);
    res.json({ users, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (err) {
    next(err);
  }
};

// @desc  Get user by ID with their orders (admin)
// @route GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const [user, orders] = await Promise.all([
      User.findById(req.params.id).select('-password'),
      Order.find({ user: req.params.id }).sort({ createdAt: -1 }),
    ]);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user, orders });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete user (admin)
// @route DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin account' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (err) {
    next(err);
  }
};

// @desc  Update user role (admin)
// @route PUT /api/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, deleteUser, updateUserRole };
