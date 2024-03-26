import React from 'react';
import AccountDetails from '../components/AccountDetails';
import TranslationHistory from '../components/TranslationHistory';
import { Grid } from '@mui/material';


const AccountPage = () => {
  return (
    <Grid container spacing={1} padding="50px" >
      <AccountDetails/>
      <TranslationHistory/>
    </Grid>
  );
}

export default AccountPage;
