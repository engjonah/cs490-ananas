import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useMediaQuery, useTheme } from "@mui/material";
import BackendStatus from '../components/BackendStatus';
import CodeBox from '../components/CodeBox';
import './App.css';
import FeedbackForm from '../components/FeedbackForm';
import FileUpload from '../components/FileUpload';
import { useAuthContext } from '../hooks/useAuthContext';
import ApiUrl from '../ApiUrl';

function TranslatePage() {
  let [test, setTest] = useState(null);
  const {user} = useAuthContext()
  useEffect(()=>{
    if (user){
      fetch(`${ApiUrl}/api/test`, {
        headers: {
          'Authorization':`Bearer ${user.token}`
        }
      })
        .then(res=>res.json())
        .then(res=>{
          console.log(res)
          setTest(res)
        })
    }else{
      setTest([{test:'User must be logged in!'}])
    }
    
  },[user]);


  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  
  const [outputLang, setOutputLang] = useState(1);
  const [inputLang, setInputLang] = useState(0);
  const [codeUpload, setCodeUpload] = useState("");
  const [outputCode, setOutputCode] = useState("");
  
  return (
    <div className="App">
      <div className="div">
        <Container id="translation" disableGutters={true} maxWidth="lg" style={{"paddingTop":"30px"}}>
          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Container maxWidth="sm" disableGutters={true} style={{"display": "inline-block", "minHeight": "10vh"}}>
                <FileUpload setCodeUpload={setCodeUpload}/>
              </Container>
              <Container maxWidth="sm" disableGutters={true} style={{"display": "inline-block", "minHeight": "50vh", "paddingTop":"15px"}}>
                <CodeBox defaultValue={"Enter your code here!\n(can edit)"} user={user} readOnly={false} outputLang={outputLang} codeUpload={codeUpload} inputLang={inputLang} setInputLang={setInputLang} setOutputCode={setOutputCode} />
              </Container>
            </Grid>
            <Grid xs={12} md={6}>
              {!isSmallScreen && <Container maxWidth="sm" disableGutters={true} style={{"display": "inline-block", "minHeight": "10vh"}} />}
              <Container maxWidth="sm" disableGutters={true} style={{"display": "inline-block", "minHeight": "50vh", "paddingTop":"15px"}}>
                <CodeBox defaultValue={"GPT API Output here...\n(read only)\n"} readOnly={true} setOutputLang={setOutputLang} outputCode={outputCode}/>
              </Container>
              <FeedbackForm uid='placeholder' outputLang={outputLang} inputLang={inputLang}/>
            </Grid>
          </Grid>
        </Container>
        <BackendStatus status={test}/>
      </div>
    </div>
  );
}

export default TranslatePage;
