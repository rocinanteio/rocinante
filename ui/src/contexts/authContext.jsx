'use client';

import { createContext, useEffect, useReducer, useCallback } from 'react';

import { SplashScreen } from 'components/splash-screen';
const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGED':
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated: true, user, isInitialized: true };

    default:
      return state;
  }
};

export const AuthContext = createContext({ ...initialAuthState });
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const init = useCallback(() => {
    const payload = {
      isAuthenticated: true,
      user: {
        role: 'admin',
        email: 'ibrahim.dagdelen@trendyol.com',
        avatar: '',
        name: 'İbrahim Dağdelen',
      },
    };
    dispatch({
      type: 'AUTH_STATE_CHANGED',
      payload,
    });
  }, []);
  useEffect(() => init(), [init]); // SHOW LOADING

  if (!state.isInitialized) return <SplashScreen />;
  return (
    <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>
  );
};
