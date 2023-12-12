// Customers.jsx
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import ViewInfoCustomer from './ViewInfoCustomer';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/costumers/getAllCostumers?page=${currentPage}`);
        const data = response.data;
        setCustomers(data.customers);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  return (
    <div>
      <h1>Customers</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer.first_name}</TableCell>
                <TableCell>{customer.last_name}</TableCell>
                <TableCell>{customer.active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(customer.creation_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewCustomer(customer)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  {/* Add other action buttons as needed */}
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

      {/* Modal for viewing customer information */}
      {showViewModal && (
        <ViewInfoCustomer
          customer={selectedCustomer}
          onClose={handleCloseViewModal}
        />
      )}
    </div>
  );
};

export default Customers;
