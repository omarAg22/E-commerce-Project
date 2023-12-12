/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// DeleteUser.jsx
import { useState } from 'react';
import { Modal, Button, Typography, useTheme } from '@mui/material';
import axios from 'axios';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const DeleteUser = ({ userId, userName, onDelete, userRole }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/users/deleteUser/${userId}`);
      onDelete(); // Call the update function after deletion
      setOpenModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      {userRole === 'Admin' && (
        <DeleteOutlinedIcon
          onClick={() => setOpenModal(true)}
          sx={{
            color: theme.palette.error.main,
            cursor: 'pointer',
          }}
        />
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: theme.palette.common.white,
            padding: '32px',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'black' }}>
            Are you sure you want to delete {userName}?
          </Typography>
          <Button
            onClick={handleDelete}
            sx={{
              backgroundColor: theme.palette.error.main,
              color: 'common.white',
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
