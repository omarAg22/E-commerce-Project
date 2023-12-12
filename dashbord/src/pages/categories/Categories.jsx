// @ts-nocheck
// Category.jsx
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
import CreateCategory from './CreateCategory';
import UpdateCategory from './UpdateCategory';
import DeleteCategory from './DeleteCategory';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/categories/all-categories?page=${currentPage}`
      );
      const data = response.data;
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleUpdate = (updatedCategory) => {
    // Update the local state with the updated category
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      )
    );
    setSelectedCategory(null); // Clear the selected category
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleDelete = async () => {
    // Reload categories after deletion
    try {
      const response = await axios.get(
        `http://localhost:3001/categories/all-categories?page=${currentPage}`
      );
      const data = response.data;
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryCreated = () => {
    // Reload categories after creating a new category
    fetchCategories();
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div>
      <h1>Categories</h1>
      <CreateCategory onCategoryCreated={handleCategoryCreated} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Category Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.category_name}</TableCell>
                <TableCell>{category.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <img
                    src={category.categorie_image}
                    alt={category.category_name}
                    style={{ width: '50px', height: '50px' }}
                  />
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex' }}>
                    <IconButton onClick={() => handleSelectCategory(category)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <DeleteCategory
                      categoryName={category.category_name}
                      categoryId={category._id}
                      onDelete={handleDelete}
                    />
                  </div>
                  {/* Modal for updating category */}
                  {selectedCategory && (
                    <UpdateCategory
                      category={selectedCategory}
                      onUpdate={handleUpdate}
                      onClose={handleCloseModal}
                    />
                  )}
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
    </div>
  );
};

export default Category;
