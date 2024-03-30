import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie'; // Import js-cookie for managing cookies
import { login } from './Admin/services/UserAPI';

const SignInSide = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const token = response.token;
      const role = response.role;

      // Store token in a cookie
      Cookies.set('token', token, { expires: 10000 }); // Set cookie expiration as needed

      // Redirect based on user role
      if (role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error logging in: ' + error.message);
      setSnackbarOpen(true);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', bgcolor: '#F8F6E3' }}>
      <Grid
        item
        xs={12}
        sm={8}
        md={7}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={6}
          square
          sx={{
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '15px', // Added border radius
            boxShadow: '20px 19px 0px 0px rgb(93 121 251)',
            border: '1px solid black',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '300px',
              height: '300px',
              borderRadius: '15px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '20px 19px 0px 0px rgb(93 121 251)',
              zIndex: '-1',
            },
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: '20',
            }}
          >
            <Avatar sx={{ bgcolor: '#5d79fb' }}>
              <ModelTrainingSharpIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              {/* Forgot Password Link */}
              <Typography variant="body2">
                <Link to="/forgot-password">Forgot Password?</Link>
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#5d79fb' }}
              >
                Log In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={5}
        sx={{
          display: { xs: 'none', sm: 'flex' }, // Hide on small screens
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#5d79fb',
        }}
      >
        <img
          src="https://elearningindustry.com/wp-content/uploads/2019/11/How-To-Design-Effective-Employee-Training-With-The-70-20-10-Model.png"
          alt="Image"
          style={{ maxWidth: '100%', maxHeight: '900px' }}
        />
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};

export default SignInSide;
