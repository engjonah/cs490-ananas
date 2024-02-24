import Editor from '@monaco-editor/react';
import React, { useRef, useState } from 'react';
import Container from '@mui/material/Container';

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
          <button disabled={!inputExists} onClick={showValue}>Proof of concept to export code somewhere</button>
      </Container>
    </>
  )
}

