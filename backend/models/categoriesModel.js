const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
  },
  categorie_image: {
    type: String,
    required: false,
  },

  active: {
    type: Boolean,
    required: true,
  },
});

const Category = mongoose.model('Categories', categoriesSchema);
module.exports = Category;
