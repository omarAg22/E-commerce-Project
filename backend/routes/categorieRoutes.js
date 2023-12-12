const express = require('express');
const router = express.Router();
const { uploadCat } = require('../middleware/uploadMiddleware');
const {
  createCategorie,
  getAllCategories,
  searchForCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categorieController');

router.post(
  '/create-category',
  uploadCat.single('categorie_image'),
  createCategorie
);
router.get('/all-categories', getAllCategories);
router.get('/search-category', searchForCategory);
router.get('/get-category-by-id/:id', getCategoryById);
router.put(
  '/update-category/:id',
  uploadCat.single('categorie_image'),
  updateCategory
);

router.delete('/delete-category/:id', deleteCategory);
module.exports = router;
