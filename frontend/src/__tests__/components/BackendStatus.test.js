import { render, screen, cleanup } from '@testing-library/react';
import BackendStatus from "../../components/BackendStatus";

afterEach(() => {
  cleanup(); 
})

describe("BackendStatus Component", () => {
  test('backend status text rending', () => {
    render(<BackendStatus status={[{_id: 'asdf123', test: 'hello wolrd'}]}/>);
    expect(screen.getByText('Backend Status:')).toBeInTheDocument();
  })  
  test('backend status false', () => {
    render(<BackendStatus status={null}/>);
    expect(screen.getByText('API not working')).toBeInTheDocument();
  }) 
  test('backend status true', () => {
    render(<BackendStatus status={[{_id: 'asdf123', test: 'hello wolrd'}]}/>);
    expect(screen.getByText('hello wolrd')).toBeInTheDocument();
  }) 
})


