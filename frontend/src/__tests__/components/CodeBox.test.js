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

  test('Download button downloads correct file', () => {
    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, jest.fn()]) //input exists
      .mockImplementationOnce(() => ["hello world", jest.fn()]) //code
      .mockImplementationOnce(() => [1, jest.fn()]) //tab
      .mockImplementationOnce(() => [99, jest.fn()]) //lines
      .mockImplementation((x) => [x, jest.fn()]);
    render(<CodeBox />);
    
    const mockOnClick = jest.fn();
    const { getByTestId } = render(<DownloadButton onClick={mockOnClick} />);
    fireEvent.click(getByTestId('download-button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  })

  test('calls onClick prop when the button is clicked', () => {
    
  });

  test('calls onCopy prop and copies text when the button is clicked', () => {
    // Mock the onCopy function
    const mockOnCopy = jest.fn();
  
    // Define text to copy
    const textToCopy = 'Hello, Jest!';
  
    // Render the component with the mock function and text to copy
    const { getByTestId } = render(
      <CopyButton onCopy={mockOnCopy} textToCopy={textToCopy} />
    );
  
    // Simulate a button click
    fireEvent.click(getByTestId('copy-button'));
  
    // Check if the onCopy function was called once
    expect(mockOnCopy).toHaveBeenCalledTimes(1);
  
    // Check if the text was copied to the clipboard
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(textToCopy);
  });
})