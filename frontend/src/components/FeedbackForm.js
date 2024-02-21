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
    marginTop: '-20px', // Adjust margin to position stars
    paddingRight: '10px', // Add some padding to align with the title
  });
  
  
// Styled component for rounded rectangle outline
const StyledRatingWrapper = styled('div')({
  display: 'inline-block',
  borderRadius: '8px', // Adjust border radius as needed
  border: '2px solid #ccc',
  padding: '10px',
});

function FeedbackForm(props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleOpen = () => {
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

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            backgroundColor: '#D9D9D9', // Grey background color
            borderRadius: '8px', // Rounded corners
            padding: '20px', // Increase padding
          }}
        >
          Feedback Form
          <StarsWrapper> {/* Align stars to the top right */}
            <StyledRatingWrapper> {/* Rounded rectangle outline */}
              <Rating
                name="feedback-rating"
                value={rating}
                onChange={(event, newValue) => {
                  handleRatingChange(newValue);
                }}
                size="large" // Make stars bigger
              />
            </StyledRatingWrapper>
          </StarsWrapper>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comments"
            type="text"
            fullWidth
            value={comment}
            onChange={handleCommentChange}
            style={{ fontSize: '18px' }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FeedbackForm;
