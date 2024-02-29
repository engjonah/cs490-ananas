import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter to provide context for Link
import HomeScreen from '../components/HomeScreen';

describe('HomeScreen', () => {
  test('renders How to Use section', () => {
    render(<HomeScreen />, { wrapper: MemoryRouter }); // Use MemoryRouter as a wrapper for testing components that use <Link>
    
    const howToUseHeader = screen.getByText('How to Use');
    expect(howToUseHeader).toBeInTheDocument();

    const howToUseList = screen.getByRole('list');
    expect(howToUseList).toBeInTheDocument();

    // Add more assertions as needed
  });

  test('renders Translate Now! button', () => {
    render(<HomeScreen />, { wrapper: MemoryRouter });
    
    const translateButton = screen.getByRole('button', { name: 'Translate Now!' });
    expect(translateButton).toBeInTheDocument();
  });
});
