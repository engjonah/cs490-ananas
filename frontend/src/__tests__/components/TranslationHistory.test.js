import React, { useEffect } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TranslationHistory from '../../components/TranslationHistory';
import ApiUrl from '../../ApiUrl';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

const sampleTranslations = Array.from({ length: 10 }, (_, index) => ({
  _id: index.toString(),
  inputLang: `input${index}`,
  outputLang: `output${index}`,
  inputCode: `inputcode${index}`,
  outputCode: `outputcode${index}`,
  status: 200,
  translatedAt: Date.now() + index * 1000,
}));

describe('TranslationHistory Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders translation history correctly', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const { getByText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);
    await waitFor(() => expect(mockUseEffect).toHaveBeenCalledTimes(3));

    expect(getByText('Translation History')).toBeInTheDocument();
    expect(getByText('input4')).toBeInTheDocument();
    expect(getByText('output4')).toBeInTheDocument();
  });

  test('deletes translation on button click', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve({ json: () => Promise.resolve([]) })
      )

    const { getByText, getByLabelText } = render(<TranslationHistory 
      testTranslations={[{
        _id: '1',
        inputLang: `input1`,
        outputLang: `output1`,
        inputCode: `inputcode1`,
        outputCode: `outputcode1`,
        status: 200,
        translatedAt: Date.now(),
      }]}
    />);
    
    await waitFor(() => expect(mockUseEffect).toHaveBeenCalledTimes(3));

    fireEvent.click(getByLabelText('delete'));
    expect(fetchMock).toHaveBeenCalledWith(`${ApiUrl}/api/translateHistory/1`, { 
      method: 'DELETE',
      headers: {
        "Content-type": "application/json",
        'Authorization':`Bearer 123`
      }});
    expect(getByText('You have no translations!')).toBeInTheDocument();
  });

  test('expands translation on button click', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const { getByText, getByLabelText } = render(<TranslationHistory 
      testTranslations={[{
        _id: '1',
        inputLang: `input1`,
        outputLang: `output1`,
        inputCode: `inputcode1`,
        outputCode: `outputcode1`,
        status: 200,
        translatedAt: Date.now(),
      }]}
    />);

    await waitFor(() => expect(mockUseEffect).toHaveBeenCalledTimes(3));

    fireEvent.click(getByLabelText('expand'));
    expect(getByText('Input Code:')).toBeInTheDocument();
    expect(getByText('Output Code:')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    const mockUseEffect = jest.fn()
    jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect)

    const { getByText, queryByText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    await waitFor(() => expect(mockUseEffect).toHaveBeenCalledTimes(3));

    expect(getByText('input0')).toBeInTheDocument();
    expect(queryByText('input5')).not.toBeInTheDocument();

    fireEvent.click(getByText('2'));

    expect(queryByText('input0')).not.toBeInTheDocument();
    expect(getByText('input5')).toBeInTheDocument();
  });
});
