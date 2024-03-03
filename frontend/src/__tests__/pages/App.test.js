import { render, screen } from '@testing-library/react';
import App from '../../App.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

test('placeholder test', () => {
  useAuthContext.mockReturnValue(true);
  render(<App />);
  expect(true).toBe(true);
});
