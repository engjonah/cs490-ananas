import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
import { useAuthContext } from '../hooks/useAuthContext';
import AccountDetails from '../components/AccountDetails';
//import './AccountPage.css'; // Import the CSS file for HomePage


const AccountPage = () => {
  return (
   <AccountDetails/>
  );
}

export default AccountPage;
