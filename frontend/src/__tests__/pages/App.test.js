import { render, screen } from '@testing-library/react';
import App from '../../App.js';
import { useAuthContext } from '../../hooks/useAuthContext.js';
import { initRecaptcha } from '../../firebase';
let firebase = require('firebase/auth')

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

jest.mock('../../firebase', () => ({
  initRecaptcha: jest.fn(),
}));

test('placeholder test', () => {
  useAuthContext.mockReturnValue(true);
  render(<App />);
  expect(true).toBe(true);
});
