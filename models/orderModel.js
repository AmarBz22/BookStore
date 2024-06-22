const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  customerName: {
    type: String, // Change the type to String
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Payed','Shipped'], 
    default: 'Pending'
  },
  homePlace: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
