const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc  Register new user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc  Update current user profile
// @route PUT /api/auth/me
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) user.password = password;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateMe };
