import React from 'react';
import { render } from '@testing-library/react';
import AccountPage from '../../pages/AccountPage';

// Mocking AccountDetails component
jest.mock('../../components/AccountDetails', () => () => (
  <div data-testid="mock-account-details">Mock AccountDetails</div>
));

describe('AccountPage component', () => {
  it('renders AccountDetails component', () => {
    // Render the AccountPage component
    const { getByTestId } = render(<AccountPage />);

    // Ensure that AccountDetails component is rendered
    const accountDetailsElement = getByTestId('mock-account-details');
    expect(accountDetailsElement).toBeInTheDocument();
    expect(accountDetailsElement.textContent).toBe('Mock AccountDetails');
  });
});
