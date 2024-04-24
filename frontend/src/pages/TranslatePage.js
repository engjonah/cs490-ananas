import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useMediaQuery, useTheme } from '@mui/material';
import CodeBox from '../components/CodeBox';
import './App.css';
import FeedbackForm from '../components/FeedbackForm';
import FileUpload from '../components/FileUpload';
import { useAuthContext } from '../hooks/useAuthContext';
import TranslationHistory from '../components/TranslationHistory';

function TranslatePage() {
  const { user } = useAuthContext();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [outputLang, setOutputLang] = useState(1);
  const [inputLang, setInputLang] = useState(0);
  const [codeUpload, setCodeUpload] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [outputLoading, setOutputLoading] = useState(false);
  const [editCalled, setEditCalled] = useState(false);
  const [translationId, setTranslationId] = useState('');

  useEffect(() => {}, [editCalled]);

  return (
    <div className="App">
      <div className="div">
        <Container
          id="translation"
          disableGutters={true}
          maxWidth="lg"
          style={{ marginTop: '8%' }}
        >
          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Container
                maxWidth="sm"
                disableGutters={true}
                style={{ display: 'inline-block', minHeight: '10vh' }}
              >
                <FileUpload
                  setCodeUpload={setCodeUpload}
                  setInputLang={setInputLang}
                />
              </Container>
              <Container
                maxWidth="sm"
                disableGutters={true}
                style={{
                  display: 'inline-block',
                  minHeight: '50vh',
                  paddingTop: '15px',
                }}
              >
                <CodeBox
                  defaultValue={'Enter your code here!\n(can edit)'}
                  user={user}
                  readOnly={false}
                  outputLang={outputLang}
                  codeUpload={codeUpload}
                  inputLang={inputLang}
                  setInputLang={setInputLang}
                  setOutputCode={setOutputCode}
                  outputLoading={outputLoading}
                  setOutputLoading={setOutputLoading}
                  setTranslationId={setTranslationId}
                />
              </Container>
            </Grid>
            <Grid xs={12} md={6}>
              {!isSmallScreen && (
                <Container
                  maxWidth="sm"
                  disableGutters={true}
                  style={{ display: 'inline-block', minHeight: '10vh' }}
                />
              )}
              <Container
                maxWidth="sm"
                disableGutters={true}
                style={{
                  display: 'inline-block',
                  minHeight: '50vh',
                  paddingTop: '15px',
                }}
              >
                <CodeBox
                  defaultValue={'GPT API Output here...\n(read only)\n'}
                  readOnly={true}
                  outputLang={outputLang}
                  setOutputLang={setOutputLang}
                  outputLoading={outputLoading}
                  outputCode={outputCode}
                />
              </Container>
              <FeedbackForm
                outputLang={outputLang}
                inputLang={inputLang}
                translationId={translationId}
              />
            </Grid>
            <Grid xs={12} md={12}>
              <TranslationHistory
                outputLoading={outputLoading}
                setEditCalled={setEditCalled}
                setCodeUpload={setCodeUpload}
                setOutputCode={setOutputCode}
                setInputLang={setInputLang}
                setOutputLang={setOutputLang}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
}

export default TranslatePage;
