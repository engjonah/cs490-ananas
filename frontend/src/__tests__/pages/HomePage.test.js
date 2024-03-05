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

  test('renders Translate Now! button and routes correctly', () => {
    const { container } = render(<HomePage />, { wrapper: MemoryRouter });

    const translateButton = screen.getByRole('button', { name: 'Translate Now!' });
    expect(translateButton).toBeInTheDocument();

    // Simulate a click on the Translate Now! button
    fireEvent.click(translateButton);

    // After clicking, assert that the URL has changed to the expected route
    expect(container.innerHTML).toMatch('/translate');
  });
});
