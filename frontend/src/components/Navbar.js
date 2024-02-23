import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material'
import { Icon } from './Icon.js'
import { ReactComponent as TranslateIcon } from '../icons/TranslateIcon.svg'
import { ReactComponent as DocumentationIcon } from '../icons/DocumentationIcon.svg'
import { ReactComponent as AccountIcon } from '../icons/AccountIcon.svg'

function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#D9D9D9' }}>
      <Toolbar>
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <Typography variant='h4' style={{ color: 'black', fontFamily: 'Fira Code' }} edge="start">Ananas</Typography>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link to="/translate">
          <Icon icon={TranslateIcon} />
        </Link>
        <Link to="/documentation">
          <Icon icon={DocumentationIcon} />
        </Link>
        <Link to="/account">
          <Icon icon={AccountIcon} />
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
