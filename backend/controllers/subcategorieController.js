const Subcategory = require('../models/subcategoriesModel');
const Category = require('../models/categoriesModel');
const Product = require('../models/productsModel');

const createSubCategory = async (req, res) => {
  try {
    const { category_id, subcategory_name } = req.body;
    // Check if the category_id exists in the Category collection
    const categoryExists = await Category.exists({ _id: category_id });

    if (!categoryExists) {
      return res.status(404).json({
        message: 'Category with the provided category_id does not exist.',
      });
    }

    // Check if the subcategory name is unique within the specified category
    const existingSubcategory = await Subcategory.findOne({
      category_id,
      subcategory_name,
    });

    if (existingSubcategory) {
      return res.status(400).json({
        message:
          'Subcategory name already in use within the specified category.',
      });
    }

    const newSubcategory = new Subcategory({
      category_id,
      subcategory_name,
      active: false, // Set active to false by default
    });

    await newSubcategory.save();

    res.json({ message: 'Category created successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const subcategories = await Subcategory.find()
      .limit(limit)
      .skip(skip)
      .populate('category_id', 'category_name')
      .exec();

    if (!subcategories || subcategories.length === 0) {
      return res.json([]);
    }

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchSubcategories = async (req, res) => {
  try {
    const query = req.query.query || ''; // Get the search query from the request
    const page = req.query.page || 1; // Get the page number from the request

    const limit = 10; // Limit the number of subcategories per page
    const skip = (page - 1) * limit;

    const subcategories = await Subcategory.aggregate([
      {
        $match: {
          subcategory_name: { $regex: query, $options: 'i' }, // Perform a case-insensitive search
        },
      },
      {
        $lookup: {
          from: 'categories', // The name of the Categories collection
          localField: 'category_id',
          foreignField: '_id',
          as: 'category_info',
        },
      },
      {
        $unwind: '$category_info',
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    const subcategory = await Subcategory.findById(subcategoryId).populate(
      'category_id',
      'category_name'
    );

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json(subcategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const { subcategory_name } = req.body;

    // Check if the subcategory ID exists
    const subcategory = await Subcategory.findById(subcategoryId);

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

   // Check if the updated subcategory name already exists in the same category
   const existingSubcategory = await Subcategory.findOne({
    _id: { $ne: subcategoryId }, // Exclude the current subcategory from the search
    category_id: subcategory.category_id, // Assuming the category_id field exists
    subcategory_name,
  });

    if (existingSubcategory) {
      return res.status(400).json({
        message: 'Subcategory name already in use within the specified category.',
      });
    }

    // Update the subcategory data
    subcategory.subcategory_name = subcategory_name;

    // Save the updated subcategory
    const updatedSubcategory = await subcategory.save();

    res.json({
      message: 'Subcategory updated successfully',
      updatedSubcategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    // Check the user's role (admin or manager) and authorize the action.

    const subcategoryId = req.params.id;

    // Check if the subcategory has attached products
    const productsWithSubcategory = await Product.find({ subcategory_id: subcategoryId });

    if (productsWithSubcategory.length > 0) {
      return res.status(400).json({
        message: 'Subcategory has attached products and cannot be deleted.',
      });
    }

    // If no products are attached, proceed with deletion
    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategoryId);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: 'Subcategory not found.' });
    }

    res.json({ message: 'Subcategory deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubCategory,
  getSubcategories,
  searchSubcategories,
  getSubcategoryById,
  updateSubCategory,
  deleteSubcategory
};
