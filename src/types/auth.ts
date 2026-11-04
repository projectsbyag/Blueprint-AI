import type React from 'react';

export interface SignUpCredentials {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string | null;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (credentials: SignUpCredentials) => Promise<AuthUser>;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  loginAsDemo: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
