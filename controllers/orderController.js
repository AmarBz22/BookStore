const Order = require('../models/orderModel');
const Book = require('../models/bookModel');

// Place an order
exports.makeOrder = async (req, res) => {
  try {
      const { items, homePlace ,customerName} = req.body;
      

      // Calculate total price
      let totalPrice = 0;
      const orderItems = [];

      // Validate items and calculate total price
      for (const item of items) {
          const book = await Book.findOne({ title: item.title });
          if (!book) {
              return res.status(400).json({ error: `Book not found: ${item.title}` });
          }
          if (item.quantity <= 0 || item.quantity > book.stockQuantity) {
              return res.status(400).json({ error: `Invalid quantity for book: ${item.title}` });
          }
          totalPrice += book.price * item.quantity;

          // Update stock quantity
          book.stockQuantity -= item.quantity;
          await book.save();

          // Add to order items
          orderItems.push({ book: book._id, quantity: item.quantity });
      }

      // Create and save the order
      const order = new Order({
          items: orderItems,
          customerName, // Use username directly from req.user
          totalPrice,
          status: 'Pending',
          homePlace,
      });

      const savedOrder = await order.save();
      res.status(201).json(savedOrder);
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

// View order history
exports.getOrderHistory = async (req, res) => {
    try {
        const { userId } = req.user;
        const orders = await Order.find({ user: userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// View order details
exports.getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { username } = req.user;
        const order = await Order.findOne({ _id: orderId, customerName: username });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { username } = req.user;
        const order = await Order.findOne({ _id: orderId, customerName: username });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'Pending') {
            return res.status(400).json({ error: 'Cannot cancel order. Order status is not Pending' });
        }

        order.status = 'Cancelled';
        await order.save();
        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Confirm an order
exports.confirmOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status === 'Cancelled') {
            return res.status(400).json({ error: 'Cannot confirm a cancelled order' });
        }
        if (order.status === 'Payed') {
            return res.status(400).json({ error: 'Order is already paid' });
        }
        if (order.status === 'Shipped') {
            return res.status(400).json({ error: 'Order is already shipped' });
        }

        order.status = 'Payed';
        await order.save();
        res.json({ message: 'Order confirmed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ship an order
exports.shippedOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status !== 'Payed') {
            return res.status(400).json({ error: 'Order must be in "Payed" status to be shipped' });
        }

        order.status = 'Shipped';
        await order.save();
        res.json({ message: 'Order shipped successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search orders
exports.searchOrders = async (req, res) => {
    try {
        const { customerName, status } = req.body;
        const filter = {};

        if (customerName) {
            filter.customerName = new RegExp(customerName, 'i');
        }
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
