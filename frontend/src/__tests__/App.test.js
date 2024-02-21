import { render, screen } from '@testing-library/react';
import App from '../App';

test('placeholder test', () => {
  render(<App />);
  expect(true).toBe(true);
});
