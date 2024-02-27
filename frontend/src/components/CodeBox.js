import Editor from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Tooltip }  from '@mui/material';
import { IconButton, Box, Tab, Tabs } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function CodeBox({defaultValue, readOnly, outputLang, setOutputLang, codeUpload}) {
  const editorRef = useRef(null);

  const [inputExists, setInputExists] = useState(false)
  const [code, setCode] = useState(defaultValue);
  const [currTab, setCurrTab] = React.useState(0);

  function updateCurrentInput() {
    setCode(editorRef.current.getValue());
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
    editorRef.current = editor;
    updateCurrentInput();
  }

  function showValue() {
    alert(
      code + 
      "\ninput language: " + (languageMap[readOnly? currTab:currTab-1] ? languageMap[readOnly? currTab:currTab-1].name : "detect this language") + 
      "\noutput language: " + languageMap[outputLang].name + 
      "\n^ This gets submitted to API");
  }

  const downloadCodeFile = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "placeholder" + languageMap[readOnly? currTab:currTab-1].extension;
    document.body.appendChild(element);
    element.click();
  }

  const handleTabChange = (event, newTab) => {
    setCurrTab(newTab);
    if (readOnly) {
      setOutputLang(newTab);
    }
  };

  const languageMap = [
    { name: "Python", extension: ".py" },
    { name: "Java", extension: ".java" },
    { name: "C++", extension: ".cpp" },
    { name: "Ruby", extension: ".rb" },
    { name: "C#", extension: ".cs" },
    { name: "Kotlin", extension: ".kt" },
    { name: "Go", extension: ".go" },
    { name: "Matlab", extension: ".m" },
    // add more languages here
  ];
  
  return (
    <>
      <Container style={{"borderRadius": '5%', "padding": "6px", "backgroundColor": "white"}}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currTab} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
              >
                {!readOnly && <Tab label={"Detect Language"} key={0} />}
                {languageMap.map((language, index) => (
                  <Tab label={language.name} key={index + 1} />
                ))}
              </Tabs>
            </Box>
          </Box>
          <Editor
            height="40vh" 
            theme="light" 
            defaultValue={defaultValue}
            options={{"readOnly":readOnly}}
            onMount={handleEditorDidMount}
            onChange={updateCurrentInput}
          />
          {!readOnly && 
            <Tooltip title={!inputExists ? "Add some code first!" : "Submit your code here"}>
              <span>
                <Button variant="outlined" disabled={!inputExists} onClick={showValue}>Translate</Button>
              </span>
            </Tooltip>
          }
          <Tooltip title={"Download"}>
            <IconButton onClick={downloadCodeFile} aria-label="delete" size="large">
              <DownloadRoundedIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title={"Copy"}>
            <IconButton onClick={() => {navigator.clipboard.writeText(code)}}>
              <ContentCopyIcon/>
            </IconButton>
          </Tooltip>
      </Container>
    </>
  )
}

