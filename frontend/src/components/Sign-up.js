import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { registerWithEmailAndPassword,signInWithGoogle,signInWithGithub } from '../firebase';
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
import GoogleButton from 'react-google-button';
import GithubButton from 'react-github-login-button/dist/react-github-button'; 
const SignUp = () => {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const onSubmitEmailPass = async (event) => {     
        event.preventDefault();
        try {
            await registerWithEmailAndPassword(name, email, password);
            console.log("done!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
            alert(error.message);
        }
      
    }
    const onSubmitGoogle = async (event) => {
      event.preventDefault();
        try {
            await signInWithGoogle();
            console.log("done!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
        }
    }
    const onSubmitGithub = async (event) => {
      event.preventDefault();
        try {
            await signInWithGithub();
            console.log("done!")
            navigate("/translate")
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
              <Grid item xs={12}>
                <Button
                type="submit"
                variant="contained"
                xs={12}
                fullWidth
                >
                  Sign Up
                </Button>
              </Grid>           
              <Grid container justifyContent="flex-end">
                  <Link href="#" variant="body2">
                    Already have an account? Sign in
                  </Link>    
              </Grid>
            </Grid>
            -----------------------------------   or  ---------------------------------

          </Box>
          
          <GoogleButton
              type="dark"
              onClick={onSubmitGoogle}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Google
          </GoogleButton>
          <div></div>
          <GithubButton
              type="dark"
              onClick={onSubmitGithub}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In With Github
          </GithubButton>
          

          
        </Box>
      </Container>
    </main>

    

  )
}
 
export default SignUp