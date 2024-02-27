import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import BackendStatus from './BackendStatus';
import CodeBox from './CodeBox';
import './App.css';
import FeedbackForm from './FeedbackForm';
import FileUpload from './FileUpload';

function TranslatePage() {
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

  const [outputLang, setOutputLang] = useState(0);
  const [codeUpload, setCodeUpload] = useState("");
  
  return (
    <div className="App">
      <div className="div">
        <Container id="translation" maxWidth="lg" style={{"backgroundColor":"gray"}}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <Container maxWidth="sm" style={{"backgroundColor":"blue", "display": "inline-block", "minHeight": "10vh"}}>
                <FileUpload setCodeUpload={setCodeUpload}/>
              </Container>
              <Container maxWidth="sm" style={{"backgroundColor":"green", "display": "inline-block", "minHeight": "50vh"}}>
                Code Input placeholder  
                <CodeBox defaultValue={"Enter your code here!\n(can edit)"} readOnly={false} outputLang={outputLang} codeUpload={codeUpload} />
              </Container>
            </Grid>
            <Grid xs={6}>
              <Container maxWidth="sm" style={{"backgroundColor":"red", "display": "inline-block", "minHeight": "60vh"}}>
                Code Output placeholder
                <CodeBox defaultValue={"GPT API Output here...\n(read only)\n"} readOnly={true} setOutputLang={setOutputLang} />
              </Container>
            </Grid>
          </Grid>
        </Container>
        <FeedbackForm/>
        <BackendStatus status={test}/>

      </div>
    </div>
  );
}

export default TranslatePage;
