/* eslint-disable react/prop-types */
// UpdateProduct.jsx
import  { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import axios from 'axios';

const UpdateProduct = ({ product, onUpdate, onClose, categories }) => {
  const [formData, setFormData] = useState({
    sku: product.sku || '',
    product_name: product.product_name || '',
    category_name: product.category_name || '',
    short_description: product.short_description || '',
    long_description: product.long_description || '',
    price: product.price || 0,
    discount_price: product.discount_price || 0,
    stock: product.stock || 0,
    product_image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'product_image') {
      setFormData({ ...formData, [name]: files[0] || null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.put(
        `http://localhost:3001/products/update-product/${product._id}`,
        formDataToSend
      );
      const data = response.data;
      onUpdate(data.updatedProduct);
      onClose();
      console.log('Product updated successfully:', data.updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
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
          margin="normal"
        />
        <TextField
          label="Discount Price"
          name="discount_price"
          value={formData.discount_price}
          onChange={handleChange}
          fullWidth
          type="number"
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
          onClick={handleUpdate}
          style={{ marginTop: '16px' }}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProduct;
