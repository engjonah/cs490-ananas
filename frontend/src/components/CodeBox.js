import Editor from '@monaco-editor/react';
import React, { useEffect, useRef } from 'react';
import { Button, Container, Tooltip } from '@mui/material';
import { IconButton, Box, Tab, Tabs } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';
import loadingPenguin from '../assets/loadingPenguin.gif'
import toast from 'react-hot-toast';
import detectLang from 'lang-detector';
import { languageMap, nameToLanguage } from '../constants'

export default function CodeBox({ defaultValue, readOnly, outputLang, setOutputLang, codeUpload, inputLang, setInputLang, user, outputCode, setOutputCode , outputLoading, setOutputLoading, setTranslationId}) {
  const editorRef = useRef(null);

  const [inputExists, setInputExists] = React.useState(false)
  const [code, setCode] = React.useState(defaultValue);
  const [currTab, setCurrTab] = React.useState(readOnly ? 1 : 0);
  const [lineCount, setLineCount] = React.useState(0);

  const maxLineLimit = 1000;

  function updateCurrentInput() {
    setCode(editorRef.current.getValue());
    setLineCount(editorRef.current.getModel().getLineCount());
    detectLanguageOnChange();
  }

  useEffect(() => {
    setInputExists(readOnly || (code !== defaultValue && code !== ''));
  }, [code, readOnly, defaultValue]);

  useEffect(() => {
    if (codeUpload) {
      editorRef.current.setValue(codeUpload);
    }
  }, [codeUpload])

  useEffect(()=>{
    if(inputLang){
      setCurrTab(inputLang)
    }
  },[inputLang])

  useEffect(()=>{
    if(readOnly && outputLang){
      setCurrTab(outputLang)
    }
  },[outputLang, readOnly])

  const detectLanguageOnChange = () => {
    if (inputLang !== 0) {
      return;
    }
    const detectedLang = detectLang(code) || "Unknown";
    const langNum = nameToLanguage[detectedLang] || 0;
    setInputLang(langNum);
  };

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme('gray', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#f5f5f5',
      },
    });
    monaco.editor.setTheme('gray')
    editorRef.current = editor;
    setCode(editorRef.current.getValue());
    setLineCount(editorRef.current.getModel().getLineCount());
  }

  async function storeTranslation(inputLang, outputLang, inputCode, outputCode, status) {
    await fetch(`${ApiUrl}/api/translateHistory`,{
        method: "POST",
        body: JSON.stringify({
          uid: user.uid,
          inputLang: inputLang === "this unknown language"? "Detect Language" : inputLang,
          outputLang: outputLang,
          inputCode: inputCode,
          outputCode: outputCode,
          status: status,
          translatedAt: new Date(),
        }),
        headers:{
          "Content-type": "application/json",
          'Authorization':`Bearer ${user.token}`,
        },
    })
    .then(res => res.json())
    .then((res) => {
        setTranslationId(res.translationId);
        console.log("Translation saved");
    })
    .catch((err) => {
        ErrorReport("Translation history:" + err.message);
        toast.error("An error occured when storig the translation")
        console.log(err.message)
    })
  };

  async function getTranslation() {
    setOutputLoading(true);
    let status = 200;
    const output = await fetch(`${ApiUrl}/api/translate`, {
      method: "POST",
      body: JSON.stringify({
        uid: user.uid,
        inputLang: currTab !== 0 ? languageMap[currTab - 1].name : "this unknown language",
        outputLang: languageMap[outputLang - 1].name,
        inputCode: code,
        translatedAt: new Date()
      }),
      headers: {
        "Content-type": "application/json",
        'Authorization':`Bearer ${user.token}`,
      },
    })
      .then((response) => {
        status = response.status;
        if (response.status === 429) {
          toast.error("Rate Limit Exceeded")
          return "Translation Failed"
        }
        if (response.status === 503) {
          toast.error("API Connection Error")
          return "Translation Failed"
        }
        if (response.status === 500) {
          toast.error("Unknown Error Occurred")
          return "Translation Failed"
        }
        if (response.status === 200) {
          toast.success("Translation Completed!");
        }
        return response.json()
      }).then((data) => {
        if (data.translation) return data.translation
        return data
      })
      .catch((err) => {
        ErrorReport("CodeBox:" + err.message);
        console.log(err.message)
        toast.error("An error occurred during the translation process.");
        return "Translation Failed"
      })
    console.log(output)
    await storeTranslation(currTab !== 0 ? languageMap[currTab - 1].name : "this unknown language", languageMap[outputLang - 1].name, code, output, status)
    setOutputCode(output);
    setOutputLoading(false);
  }

  const downloadCodeFile = (code, extension) => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "output" + extension;
    document.body.appendChild(element);
    element.click();
  }

  const handleTabChange = (event, newTab) => {
    setCurrTab(newTab);

    if (readOnly) {
      setOutputLang(newTab);
    }
    else {
      setInputLang(newTab);
    }
  };

  return (
    <>
      <Container style={{ "borderRadius": '15px', "padding": "6px", "backgroundColor": "#f5f5f5" }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& button:hover": { background: "#ecf0f3" },
              }}
            >
              {!readOnly && <Tab label={"Detect Language"} value={0} key={0} />}
              {languageMap.map((language, index) => (
                <Tab label={language.name} value={index + 1} key={index + 1} />
              ))}
            </Tabs>
          </Box>
        </Box>
        {(!readOnly || (readOnly && !outputLoading)) && 
        <Editor
          height="40vh"
          theme="light"
          loading="Loading your pudgy penguins..."
          defaultValue={defaultValue}
          value={readOnly && outputCode}
          language={currTab !== 0 ? languageMap[currTab - 1].syntaxName : "detect this language"}
          options={{ "readOnly": readOnly }}
          onMount={handleEditorDidMount}
          onChange={updateCurrentInput}
        />
        }
        {(readOnly && outputLoading) &&
        <div>
          <img src={loadingPenguin} alt="loading..." style={{"width":"100%", "height":"40vh", "objectFit":"cover", "objectPosition":"50% 70%"}}/>
        </div>
        }
        {!readOnly &&
          <Tooltip title={outputLoading ? "Translating...": !inputExists ? "Add some code first!" : (lineCount > maxLineLimit ? "Input exceeded max limit" : "Submit your code here")}>
            <span>
              <Button variant="outlined" disabled={!inputExists || lineCount > maxLineLimit || outputLoading} onClick={getTranslation}>Translate</Button>
            </span>
          </Tooltip>
        }
        <Tooltip title={"Download"}>
          <IconButton onClick={(e) => downloadCodeFile(code, currTab !== 0 ? languageMap[currTab - 1].extension : ".detectlang")} aria-label="delete" size="large" data-testid="download-button">
            <DownloadRoundedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Copy"}>
          <IconButton onClick={() => { navigator.clipboard.writeText(code) }} data-testid="copy-button">
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Container>
    </>
  )
}
