'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type {
  AuthContextType,
  AuthProviderProps,
  AuthUser,
  LoginCredentials,
  SignUpCredentials,
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_SESSION_KEY = 'blueprint_user_session';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (savedSession) {
        setUser(JSON.parse(savedSession));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSession = (authUser: AuthUser) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(authUser));
    } catch (e) {
      console.warn('Could not persist session to localStorage:', e);
    }
    setUser(authUser);
  };

  const signUp = async ({ email }: SignUpCredentials): Promise<AuthUser> => {
    setLoading(true);
    try {
      const newUser: AuthUser = {
        uid: 'user_' + Math.random().toString(36).substring(2, 10),
        email: email.trim().toLowerCase(),
        displayName: email.split('@')[0],
      };
      saveUserSession(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email }: LoginCredentials): Promise<AuthUser> => {
    setLoading(true);
    try {
      const loggedInUser: AuthUser = {
        uid: 'user_' + Math.random().toString(36).substring(2, 10),
        email: email.trim().toLowerCase(),
        displayName: email.split('@')[0],
      };
      saveUserSession(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (): Promise<AuthUser> => {
    setLoading(true);
    try {
      const demoUser: AuthUser = {
        uid: 'demo_designer_01',
        email: 'designer@blueprint.app',
        displayName: 'Demo Designer',
      };
      saveUserSession(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    login,
    loginAsDemo,
    logout,
    isDemoMode: user?.email === 'designer@blueprint.app',
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
