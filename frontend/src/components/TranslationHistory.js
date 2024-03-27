import React, { useState } from 'react';
import { Paper, Typography, IconButton, Grid, Divider, Collapse, Pagination, Container, Tooltip } from '@mui/material';
import ApiUrl from '../ApiUrl';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Editor from '@monaco-editor/react';

const TranslationHistoryItem = ({ translation, onDelete, onExpand, expanded, onEdit }) => {
  const { inputLang, outputLang, inputCode, outputCode, status, translatedAt } = translation;

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme('gray', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      },
    });
    monaco.editor.setTheme('gray')
  }

  return (
    <Paper elevation={1} style={{ padding: '15px', marginBottom: '10px', overflow: 'hidden', backgroundColor: "#f5f5f5", textAlign:"left"}}>
      <Grid container alignItems="center">
        <Grid item xs={8}>
          <Typography variant="subtitle1"><strong>{`${inputLang} `}</strong>
            <ArrowForwardIcon fontSize="15px" />
            <strong>{` ${outputLang}`}</strong></Typography>
          <Typography variant="body2"><strong>Date: </strong>{new Date(translatedAt).toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
          <Tooltip title={expanded ? "Collapse" : "Expand"}>
            <IconButton aria-label="expand" onClick={onExpand}>
              {expanded? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={"Edit"}>
            <IconButton aria-label="edit" onClick={onEdit}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={"Delete"}>
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ padding: '10px' }}>
          <Typography variant="body2">
            <strong>Input Code: </strong>
            <br/>
            <Container style={{ "borderRadius": '15px', "padding": "6px", "backgroundColor": "#ffffff" }}>
              <Editor 
                height="15vh" 
                defaultLanguage={inputLang} 
                defaultValue={inputCode} 
                options={{ "readOnly": true }}
                onMount={handleEditorDidMount}
              />
            </Container>
          </Typography>
          <br/>
          <Typography variant="body2">
            <strong>Output Code: </strong>
            <br/>
            <Container style={{ "borderRadius": '15px', "padding": "6px", "backgroundColor": "#ffffff" }}>
              <Editor 
                height="15vh" 
                defaultLanguage={inputLang} 
                defaultValue={outputCode} 
                options={{ "readOnly": true }}
                onMount={handleEditorDidMount}
              />
            </Container>
          </Typography>
          <Typography variant="body2"><strong>Status: </strong> {status}</Typography>
        </div>
      </Collapse>
    </Paper>
  );
};


const TranslationHistory = ({testTranslations, outputLoading, setEditCalled, setCodeUpload, setOutputCode, setInputLang, setOutputLang}) => {

  const [translations, setTranslations] = useState(testTranslations? testTranslations : []);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [expandedIndex, setExpandedIndex] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?.uid;

  React.useEffect(() => {
    if (userId) {
      fetch(`${ApiUrl}/api/translateHistory/${userId}`)
        .then(response => response.json())
        .then(data => {
          const sortedTranslations = data.Translations.sort((a, b) => new Date(b.translatedAt) - new Date(a.translatedAt));
          setTranslations(sortedTranslations);
          console.log("Translations:", sortedTranslations);
        })
        .catch(error => {
          console.error('Error fetching translations:', error);
        });
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) {
      fetch(`${ApiUrl}/api/translateHistory/${userId}`)
        .then(response => response.json())
        .then(data => {
          const sortedTranslations = data.Translations.sort((a, b) => new Date(b.translatedAt) - new Date(a.translatedAt));
          setTranslations(sortedTranslations);
          console.log("Translations:", sortedTranslations);
        })
        .catch(error => {
          console.error('Error fetching translations:', error);
        });
    }
  }, [outputLoading, userId]);


  const handleDelete = async(index) => {
    fetch(`${ApiUrl}/api/translateHistory/${translations[index]._id}`, { method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
          console.log(translations[index]);
          console.log("Deleted item at index:", index);
        })
        .catch(error => {
          console.error('Error fetching translations:', error);
          return;
        });
    const updatedTranslations = [...translations];
    updatedTranslations.splice(index, 1);
    setTranslations(updatedTranslations);
  };

  const handleExpand = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

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

  const handleEdit = (index) => {
    setEditCalled(true)
    setCodeUpload(translations[index].inputCode)
    setOutputCode(translations[index].outputCode)
    setInputLang(nameToLanguage[translations[index].inputLang] || 0)
    setOutputLang(nameToLanguage[translations[index].outputLang] || 0)
    setEditCalled(false)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, translations.length); // Adjust endIndex

  return (
    <Container style={{ borderRadius: '5px', padding: "20px", alignItems: "left"}}>
      <Typography variant="h4" gutterBottom>Translation History</Typography>
      {translations.length === 0 ? (
        <Typography variant="subtitle1">You have no translations!</Typography>
      ) : (
        <>
          {translations.slice(startIndex, endIndex).map((translation, index) => (
            <React.Fragment key={startIndex + index}>
              <TranslationHistoryItem
                translation={translation}
                onDelete={() => handleDelete(startIndex + index)}
                onEdit={() => handleEdit(startIndex + index)}
                onExpand={() => handleExpand(startIndex + index)}
                expanded={startIndex + index === expandedIndex}
              />
              {index !== itemsPerPage - 1 && index !== translations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Pagination
            count={Math.ceil(translations.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            style={{ marginTop: '20px' }}
          />
        </>
      )}
    </Container>
  );
};

export default TranslationHistory;
