const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Ensure this path is correct
const { isAdmin, isClient, isLivreur } = require('../middlewares/requireAuthorization');

// Make an order
router.post('/', isClient, orderController.makeOrder);

// View order history
router.get('/', isClient, orderController.getOrderHistory);

// Confirm order status (for admin)
router.put('/:id/confirm', isAdmin, orderController.confirmOrder);

// View order details
router.get('/:id', isClient, orderController.getOrderDetails);

// Cancel an order
router.put('/:id/cancel', isClient, orderController.cancelOrder);

// Mark order as shipped
router.put('/:id/livrer', isLivreur, orderController.shippedOrder);

router.post('/search', isAdmin, orderController.searchOrders);

module.exports = router;
