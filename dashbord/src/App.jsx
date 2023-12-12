import * as React from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import TopBar from './components/TopBar';
import Box from '@mui/material/Box';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CssBaseline from '@mui/material/CssBaseline';
import SideBar from './components/SideBar';
import { getDesignTokens } from './theme';
import { Route, Routes } from 'react-router-dom';

// Import your page components here
import Dashboard from './pages/dashboard/Dashboard';
import Team from './pages/team/Team';
import Customers from './pages/customers/Customers';
import SignIn from './pages/signin/SignIn';
import Category from './pages/categories/Categories';
import Porducts from './pages/products/Products';
import ProtectedRoute from './components/ProtectedRoutes';
import Orders from './pages/orders/Orders';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [mode, setMode] = React.useState(
    localStorage.getItem('currentMode')
      ? localStorage.getItem('currentMode')
      : 'light'
  );
  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-center" limit={1} />
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar
          open={open}
          handleDrawerOpen={handleDrawerOpen}
          setMode={setMode}
        />
        <SideBar open={open} handleDrawerClose={handleDrawerClose} />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categorie"
              element={
                <ProtectedRoute>
                  <Category />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <Porducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
