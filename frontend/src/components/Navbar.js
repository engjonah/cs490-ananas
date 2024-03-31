import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@mui/material'
import { Icon } from './Icon.js'
import { ReactComponent as TranslateIcon } from '../assets/TranslateIcon.svg'
import { ReactComponent as DocumentationIcon } from '../assets/DocumentationIcon.svg'
import { ReactComponent as AccountIcon } from '../assets/AccountIcon.svg'
import {useLogout} from '../hooks/useLogOut.js'
import { useAuthContext } from '../hooks/useAuthContext.js';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';

function Navbar() {
  const {logout} = useLogout()
  const {user} = useAuthContext();
  const navigate = useNavigate();

  let [test, setTest] = useState(null);

  useEffect(()=>{
    if (user){
      fetch(`${ApiUrl}/api/test`, {
        headers: {
          'Authorization':`Bearer ${user.token}`
        }
      })
        .then(res => {
          if (res.status === 401) {
            logout();
            navigate('/signin');
          }
          else if (!res.ok) {
            ErrorReport("Auth Check: Something went wrong");
            throw new Error("something went wrong");
          }
          return res;
        })
        .then(res => res.json())
        .then(res => {
          setTest(res);
        })
        .catch((err) => {
          console.log('error here');
        })
      }
  },[user, navigate, logout]);

  const handleClick = () =>{
    navigate('/');
    logout()
  }
  const handleSignIn = () =>{
    navigate('/signin');
  }
  return (
    <AppBar position="static" sx={{ bgcolor: '#D9D9D9' }}>
      <Toolbar>
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <Tooltip title="Home">
            <Typography variant='h4' style={{ color: 'black', fontFamily: 'Fira Code' }} edge="start">Ananas</Typography>
          </Tooltip>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link to="/translate">
          <Icon icon={TranslateIcon} tooltip="Translate" />
        </Link>
        <Link to="/documentation">
          <Icon icon={DocumentationIcon} tooltip="Documentation" />
        </Link>
        { user && (
          <Link to="/Account">
          <Icon icon={AccountIcon} tooltip="Account" />
        </Link>
        )}
        {/* { !user && (
          <Link to="/SignIn">
          Sign In
        </Link>
        )} */}
        { !user && ( <Button onClick={handleSignIn}>Sign In</Button>)}
        { user && ( <Button onClick={handleClick}>Logout</Button>)}
       
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
