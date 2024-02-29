import React from 'react';
import { render, screen } from '@testing-library/react';
import Documentation from './Documentation';

describe('Documentation', () => {
  test('renders documentation content correctly', () => {
    render(<Documentation />);
    
    // Check if the title is rendered
    const titleElement = screen.getByText('Documentation');
    expect(titleElement).toBeInTheDocument();

    // Check if the content is rendered
    const contentElement = screen.getByText('This documentation page provides basic information about the MERN');
    expect(contentElement).toBeInTheDocument();

    // Check if both instances of the content are rendered (assuming duplication is intentional)
    const contentElements = screen.getAllByText('This documentation page provides basic information about the MERN');
    expect(contentElements.length).toBe(2);

    // Add more assertions as needed
  });

  // You can add more specific tests here to check for the presence of certain elements or text
});
