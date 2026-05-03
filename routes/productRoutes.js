const express    = require('express');
const router     = express.Router();
const ctrl       = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/',    ctrl.getAllProducts);   // supports ?page=&limit=&category=
router.get('/:id', ctrl.getProductById);

// Criterion 1: hidden seed route (admin protected)
router.post('/seed', protect, adminOnly, ctrl.seedProducts);

// Criterion 4: protected admin routes
router.post('/',    protect, adminOnly, ctrl.createProduct);
router.put('/:id',  protect, adminOnly, ctrl.updateProduct);
router.delete('/:id', protect, adminOnly, ctrl.deleteProduct);

module.exports = router;
