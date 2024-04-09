import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TranslationHistory from '../../components/TranslationHistory';
import ApiUrl from '../../ApiUrl';
import { useAuthContext } from '../../hooks/useAuthContext.js';

jest.mock('../../hooks/useAuthContext', () => ({
  useAuthContext: jest.fn(),
}));

const languageNames = [
  "Unknown",
  "Python",
  "Java",
  "C++",
  "Ruby",
  "C#",
  "JavaScript",
  "Kotlin",
  "Objective-C",
];

const sampleTranslations = languageNames.map((lang, index) => ({
  _id: index.toString(),
  inputLang: lang,
  outputLang: lang,
  inputCode: `inputcode${index}`,
  outputCode: `outputcode${index}`,
  status: 200,
  translatedAt: Date.now() - index * 1000,
}));

describe('TranslationHistory Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders translation history correctly', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, getByLabelText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(getByText('Translation History')).toBeInTheDocument();
    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
  });

  test('deletes translation on button click', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, getByLabelText, queryByText } = render(<TranslationHistory 
      testTranslations={[{
        _id: '1',
        inputLang: `Python`,
        outputLang: `Java`,
        inputCode: `inputcode1`,
        outputCode: `outputcode1`,
        status: 200,
        translatedAt: Date.now(),
      }]}
    />);
    
    expect(queryByText('Python')).toBeInTheDocument();

    fireEvent.click(getByLabelText('delete'));
    expect(global.fetch).toHaveBeenCalledWith(`${ApiUrl}/api/translateHistory/1`, { 
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

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, getByLabelText } = render(<TranslationHistory 
      testTranslations={[{
        _id: '1',
        inputLang: `Python`,
        outputLang: `Java`,
        inputCode: `inputcode1`,
        outputCode: `outputcode1`,
        status: 200,
        translatedAt: Date.now(),
      }]}
    />);

    fireEvent.click(getByLabelText('expand'));
    expect(getByText('Input Code:')).toBeInTheDocument();
    expect(getByText('Output Code:')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, queryByText, getByLabelText, queryByLabelText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
    expect(queryByLabelText('inputLabelJavaScript')).not.toBeInTheDocument();

    fireEvent.click(getByText('2'));

    expect(queryByLabelText('inputLabelPython')).not.toBeInTheDocument();
    expect(getByLabelText('inputLabelJavaScript')).toBeInTheDocument();
  });

  test('renders filtering correctly', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, queryByText, getByLabelText, queryByLabelText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(queryByText('Input Languages:')).not.toBeInTheDocument();
    expect(queryByText('Output Languages:')).not.toBeInTheDocument();
    expect(queryByLabelText('inputPythonCheckbox')).not.toBeInTheDocument();

    fireEvent.click(getByLabelText('filterButton'));

    expect(getByText('Input Languages:')).toBeInTheDocument();
    expect(getByText('Output Languages:')).toBeInTheDocument();
    expect(getByLabelText('inputPythonCheckbox')).toBeInTheDocument();
  });

  test('clear filters button and select all filters button', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { getByText, getByLabelText, queryByText, queryByLabelText } = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(getByLabelText('inputLabelUnknown')).toBeInTheDocument();
    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
    expect(getByLabelText('inputLabelJava')).toBeInTheDocument();
    expect(getByLabelText('inputLabelC++')).toBeInTheDocument();
    expect(getByLabelText('inputLabelRuby')).toBeInTheDocument();

    fireEvent.click(getByLabelText('filterButton'));
    fireEvent.click(getByLabelText('clearAllInputFilterButton'));
    fireEvent.click(getByLabelText('closeFilterMenuButton'));

    expect(getByText('No translations match that filtering!')).toBeInTheDocument();

    expect(queryByLabelText('inputLabelUnknown')).not.toBeInTheDocument();
    expect(queryByLabelText('inputLabelPython')).not.toBeInTheDocument();
    expect(queryByLabelText('inputLabelJava')).not.toBeInTheDocument();
    expect(queryByLabelText('inputLabelC++')).not.toBeInTheDocument();
    expect(queryByLabelText('inputLabelRuby')).not.toBeInTheDocument();

    fireEvent.click(getByLabelText('filterButton'));
    fireEvent.click(getByLabelText('selectAllInputFilterButton'));
    fireEvent.click(getByLabelText('closeFilterMenuButton'));

    expect(queryByText('No translations match that filtering!')).not.toBeInTheDocument();

    expect(getByLabelText('inputLabelUnknown')).toBeInTheDocument();
    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
    expect(getByLabelText('inputLabelJava')).toBeInTheDocument();
    expect(getByLabelText('inputLabelC++')).toBeInTheDocument();
    expect(getByLabelText('inputLabelRuby')).toBeInTheDocument();
  });

  test('input filter checkboxes', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { queryByLabelText, getByLabelText} = render(<TranslationHistory testTranslations={sampleTranslations}/>);
    
    fireEvent.click(getByLabelText('filterButton'));
    fireEvent.click(getByLabelText('clearAllInputFilterButton'));
    fireEvent.click(getByLabelText('closeFilterMenuButton'));

    languageNames.forEach((language) => {
      expect(queryByLabelText(`inputLabel${language}`)).not.toBeInTheDocument();

      fireEvent.click(getByLabelText('filterButton'));
      fireEvent.click(getByLabelText(`input${language}Checkbox`));
      fireEvent.click(getByLabelText('closeFilterMenuButton'));
      
      expect(getByLabelText(`inputLabel${language}`)).toBeInTheDocument();
      languageNames
        .filter((lang) => lang !== language)
        .forEach((otherLanguage) => {
          expect(queryByLabelText(`inputLabel${otherLanguage}`)).not.toBeInTheDocument();
        });

      fireEvent.click(getByLabelText('filterButton'));
      fireEvent.click(getByLabelText(`input${language}Checkbox`));
      fireEvent.click(getByLabelText('closeFilterMenuButton'));
    });
  });

  test('sort order change', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { queryByLabelText, getByLabelText} = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
    expect(queryByLabelText('inputLabelKotlin')).not.toBeInTheDocument();
    fireEvent.click(getByLabelText('sortOrderButton'));
    expect(queryByLabelText('inputLabelPython')).not.toBeInTheDocument();
    expect(getByLabelText('inputLabelKotlin')).toBeInTheDocument();
  });

  test('sort categories change', async () => {
    useAuthContext.mockReturnValue({user : {token : 123}});
    localStorage.setItem('user', JSON.stringify({ uid: '123' }));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ Translations: sampleTranslations }),
      }),
    )

    const { queryByLabelText, getByLabelText} = render(<TranslationHistory testTranslations={sampleTranslations}/>);

    expect(getByLabelText('inputLabelPython')).toBeInTheDocument();
    expect(queryByLabelText('inputLabelKotlin')).not.toBeInTheDocument();
    fireEvent.change(getByLabelText('sortCategoriesButton').querySelector('input'), {
      target: { value: "inputLang" }
    });
    expect(getByLabelText('inputLabelRuby')).toBeInTheDocument();
    expect(queryByLabelText('inputLabelC++')).not.toBeInTheDocument();

    fireEvent.change(getByLabelText('sortCategoriesButton').querySelector('input'), {
      target: { value: "outputLang" }
    });
    expect(getByLabelText('outputLabelRuby')).toBeInTheDocument();
    expect(queryByLabelText('outputLabelC++')).not.toBeInTheDocument();
  });
});
