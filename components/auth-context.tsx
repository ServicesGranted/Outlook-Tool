'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  PublicClientApplication,
  AuthenticationResult,
} from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../lib/msalConfig';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Only create MSAL instance once, and only in the browser
const msalInstance =
  typeof window !== 'undefined'
    ? new PublicClientApplication(msalConfig)
    : null!;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  // On mount, restore from localStorage and (optionally) initialize MSAL
  useEffect(() => {
    if (!msalInstance) return;
    // Warm up MSAL (avoids popup delay on first login)
    msalInstance
      .initialize()
      .catch((err) => console.warn('MSAL init warning:', err));
    const saved = localStorage.getItem('msal_token');
    if (saved) setToken(saved);
  }, []);

  const login = async () => {
    if (!msalInstance) return;
    try {
      // 1) Ensure MSAL is initialized
      await msalInstance.initialize();
      // 2) Then open the popup
      const response: AuthenticationResult =
        await msalInstance.loginPopup(loginRequest);
      setToken(response.accessToken);
      localStorage.setItem('msal_token', response.accessToken);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  const logout = async () => {
    if (!msalInstance) return;
    await msalInstance.logoutPopup();
    setToken(null);
    localStorage.removeItem('msal_token');
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
};
