import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers

import Documentation from '../components/Documentation';

test('renders documentation title', () => {
  const { getByText } = render(<Documentation />);
  const titleElement = getByText('Documentation');
  expect(titleElement).toBeInTheDocument();
});


// Add more tests as needed to cover different aspects of your component
