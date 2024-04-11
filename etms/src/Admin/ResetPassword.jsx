import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';
import { resetPassword } from './services/UserAPI';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#5d79fb', // Customize primary color
    },
  },
});

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const { token: paramToken } = useParams(); // Accessing the token from URL parameter

  useEffect(() => {
    if (paramToken) {
      setToken(paramToken);
    }
  }, [paramToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isStrongPassword = (password) => {
    // Password strength criteria (example)
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    return strongRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)'
      );
      return;
    }

    try {
      const response = await resetPassword(token, newPassword);
      console.log(response);
      // If successful, redirect the user to the login page
      window.location.href = 'http://localhost:3000/'; // Redirect to login page
    } catch (error) {
      console.error('Error resetting password:', error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div className="ResetPass">
      <ThemeProvider theme={customTheme}>
        <Grid container component="main" className="reset-password-container">
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            sx={{
              boxShadow: '20px 20px 0px 1px rgb(255 247 185 / 43%)',
              borderRadius: '2%',
            }}
          >
            <div className="reset-password-content">
              <Avatar sx={{ bgcolor: '#5d79fb' }}>
                <ModelTrainingSharpIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Reset Password
              </Typography>
              <form onSubmit={handleSubmit} className="reset-password-form">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={error !== ''}
                  helperText={error}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="reset-password-submit"
                  disabled={!formData.newPassword || !formData.confirmPassword}
                >
                  Reset Password
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
};

export default ResetPasswordPage;
