import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { resetPasswordEmail } from '../../firebase';
import ResetPasswordPage from '../../pages/ResetPasswordPage';

jest.mock('../../firebase', () => ({
  resetPasswordEmail: jest.fn(),
}));

describe('ResetPasswordPage', () => {
  it('renders correctly', () => {
    const { getByRole } = render(
      <Router>
        <ResetPasswordPage />
      </Router>
    );

    expect(
      getByRole('button', { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it('submits the form correctly', async () => {
    const { getByRole, getByPlaceholderText } = render(
      <Router>
        <ResetPasswordPage />
      </Router>
    );

    fireEvent.change(getByPlaceholderText('Enter your email address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(resetPasswordEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
