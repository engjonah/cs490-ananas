import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TranslatePage from './components/TranslatePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomeScreen from './components/HomeScreen';
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
          <Route path="/" element={<HomeScreen />} />
          <Route path="/translate" element={user ? <TranslatePage /> : <Navigate to='/SignIn'/>} />
          <Route path="/SignIn" element={!user ? <SignIn/> : <Navigate to='/translate'/>}/>
          <Route path="/SignUp" element={!user ? <SignUp/> : <Navigate to='/translate'/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
