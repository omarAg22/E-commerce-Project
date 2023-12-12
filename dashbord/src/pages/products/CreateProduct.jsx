/* eslint-disable react/prop-types */
// CreateProduct.jsx
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';

const CreateProduct = ({ onProductCreated, categories }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    product_name: '',
    category_name: '',
    short_description: '',
    long_description: '',
    price: 0,
    discount_price: 0,
    stock: 0,
    product_image: null, // Assuming you want to allow image upload
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // If the input is a file input, set product_image with the selected file
    if (name === 'product_image') {
      setFormData({ ...formData, [name]: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCreateProduct = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        'http://localhost:3001/products/create-product',
        formDataToSend
      );
      const data = response.data;
      onProductCreated(); // Trigger a refresh of the products list in the parent component
      handleClose();
      console.log('Product created successfully:', data.product);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Create Product
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Product Name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category Name</InputLabel>
            <Select
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category.category_name}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Short Description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Long Description"
            name="long_description"
            value={formData.long_description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={6}
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            margin="normal"
          />
          <TextField
            label="Discount Price"
            name="discount_price"
            value={formData.discount_price}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
            margin="normal"
          />
          <TextField
            label="Stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <input
            type="file"
            name="product_image"
            accept="image/*"
            onChange={handleChange}
            style={{ margin: '16px 0' }}
          />
          <Button
            variant="contained"
            onClick={handleCreateProduct}
            style={{ marginTop: '16px' }}
          >
            Create
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProduct;
