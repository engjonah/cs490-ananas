import React from 'react';
import AccountDetails from '../components/AccountDetails';
import TranslationHistory from '../components/TranslationHistory';
import { Grid } from '@mui/material';


const AccountPage = () => {
  return (
    <Grid container direction="row" spacing={1} padding="50px" >
      <Grid item xs={5}>
        <AccountDetails/>
      </Grid>
      <Grid item xs={5}>
        <TranslationHistory/>
      </Grid>
    </Grid>
  );
}

export default AccountPage;
