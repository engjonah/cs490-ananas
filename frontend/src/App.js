import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const API_BASE_URL = process.env.NODE_ENV === 'production' ?
    'https://cs490-ananas-2b50a43be02e.herokuapp.com' :
    'http://localhost:3000';

  let [test, setTest] = useState(null);

  useEffect(()=>{
    fetch(`${API_BASE_URL}/test`)
      .then(res=>res.json())
      .then(res=>{
        setTest(res)
      })
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
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
