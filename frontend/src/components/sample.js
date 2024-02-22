import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

export default function RateDialog() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [review, setReview] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue(1);
    setReview('');
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open rate dialog
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Rate this translation</DialogTitle>
        <DialogContent>
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Leave a review"
            type="email"
            fullWidth
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />
        </DialogContent>
        <Button onClick={handleClose} color="primary">
          Submit
        </Button>
      </Dialog>
    </div>
  );
}
