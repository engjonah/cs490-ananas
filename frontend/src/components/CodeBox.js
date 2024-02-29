import Editor from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, Tooltip }  from '@mui/material';
import { IconButton, Box, Tab, Tabs } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function CodeBox({defaultValue, readOnly, outputLang, setOutputLang, codeUpload, inputLang, setInputLang}) {
  const editorRef = useRef(null);

  const [inputExists, setInputExists] = useState(false)
  const [code, setCode] = useState(defaultValue);
  const [currTab, setCurrTab] = React.useState(1);

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

  function showValue() {
    alert(
      code + 
      "\ninput language: " + (currTab !== 0? languageMap[currTab-1].name : "detect this language") + 
      "\noutput language: " + languageMap[outputLang].name + 
      "\n^ This gets submitted to API");
  }

  const downloadCodeFile = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "placeholder" + (currTab !== 0? languageMap[currTab-1].extension : ".detectlang");
    document.body.appendChild(element);
    element.click();
  }

  const handleTabChange = (event, newTab) => {
    setCurrTab(newTab);
    
    if (readOnly) {
      setOutputLang(newTab);
    }
    else
    {
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
      <Container style={{"borderRadius": '15px', "padding": "6px", "backgroundColor": "#f5f5f5"}}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={currTab} 
                onChange={handleTabChange} 
                variant="scrollable"
                scrollButtons="auto"
              >
                {!readOnly && <Tab label={"Detect Language"} value={0} key={0}/>}
                {languageMap.map((language, index) => (
                  <Tab label={language.name} value={index+1} key={index+1}/>
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
            language={currTab !== 0 ? languageMap[currTab-1].syntaxName : "detect this language"}
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

