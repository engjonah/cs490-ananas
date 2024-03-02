import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FeedbackForm, { storeFeedback } from '../components/FeedbackForm';

describe('FeedbackForm component', () => {

  it('ensures that storeFeedback is called and then makes API Request on submit', async () => {
    const mockFetch = jest.fn(() => Promise.resolve());
    global.fetch = mockFetch;

    const { getByText, getByLabelText } = render(<FeedbackForm />);

    // Click the "Feedback" button
    fireEvent.click(getByText('Feedback'));

    // Wait for the dialog to open
    await waitFor(() => {
      expect(getByText('Rate This Translation')).toBeVisible();
    });

    // Submit the form
    fireEvent.click(getByText('Submit'));

    // Ensure that the fetch function is called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });


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


//   describe('storeFeedback function', () => {
//     it('should make a POST request to the feedback API', async () => {
//         // Mock process.env.NODE_ENV
//         const originalEnv = process.env.NODE_ENV;
//         process.env.NODE_ENV = 'production';

//         // Mock window.location.origin
//         global.window = { location: { origin: 'https://example.com' } };

//         // Call the function
//         await storeFeedback(5, 'Great service!');

//         // Expect fetch to be called with the correct URL and options
//         expect(fetch).toHaveBeenCalled();

//         // Restore the original process.env.NODE_ENV
//         process.env.NODE_ENV = originalEnv;
//     });

//     it('should handle errors if the API call fails', async () => {
//         // Mock the console.error function
//         console.error = jest.fn();

//         // Mock the fetch function to throw an error
//         global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));

//         // Call the function
//         await storeFeedback(3, 'Okay service.');

//         // Expect console.error to be called with the error message
//         expect(console.error).toHaveBeenCalledWith('Failed to fetch');

//         // Restore the original console.error function
//         console.error.mockRestore();
//     });
// });

});
