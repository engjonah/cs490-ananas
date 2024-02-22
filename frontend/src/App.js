import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainApp from './components/MainApp';
import HomeScreen from './components/HomeScreen';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/main" element={<MainApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
