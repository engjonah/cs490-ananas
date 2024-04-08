import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';
import { useAuthContext } from '../hooks/useAuthContext';
import { CssBaseline, Container, Box, Grid } from '@mui/material';
import toast from 'react-hot-toast';

function FeedbackForm(props) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const outputLang = props.outputLang;
  const inputLang = props.inputLang;
  const uid = JSON.parse(localStorage.getItem("user"))?.uid;
  const translationId = props.translationId;
  const { user } = useAuthContext();
  const characterLimit = 1000;

  const handleOpen = () => {
    setReview('');
    setRating(5);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const storeFeedback = async () => {
    await fetch(`${ApiUrl}/api/feedback`, {
      method: "POST",
      body: JSON.stringify({
        uid,
        inputLang,
        outputLang,
        translationId,
        rating,
        review,
      }),
      headers: {
        "Content-type": "application/json",
        'Authorization': `Bearer ${user.token}`,
      },
    })
      .then(() => {
        toast.success('Feedback Submitted!');
      })
      .catch((err) => {
        ErrorReport("Feedback Form:" + err.message);
        console.log(err.message);
      });
  };

  const handleSubmit = () => {
    storeFeedback();
    handleClose();
  };

  return (
    <Container>
      <Tooltip title={translationId ? "Submit Feedback" : "Translate something first!"}>
        <span>
          <Button disabled={!translationId} variant="contained" style={{ backgroundColor: '#CACACA', color: 'black'}} onClick={handleOpen}>
            Feedback
          </Button>
        </span>
      </Tooltip>
      <CssBaseline/>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <Box sx={{ width:'auto', maxWidth: '600px', backgroundColor: '#d3d3d3' }}>
          <Grid container direction="column">
            <Grid item >
              <DialogTitle style={{ fontSize: '30px', fontWeight: 'normal', textAlign: 'center'}}>
                Rate This Translation 
              </DialogTitle>
            </Grid>
            <Grid item style={{textAlign:'center'}}>
              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => { handleRatingChange(newValue); }}
                size="large"
              />
            </Grid>
            <Grid item style={{width:'400px'}}>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Leave a review"
                  type="text"
                  fullWidth
                  value={review}
                  onChange={handleReviewChange}
                  multiline={true}
                  inputProps={{
                    maxLength: characterLimit // Sets the maximum character length
                  }}
                  
                  helperText={`${review.length}/${characterLimit} characters`} // Shows character count
                />
              </DialogContent>
            </Grid>
            <Grid item>
              <DialogActions>
                <Button onClick={handleClose} style={{color: 'black'}}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} style={{color: 'black'}}>
                  Submit
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Container>
  );
}


export default FeedbackForm;
