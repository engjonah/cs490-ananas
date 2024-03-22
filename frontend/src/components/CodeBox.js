import Editor from '@monaco-editor/react';
import React, { useEffect, useRef } from 'react';
import { Button, Container, Tooltip } from '@mui/material';
import { IconButton, Box, Tab, Tabs } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';

export default function CodeBox({ defaultValue, readOnly, outputLang, setOutputLang, codeUpload, inputLang, setInputLang, user, outputCode, setOutputCode }) {
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
        console.log("Translation successfully generated")
        return response.json()
      }).then((data) => {
        return data.translation
      })
      .catch((err) => {
        ErrorReport("CodeBox:" + err.message);
        console.log(err.message)
        return "Translation failed"
      })
    console.log(output)
    setOutputCode(output);
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
        {!readOnly &&
          <Tooltip title={!inputExists ? "Add some code first!" : (lineCount > 100 ? "Input exceeded max limit" : "Submit your code here")}>
            <span>
              <Button variant="outlined" disabled={!inputExists || lineCount > 100} onClick={getTranslation}>Translate</Button>
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
