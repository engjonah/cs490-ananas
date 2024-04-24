import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import AccountDetails from '../../components/AccountDetails';
import { firebaseOnlyUser, deleteAccount } from '../../firebase.js';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../firebase', () => ({
  changePassword: jest.fn(),
  firebaseOnlyUser: jest.fn(() => true),
  deleteAccount: jest.fn(),
  setRecaptchaVisibility: jest.fn(),
  checkUserMFA: jest.fn(),
}));

jest.mock('../../hooks/useLogOut', () => ({
  useLogout: () => ({
    logout: () => jest.fn(),
  }),
}));

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

describe('AccountDetails component', () => {
  let mockErrorReport;

  it('renders account information', async () => {
    useAuthContext.mockReturnValue({
      user: { token: 123 },
    });
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
    };
    localStorage.setItem('user', JSON.stringify({ uid: 'testUserId' }));

    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    render(
      <Router>
        {' '}
        {/* Wrap the component with the Router component */}
        <AccountDetails />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('updates name on button click', async () => {
    useAuthContext.mockReturnValue({
      user: { token: 123 },
    });
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
    };
    localStorage.setItem('user', JSON.stringify({ uid: 'testUserId' }));
    jest.spyOn(window, 'prompt').mockReturnValueOnce('newUserName');
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    render(
      <Router>
        {' '}
        {/* Wrap the component with the Router component */}
        <AccountDetails />
      </Router>
    );

    const updateNameButton = screen.getByText('Update Name');
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    fireEvent.click(updateNameButton);
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    await waitFor(() => {
      expect(screen.getByText('Change Name')).toBeInTheDocument();
    });
  });

  it('updates password on button click', async () => {
    useAuthContext.mockReturnValue({
      user: { token: 123 },
    });
    const mockUser = {
      email: 'test@example.com',
      name: 'Test User',
    };
    firebaseOnlyUser.mockReturnValue(true);
    localStorage.setItem('user', JSON.stringify({ uid: 'testUserId' }));
    jest.spyOn(window, 'prompt').mockReturnValueOnce('newPassword');
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });
    render(
      <Router>
        {' '}
        {/* Wrap the component with the Router component */}
        <AccountDetails />
      </Router>
    );

    firebaseOnlyUser.mockReturnValueOnce(true);
    await waitFor(() => {
      expect(screen.getByText('Update Password')).toBeInTheDocument();
    });
    const updatePasswordButton = screen.getByText('Update Password');
    fireEvent.click(updatePasswordButton);
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockUser),
    });

    await waitFor(() => {
      expect(firebaseOnlyUser).toHaveBeenCalled();
      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });
  });

  it('deletes account on button click', async () => {
    useAuthContext.mockReturnValue({
      user: { token: 123 },
    });
    localStorage.setItem('user', JSON.stringify({ uid: 'testUserId' }));
    window.confirm = jest.fn(() => true);

    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    jest.spyOn(window, 'confirm').mockResolvedValueOnce(true);

    render(
      <Router>
        {' '}
        {/* Wrap the component with the Router component */}
        <AccountDetails />
      </Router>
    );

    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });
    jest.spyOn(window, 'confirm').mockResolvedValueOnce(true);
    const deleteAccountButton = screen.getByText('Delete Account');
    fireEvent.click(deleteAccountButton);
    jest.spyOn(window, 'confirm').mockResolvedValueOnce(true);
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    });

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(deleteAccount).toHaveBeenCalled();
    });
  });
});
