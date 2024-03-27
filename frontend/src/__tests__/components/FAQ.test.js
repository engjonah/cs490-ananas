import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FAQ from '../../components/FAQ.js';

test('Search functionality in FAQ component', () => {
  const { getByPlaceholderText, getByText, queryByText } = render(<FAQ />);

  // Initial render should display all FAQ items
  expect(getByText('How do I use this service?')).toBeInTheDocument();
  expect(getByText('How does the translation work?')).toBeInTheDocument();
  expect(getByText('How much does this cost to use?')).toBeInTheDocument();

  // Search for a specific term
  const searchInput = getByPlaceholderText('Search FAQ');
  fireEvent.change(searchInput, { target: { value: 'translation' } });

  // Verify that only relevant FAQ item is displayed
  expect(getByText('How does the translation work?')).toBeInTheDocument();
  expect(queryByText('How do I use this service?')).not.toBeInTheDocument();
  expect(queryByText('How much does this cost to use?')).not.toBeInTheDocument();
});
