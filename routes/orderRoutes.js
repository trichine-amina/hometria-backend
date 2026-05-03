const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Criterion 4: all order routes are protected
router.post('/',    protect, ctrl.createOrder);
router.get('/',     protect, ctrl.getAllOrders);
router.get('/:id',  protect, ctrl.getOrderById);

module.exports = router;
