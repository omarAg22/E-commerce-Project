/* eslint-disable react/prop-types */
// CreateCategory.jsx
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Input,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateCategory = ({ onCategoryCreated }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = () => {
    // Trigger the hidden file input when the image is clicked
    document.getElementById('category-image-input').click();
  };

  const handleImageChange = (e) => {
    // Handle file change
    setCategoryImage(e.target.files[0]);
  };

  const handleCreateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      formData.append('categorie_image', categoryImage);

      const response = await axios.post('http://localhost:3001/categories/create-category', formData);

      // Check the response status and show toast accordingly
      if (response.status === 200) {
        // Notify the parent component that a new category has been created
        onCategoryCreated();
        toast.success('Category created successfully.');
      } else {
        // Display the error message from the server
        toast.error(response.data.message);
      }
    } catch (error) {
      // Display the generic error message
      toast.error('Error creating category. Please try again.');
      console.error('Error creating category:', error);
    } finally {
      handleClose();
    }
  };
  

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        startIcon={<AddIcon />}
        variant="contained"
        style={{
          backgroundColor: theme.palette.success.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.success.dark,
          },
        }}
      >
        Add Category
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent style={{ display: 'flex', width: '500px' }}>
          {/* Left Side */}
          <div style={{ width: '50%', padding: '16px' }}>
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel htmlFor="category-name">Category Name</InputLabel>
              <Input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </FormControl>
            <div style={{ border: '2px dotted #ddd', padding: '16px', textAlign: 'center' }}>
              <label htmlFor="category-image-input" style={{ cursor: 'pointer' }}>
                {categoryImage ? 'Click here to change image' : 'Click here to upload image'}
              </label>
            </div>
            <input
              type="file"
              id="category-image-input"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          {/* Right Side */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {categoryImage && (
              <img
                src={URL.createObjectURL(categoryImage)}
                alt="Category Image"
                style={{ width: '100%', height: '100%' }}
                onClick={handleImageClick}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: theme.palette.error.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            <CancelIcon /> Cancel
          </Button>
          <Button
            onClick={handleCreateCategory}
            style={{
              backgroundColor: theme.palette.success.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateCategory;
