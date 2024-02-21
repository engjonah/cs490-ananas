import Editor from '@monaco-editor/react';
import React, { useRef } from 'react';
import Container from '@mui/material/Container';

export default function CodeSubmissionBox() {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
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
            defaultValue="//Add your code here!"
            onMount={handleEditorDidMount}
          />
          <button onClick={showValue}>Proof of concept to export code somewhere</button>
      </Container>
    </>
  )
}

