/* eslint-disable react/prop-types */
// UpdateCategory.jsx
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Input,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateCategory = ({ category, onUpdate ,onClose}) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  useEffect(() => {
    setCategoryName(category.category_name);
  }, [category]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageChange = (e) => {
    // Handle file change
    setCategoryImage(e.target.files[0]);
  };

  const handleUpdateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      formData.append('categorie_image', categoryImage);

      const response = await axios.put(`http://localhost:3001/categories/update-category/${category._id}`, formData);

      // Check the response status and show toast accordingly
      if (response.status === 200) {
        toast.success('Category updated successfully.');
        onUpdate(response.data); // Notify the parent component of the update
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error updating category. Please try again.');
      console.error('Error updating category:', error);
    } finally {
      onClose(); // Close the modal
    }
  };

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        startIcon={<SaveIcon />}
        variant="outlined"
        color="primary"
      >
        Update
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <FormControl fullWidth style={{ marginBottom: '16px' }}>
            <InputLabel htmlFor="category-name">Category Name</InputLabel>
            <Input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '16px' }}>
            <InputLabel htmlFor="category-image">Category Image</InputLabel>
            <Input
              id="category-image"
              type="file"
              onChange={handleImageChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UpdateCategory;
