import { render, screen, cleanup, waitFor } from '@testing-library/react';
import CodeSubmissionBox from "../components/CodeSubmissionBox";

afterEach(() => {
  cleanup(); 
})

describe("CodeSubmissionBox Component", () => {
  test('CodeSubmissionBox code box starts rending', async () => {
    render(<CodeSubmissionBox />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  })
  test('Proof of concept button shows up', () => {
    render(<CodeSubmissionBox />);
    expect(screen.getByText('Proof of concept to export code somewhere')).toBeInTheDocument();
  })  
})