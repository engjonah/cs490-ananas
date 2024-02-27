import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TranslatePage from './components/TranslatePage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import HomeScreen from './components/HomeScreen';
import Navbar from './components/Navbar';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div>
        <Toaster/>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/SignIn" element={<SignIn/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
