import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Tooltip, Typography } from '@mui/material';
import { Icon } from './Icon.js';
import { ReactComponent as TranslateIcon } from '../assets/TranslateIcon.svg';
import { ReactComponent as DocumentationIcon } from '../assets/DocumentationIcon.svg';
import { ReactComponent as AccountIcon } from '../assets/AccountIcon.svg';
import { useLogout } from '../hooks/useLogOut.js';
import { useAuthContext } from '../hooks/useAuthContext.js';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';
import NotesIcon from '@mui/icons-material/Notes';

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/signin');
  }, [logout, navigate]);

  const handleSignIn = useCallback(() => {
    navigate('/signin');
  }, [navigate]);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetch(`${ApiUrl}/api/test`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          handleLogout();
        } else if (!res.ok) {
          ErrorReport('Auth Check: Something went wrong');
          throw new Error('something went wrong');
        }
        return res;
      })
      .catch((err) => {
        ErrorReport('Navbar:' + err.message);
        console.log('error here', err);
      });
  }, [user, handleLogout]);

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        width: '85%',
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 2,
        paddingRight: '15%',
      }}
    >
      <Toolbar
        variant="regular"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderRadius: '999px',
          bgcolor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(24px)',
          maxHeight: 40,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`,
        }}
      >
        <Link style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <Tooltip title="Home">
            <Typography
              variant="h4"
              style={{ color: 'black', fontWeight: 'bold' }}
              edge="start"
            >
              Ananas
            </Typography>
          </Tooltip>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link to="/translate">
          <Icon icon={TranslateIcon} tooltip="Translate" />
        </Link>
        <Link to="/documentation">
          <Icon icon={DocumentationIcon} tooltip="Documentation" />
        </Link>
        <Link to="/releaseNotes">
          <Icon icon={NotesIcon} tooltip="Release Notes" />
        </Link>
        {user && (
          <Link to="/Account">
            <Icon icon={AccountIcon} tooltip="Account" />
          </Link>
        )}
        {!user && (
          <Button
            sx={{ color: 'black', fontWeight: 'bold' }}
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        )}
        {user && (
          <Button
            sx={{ color: 'black', fontWeight: 'bold' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
