/* eslint-disable react/prop-types */
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import InboxIcon from '@mui/icons-material/MoveToInbox';
// import MailIcon from '@mui/icons-material/Mail';
import List from '@mui/material/List';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Store } from '../Store';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
  // @ts-ignore
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const array1 = [
  { text: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/' },
  { text: 'Manage Team', icon: <PeopleOutlinedIcon />, path: '/team' },
  {
    text: 'Categories',
    icon: <CategoryOutlinedIcon />,
    path: '/categorie',
  },
  {
    text: 'Products',
    icon: <ShoppingCartOutlinedIcon />,
    path: '/product',
  },
];

const array2 = [
  { text: 'customer', icon: <PersonOutlinedIcon />, path: '/customer' },
  { text: 'order', icon: <InventoryOutlinedIcon />, path: '/order' },
];

const SideBar = ({ open, handleDrawerClose }) => {
  const { state } = useContext(Store);
  const { userprivateInfo } = state;
  const theme = useTheme();
  const navigate = useNavigate();
  let location = useLocation();
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {userprivateInfo ? (
        <Avatar
          {...stringAvatar(
            `${userprivateInfo.first_name} ${userprivateInfo.last_name}`
          )}
          sx={{
            mx: 'auto',
            width: open ? 66 : 44,
            height: open ? 66 : 44,
            my: 1,
            border: '2px solid grey',
            transition: '0.25s',
          }}
        />
      ) : 
      null}

      {userprivateInfo ? (
        <div>
          {' '}
          <Typography
            align="center"
            sx={{ fontSize: open ? 17 : 0, transition: '0.25s' }}
          >
            {userprivateInfo.first_name} {userprivateInfo.last_name}
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: open ? 15 : 0,
              transition: '0.25s',
              color: theme.palette.info.main,
            }}
          >
            {userprivateInfo.role}
          </Typography>
        </div>
      ) : (
        <div>
          {' '}
          <Typography
            align="center"
            sx={{ fontSize: open ? 17 : 0, transition: '0.25s' }}
          >
            user ...
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: open ? 15 : 0,
              transition: '0.25s',
              color: theme.palette.info.main,
            }}
          >
            Admin..
          </Typography>
        </div>
      )}

      <Divider />
      <List>
        {array1.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                bgcolor:
                  location.pathname === item.path
                    ? theme.palette.mode === 'dark'
                      ? grey[800]
                      : grey[300]
                    : null,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />

      <List>
        {array2.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default SideBar;
