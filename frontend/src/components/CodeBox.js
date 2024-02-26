import Editor from '@monaco-editor/react';
import React, { useRef, useState } from 'react';
import { Button, Container, Tooltip }  from '@mui/material';

export default function CodeSubmissionBox({defaultValue, readOnly}) {
  const editorRef = useRef(null);

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
  return (
    <>
      <Container style={{"borderRadius": '5%', "padding": "6px", "backgroundColor": "white"}}>
          <Editor 
            height="40vh" 
            theme="light" 
            defaultValue={defaultValue}
            options={{"readOnly":readOnly}}
            onMount={handleEditorDidMount}
            onChange={updateCurrentInput}
          />
          <Tooltip title={!inputExists ? "Add some code first!" : "Submit your code here"}>
            <span>
              <Button variant="outlined" disabled={!inputExists} onClick={showValue}>Proof of concept to export code somewhere</Button>
            </span>
          </Tooltip>
      </Container>
    </>
  )
}

