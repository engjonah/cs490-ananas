import Editor from '@monaco-editor/react';
import React, { useCallback, useEffect, useRef } from 'react';
import { Button, Container, Tooltip } from '@mui/material';
import { IconButton, Box, Tab, Tabs } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';
import loadingPenguin from '../assets/loadingPenguin.gif'
import toast from 'react-hot-toast';
import detectLang from 'lang-detector';

export default function CodeBox({ defaultValue, readOnly, outputLang, setOutputLang, codeUpload, inputLang, setInputLang, user, outputCode, setOutputCode , outputLoading, setOutputLoading}) {
  const editorRef = useRef(null);

  const [inputExists, setInputExists] = React.useState(false)
  const [code, setCode] = React.useState(defaultValue);
  const [currTab, setCurrTab] = React.useState(1);
  const [lineCount, setLineCount] = React.useState(0);

  function updateCurrentInput() {
    setCode(editorRef.current.getValue());
    setLineCount(editorRef.current.getModel().getLineCount());
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

  

  useEffect(() => {
    const detectLanguageOnChange = () => {
      var code = editorRef.current.getValue();
      var detectedLang = detectLang(code) || "Unknown";
      console.log(detectedLang);
      const nameToLanguage = {
        "Unknown": 0,
        "Python": 1,  // Python
        "Java": 2,  // Java
        "C++": 3,  // Cpp
        "Ruby": 4,  // Ruby
        "C#": 5,  // Csharp
        "JavaScript": 6,  // javascript
        "Kotlin": 7,  // Kotlin
        "Objective-C": 8,  // Objective-C
      };
      var langNum = nameToLanguage[detectedLang] || 0;
      setInputLang(langNum);      
    }
    if (editorRef.current) {
      editorRef.current.onDidChangeModelContent(detectLanguageOnChange);
    } 
  }, [editorRef, setInputLang]);
  

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
    updateCurrentInput();
  }

  async function getTranslation() {
    setOutputLoading(true);
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
        "Content-type": "application/json"
      },
    })
      .then((response) => {
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
        return response.json()
      }).then((data) => {
        if (data.translation) return data.translation
        return data
      })
      .catch((err) => {
        ErrorReport("CodeBox:" + err.message);
        console.log(err.message)
        return "Translation Failed"
      })
    console.log(output)
    setOutputCode(output);
    setOutputLoading(false);
  }

  const downloadCodeFile = (code, extension) => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "placeholder" + extension;
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

  const languageMap = [
    { syntaxName: "python", name: "Python", extension: ".py" },
    { syntaxName: "java", name: "Java", extension: ".java" },
    { syntaxName: "cpp", name: "C++", extension: ".cpp" },
    { syntaxName: "ruby", name: "Ruby", extension: ".rb" },
    { syntaxName: "csharp", name: "C#", extension: ".cs" },
    { syntaxName: "javascript", name: "JavaScript", extension: ".js" },
    { syntaxName: "kotlin", name: "Kotlin", extension: ".kt" },
    { syntaxName: "objectivec", name: "Objective-C", extension: ".m" },
    {}
    // add more languages here
  ];

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
          defaultLanguage='python'
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
          <Tooltip title={outputLoading ? "Translating...": !inputExists ? "Add some code first!" : (lineCount > 100 ? "Input exceeded max limit" : "Submit your code here")}>
            <span>
              <Button variant="outlined" disabled={!inputExists || lineCount > 100 || outputLoading} onClick={getTranslation}>Translate</Button>
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
