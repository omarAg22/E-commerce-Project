/* eslint-disable react/prop-types */
import { Modal, Box, Typography, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetailsUser = ({ open, onClose, user, }) => {
  const theme = useTheme();
  if (!user) {
    // If user is null, return null or some default content
    return null;
  }

  const {
    first_name,
    last_name,
    user_name,
    email,
    role,
    last_login,
    createdAt,
  } = user;

  return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              color: theme.palette.primary.main,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>First Name:</strong> {first_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Last Name:</strong> {last_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>User Name:</strong> {user_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Email:</strong> {email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Role:</strong> {role}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Last Login:</strong> {last_login}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Created At:</strong> {createdAt}
          </Typography>
        </Box>
      </Modal>
  );
};

export default DetailsUser;
