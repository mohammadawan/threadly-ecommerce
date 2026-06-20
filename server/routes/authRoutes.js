const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  login
);

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
