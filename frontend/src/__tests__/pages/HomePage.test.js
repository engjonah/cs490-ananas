import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  test('renders How to Use section', () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    const howToUseHeader = screen.getByText('How to Use');
    expect(howToUseHeader).toBeInTheDocument();

    const howToUseList = screen.getByRole('list');
    expect(howToUseList).toBeInTheDocument();
  });

  it('renders the average rating when average rating is greater than 0', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ RatingCounts: [1, 2, 3, 4, 5], AverageRating: 3 }),
      })
    );

    render(<HomePage />, { wrapper: MemoryRouter });

    // Wait for the API call to resolve
    await screen.findByText('Average Rating: 3 / 5');

    expect(screen.getByText('Average Rating: 3 / 5')).toBeInTheDocument();
  });
  
  test('renders Translate Now! button and routes correctly', () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ RatingCounts: [1, 2, 3, 4, 5], AverageRating: 3 }),
      })
    );

    const { container } = render(<HomePage />, { wrapper: MemoryRouter });

    const translateButton = screen.getByRole('button', { name: 'Translate Now!' });
    expect(translateButton).toBeInTheDocument();

    // Simulate a click on the Translate Now! button
    fireEvent.click(translateButton);

    // After clicking, assert that the URL has changed to the expected route
    expect(container.innerHTML).toMatch('/translate');
  });
});
