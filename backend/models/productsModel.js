const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
    required: false,
  },
  product_name: {
    type: String,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
  short_description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  discount_price: {
    type: Number,
  },
  options: {
    type: Array, // You can specify the appropriate data structure for options
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
