import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import BackendStatus from './BackendStatus';
import CodeSubmissionBox from './CodeSubmissionBox';
import './App.css';

function MainApp() {
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
      <div className="App-header">
        <div id='navbar'>Navbar Placeholder</div>
      </div>
      <div className="div">
        <Container id="translation" maxWidth="lg" style={{"backgroundColor":"gray"}}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Container maxWidth="sm" style={{"backgroundColor":"blue", "display": "inline-block", "minHeight": "10vh"}}>
                Code upload placeholder
              </Container>
              <Container maxWidth="sm" style={{"backgroundColor":"green", "display": "inline-block", "minHeight": "50vh"}}>
                Code Input placeholder  
                <CodeSubmissionBox />
              </Container>
            </Grid>
            <Grid xs={6}>
              <Container maxWidth="sm" style={{"backgroundColor":"red", "display": "inline-block", "minHeight": "60vh"}}>
                Code Output placeholder
              </Container>
            </Grid>
          </Grid>
        </Container>
        <BackendStatus status={test}/>
      </div>
    </div>
  );
}

export default MainApp;
