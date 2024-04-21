import React from 'react';
import { render, waitFor, fireEvent, queryByText } from '@testing-library/react';
import FeedbackDisplay from '../../components/FeedbackDisplay';

describe('FeedbackDisplay Component', () => {
  test('renders without crashing', () => {
    render(<FeedbackDisplay />);
  });

  test('initial state is set correctly', async () => {
    const { getByText } = render(<FeedbackDisplay />);

    await waitFor(() => getByText('No feedback available.'));
  });

  test('fetches feedback data from API', async () => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ AllFeedback: [{ id: 1, inputLang: 'English', outputLang: 'Spanish', rating: '4', review: 'Great translation!' }] }),
      })
    );

    const { getByText } = render(<FeedbackDisplay />);
    await waitFor(() => getByText('Great translation!'));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('displays feedback items properly', async () => {
    const feedbackData = [{ id: 1, inputLang: 'English', outputLang: 'Spanish', rating: '4', review: 'Great translation!' }];
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ AllFeedback: feedbackData }),
      })
    );

    const { getByText } = render(<FeedbackDisplay />);
    await waitFor(() => getByText('Great translation!'));
    expect(getByText('Great translation!')).toBeInTheDocument();
  });

  test('pagination functionality works', async () => {
    const feedbackData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      inputLang: 'English',
      outputLang: 'Spanish',
      rating: '4',
      review: `Review ${i + 1}`,
    }));

    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ AllFeedback: feedbackData }),
      })
    );

    const { getByText, getByTestId } = render(<FeedbackDisplay />);
    await waitFor(() => getByText('Review 3'));
  });

  test('handles API fetch error', async () => {
    // Mock fetch function to return an error response
    global.fetch = jest.fn(() => Promise.reject(new Error('Error fetching data')));

    const { getByText } = render(<FeedbackDisplay />);
    await waitFor(() => getByText('No feedback available.'));
  });
});
