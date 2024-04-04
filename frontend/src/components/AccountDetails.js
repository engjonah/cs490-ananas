import React, { useState, useEffect } from 'react';
import ApiUrl from '../ApiUrl';
import { changePassword, firebaseOnlyUser, deleteAccount } from '../firebase';
import { Button, Grid, CssBaseline, Container } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogOut';
import { ErrorReport } from '../services/ErrorReport';
import { useAuthContext } from '../hooks/useAuthContext'

const AccountDetails = () => {
  const navigate = useNavigate();
  const {logout} = useLogout()
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user")).uid;
  const firstParty = firebaseOnlyUser();
  const {user} = useAuthContext();

  useEffect(() => {

    fetch(`${ApiUrl}/api/account/${userId}`, {
      headers: {
        'Authorization':`Bearer ${user.token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found! Please sign up!');
        }
        return response.json();
      })
      .then(data => {
        setUserInfo(data);
      })
      .catch(error => {
        ErrorReport("Account Details:" + error.message);
        setError(error.message);
      });
  }, [userId, user.token]); 
  
  const handleUpdateName = () => {

    const newName = prompt("Enter new name:");
    const userId = JSON.parse(localStorage.getItem("user")).uid;

    if (newName) {

      fetch(`${ApiUrl}/api/account/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization':`Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      })
      .then(response => response.json())
      .then(data => {
        setUserInfo(data);
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
      if (newPassword != null)
      {
        if (newPassword.length > 5)
      {
        changePassword(newPassword);
        toast.success("Password Updated");
      }
      else toast.error("Password too short!");
      }
    }
    else
    {
      toast.error("Refer to third party provider to update password!")
    }
    
  
  };

  const handleDeleteAccount = () => {
    

    if (window.confirm("Delete this account?"))
    {
      fetch(`${ApiUrl}/api/account/${userId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization':`Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },})
      .then(response => {
        if (!response.ok) {
          throw new Error('User not found! Please sign up!');
        }
        return response.json();
      })
      .then(data => {
        setUserInfo(data);
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
      <CssBaseline/>
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="AccountPage-content">
        <Grid item xs={12} sm={6}>
          <h1>Account Information</h1>
          {userInfo && (
            <>
              <h3>Email: {userInfo.email}</h3>
              <h3>Name: {userInfo.name}</h3>
            </>
          )}

          <Button variant="contained" onClick={handleUpdateName}>Update Name</Button>
          <br></br><br></br>
          {firstParty && 
          (
            <>
          <Button variant="contained" onClick={handleUpdatePassword}>Update Password</Button> 
          <br></br><br></br>
            </>
          )}
          
          <Button variant="contained" onClick={handleDeleteAccount}>Delete Account</Button>

          {error && <p>{error}</p>}
        </Grid>
      </Grid>
    </div>
  );
}

export default AccountDetails;
