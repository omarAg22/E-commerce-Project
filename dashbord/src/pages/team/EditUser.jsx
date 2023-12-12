// @ts-nocheck
/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  Modal,
  Button,
  Typography,
  TextField,
  useTheme,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import axios from 'axios';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';

const EditUser = ({
  userId,
  firstName,
  lastName,
  userName,
  email,
  role,
  onEdit,
  userRole = { userRole },
}) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState(firstName);
  const [editedLastName, setEditedLastName] = useState(lastName);
  const [editedUserName, setEditedUserName] = useState(userName);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedRole, setEditedRole] = useState(role);

  const handleEdit = async () => {
    try {
      const updatedUser = {
        first_name: editedFirstName,
        last_name: editedLastName,
        user_name: editedUserName,
        email: editedEmail,
        role: editedRole,
      };

      await axios.put(
        `http://localhost:3001/users/updateUser/${userId}`,
        updatedUser,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      onEdit(); // Call the update function after editing
      setOpenModal(false);
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  return (
    <>
      {userRole === 'Admin' && (
        <ModeEditOutlinedIcon
          onClick={() => setOpenModal(true)}
          sx={{
            color: theme.palette.success.main,
            cursor: 'pointer',
          }}
        />
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <TextField
            label="First Name"
            value={editedFirstName}
            onChange={(e) => setEditedFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={editedLastName}
            onChange={(e) => setEditedLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="User Name"
            value={editedUserName}
            onChange={(e) => setEditedUserName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={handleEdit}
            sx={{
              backgroundColor: theme.palette.success.main,
              color: 'common.white',
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default EditUser;
