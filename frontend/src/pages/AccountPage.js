import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';
//import './AccountPage.css'; // Import the CSS file for HomePage

const AccountPage = () => {
  return (
    <div className="AccountPage">
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="AccountPage-content">
        <Grid item xs={12} sm={6}>
          <h2>Account Information</h2>
          <ol>
            <li>Select Source Language</li>
            <li>Select Destination Item</li>
            <li>Select Convert</li>
            <li>That's It!</li>
          </ol>
          <h2>Overview</h2>
          <p>Tool to quickly and accurately convert code from one language to another utilizing ChatGPT 3.5</p>
        </Grid>
      </Grid>
      
      <Grid container justifyContent="center" className="HomePage-button">
        <Grid item>
          <Link to="/translate">
            <Button variant="contained" style={{ backgroundColor: '#CACACA', color: 'black', font:'Fira Code'}}>Translate Now!</Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountPage;
