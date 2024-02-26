import { render, screen, cleanup, waitFor } from '@testing-library/react';
import CodeBox from "../components/CodeBox";

afterEach(() => {
  cleanup(); 
})

describe("CodeBox Component", () => {
  test('CodeBox code box starts rending', async () => {
    render(<CodeBox />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  })
  test('Proof of concept button shows up', () => {
    render(<CodeBox />);
    expect(screen.getByText('Proof of concept to export code somewhere')).toBeInTheDocument();
  })  
})