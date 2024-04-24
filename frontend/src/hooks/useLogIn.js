import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import ApiUrl from '../ApiUrl';
import { ErrorReport } from '../services/ErrorReport';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const login = async (email, uid, remember) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${ApiUrl}/api/login`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        uid,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    });
    const json = await response.json();

    if (!response.ok) {
      ErrorReport('useLogin:' + json.error);
      throw Error(json.error);
    } else {
      if (remember) {
        localStorage.setItem('user', JSON.stringify(json));
      } else {
        sessionStorage.setItem('user', JSON.stringify(json));
      }
      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
