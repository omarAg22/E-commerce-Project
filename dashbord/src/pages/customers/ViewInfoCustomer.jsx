/* eslint-disable react/prop-types */
// ViewInfoCustomer.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const ViewInfoCustomer = ({ customer, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Customer Information</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>First Name:</strong> {customer.first_name}
        </Typography>
        <Typography variant="body1">
          <strong>Last Name:</strong> {customer.last_name}
        </Typography>
        <Typography variant="body1">
          <strong>Creation Date:</strong> {new Date(customer.creation_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Active:</strong> {customer.active ? 'Yes' : 'No'}
        </Typography>
        {/* Add other customer information fields as needed */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewInfoCustomer;
