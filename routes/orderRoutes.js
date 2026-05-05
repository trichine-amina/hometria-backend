const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// POST is now public - no login required for guest checkout
router.post('/',    ctrl.createOrder);
router.get('/',     protect, ctrl.getAllOrders);
router.get('/:id',  protect, ctrl.getOrderById);

module.exports = router;