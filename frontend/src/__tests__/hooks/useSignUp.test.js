import { useSignup } from '../../hooks/useSignUp';
import { act, renderHook } from '@testing-library/react';
import { AuthContext } from '../../AuthContext';
import * as ErrorReport from '../../services/ErrorReport';

const dispatch = jest.fn();
const state = {};
describe('Sign up hook', () => {
  let mockErrorReport;
  beforeEach(() => {
    global.fetch = jest.fn();
    Storage.prototype.setItem = jest.fn();
    mockErrorReport = jest
      .spyOn(ErrorReport, 'ErrorReport')
      .mockImplementation(() => 'error');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Error returned from backend', async () => {
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
    const { result, waitforupdate } = renderHook(() => useSignup(), {
      wrapper,
    });
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: () => ({ error: 'error' }),
    });
    expect(async () => {
      await result.current.signup('test', 'test', 'test');
    }).rejects.toThrow(Error('error'));
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  test('Successful response from backend', async () => {
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
    const { result, waitforupdate } = renderHook(() => useSignup(), {
      wrapper,
    });
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => ({ token: 'test-token' }),
    });
    await act(() => {
      result.current.signup('test', 'test', 'test');
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ token: 'test-token' })
    );
  });
});
