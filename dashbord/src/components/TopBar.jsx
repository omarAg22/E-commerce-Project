// @ts-nocheck
/* eslint-disable react/prop-types */
import { useContext } from 'react';
import { Button, IconButton, Toolbar, Box, Stack, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MuiAppBar from '@mui/material/AppBar';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const TopBar = ({ open, handleDrawerOpen, setMode }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userprivateInfo } = state;

  const theme = useTheme();
  const navigate = useNavigate();

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userprivateInfo');
    navigate('signin');
  };

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          <Stack direction={'row'}>
            {theme.palette.mode === 'light' ? (
              <IconButton
                onClick={() => {
                  localStorage.setItem(
                    'currentMode',
                    theme.palette.mode === 'dark' ? 'light' : 'dark'
                  );
                  setMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light'
                  );
                }}
                color="inherit"
              >
                <LightModeOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  localStorage.setItem(
                    'currentMode',
                    theme.palette.mode === 'dark' ? 'light' : 'dark'
                  );
                  setMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light'
                  );
                }}
                color="inherit"
              >
                <DarkModeOutlinedIcon />
              </IconButton>
            )}
          </Stack>
          
          <Box flexGrow={1} />
          {userprivateInfo ? (
            <Button
              color="inherit"
              onClick={signoutHandler}
              startIcon={<LogoutOutlinedIcon />}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/signin')}
              startIcon={<LoginOutlinedIcon />}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopBar;
