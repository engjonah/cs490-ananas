import React, { useCallback, useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone'
import { Button, Container }  from '@mui/material';

export default function FileUpload({setCodeUpload, setInputLang}) {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        setCodeUpload(binaryStr);
      };

      //reader.readAsArrayBuffer(file)

      reader.readAsText(file)

      const fileExtension = file.name.split('.').pop();

      const extensionToLanguage = {
        py: 1,  // Python
        java: 2,  // Java
        cpp: 3,  // Cpp
        rb: 4,  // Ruby
        cs: 5,  // Csharp
        js: 6,  // javascript
        kt: 7,  // Kotlin
        m: 8,  // Objective-C
      };

      if (extensionToLanguage[fileExtension]) {
        setInputLang(extensionToLanguage[fileExtension]);
      }
    })
  }, [setCodeUpload, setInputLang])

  const {
    getRootProps, 
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {'text/*': ['.js', '.py', '.java', '.rb', '.cpp', '.cs', '.kt', '.m']},
    maxFiles:1
  })

  const [dropColor, setDropColor] = useState("#f5f5f5");

  useEffect(() => {
    setDropColor(isDragActive ? (isDragAccept ? "#77DD77" : "#FFCCCC"): "#f5f5f5");
  }, [isDragReject, setDropColor, isDragAccept, isDragActive, dropColor])

  return (
    <Container {...getRootProps()} maxWidth={false} disableGutters={true} style={{"backgroundColor":dropColor, "borderRadius": '15px', "border":"dotted", "borderColor":"#d9d9d9", "borderWidth":"1.5px"}}>
      <input {...getInputProps()} />
      <Button fullWidth={true} style={{"minHeight":"10vh"}}>Drop files here or click to upload </Button>
    </Container>
  )
}
