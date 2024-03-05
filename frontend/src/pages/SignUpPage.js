import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { useSignup } from '../hooks/useSignUp';
import { registerWithEmailAndPassword,signInWithGoogle,signInWithGithub } from '../firebase';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Divider} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleButton from 'react-google-button';
import GithubButton from 'react-github-login-button/dist/react-github-button'; 
import toast from 'react-hot-toast';
const SignUpPage = () => {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const {signup} = useSignup();

    const onSubmitEmailPass = async (event) => {     
        event.preventDefault();
        try {
            const uid = await registerWithEmailAndPassword(name, email, password);
            await signup(name, email, uid)
            toast.success("User registered!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
      
    }
    const onSubmitGoogle = async (event) => {
      event.preventDefault();
        try {
            const {name, email ,uid} = await signInWithGoogle();
            await signup(name, email, uid)
            toast.success("User registered!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)        
        }
    }
    const onSubmitGithub = async (event) => {
      event.preventDefault();
        try {
            const {name, email ,uid} = await signInWithGithub();
            await signup(name, email ,uid)
            toast.success("User registered!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)        
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
          <Box component="form" noValidate onSubmit={onSubmitEmailPass} sx={{ mt: 3, mb: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                    autoComplete="given-name"
                    fullWidth
                    name="Name"
                    type="text"
                    label="Name"
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
                <Button
                type="submit"
                variant="contained"
                xs={12}
                fullWidth
                >
                  Sign Up
                </Button>
              </Grid>           
              <Grid container justifyContent="center" alignContent="center" margin={1}>
                  <Link href="/SignIn" variant="body2">
                    Already have an account? Sign in
                  </Link>    
              </Grid>
            </Grid>
            <Divider color = "black" marginBottom = {2}/>
          </Box>
          <Box marginTop={2}>
            <Grid container spacing={2}></Grid>
            <GoogleButton
                type="dark"
                onClick={onSubmitGoogle}
                variant="contained"
                label='Sign up With Google'
            />                
            <GithubButton
                type="dark"
                onClick={onSubmitGithub}
                variant="contained"
                label='Sign up With Github'
            />
          </Box>
          
          

          
        </Box>
      </Container>
    </main>

    

  )
}
 
export default SignUpPage