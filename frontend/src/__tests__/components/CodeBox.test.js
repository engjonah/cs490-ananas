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
})