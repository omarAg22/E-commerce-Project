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
import SendAndArchiveOutlinedIcon from '@mui/icons-material/SendAndArchiveOutlined';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orders?page=${currentPage}`
        );
        const data = response.data;
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      // Make a PUT request to update the delivery status in the database
      await axios.put(`http://localhost:3001/orders/${orderId}/deliver`);

      // Fetch the updated order from the server
      const response = await axios.get(
        `http://localhost:3001/orders?page=${currentPage}`
      );
      const data = response.data;

      // Update the local state with the new order data
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error delivering order:', error);
    }
  };

  return (
    <div>
      <h1>Orders</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Delivered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{`${order.customer.first_name} ${order.customer.last_name}`}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                  {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivred ? (
                    new Date(order.delivredAt).toLocaleDateString()
                  ) : (
                    <IconButton onClick={() => handleDeliverOrder(order._id)}>
                      <SendAndArchiveOutlinedIcon color="primary" />
                    </IconButton>
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

export default Orders;
