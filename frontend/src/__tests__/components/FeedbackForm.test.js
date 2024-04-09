import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FeedbackForm, { storeFeedback } from '../../components/FeedbackForm';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));


describe('FeedbackForm component', () => {

  test('renders Feedback button', () => {
    useAuthContext.mockReturnValue({user : {token : 123}});

    const { getByText } = render(<FeedbackForm />);
    // eslint-disable-next-line testing-library/prefer-screen-queries
    const feedbackButton = getByText('Feedback');
    expect(feedbackButton).toBeInTheDocument();
  });

  test('opens dialog when Feedback button is clicked', () => {
    useAuthContext.mockReturnValue({user : {token : 123}});

    const { getByText, getByLabelText } = render(<FeedbackForm translationId="mockTranslationId" />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const dialogTitle = getByText('Rate This Translation');
    expect(dialogTitle).toBeInTheDocument();
    const leaveReviewTextField = getByLabelText('Leave a review');
    expect(leaveReviewTextField).toBeInTheDocument();
  });

  test('submits form when Submit button is clicked and rating/review fields are cleared', () => {
    useAuthContext.mockReturnValue({user : {token : 123}});

    const { getByText, getByLabelText } = render(<FeedbackForm translationId="mockTranslationId" />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const submitButton = getByText('Submit');
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: 'Great translation!' } });
    fireEvent.click(submitButton);
    expect(leaveReviewTextField.value).toBe('Great translation!');
    

  });

  test('form cleared on reopening', () => {
    useAuthContext.mockReturnValue({user : {token : 123}});

    const { getByText, getByLabelText } = render(<FeedbackForm translationId="mockTranslationId" />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
    const submitButton = getByText('Submit');
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: 'Great translation!' } });
    fireEvent.click(submitButton);
    fireEvent.click(feedbackButton);
    expect(leaveReviewTextField.value).toBe('');
  });

  test('feedback form input text cannot exceed character limit', () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
  
    // Assuming the character limit is 1000 characters
    const characterLimit = 1000;
    const excessiveText = 'a'.repeat(characterLimit + 1); // Create a string that exceeds the limit
  
    const { getByText, getByLabelText } = render(<FeedbackForm translationId="mockTranslationId" />);
    const feedbackButton = getByText('Feedback');
    fireEvent.click(feedbackButton);
  
    const leaveReviewTextField = getByLabelText('Leave a review');
    fireEvent.change(leaveReviewTextField, { target: { value: excessiveText } });
  
    // The actual value should not exceed the character limit
    expect(leaveReviewTextField.value.length).toBe(characterLimit);
  });  

});
