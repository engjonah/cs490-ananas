import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/system';

// Styled component for stars wrapper
const StarsWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end', // Align stars to the right
  alignItems: 'flex-start', // Align stars to the top
  marginTop: '-40px',
  marginBottom: '-10px', // Adjust margin to position stars
  paddingRight: '4px', // Add some padding to align with the title
});
  
function FeedbackForm(props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleOpen = () => {
    setComment('');
    setRating(5);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const storeFeedback = async(rating,comment) =>{
    const API_BASE_URL = process.env.NODE_ENV === 'production' ?
     window.location.origin:
     'http://localhost:3000';
    await fetch(`${API_BASE_URL}/api/feedback`,{
        method: "POST",
        body: JSON.stringify({
            rating,
            comment
        }),
        headers:{
            "Content-type": "application/json"
        },
    })
    .then(() => {
        console.log("User registered");
    })
    .catch((err) => {
        console.log(err.message)
    })
};

  const handleSubmit = () => {
    const API_BASE_URL = process.env.NODE_ENV === 'production' ?
    window.location.origin:
    'http://localhost:3000';

    
      
  

    // Handle form submission here
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" style={{ backgroundColor: '#CACACA', color: 'black'}} onClick={handleOpen}>
        Feedback
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth={true}>
        <DialogTitle
          style={{
            fontSize: '30px',
            fontWeight: 'normal',
            backgroundColor: '#d3d3d3', // Grey background color
            borderRadius: '8px',
          }}
        >
          Rate This Translation
          <StarsWrapper> {/* Align stars to the top right */}
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(event, newValue) => {
                handleRatingChange(newValue);
              }}
              size="large" // Make stars bigger
            />
          </StarsWrapper>
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: '#d3d3d3',
            paddingTop: '10px'
          }}
        >
          <TextField
            autoFocus
            margin="normal"
            label="Leave a review"
            type="text"
            fullWidth={true}
            value={comment}
            onChange={handleCommentChange}
            style={{ fontSize: '2px' }} 
            multiline={true}
          />
        </DialogContent>
        <DialogActions
        style={{ backgroundColor: '#d3d3d3'}}>
          <Button onClick={handleClose} style={{color: 'black'}}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{color: 'black'}}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FeedbackForm;
