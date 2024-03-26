import React, { useState, useEffect } from 'react';
import { Paper, Typography, IconButton, Grid, Divider, Collapse, Pagination, Container } from '@mui/material';
import ApiUrl from '../ApiUrl';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const TranslationHistoryItem = ({ translation, onDelete, onExpand, expanded }) => {
  const { inputLang, outputLang, inputCode, outputCode, status, translatedAt } = translation;

  const handleExpandClick = () => {
    onExpand();
  };

  return (
    <Paper elevation={3} style={{ padding: '15px', marginBottom: '10px', overflow: 'hidden' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={8}>
          <Typography variant="subtitle1"><strong>{`${inputLang} `}</strong>
            <ArrowForwardIcon fontSize="15px" />
            <strong>{` ${outputLang}`}</strong></Typography>
          <Typography variant="body2"><strong>Date: </strong>{new Date(translatedAt).toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
          <IconButton aria-label="expand" onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ padding: '10px' }}>
          <Typography variant="body2"><strong>Input Code: </strong> {inputCode}</Typography>
          <Typography variant="body2"><strong>Output Code: </strong> {outputCode}</Typography>
          <Typography variant="body2"><strong>Status: </strong> {status}</Typography>
        </div>
      </Collapse>
    </Paper>
  );
};

const TranslationHistory = () => {
  const [translations, setTranslations] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [expandedIndex, setExpandedIndex] = useState(null);
  const userId = JSON.parse(localStorage.getItem("user"))?.uid; // Handle user null case

  useEffect(() => {
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

  const handleDelete = async(index) => {
    fetch(`${ApiUrl}/api/translateHistory/${translations[index]._id}`, { method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
          const updatedTranslations = [...translations];
          console.log(translations[index]);
          updatedTranslations.splice(index, 1);
          setTranslations(updatedTranslations);
          console.log("Deleted item at index:", index);
        })
        .catch(error => {
          console.error('Error fetching translations:', error);
        });
  };

  const handleExpand = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, translations.length); // Adjust endIndex

  return (
    <Container style={{ borderRadius: '5px', padding: "20px", backgroundColor: "#f5f5f5" }}>
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
                onExpand={() => handleExpand(startIndex + index)}
                expanded={startIndex + index === expandedIndex}
              />
              {index !== itemsPerPage - 1 && index !== translations.length - 1 && <Divider />} {/* Adjust Divider */}
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
