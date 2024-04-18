import React, { useState, useEffect } from 'react';
import { Paper, Typography, IconButton, Grid, Divider, Collapse, Pagination, Container, Tooltip, MenuItem, Select, FormControlLabel, Checkbox, Menu, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import ApiUrl from '../ApiUrl';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../hooks/useAuthContext';
import { ErrorReport } from '../services/ErrorReport';
import { nameToLanguage } from '../constants'
import { GetUID } from '../services/UserInfo';

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
          <Grid container alignItems="center">
            <Typography aria-label={`inputLabel${inputLang}`} variant="subtitle1"><strong>{`${inputLang}  `}</strong> </Typography>
              <ArrowForwardIcon fontSize="15px" />
            <Typography aria-label={`outputLabel${outputLang}`} variant="subtitle1"><strong>{`  ${outputLang}`}</strong></Typography>
          </Grid>
          <Typography variant="body2"><strong>Date: </strong>{new Date(translatedAt).toLocaleString()}</Typography>
        </Grid>
        <Grid item xs={4} container justifyContent="flex-end" alignItems="center">
          <Tooltip title={expanded ? "Collapse" : "Expand"}>
            <IconButton aria-label="expand" onClick={onExpand}>
              {expanded? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={"View"}>
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
          </Typography>
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
          <br/>
          <Typography variant="body2">
            <strong>Output Code: </strong>
          </Typography>
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
          <Typography variant="body2"><strong>Status: </strong> {status}</Typography>
        </div>
      </Collapse>
    </Paper>
  );
};



const TranslationHistory = ({testTranslations, outputLoading, setEditCalled, setCodeUpload, setOutputCode, setInputLang, setOutputLang}) => {

  const [translations, setTranslations] = useState(testTranslations? testTranslations : []);
  const [filteredTranslations, setFilteredTranslations] = useState(testTranslations? testTranslations : []);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('translatedAt');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for descending, 'asc' for ascending
  const [selectedInputLanguages, setSelectedInputLanguages] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedOutputLanguages, setSelectedOutputLanguages] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const userId = GetUID();
  const {user} = useAuthContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [clearMenuOpen, setClearMenuOpen] = useState(false);

  React.useEffect(() => {
    if (userId) {
      fetch(`${ApiUrl}/api/translateHistory/${userId}`, { 
        method: 'GET',
        headers: {
          "Content-type": "application/json",
          'Authorization':`Bearer ${user.token}`
        },
      })
        .then(response => response.json())
        .then(data => {
          const sortedTranslations = data.Translations.sort((a, b) => new Date(b.translatedAt) - new Date(a.translatedAt));
          setTranslations(sortedTranslations);
        })
        .catch(error => {
          ErrorReport("Translation History Fetch:" + error.message);
          toast.error(error.message);
          console.error('Error fetching translations:', error);
        });
    }
  }, [outputLoading, userId, user.token]);

  useEffect(() => {
    if(outputLoading) {
      setSortOrder('desc')
      setSortCriteria('translatedAt')
    }
  }, [outputLoading, sortOrder, sortCriteria]);

  // filtering
  useEffect(() => {
    const newFilteredTranslations = translations.filter(translation => {
      const inputLanguageSelected = selectedInputLanguages.includes(nameToLanguage[translation.inputLang]);
      const outputLanguageSelected = selectedOutputLanguages.includes(nameToLanguage[translation.outputLang]);
      return inputLanguageSelected && outputLanguageSelected;
    });
    setFilteredTranslations(newFilteredTranslations);
  }, [translations, selectedInputLanguages, selectedOutputLanguages]);


  const handleDelete = async(index) => {
    fetch(`${ApiUrl}/api/translateHistory/${translations[index]._id}`, { 
      method: 'DELETE',
      headers: {
        "Content-type": "application/json",
        'Authorization':`Bearer ${user.token}`
      },
    })
        .then(response => response.json())
        .then(data => {
          toast.success("Deleted translation!");
        })
        .catch(error => {
          ErrorReport("Translation History Delete:" + error.message);
          toast.error(error.message);
          console.error('Error fetching translations:', error);
          return;
        });
    const updatedTranslations = [...translations];
    updatedTranslations.splice(index, 1);
    setTranslations(updatedTranslations);
    if (index === expandedIndex) {
      setExpandedIndex(null);
    }
  };

  const handleClearHistory = async(index) => {
    fetch(`${ApiUrl}/api/translateHistory/clearHistory/${userId}`, { 
      method: 'DELETE',
      headers: {
        "Content-type": "application/json",
        'Authorization':`Bearer ${user.token}`
      },
    })
        .then(response => response.json())
        .then(data => {
          toast.success("Cleared translation history!");
        })
        .catch(error => {
          ErrorReport("Translation History Clear:" + error.message);
          toast.error(error.message);
          return;
        });
    setTranslations([]);
    setPage(1);
    setExpandedIndex(null);
    setClearMenuOpen(false);
  };

  const handleSort = (criteria, order) => {
    const sortedTranslations = [...translations].sort((a, b) => {
      if (criteria === 'translatedAt') {
        return order === 'asc' ? new Date(a[criteria]) - new Date(b[criteria]) : new Date(b[criteria]) - new Date(a[criteria]);
      } else {
        const comparison = a[criteria] < b[criteria] ? -1 : a[criteria] > b[criteria] ? 1 : 0;
        return order === 'asc' ? comparison : -comparison;
      }
    });
  
    setSortOrder(order);
    setSortCriteria(criteria);
    setTranslations(sortedTranslations);
  };

  const handleCheckboxChange = (language, type) => {
    if (type === 'input') {
      setSelectedInputLanguages(prevLanguages => {
        if (prevLanguages.includes(language)) {
          return prevLanguages.filter(lang => lang !== language);
        } else {
          return [...prevLanguages, language];
        }
      });
    } else if (type === 'output') {
      setSelectedOutputLanguages(prevLanguages => {
        if (prevLanguages.includes(language)) {
          return prevLanguages.filter(lang => lang !== language);
        } else {
          return [...prevLanguages, language];
        }
      });
    }
  };

  const handleCheckboxSelectAll = (type) => {
    if (type === 'input') {
      setSelectedInputLanguages([0, 1, 2, 3, 4, 5, 6, 7, 8])
    } else if (type === 'output') {
      setSelectedOutputLanguages([0, 1, 2, 3, 4, 5, 6, 7, 8])
    }
  };

  const handleCheckboxClearAll = (type) => {
    if (type === 'input') {
      setSelectedInputLanguages([])
    } else if (type === 'output') {
      setSelectedOutputLanguages([])
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //move back a page if deleted element on last page
  React.useEffect(() => {
    if (page !== 1 && page > Math.ceil(translations.length / itemsPerPage)) {
      setPage(page-1);
    }
  }, [page, translations])

  const handleExpand = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const handleEdit = (index) => {
    setEditCalled(true)
    setCodeUpload(translations[index].inputCode)
    setOutputCode(translations[index].outputCode)
    setInputLang(nameToLanguage[translations[index].inputLang] || 0)
    setOutputLang(nameToLanguage[translations[index].outputLang] || 0)
    setEditCalled(false)
    window.scroll({top: 0, left: 0, behavior: 'smooth' })
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, translations.length); // Adjust endIndex

  return (
    <Container style={{ borderRadius: '5px', padding: "20px", alignItems: "left"}}>
      <Typography variant="h4" gutterBottom>Translation History</Typography>
      <div style={{ marginBottom: '10px', display:'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" style={{ display: 'inline-block', marginRight: '10px'}}><strong>Sort By:</strong></Typography>
        <Select
          value={sortCriteria || ''}
          onChange={(e) => handleSort(e.target.value, sortOrder)}
          style={{ minWidth: '175px', maxHeight: '30px'}}
          aria-label= "sortCategoriesButton"
        >
          <MenuItem aria-label='inputLangSortCategoriesButton' value="inputLang">Input Language</MenuItem>
          <MenuItem aria-label='outputLangSortCategoriesButton' value="outputLang">Output Language</MenuItem>
          <MenuItem aria-label='dateSortCategoriesButton' value="translatedAt">Date</MenuItem>
        </Select>
        <Tooltip title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}>
          <IconButton aria-label='sortOrderButton' onClick={() => handleSort(sortCriteria, sortOrder === 'asc' ? 'desc' : 'asc')}>
            {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={'Filter'}>
          <IconButton aria-label='filterButton' onClick={handleMenuOpen}>
            <FilterAltIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title={'Clear History'}>
          <Button aria-label='clearHistoryButton' onClick={() => setClearMenuOpen(true)}>
            Clear History
          </Button>
        </Tooltip>
        <Dialog open={clearMenuOpen} onClose={() => setClearMenuOpen(false)}>
          <DialogTitle>Confirm Clear History</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to clear your history?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearMenuOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleClearHistory()} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton aria-label="closeFilterMenuButton" onClick={handleMenuClose} style={{ fontSize: 'small', position: 'absolute', top: 5, right: 0 }}>
                <CloseIcon/>
              </IconButton>
            </div>
            <div style={{ display: 'flex', marginTop: '10px', marginLeft: '20px', marginRight: '10px'}}>
              <div style={{ marginRight: '20px' }}>
                <Typography variant="subtitle1">Input Languages:</Typography>
                <div>
                  {Object.keys(nameToLanguage).map(language => (
                    <FormControlLabel style={{display: 'block'}}
                      key={language}
                      control={
                        <Checkbox
                          aria-label={`input${language}Checkbox`}
                          checked={selectedInputLanguages.includes(nameToLanguage[language])}
                          onChange={() => handleCheckboxChange(nameToLanguage[language], 'input')}
                        />
                      }
                      label={language}
                    />
                  ))}
                </div>
                <Button aria-label='selectAllInputFilterButton' onClick={() => handleCheckboxSelectAll('input')}>SELECT ALL</Button>
                <Button aria-label='clearAllInputFilterButton' onClick={() => handleCheckboxClearAll('input')}>CLEAR</Button>
              </div>
              <div>
                <Typography variant="subtitle1">Output Languages:</Typography>
                <div>
                  {Object.keys(nameToLanguage).map(language => (
                    <FormControlLabel style={{display: 'block'}}
                      key={language}
                      control={
                        <Checkbox
                          aria-label={`output${language}Checkbox`}
                          checked={selectedOutputLanguages.includes(nameToLanguage[language])}
                          onChange={() => handleCheckboxChange(nameToLanguage[language], 'output')}
                        />
                      }
                      label={language}
                    />
                  ))}
                </div>
                <Button aria-label='selectAllOutputFilterButton' onClick={() => handleCheckboxSelectAll('output')}>SELECT ALL</Button>
                <Button aria-label='clearAllOutputFilterButton' onClick={() => handleCheckboxClearAll('output')}>CLEAR</Button>
              </div>
            </div>
        </Menu>
      </div>
      {filteredTranslations.length === 0 ? (
        (translations.length === 0) ? (
          <Typography variant="subtitle1">You have no translations!</Typography>
        ) : (
          <Typography variant="subtitle1">No translations match that filtering!</Typography>
        )
      ) : (
        <>
          {filteredTranslations.slice(startIndex, endIndex).map((translation, index) => (
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
            count={Math.ceil(filteredTranslations.length / itemsPerPage)}
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
