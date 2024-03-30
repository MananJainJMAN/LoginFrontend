import React, { useState } from 'react';
import './ResetPassword.css'; // Import CSS file for styling
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { forgotPassword } from './services/UserAPI';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#5d79fb', // Customize primary color
    },
  },
});

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(formData);
      setSnackbarSeverity('success');
      setSnackbarMessage(response.message);
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/'; // Redirect to login page after showing message for a while
      }, 5000); // Redirect after 5 seconds
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className='ResetPass'>
      <ThemeProvider theme={customTheme}  >
        <Grid container component="main" className="reset-password-container">
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6}   sx={{ boxShadow: '20px 20px 0px 1px rgb(255 247 185 / 43%)', borderRadius: '2%' }}>
            <div className="reset-password-content">
              <Avatar sx={{ bgcolor: '#5d79fb' }}>
                <ModelTrainingSharpIcon />
              </Avatar>
              <Typography component="h2" variant="h5">
                Enter your email to reset your password .
              </Typography>
              <form onSubmit={handleSubmit} className="reset-password-form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="reset-password-submit"
                >
                  Sent Link
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
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
    </div>
  );
};

export default ResetPasswordPage;
