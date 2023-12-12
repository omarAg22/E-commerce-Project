/* eslint-disable react/prop-types */
// DeleteProduct.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import axios from 'axios';

const DeleteProduct = ({ productId, productName, onDelete, onClose }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/products/delete-product/${productId}`);
      onDelete(); // Trigger a refresh of the products list in the parent component
      onClose();
      console.log('Product deleted successfully:', productName);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Delete Product</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete the product{productName}?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProduct;
