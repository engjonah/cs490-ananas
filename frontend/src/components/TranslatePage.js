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
        <Container id="translation" disableGutters={true} maxWidth="lg">
          <Grid container spacing={4}>
            <Grid xs={6}>
              <Container maxWidth="sm" disableGutters={true} style={{"backgroundColor":"blue", "display": "inline-block", "minHeight": "10vh"}}>
                <FileUpload setCodeUpload={setCodeUpload}/>
              </Container>
              <Container maxWidth="sm" disableGutters={true} style={{"backgroundColor":"green", "display": "inline-block", "minHeight": "50vh"}}>
                <CodeBox defaultValue={"Enter your code here!\n(can edit)"} readOnly={false} outputLang={outputLang} codeUpload={codeUpload} />
              </Container>
            </Grid>
            <Grid xs={6}>
              <Container maxWidth="sm" disableGutters={true} style={{"backgroundColor":"red", "display": "inline-block", "minHeight": "60vh"}}>
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
