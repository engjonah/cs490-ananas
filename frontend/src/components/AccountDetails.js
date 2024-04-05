import React, { useState, useEffect } from 'react';
import ApiUrl from '../ApiUrl';
import { changePassword, firebaseOnlyUser, deleteAccount } from '../firebase';
import { Button, Typography, Container, Avatar, CssBaseline} from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogOut';
import { ErrorReport } from '../services/ErrorReport';
import { useAuthContext } from '../hooks/useAuthContext';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';


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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar style={{ margin: '8px', backgroundColor: '#1976d2' }}>
          <ManageAccountsIcon />
        </Avatar>
        <Typography component="h1" variant="h4" paddingBottom={2}>
          Account Details
        </Typography>
        <div style={{alignItems: 'left'}}>
        {userInfo && (
            <>
            <Typography variant="h5" gutterBottom>
              <b>Name:</b> {userInfo.name}
            </Typography>
            <Typography variant="h5" gutterBottom >
              <b>Email:</b> {userInfo.email}
            </Typography>
            </>
        )}
        </div>
        <form style={{ width: '100%', marginTop: '16px' }} noValidate>
          
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
            onClick={handleUpdateName}
          >
            Update Name
          </Button>
          {firstParty && ( 
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              onClick={handleUpdatePassword}
            >
              Update Password
            </Button>
            )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            
            style={{ marginTop: '16px', backgroundColor: 'darkRed'}}
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </Container>
  );
};


export default AccountDetails;
