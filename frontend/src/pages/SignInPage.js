import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, signInWithGoogle, signInWithGithub } from '../firebase';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container, Divider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleButton from 'react-google-button';
import GithubButton from 'react-github-login-button/dist/react-github-button';
import toast from 'react-hot-toast';
import { useLogin } from '../hooks/useLogIn';
import { ErrorReport } from '../services/ErrorReport';
import {useRecaptcha} from "../hooks/useRecaptcha";

const SignInPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useLogin();
  const navigate = useNavigate();
  const recaptchaVerifier = useRecaptcha('recaptcha-container');

  const onSubmitEmailPass = async () => {
    try {
      const uid = await logInWithEmailAndPassword(email, password, recaptchaVerifier);
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Signin page:" + error.message);;
    }
  }

  const onSubmitGoogle = async () => {
    try {
      const { email, uid } = await signInWithGoogle(recaptchaVerifier);
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Signin page:" + error.message);
    }
  }
  const onSubmitGithub = async (event) => {
    try {
      const { email, uid } = await signInWithGithub(recaptchaVerifier);
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate")
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Signin page:" + error.message);
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
          <Box component="form" noValidate sx={{ mt: 3, mb: 2 }}>
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
                    control={<Checkbox />}
                    checked={remember}
                    onChange={e => {
                      setRemember(e.target.checked)
                    }}
                    label="Remember Me"
                  />
                </FormGroup>
              </Grid>
              <div id="recaptcha-container"></div>
              <Grid item xs={12}>
                <Button
                  onClick={onSubmitEmailPass}
                  variant="contained"
                  xs={12}
                  fullWidth
                >
                  Log In
                </Button>
              </Grid>
              <Grid container marginTop={2} marginBottom={2} marginLeft={2}>
                <Grid item xs>
                  <Link href="/resetPassword" variant="body2">
                    Forgot password?
                  </Link>
                  {/* <Button variant="body2">Forgot Password?</Button> */}
                </Grid>
                <Grid item>
                  <Link href="/SignUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            <Divider color="black" />
          </Box>
          <Box marginTop={2}>
            <Grid container spacing={2}></Grid>
            <GoogleButton

              type="dark"
              onClick={onSubmitGoogle}
              variant="contained"
              title='google-button'
            >
              Log In With Google
            </GoogleButton>
            <GithubButton
              type="dark"
              onClick={onSubmitGithub}
              variant="contained"
              title='github-button'
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
