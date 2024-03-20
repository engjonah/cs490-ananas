import React, { useState, useEffect } from 'react';
import ApiUrl from '../ApiUrl';
import { changePassword, firebaseOnlyUser, deleteAccount } from '../firebase';
import { Button, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogOut';






const AccountDetails = () => {
  const navigate = useNavigate();
  const {logout} = useLogout()
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user")).uid;


  useEffect(() => {

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
  }, []); 
  
  const handleUpdateName = () => {

    const newName = prompt("Enter new name:");
    const userId = JSON.parse(localStorage.getItem("user")).uid;

    if (newName) {

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
        toast.success("Name Updated!")
      })
      .catch(error => {
        console.log("error:" + error)
      });
    }
  };
  

  const handleUpdatePassword = () => {
    const firstParty = firebaseOnlyUser();
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

  const handleDeleteAccount = () => {
    

    if (window.confirm("Delete this account?"))
    {
      fetch(`${ApiUrl}/api/account/${userId}`, { method: 'DELETE'})
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
      deleteAccount();
      logout();
      toast.success("Account Deleted");
      navigate("/")
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
          <br></br><br></br>
          <Button variant="contained" onClick={handleUpdatePassword}>Update Password</Button> 
          <br></br><br></br>
          <Button variant="contained" onClick={handleDeleteAccount}>Delete Account</Button>

          {error && <p>{error}</p>}
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountDetails;
