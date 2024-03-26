import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import CodeBox from "../../components/CodeBox";
import React from 'react';

afterEach(() => {
  cleanup(); 
})

describe("CodeBox Component Functionality", () => {
  test('CodeBox code box starts rending', async () => {
    render(<CodeBox />);
    expect(screen.getByText('Loading your pudgy penguins...')).toBeInTheDocument();
  })
  test('Translate button shows up', () => {
    render(<CodeBox />);
    expect(screen.getByText('Translate')).toBeInTheDocument();
  })
  test('Submission button disabled if input does not exit', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [false, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);
    render(<CodeBox value="Hello World" />);
    
    const translateButton = screen.getByText('Translate');
    expect(translateButton).toBeDisabled();
  })  
  test('Submission button disabled if input too long', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [101, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);
    render(<CodeBox />);
    
    const translateButton = screen.getByText('Translate');
    expect(translateButton).toBeDisabled();
  })
  test('Submission button enabled with good inputs', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);
    render(<CodeBox />);
    
    const translateButton = screen.getByText('Translate');
    expect(translateButton).not.toBeDisabled();
  })
  test('Copy button copies code to clipboard', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) // input exists
      .mockImplementationOnce(() => ["const example = 'Hello!';", jest.fn()]) // code
      .mockImplementationOnce(() => [1, jest.fn()]) // tab
      .mockImplementationOnce(() => [99, jest.fn()]) // lines
      .mockImplementation((x) => [x, jest.fn()]);

    // Mock the clipboard API
    const clipboardWriteTextMock = jest.fn();
    global.navigator.clipboard = {
      writeText: clipboardWriteTextMock,
    };

    render(<CodeBox />);

    // Find and click the copy button
    const copyButton = screen.getByTestId('copy-button');
    fireEvent.click(copyButton);

    // Mocked clipboard.writeText should be called with the code
    expect(clipboardWriteTextMock).toHaveBeenCalledWith("const example = 'Hello!';");

    // Clean up mocks
    jest.restoreAllMocks();
  })

  test('Download button downloads code file', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);
    render(<CodeBox />);

    global.URL.createObjectURL = jest.fn();
    const mockDownloadCodeFile = (code, extension) => {
      const element = document.createElement("a");
      const file = new Blob([code], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "placeholder" + extension;
      element.click();
    }
    const elementMock = {
      click: jest.fn()
    };
    jest.spyOn(document, "createElement").mockImplementation(() => elementMock);
    
    const file = new Blob(["const example = 'Hello!';"], {type: 'text/plain'});
    mockDownloadCodeFile("const example = 'Hello!';", ".py");

    expect(elementMock.download).toEqual("placeholder.py");
    expect(elementMock.href).toEqual(URL.createObjectURL(file));
    expect(elementMock.click).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
  })

  test('Selected tab changes on click', async () => {
    render(<CodeBox setInputLang={jest.fn()} setOutputLang={jest.fn()}/>);

    const detectLangTab = screen.getByText("Detect Language").closest("button");
    const javaTab = screen.getByText("Java").closest("button");

    expect(detectLangTab).toHaveAttribute("aria-selected", "true");
    expect(javaTab).toHaveAttribute("aria-selected", "false");

    fireEvent.click(javaTab);
    
    expect(detectLangTab).toHaveAttribute("aria-selected", "false");
    expect(javaTab).toHaveAttribute("aria-selected", "true");
  });

  test('loading gif loads', async () => {
    render(<CodeBox outputLoading={true} readOnly={true}/>);

    const gif = screen.queryAllByAltText("loading...");

    expect(gif).toBeInTheDocument;
  });

  test('loading gif doesn\'t appear when not loaindg', async () => {
    render(<CodeBox outputLoading={false} readOnly={true}/>);

    const gif = screen.queryAllByAltText("loading...");

    expect(gif).not.toBeInTheDocument;
  });

  test('toast success notif', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);

    jest.spyOn(toast, 'success');

    render(<CodeBox setOutputLoading={jest.fn()} setOutputCode={jest.fn()} user={{"uid":"mockuid"}} outputLang={1}/>);

    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);

    await waitFor(()=>{
      expect(toast.success).toHaveBeenCalledWith('Translation Completed!');
    });
  });
  test('toast 429 error notif', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);

    jest.spyOn(toast, 'error');

    global.fetch = jest.fn(() => Promise.resolve(
      new Response(JSON.stringify({}), {status: 429})
    ));

    render(<CodeBox setOutputLoading={jest.fn()} setOutputCode={jest.fn()} user={{"uid":"mockuid"}} outputLang={1}/>);

    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);

    await waitFor(()=>{
      expect(toast.error).toHaveBeenCalledWith('Rate Limit Exceeded');
    });
  });
  test('toast 503 error notif', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);

    jest.spyOn(toast, 'error');

    global.fetch = jest.fn(() => Promise.resolve(
      new Response(JSON.stringify({}), {status: 503})
    ));

    render(<CodeBox setOutputLoading={jest.fn()} setOutputCode={jest.fn()} user={{"uid":"mockuid"}} outputLang={1}/>);

    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);

    await waitFor(()=>{
      expect(toast.error).toHaveBeenCalledWith('API Connection Error');
    });
  });
  test('toast 500 error notif', async () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);

    jest.spyOn(toast, 'error');

    global.fetch = jest.fn(() => Promise.resolve(
      new Response(JSON.stringify({}), {status: 500})
    ));

    render(<CodeBox setOutputLoading={jest.fn()} setOutputCode={jest.fn()} user={{"uid":"mockuid"}} outputLang={1}/>);

    const translateButton = screen.getByText('Translate');
    fireEvent.click(translateButton);

    await waitFor(()=>{
      expect(toast.error).toHaveBeenCalledWith('Unknown Error Occurred');
    });
  });
})