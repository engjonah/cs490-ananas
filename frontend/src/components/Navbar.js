import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@mui/material'
import { Icon } from './Icon.js'
import { ReactComponent as TranslateIcon } from '../icons/TranslateIcon.svg'
import { ReactComponent as DocumentationIcon } from '../icons/DocumentationIcon.svg'
import { ReactComponent as AccountIcon } from '../icons/AccountIcon.svg'
import {useLogout} from '../hooks/useLogOut.js'
import { useAuthContext } from '../hooks/useAuthContext.js';

function Navbar() {
  const {logout} = useLogout()
  const {user} = useAuthContext();
  const handleClick = () =>{
    logout()
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
        { !user && (
          <Link to="/SignIn">
          <Icon icon={AccountIcon} tooltip="Account" />
        </Link>
        )}
        { user && ( <Button onClick={handleClick}>Logout</Button>)}
       
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
