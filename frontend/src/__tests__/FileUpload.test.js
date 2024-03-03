import { act, render, screen, cleanup, fireEvent } from '@testing-library/react';
import FileUpload from "../components/FileUpload";
import React from 'react';

describe("FileUpload Component Functionality", () => {
  function createFile(name, size, type) {
    const file = new File([], name, { type });
    Object.defineProperty(file, "size", {
      get() {
        return size;
      },
    });
    return file;
  }

  function createDtWithFiles(files = []) {
    return {
      dataTransfer: {
        files,
        items: files.map((file) => ({
          kind: "file",
          size: file.size,
          type: file.type,
          getAsFile: () => file,
        })),
        types: ["Files"],
      },
    };
  }

  afterEach(() => {
    cleanup(); 
  })

  test('FileUpload renders', async () => {
    render(<FileUpload />);
    expect(screen.getByText('Drop files here or click to upload')).toBeInTheDocument();
  })
  test('FileUpload button brings up file explorer', async () => {
    const onClickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
    render(<FileUpload />);

    fireEvent.click(screen.getByText('Drop files here or click to upload'));
    expect(onClickSpy).toHaveBeenCalled();
  })
  test('Dropzone accept state on hover', async () => {
    const goodFileList = [createFile('test.py', 100, "text/x-python")];
    const event = createDtWithFiles(goodFileList);
    const { container } = render(<FileUpload />);

    const dropzone = container.querySelector("button");
    await act(() => fireEvent.dragEnter(dropzone, event));
    fireEvent.dragOver(dropzone, event);

    expect(container.querySelector("div")).toHaveStyle(`backgroundColor: #77DD77`);
  })
  test('Dropzone reject state on hover wrong file type', async () => {
    const badFileList = [createFile('test.jpeg', 100, "image/jpeg")];
    const event = createDtWithFiles(badFileList);
    const { container } = render(<FileUpload />);

    const dropzone = container.querySelector("button");
    await act(() => fireEvent.dragEnter(dropzone, event));
    fireEvent.dragOver(dropzone, event);

    expect(container.querySelector("div")).toHaveStyle(`backgroundColor: #FFCCCC`);
  })
  test('Dropzone reject state on hover too many files', async () => {
    const badFileGroup = [createFile('test1.py', 100, "text/x-python"), createFile('test2.py', 100, "text/x-python")];
    const event = createDtWithFiles(badFileGroup);
    const { container } = render(<FileUpload />);

    const dropzone = container.querySelector("button");
    await act(() => fireEvent.dragEnter(dropzone, event));
    fireEvent.dragOver(dropzone, event);

    expect(container.querySelector("div")).toHaveStyle(`backgroundColor: #FFCCCC`);
  })
  test('Dropzone non interactive state', async () => {
    const { container } = render(<FileUpload />);
    expect(container.querySelector("div")).toHaveStyle(`backgroundColor: #f5f5f5`);
  })
})