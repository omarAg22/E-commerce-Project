const Category = require('../models/categoriesModel');
const Subcategory = require('../models/subcategoriesModel');

const createCategory = async (req, res) => {
  const { category_name } = req.body;

  try {
    // Check if the category name is unique
    const existingCategory = await Category.findOne({ category_name });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists.' });
    }

    // Create a new category with active status set to false
    const newCategory = new Category({
      category_name,
      active: false,
    });

    if (req.file) {
      newCategory.categorie_image = req.file.path;
    }

    const savedCategory = await newCategory.save();

    res.json({ message: 'Category created successfully.',savedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    

    const categories = await Category.find().limit(limit).skip(skip);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const searchForCategory = async (req, res) => {
  try {
    const query = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({
      category_name: { $regex: query, $options: 'i' },
    })
      .limit(limit)
      .skip(skip);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { category_name } = req.body;

    // Check if the category name is unique
    const existingCategory = await Category.findOne({
      category_name,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already in use.' });
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { category_name },
      { new: true } // Return the updated category
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if the category has attached subcategories
    const subcategories = await Subcategory.find({ category_id: categoryId });

    if (subcategories.length > 0) {
      return res.status(400).json({
        message: 'Category has attached subcategories and cannot be deleted.',
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createCategory,
  getAllCategories,
  searchForCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
