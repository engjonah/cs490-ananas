import React, { useState, useEffect } from 'react';
import { Paper, Typography, Container, Divider, Pagination } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Rating from '@mui/material/Rating';
import { ErrorReport } from '../services/ErrorReport';
import ApiUrl from '../ApiUrl';
import { styled } from '@mui/system'; // Import styled for custom styling


const StyledPaper = styled(Paper)({
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#f5f5f5',
    textAlign: 'left',
    overflow: 'hidden',
    position: 'relative', // Add position relative to enable absolute positioning of Rating
  });

const FeedbackItem = ({ feedback }) => {
  return (
    <StyledPaper elevation={1}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" style={{ wordWrap: 'break-word' }}>
          <strong>{feedback.inputLang} <ArrowForwardIcon fontSize="15px" style={{ verticalAlign: 'middle' }} /> {feedback.outputLang}</strong>
        </Typography>
        <Rating
          name="rating"
          value={parseInt(feedback.rating)}
          readOnly
          style={{ position: 'absolute', top: '5px', right: '5px' }} // Position the Rating component to top right
        />
      </div>
      <Typography variant="body2"><strong>Review:</strong> {feedback.review}</Typography>
    </StyledPaper>
  );
};

const FeedbackDisplay = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    fetch(`${ApiUrl}/api/feedbackDisplay/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error retrieving feedback');
        }
        return response.json();
      })
      .then(data => {
        setFeedbacks(data.AllFeedback);
        console.log("Feedback list", data.AllFeedback);
      })
      .catch(error => {
        ErrorReport("Feedback Display:" + error.message);
        console.log(error);
      });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, feedbacks.length);

  return (
    <Container style={{ borderRadius: '5px', padding: "20px", alignItems: "left" }}>
      {feedbacks.length === 0 ? (
        <Typography variant="subtitle1"><p></p></Typography>
      ) : (
        <>
          {feedbacks.slice(startIndex, endIndex).map((feedback, index) => (
            <React.Fragment key={startIndex + index}>
              <FeedbackItem feedback={feedback} />
              {index !== itemsPerPage - 1 && index !== feedbacks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <Pagination
            count={Math.ceil(feedbacks.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            style={{ marginTop: '20px' }}
          />
        </>
      )}
    </Container>
  );
};

export default FeedbackDisplay;
