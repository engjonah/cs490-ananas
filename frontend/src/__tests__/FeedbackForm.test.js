import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FeedbackForm from './FeedbackForm';

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

  test('closes dialog when Cancel button is clicked', () => {
    const { getByText, queryByText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);
    const dialogTitle = queryByText('Rate This Translation');
    expect(dialogTitle).not.toBeInTheDocument();
  });

  test('submits form when Submit button is clicked', () => {
    const { getByText, getByLabelText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const submitButton = getByText('Submit');
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: 'Great translation!' } });
    fireEvent.click(submitButton);
    expect(leaveReviewTextField.value).toBe('');
  });

  test('updates rating when user selects a new rating', () => {
    const { getByText, getByLabelText } = render(<FeedbackForm />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const stars = getByLabelText('feedback-rating');
    fireEvent.click(stars.children[3]); // Click on the fourth star
    expect(stars.children[3]).toBeChecked();
  });
});
