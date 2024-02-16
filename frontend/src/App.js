import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const env = process.env.STAGE;
  let API_BASE_URL = 'http://localhost:3000';
  switch (env) {
    case 'staging':
      API_BASE_URL = 'https://cs490-ananas-beta-1b968f276a45.herokuapp.com';
      break;
    case 'prod':
      API_BASE_URL = 'https://cs490-ananas-2b50a43be02e.herokuapp.com';
      break; 
    case 'review':
      API_BASE_URL = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com';
      break;
    default:
      break;
  }

  let [test, setTest] = useState(null);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/test`)
      .then(res=>res.json())
      .then(res=>{
        setTest(res)
      })
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Backend Status:</p>
        {!test && <p>API not working</p>}
        {test && test.map((item, index) => (<p>{item.test}</p>))}
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
