import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TranslatePage from './components/TranslatePage';
import SignUp from './components/Sign-up';
import HomeScreen from './components/HomeScreen';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/translate" element={<TranslatePage />} />
          <Route path="/account" element={<SignUp/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
