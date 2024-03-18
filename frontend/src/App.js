import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TranslatePage from './pages/TranslatePage';
import AccountPage from './pages/AccountPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import DocumentationPage from './pages/DocumentationPage';
import Navbar from './components/Navbar';
import {Toaster} from 'react-hot-toast';
import { useAuthContext } from './hooks/useAuthContext';
function App() {
  const {user} = useAuthContext();
  return (
    <Router>
      <div>
        <Toaster/>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/translate" element={user ? <TranslatePage /> : <Navigate to='/SignIn'/>} />
          <Route path="/SignIn" element={!user ? <SignInPage/> : <Navigate to='/translate'/>}/>
          <Route path="/SignUp" element={!user ? <SignUpPage/> : <Navigate to='/translate'/>}/>
          <Route path="/account" element={!user ? <AccountPage/> : <Navigate to='/translate'/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
