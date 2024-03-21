import React from 'react';
import { render } from '@testing-library/react';
import DocumentationPage from '../../pages/DocumentationPage';

describe('DocumentationPage component', () => {
  it('renders all sections correctly', () => {
    const { getByText } = render(<DocumentationPage />);
    
    // Check if the title is rendered
    expect(getByText('Documentation')).toBeInTheDocument();


    expect(getByText('Translation')).toBeInTheDocument();
    expect(getByText('GPT 3.5 turbo model')).toBeInTheDocument();

    // Check if Authentication section is rendered
    expect(getByText('Authentication')).toBeInTheDocument();
    expect(getByText('Firebase API')).toBeInTheDocument();

  });
});
