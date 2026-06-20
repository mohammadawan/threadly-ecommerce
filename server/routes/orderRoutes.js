const router = require('express').Router();
const {
  createOrder, updateOrderToPaid, getMyOrders,
  getOrderById, getAllOrders, updateOrderStatus, getAnalytics,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/myorders', protect, getMyOrders);
router.get('/analytics', protect, admin, getAnalytics);
router.get('/', protect, admin, getAllOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
