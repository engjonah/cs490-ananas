import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, signInWithGoogle,signInWithGithub } from '../firebase';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Divider, FormGroup, FormControlLabel, Checkbox} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleButton from 'react-google-button';
import GithubButton from 'react-github-login-button/dist/react-github-button'; 
import toast from 'react-hot-toast';
import { useLogin } from '../hooks/useLogIn';

const SignInPage = () => {
 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const {login} = useLogin();
    const navigate = useNavigate();

    const onSubmitEmailPass = async (event) => {     
        event.preventDefault();
        try {
            const uid = await logInWithEmailAndPassword(email, password);
            await login(email, uid,remember) 
            toast.success("Logged in!")
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
            const {email,uid} = await signInWithGoogle();
            await login(email,uid,remember)
            toast.success("Logged in")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
          console.log(error.message);
          toast.error(error.message);
        }
    }
    const onSubmitGithub = async (event) => {
      event.preventDefault();
        try {
            const {email,uid} = await signInWithGithub();
            await login(email,uid,remember)
            toast.success("Logged in!")
            navigate("/translate")
        // Handle successful signup (e.g., redirect to protected content)
        } catch (error) {
          console.log(error.message);
          toast.error(error.message);
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
            Sign In
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmitEmailPass} sx={{ mt: 3, mb: 2}}>
            <Grid container spacing={2}>
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
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormGroup>
                  <FormControlLabel 
                    margin={5} 
                    control={<Checkbox/>} 
                    checked={remember} 
                    onChange={e=> {
                        setRemember(e.target.checked)
                      }} 
                    label="Remember Me" 
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Button
                type="submit"
                variant="contained"
                xs={12}
                fullWidth
                >
                  Sign In
                </Button>
              </Grid>           
              <Grid container marginTop={2} marginBottom={2} marginLeft={2}>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/SignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
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
              >
                Log In With Google
            </GoogleButton>
            <GithubButton
                type="dark"
                onClick={onSubmitGithub}
                variant="contained"
              >
                Log In With Github
            </GithubButton>
          </Box>
          
          

          
        </Box>
      </Container>
    </main>

    

  )
}
 
export default SignInPage