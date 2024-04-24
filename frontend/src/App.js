import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import TranslatePage from './pages/TranslatePage';
import AccountPage from './pages/AccountPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './hooks/useAuthContext';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { initRecaptcha } from './firebase';
import ReleaseNotesPage from './pages/ReleaseNotesPage';

function App() {
  const { user } = useAuthContext();
  useEffect(() => {
    initRecaptcha();
  }, []);

  return (
    <Router>
      <div>
        <Toaster />
        <Navbar />
        <div id="recaptcha-container" style={{ visibility: 'hidden' }}></div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/releaseNotes" element={<ReleaseNotesPage />} />
          <Route
            path="/translate"
            element={
              user ? <TranslatePage /> : <Navigate to="/SignIn" replace />
            }
          />
          <Route
            path="/SignIn"
            element={
              !user ? <SignInPage /> : <Navigate to="/translate" replace />
            }
          />
          <Route
            path="/SignUp"
            element={
              !user ? <SignUpPage /> : <Navigate to="/translate" replace />
            }
          />
          <Route
            path="/account"
            element={user ? <AccountPage /> : <Navigate to="/SignIn" replace />}
          />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
