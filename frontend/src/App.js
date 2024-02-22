import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import BackendStatus from './components/BackendStatus';
import Feedback from './components/Feedback';
import RateDialog from './components/sample';
import './App.css';

function App() {
  const API_BASE_URL = process.env.NODE_ENV === 'production' ?
    window.location.origin:
    'http://localhost:3000';

  let [test, setTest] = useState(null);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/api/test`)
      .then(res=>res.json())
      .then(res=>{
        setTest(res)
      })
  },[API_BASE_URL]);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Feedback/>

        <BackendStatus status={test}/>
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      </header>
    </div>
  );
}

export default App;
