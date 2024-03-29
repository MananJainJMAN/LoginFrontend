import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import ModelTrainingSharpIcon from '@mui/icons-material/ModelTrainingSharp';

const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Grid container component="main" sx={{ height: '100vh' , bgcolor:'#F8F6E3' }}>
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
              border:'1px solid black',
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
              <Box component="form" Validate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  v
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
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, backgroundColor: '#5d79fb' }}>
                  Log In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
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
          <img src="https://elearningindustry.com/wp-content/uploads/2019/11/How-To-Design-Effective-Employee-Training-With-The-70-20-10-Model.png" alt="Image" style={{ maxWidth: '100%', maxHeight: '900px' }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
