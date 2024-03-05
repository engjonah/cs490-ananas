import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import DocumentationPage from '../../pages/DocumentationPage';

test('renders documentation title', () => {
  const { getByText } = render(<DocumentationPage />);
  const titleElement = getByText('Documentation');
  expect(titleElement).toBeInTheDocument();
});

test('renders both MERN sections', () => {
  const { getAllByText } = render(<DocumentationPage />);
  const mernSections = getAllByText('MERN');
  expect(mernSections.length).toBe(2); // Ensure there are two sections titled "MERN"
});

test('renders background-gif div', () => {
    const { container } = render(<DocumentationPage />);
    const backgroundGifDiv = container.querySelector('.background-gif');
    expect(backgroundGifDiv).toBeInTheDocument();
  });
  

// Add more tests as needed to cover different aspects of your component
