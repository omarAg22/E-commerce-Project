// Products.jsx
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CreateProduct from './CreateProduct';
import UpdateProduct from './UpdateProduct';
import DeleteProduct from './DeleteProduct';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteProductName, setDeleteProductName] = useState('');

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/categories/all-categories'
        );
        const data = response.data;
        setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/products/get-all-product?page=${currentPage}`
      );
      const data = response.data;
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleProductUpdated = (updatedProduct) => {
    // Update the local state with the updated product
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setSelectedProduct(null); // Clear the selected product
  };

  const handleCloseUpdateModal = () => {
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId, productName) => {
    setDeleteProductId(productId);
    setDeleteProductName(productName);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Delete the product
    const updatedProducts = products.filter((product) => product._id !== deleteProductId);
    setProducts(updatedProducts);
    setShowDeleteModal(false);
    setDeleteProductId(null);
    setDeleteProductName('');
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteProductId(null);
    setDeleteProductName('');
  };

  return (
    <div>
      <h1>Products</h1>
      <CreateProduct
        onProductCreated={() => fetchProducts()}
        categories={categories}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    style={{ width: '50px', height: '50px' }}
                  />
                </TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditProduct(product)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProduct(product._id, product.product_name)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
      />

      {/* Modal for updating product */}
      {selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onUpdate={handleProductUpdated}
          onClose={handleCloseUpdateModal}
          categories={categories}
        />
      )}

      {/* Modal for deleting product */}
      {showDeleteModal && (
        <DeleteProduct
          productId={deleteProductId}
          productName={deleteProductName}
          onDelete={handleConfirmDelete}
          onClose={handleCloseDeleteModal}
        />
      )}
    </div>
  );
};

export default Products;
