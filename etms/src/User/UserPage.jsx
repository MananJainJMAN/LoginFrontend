import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie';
import UserTrainingPlan from './UserTrainingPlan'
import UserModulePage from './UserModulePage'
import ScoreIcon from '@mui/icons-material/Score';
import AssessmentScore from './AssessmentScore'
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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

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
  backgroundColor: '#5d79fb', // Set background color when drawer is open
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
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
  }),
);


const MiniDrawer = () => {
  const navigate = useNavigate()
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(null); // State to track the current page
  const [token, setToken] = useState(null); // State to store token

  useEffect(() => {
    // Retrieve token from cookie
    const storedToken = Cookies.get('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      // If no token found in cookie, redirect to login page
      navigate('/');
    }
  }, [navigate]);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page based on the selected option
  };

  const handleLogout = () => {
    // Clear the cookie session
    Cookies.remove('token');
    
    // Navigate to the home page
    navigate('/');
  };

  // Define pages for each option in the drawer
  const pages = {
    'Training Plan': <UserTrainingPlan/>,
    'Training Module': <UserModulePage/>,
    'Assessment Score': <AssessmentScore/>,
  };

  // Message to be displayed when no module is clicked
  const defaultMessage = (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Welcome Employee!!
      </Typography>
      <Typography variant="body1">
        Please select a module from the sidebar to get started.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
          <Typography variant="h6" noWrap component="div">
            Employee
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ bgcolor: '#000' }}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          <p>ETMS</p>
          <Avatar sx={{ ml: 'auto', bgcolor: '#5d79fb' }}>
            <ModelTrainingSharpIcon />
          </Avatar>
        </DrawerHeader>
        <Divider />
        <List>
          {Object.keys(pages).map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: 'block' }}
              onClick={() => handlePageChange(text)} // Set the current page based on the clicked option
            >
              <ListItemButton
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
                  {index === 0 && <EventNoteIcon />}
                  {index === 1 && <ViewModuleIcon />}
                  {index === 2 && <ScoreIcon />}
                  {index === 3 && <AssessmentIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem
            key="Logout"
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => handleLogout()} // Set the current page to null when logout is clicked
          >
            <ListItemButton
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
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* Render the current page or the default message if no module is clicked */}
        {currentPage ? pages[currentPage] : defaultMessage}
      </Box>
    </Box>
  );
};

export default MiniDrawer;
