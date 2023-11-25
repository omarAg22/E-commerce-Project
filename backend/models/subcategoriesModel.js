const mongoose = require('mongoose');

const subcategoriesSchema = new mongoose.Schema({
  subcategory_name: {
    type: String,
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Categories model
    ref: 'Categories', // The name of the model to refer to
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const Subcategories = mongoose.model('Subcategories', subcategoriesSchema);
module.exports = Subcategories;
