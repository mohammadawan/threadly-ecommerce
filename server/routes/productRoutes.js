const router = require('express').Router();
const { body } = require('express-validator');
const {
  getProducts, getProductById, createProduct, updateProduct,
  deleteProduct, getFeaturedProducts, getLowStockProducts,
} = require('../controllers/productController');
const { getProductReviews, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('subCategory').notEmpty().withMessage('Sub-category is required'),
];

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/low-stock', protect, admin, getLowStockProducts);
router.get('/:id', getProductById);

router.post('/', protect, admin, upload.array('images', 5), productValidation, createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

// Reviews nested under products
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReview);
router.delete('/:productId/reviews/:reviewId', protect, deleteReview);

module.exports = router;
