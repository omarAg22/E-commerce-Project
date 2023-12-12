import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Pagination,
  Card,
  CardContent,
  Grid,
  useTheme,
} from '@mui/material';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import axios from 'axios';

import DeleteUser from './DeleteUser';
import EditUser from './EditUser';
import CreateUser from './CreateUser';
import DetailsUser from './DetailsUser';
import { Store } from '../../Store';

const Team = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenDetailsModal = (user) => {
    setSelectedUser(user);
    setOpenDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedUser(null);
    setOpenDetailsModal(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/all-users?page=${currentPage}`
      );

      const { users, totalPages } = response.data;

      setUsers(users);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données depuis l'API:",
        error
      );
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const { state } = useContext(Store);
  const { userprivateInfo } = state;
  const userRole = userprivateInfo.role;
  return (
    <Box sx={{ position: 'relative' }}>
      {userRole === 'Admin' && (
        <IconButton
          onClick={() => setOpenModal(true)}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
            borderRadius: "6px",
            marginBottom: '8px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <AddCircleOutlineIcon />
          Add User
        </IconButton>
      )}
      {/* CreateUser component */}
      <CreateUser
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={fetchData}
      />
      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item key={user._id} xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                maxWidth: 400,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {user.first_name} {user.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.user_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {user.role}
                </Typography>
              </CardContent>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }}
              >
                {/* EditUser component */}
                <EditUser
                  userId={user._id}
                  firstName={user.first_name}
                  lastName={user.last_name}
                  userName={user.user_name}
                  email={user.email}
                  role={user.role}
                  onEdit={fetchData}
                  userRole = {userRole}
                />
                {/* DeleteUser component */}
                <DeleteUser
                  userId={user._id}
                  userName={`${user.first_name} ${user.last_name}`}
                  userRole = {userRole}
                  onDelete={fetchData}
                />

                <DetailsUser
                  open={openDetailsModal}
                  onClose={handleCloseDetailsModal}
                  user={selectedUser}
                />
                <VisibilityOutlinedIcon
                  onClick={() => handleOpenDetailsModal(user)}
                  sx={{ color: theme.palette.info.main, cursor: 'pointer' }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          // @ts-ignore
          onChange={(event, value) => setCurrentPage(value)}
          sx={{ marginTop: '16px' }}
        />
      </Box>
    </Box>
  );
};

export default Team;
