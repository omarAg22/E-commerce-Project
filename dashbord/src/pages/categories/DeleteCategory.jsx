/* eslint-disable react/prop-types */

import  { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DeleteCategory = ({ categoryName, categoryId, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/categories/delete-category/${categoryId}`);
      onDelete(); // Refresh the category list after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      handleClose();
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen} color="error" startIcon={<DeleteIcon />}>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{`Delete ${categoryName}`}</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteCategory;
