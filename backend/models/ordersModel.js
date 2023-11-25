const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Customer model
    ref: 'Customers', // The name of the model to refer to
    required: true,
  },
  order_items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Products model
        ref: 'Products', // The name of the model to refer to
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  order_date: {
    type: Date,
    default: Date.now,
  },
  cart_total_price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
