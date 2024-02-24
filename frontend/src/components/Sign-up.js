import React, {useState} from 'react';
import { registerWithEmailAndPassword,signInWithGoogle } from '../firebase';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
 
const SignUp = () => {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
 
    const onSubmitEmailPass = async (event) => {     
        event.preventDefault();
        try {
            await registerWithEmailAndPassword(name, email, password);
            console.log("done!")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
        }
      
    }
    const onSubmitGoogle = async (event) => {
      event.preventDefault();
        try {
            await signInWithGoogle();
            console.log("done!")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
        }
    }
 
  return (
    <main >        
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmitEmailPass} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                    autoComplete="given-name"
                    fullWidth
                    name="Name"
                    type="text"
                    label="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}  
                    required                                    
                    placeholder="Name"
                    autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                    placeholder="Email address" 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    type="password"
                    label="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I agree to the privacy policy."
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid item xs={12}>
                OR
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          <Box component="form" noValidate onSubmit={onSubmitGoogle} sx={{ mt: 3 }}>
          <Button
              type="submit"
              fullwidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Google
            </Button>
          </Box>
        </Box>
      </Container>
    </main>

    

  )
}
 
export default SignUp