import React from 'react';
import FeedbackForm from './FeedbackForm'; // Import the FeedbackForm component

function Feedback() {
  return (
    <div>
      <h2>Feedback Form</h2>
      <p>Please provide your feedback:</p>
      {/* Render the FeedbackForm component */}
      <FeedbackForm buttonLabel="Feedback" />
    </div>
  );
}

export default Feedback;
