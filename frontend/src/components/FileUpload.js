import React, { useCallback } from "react";
import {useDropzone} from 'react-dropzone'
import { Button, Container }  from '@mui/material';

export default function FileUpload({setCodeUpload}) {
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
    })
  }, [setCodeUpload])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <Container {...getRootProps()} maxWidth={false} disableGutters={true} style={{"backgroundColor":"#f5f5f5", "borderRadius": '15px', "border":"dotted", "borderColor":"#d9d9d9", "borderWidth":"1.5px"}}>
      <input {...getInputProps()} />
      <Button fullWidth={true} style={{"minHeight":"10vh"}}>Drop files here or click to upload </Button>
    </Container>
  )
}