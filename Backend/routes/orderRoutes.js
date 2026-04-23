const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Place a new order
router.post('/orders', orderController.placeOrder);

// Get order history for a user with status
router.get('/orders/:userId', orderController.getUserOrdersWithStatus);

module.exports = router;
