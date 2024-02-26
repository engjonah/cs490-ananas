import Editor from '@monaco-editor/react';
import React, { useRef, useState } from 'react';
import { Button, Container, Tooltip }  from '@mui/material';
import Container from '@mui/material/Container';
import { IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import LanguageBar from './LanguageBar';

export default function CodeSubmissionBox({defaultValue, isInput}) {
  const editorRef = useRef(null);
  const [code, setCode] = useState('');
  
  useEffect(() => {
    if (editorRef.current) {
      setCode(editorRef.current.getValue());
    }
  }, []);

  let [inputExists, setInputExists] = useState(false)

  function updateCurrentInput() {
    const currValue = editorRef.current.getValue();
    setInputExists(readOnly || (currValue !== defaultValue && currValue !== ''));
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    updateCurrentInput();
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }

  const downloadCodeFile = () => {
    const element = document.createElement("a");
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "placeholder.py";
    document.body.appendChild(element);
    element.click();
  }

  const tabsData = [
    { label: 'Python' },
    { label: 'Java' },
    { label: 'C++' },
    // Add more tabs as needed
  ];

  isInput && tabsData.unshift({ label: 'Detect Language' });
  
  return (
    <>
      <Container style={{"borderRadius": '5%', "padding": "6px", "backgroundColor": "white"}}>
          <LanguageBar tabsData={tabsData}/>
          <Editor
            height="40vh" 
            theme="light" 
            defaultValue={defaultValue}
            options={{"readOnly":!isInput}}
            onMount={handleEditorDidMount}
            onChange={updateCurrentInput}
          />
          <Tooltip title={!inputExists ? "Add some code first!" : "Submit your code here"}>
            <span>
              <Button variant="outlined" disabled={!inputExists} onClick={showValue}>Proof of concept to export code somewhere</Button>
            </span>
          </Tooltip>
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

