import React, { useEffect } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TranslationHistory from '../../components/TranslationHistory';

const sampleTranslations = Array.from({ length: 10 }, (_, index) => ({
  _id: index.toString(),
  inputLang: `input${index}`,
  outputLang: `output${index}`,
  inputCode: `inputcode${index}`,
  outputCode: `outputcode${index}`,
  status: 200,
  translatedAt: Date.now() + index * 1000, // Different timestamps for each translation
}));

describe('TranslationHistory Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders translation history correctly', async () => {
    // Set user ID in localStorage
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const { getByText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    // Wait for translations to be fetched
    await waitFor(() => expect(mockUseEffect).toHaveBeenCalledTimes(1));

    // Check if translation items are rendered
    expect(getByText('Translation History')).toBeInTheDocument();
    expect(getByText('input4')).toBeInTheDocument();
    expect(getByText('output4')).toBeInTheDocument();
  });

  test('deletes translation on button click', async () => {
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const { getByText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);
    
    // Click delete button
    fireEvent.click(getByLabelText('delete'));

    // Wait for translation to be deleted
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Check if translation is deleted
    expect(queryByText('javascript')).not.toBeInTheDocument();
    expect(queryByText('python')).not.toBeInTheDocument();
  });

  test('expands translation on button click', async () => {
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const { getByLabelText, getByText } = render(<TranslationHistory />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Click expand button
    fireEvent.click(getByLabelText('expand'));

    // Check if expanded translation is visible
    expect(getByText('Input Code:')).toBeInTheDocument();
    expect(getByText('Output Code:')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const { getByText, queryByText } = render(<TranslationHistory />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Check if initial page is correct
    expect(getByText('javascript')).toBeInTheDocument();
    expect(queryByText('python')).not.toBeInTheDocument();

    // Change page
    fireEvent.click(getByText('2'));

    // Wait for page change
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));

    // Check if translations on new page are rendered
    expect(queryByText('javascript')).not.toBeInTheDocument();
    expect(getByText('python')).toBeInTheDocument();
  });
});
