import React, { useState, useEffect } from 'react';
import ApiUrl from '../ApiUrl';
import { changePassword, firebaseOnlyUser } from '../firebase';
import { Button, Grid } from '@mui/material';
import toast from 'react-hot-toast';


const AccountDetails = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Replace 'userId' with the actual user ID you want to fetch
    const userId = JSON.parse(localStorage.getItem("user")).uid;

    fetch(`${ApiUrl}/api/account/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found! Please sign up!');
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        setError(error.message);
      });
  }, []); // Empty dependency array to ensure this effect runs only once
  
  const handleUpdateName = () => {
    // Here you can implement the logic to update the name
    // For example, you can prompt the user to enter a new name and then send a request to update the name
    // This is just a placeholder for demonstration purposes
    const newName = prompt("Enter new name:");
    const userId = JSON.parse(localStorage.getItem("user")).uid;

    if (newName) {
      //setUser({ ...user, name: newName }); // Update the name in the state
      // Now you can send a request to update the name on the server
      // Example:
      fetch(`${ApiUrl}/api/account/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        // Handle success
      })
      .catch(error => {
        // Handle error
      });
    }
  };
  

  const handleUpdatePassword = () => {
    const firstParty = firebaseOnlyUser();
    console.log('first party in handle submit: ' + firstParty);
    if (firstParty)
    {
      const newPassword = prompt("Enter new password:");
      if (newPassword.length > 5)
      {
        changePassword(newPassword);
        toast.success("Password Updated");
      }
      else toast.error("Password too short!");
    }
    else
    {
      toast.error("Refer to third party provider to update password!")
    }
    
  
  };
  
  
  return (
    <div className="AccountPage">
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="AccountPage-content">
        <Grid item xs={12} sm={6}>
          <h1>Account Information</h1>
          {user && (
            <>
              <h3>Email: {user.email}</h3>
              <h3>Name: {user.name}</h3>
            </>
          )}
          <Button variant="contained" onClick={handleUpdateName}>Update Name</Button>
          { <Button variant="contained" onClick={handleUpdatePassword}>Update Password</Button> } 
          {error && <p>{error}</p>}
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountDetails;
