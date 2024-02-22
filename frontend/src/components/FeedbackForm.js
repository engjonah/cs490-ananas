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
    marginTop: '-50px',
    marginBottom: '-10px', // Adjust margin to position stars
    paddingRight: '4px', // Add some padding to align with the title
  });
  
  
// Styled component for rounded rectangle outline


function FeedbackForm(props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    
    setComment('');
    setRating(5);
    
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" style={{ backgroundColor: '#CACACA', color: 'black'}} onClick={handleOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth ="md">
        <DialogTitle
          style={{
            fontSize: '30px',
            fontWeight: 'bold',
            backgroundColor: '#CACACA', // Grey background color
            borderRadius: '8px'// Rounded corners
             // Increase padding
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
            backgroundColor: '#CACACA'
        }}
            >
          <TextField
            autoFocus
            margin="normal"
            label="Leave a review"
            type="text"
            fullWidth
            value={comment}
            onChange={handleCommentChange}
            style={{ fontSize: '2px' }} 
            multiline='true'
            
            
          />
        </DialogContent>
        <DialogActions
        style={{ backgroundColor: '#CACACA'}}>
          <Button onClick={handleClose} style={{ color: 'black'}}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ color: 'black'}}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FeedbackForm;
