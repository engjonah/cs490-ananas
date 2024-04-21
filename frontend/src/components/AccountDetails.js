import React, { useState, useEffect } from 'react';
import ApiUrl from '../ApiUrl';
import { enrollPhone, checkUserMFA, setRecaptchaVisibility, changePassword, firebaseOnlyUser, deleteAccount, enrollUserMfaBack } from '../firebase';
import { Button, Typography, Container, Avatar, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useLogout } from '../hooks/useLogOut';
import { ErrorReport } from '../services/ErrorReport';
import { useAuthContext } from '../hooks/useAuthContext';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { GetUID } from '../services/UserInfo';

const AccountDetails = () => {
  const navigate = useNavigate();
  const { logout } = useLogout()
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);
  const [passwordUpdateFormOpen, setPasswordUpdateFormOpen] = useState(false);
  const [nameUpdateFormOpen, setNameUpdateFormOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const userId = GetUID();
  const [isFirstParty, setIsFirstParty] = useState(null);
  const { user } = useAuthContext();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasMFA, setHasMFA] = useState(false);
  const [openTwoFAPopup, setOpenTwoFAPopup] = useState(false);
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState('');

  useEffect(() => {
    async function checkFirebaseOnlyUser() {
      const result = await firebaseOnlyUser();
      setIsFirstParty(result);
    }
    checkFirebaseOnlyUser();
  }, [])

  useEffect(() => {
    async function fetchMFAStatus() {
      const mfaStatus = await checkUserMFA();
      setHasMFA(mfaStatus);
    }
    fetchMFAStatus();
  }, [user]);

  useEffect(() => {
    fetch(`${ApiUrl}/api/account/${userId}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
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
        toast.error(error.message);
        setError(error.message);
      });
  }, [userId, user.token]);

  const formatPhoneNumber = (value) => {
    const phoneNumber = parsePhoneNumberFromString(value, 'US');
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    }
    return value;
  };

  const handleMobileFormOpen = () => {
    setMobileFormOpen(true);
  };

  const handleMobileFormClose = () => {
    setMobileFormOpen(false);
  };
  const handlePasswordUpdateOpen = () => {
    setPasswordUpdateFormOpen(true);
  };

  const handlePasswordUpdateClose = () => {
    setPasswordUpdateFormOpen(false);
  };

  const handlePasswordUpdateSubmit = () => {
    if (newPassword === verifyNewPassword) {
      setNewPassword(newPassword);
      handleUpdatePassword();
      handlePasswordUpdateClose();
    } else {
      toast.error('Passwords do not match!');
    }
  };

  const handle2faPopupOpen = () => {
    setOpenTwoFAPopup(true);
  };

  const handle2faPopupClose = () => {
    setOpenTwoFAPopup(false);
  };

  const handleNameUpdateOpen = () => {
    setNameUpdateFormOpen(true);
  };

  const handleNameUpdateClose = () => {
    setNameUpdateFormOpen(false);
  };

  const handleNameUpdateSubmit = () => {
    if (newName) {
      setNewName(newName);
      handleUpdateName();
      handleNameUpdateClose();
    } else {
      toast.error('Name cannot be blank');
    }
  };

  const handleUpdateName = () => {
    if (newName) {
      fetch(`${ApiUrl}/api/account/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
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
          ErrorReport("Account Details Update:" + error.message);
          toast.error(error.message);
          console.log("error:" + error);
        });
    }
  };

  const enrollUserMfa = async () => {
    setRecaptchaVisibility('visible');
    try {
      const formattedNumber = formatPhoneNumber(phoneNumber);
      console.log('Formatted Phone Number:', formattedNumber);
      handleMobileFormClose();
      handle2faPopupOpen();
      const verificationId = await enrollUserMfaBack(formattedNumber);
      setVerificationId(verificationId);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Error in enroll MFA:" + error.message);
    }
  };

  const inputVerifyCode = async () => {
    try {
      handle2faPopupClose();
      await enrollPhone(verificationId, code);
      toast.message("Success in MFA enroll!");
      setHasMFA(true);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      ErrorReport("Error in enroll MFA:" + error.message);
    }finally{
      setCode('');
      setVerificationId('');
      setRecaptchaVisibility('hidden');
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword == null) {
      return;
    }
    if (!isFirstParty) {
      toast.error("Refer to third party provider to update password!");
      ErrorReport("Refer to third party provider to update password!");
      return;
    }
    if (newPassword.length <= 5) {
      toast.error("Password too short!");
      ErrorReport("Password too short!");
      return;
    }
    try {
      const passChanged = await changePassword(newPassword);
      if (passChanged) {
        toast.success("Password Updated");
      } else {
        ErrorReport("Cannot Change Password");
        toast.error("Cannot Change Password");
      }
    } catch (e) {
      ErrorReport("Account Details:" + e.message);
      toast.error(e);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Delete this account?")) {
      fetch(`${ApiUrl}/api/account/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
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
          ErrorReport("Account Details Delete Acc:" + error.message);
          toast.error(error.message)
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
        <div style={{ alignItems: 'left' }}>
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
        <Dialog open={passwordUpdateFormOpen} onClose={handlePasswordUpdateClose} fullWidth={true}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Verify New Password"
              type="password"
              fullWidth
              value={verifyNewPassword}
              onChange={(e) => setVerifyNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePasswordUpdateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handlePasswordUpdateSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={mobileFormOpen} onClose={handleMobileFormClose}>
          <DialogTitle>Update Phone Number</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Phone Number"
              type="text"
              fullWidth
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleMobileFormClose}>Cancel</Button>
            <Button onClick={enrollUserMfa}>Verify Phone</Button>
          </DialogActions>
        </Dialog>


        <Dialog open={nameUpdateFormOpen} onClose={handleNameUpdateClose} fullWidth={true}>
          <DialogTitle>Change Name</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="New Name"
              type="plaintext"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNameUpdateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleNameUpdateSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

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

        <form style={{ width: '100%', marginTop: '16px' }} noValidate>

          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '16px' }}
            onClick={handleNameUpdateOpen}
          >
            Update Name
          </Button>
          {isFirstParty && (
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }}
              onClick={handlePasswordUpdateOpen}
            >
              Update Password
            </Button>
          )}
          {!hasMFA && (
            <Button type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: '16px' }} onClick={handleMobileFormOpen}
            >
              Add Phone Number 2FA
            </Button>)}
          <Button
            type="button"
            fullWidth
            variant="contained"
            style={{ marginTop: '16px', backgroundColor: 'darkRed' }}
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
