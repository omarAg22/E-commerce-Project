const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/uploadMiddleware');

const {
  createProduct,
  listProducts,
  searchProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toutLesProduits,
} = require('../controllers/productController');

router.post('/create-product', upload.single('product_image'), createProduct);
router.get('/get-all-product', listProducts);
router.get('/search-for-products', searchProducts);
router.get('/get-product-byId/:id', getProductById);
router.put(
  '/update-product/:id',
  upload.single('product_image'),
  updateProduct
);
router.delete('/delete-product/:id', deleteProduct);
router.get('/tout', toutLesProduits);

module.exports = router;
