const express = require('express');
const router = express.Router();

const {
  createSubCategory,
  getSubcategories,
  searchSubcategories,
  getSubcategoryById,
  updateSubCategory,
  deleteSubcategory
} = require('../controllers/subcategorieController');

router.post('/create-subCategory', createSubCategory);
router.get('/get-all-subCategories', getSubcategories);
router.get('/search-for-subCategories', searchSubcategories);
router.get('/get-subCategoryById/:id', getSubcategoryById);
router.put('/update-subCategory/:id', updateSubCategory);
router.delete('/delete-subCategory/:id', deleteSubcategory);
module.exports = router;
