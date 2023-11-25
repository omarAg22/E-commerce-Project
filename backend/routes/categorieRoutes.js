const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  searchForCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categorieController');

const {uploadCat} = require('../middleware/uploadMiddleware');

router.post('/create-category',uploadCat.single('categorie_image'), createCategory);
router.get('/all-categories', getAllCategories);
router.get('/search-category', searchForCategory);
router.get('/get-category-by-id/:id', getCategoryById);
router.put('/update-category/:id', updateCategory);
router.delete('/delete-category/:id', deleteCategory);
module.exports = router;
