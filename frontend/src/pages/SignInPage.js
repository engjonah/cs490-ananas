import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { setRecaptchaVisibility, verifyCode, logInWithEmailAndPassword, signInWithGoogle, signInWithGithub } from '../firebase';
import { Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Container, Divider, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleButton from 'react-google-button';
import GithubButton from 'react-github-login-button/dist/react-github-button';
import toast from 'react-hot-toast';
import { useLogin } from '../hooks/useLogIn';
import { ErrorReport } from '../services/ErrorReport';

const SignInPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useLogin();
  const navigate = useNavigate();
  const [openTwoFAPopup, setOpenTwoFAPopup] = useState(false);
  const [code, setCode] = useState('');
  const [resolver, setResolver] = useState('');
  const [verificationId, setVerificationId] = useState('');

  const handle2faPopupOpen = () => {
    setOpenTwoFAPopup(true);
  };

  const handle2faPopupClose = () => {
    setOpenTwoFAPopup(false);
  };

  const inputVerifyCode = async () => {
    try {
      handle2faPopupClose();
      const userCredential = await verifyCode(resolver, verificationId, code);
      console.log(userCredential);
      toast.success("Logged in!");
      await login(userCredential.user.email, userCredential.user.uid, remember);
      navigate("/translate");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Error in MFA:" + error.message);
    } finally {
      setCode('');
      setResolver('');
      setVerificationId('');
      setRecaptchaVisibility('hidden');
    }
  }

  const mfaRequired = async (error) => {
    if (error.resolver && error.verificationId) {
      console.log("Resolver and Verification ID:", error.resolver, error.verificationId);
      toast("Multi-factor authentication required. Please verify your phone number.");
      handle2faPopupOpen(true);
      setResolver(error.resolver);
      setVerificationId(error.verificationId);
    } else {
      toast.error(error.message);
      ErrorReport("Signin page:" + error.message);
    }
  }

  const onSubmitEmailPass = async () => {
    setRecaptchaVisibility('visible');
    try {
      const uid = await logInWithEmailAndPassword(email, password);
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate");
    } catch (error) {
      console.log(error.message);
      mfaRequired(error);
    }
  }

  const onSubmitGoogle = async () => {
    setRecaptchaVisibility('visible');
    try {
      const { email, uid } = await signInWithGoogle();
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate");
    } catch (error) {
      console.log(error.message);
      mfaRequired(error);
    }
  }
  const onSubmitGithub = async (event) => {
    setRecaptchaVisibility('visible');
    try {
      const { email, uid } = await signInWithGithub();
      await login(email, uid, remember);
      toast.success("Logged in!");
      navigate("/translate")
    } catch (error) {
      console.log(error.message);
      mfaRequired(error);
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
          <Dialog open={openTwoFAPopup} onClose={handle2faPopupClose}>
            <DialogTitle>Enter Verification Code</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Verification Code"
                type="text"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handle2faPopupClose}>Cancel</Button>
              <Button onClick={inputVerifyCode} color="primary">Verify</Button>
            </DialogActions>
          </Dialog>
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
