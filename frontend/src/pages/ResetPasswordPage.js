import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordEmail } from '../firebase'; // Assuming you have a function for resetting password in your firebase file
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import toast from 'react-hot-toast';
import { ErrorReport } from '../services/ErrorReport';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onSubmitResetPassword = async (event) => {
    event.preventDefault();
    try {
      await resetPasswordEmail(email);
      toast.success('Password reset email sent!');
      navigate('/signin');
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Signin page:" + error.message);
    }
  };

  return (
    <main>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '25%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmitResetPassword} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Reset Password
                </Button>
              </Grid>
              <Grid container justifyContent="center" alignContent="center" margin={1}>
                <Link href="/signin" variant="body2">
                  Remembered your password? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </main>
  );
};

export default ResetPasswordPage;
