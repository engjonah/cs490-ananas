import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FeedbackForm, { storeFeedback } from '../../components/FeedbackForm';

describe('FeedbackForm component', () => {

  test('renders Feedback button', () => {
    const { getByText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    expect(feedbackButton).toBeInTheDocument();
  });

  test('opens dialog when Feedback button is clicked', () => {
    const { getByText, getByLabelText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const dialogTitle = getByText('Rate This Translation');
    expect(dialogTitle).toBeInTheDocument();
    const leaveReviewTextField = getByLabelText('Leave a review');
    expect(leaveReviewTextField).toBeInTheDocument();
  });

  test('submits form when Submit button is clicked and rating/review fields are cleared', () => {
    const { getByText, getByLabelText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const submitButton = getByText('Submit');
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: 'Great translation!' } });
    fireEvent.click(submitButton);
    expect(leaveReviewTextField.value).toBe('Great translation!');
    

  });

  test('form cleared on reopening', () => {
    const { getByText, getByLabelText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const submitButton = getByText('Submit');
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: 'Great translation!' } });
    fireEvent.click(submitButton);
    fireEvent.click(feedbackButton);
    expect(leaveReviewTextField.value).toBe('');
  });

});
