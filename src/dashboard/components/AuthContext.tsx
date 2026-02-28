import React, { createContext, useContext, useState, useEffect } from 'react';
import { configureAuthRuntime, hyperlynxApi } from '../services/hyperlynxApi';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'hyperlynx.access_token';
const REFRESH_TOKEN_KEY = 'hyperlynx.refresh_token';
const DEMO_ACCESS_TOKEN = 'demo_access_token';
const DEMO_REFRESH_TOKEN = 'demo_refresh_token';
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@hyperlynx.local',
  name: 'Demo User',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    configureAuthRuntime({
      getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
      getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
      onAccessToken: (newAccessToken: string) => {
        setAccessToken(newAccessToken);
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      },
      onAuthFailure: () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      },
    });

    return () => {
      configureAuthRuntime(null);
    };
  }, []);

  const checkSession = async () => {
    if (hyperlynxApi.isDemoMode()) {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || DEMO_ACCESS_TOKEN;
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || DEMO_REFRESH_TOKEN;
      localStorage.setItem(ACCESS_TOKEN_KEY, storedAccessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, storedRefreshToken);
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUser(DEMO_USER);
      hyperlynxApi.markDashboardSeeded(true);
      setLoading(false);
      return;
    }

    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    setAccessToken(storedAccessToken);
    setRefreshToken(storedRefreshToken);

    if (!storedAccessToken) {
      setLoading(false);
      return;
    }

    try {
      const profile = await hyperlynxApi.getProfile(storedAccessToken);
      setUser({
        id: String(profile.id),
        email: profile.email,
        name: [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username,
      });
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (hyperlynxApi.isDemoMode()) {
      setError(null);
      setUser({ id: 'demo-user', email: email || DEMO_USER.email, name: name || DEMO_USER.name });
      setAccessToken(DEMO_ACCESS_TOKEN);
      setRefreshToken(DEMO_REFRESH_TOKEN);
      localStorage.setItem(ACCESS_TOKEN_KEY, DEMO_ACCESS_TOKEN);
      localStorage.setItem(REFRESH_TOKEN_KEY, DEMO_REFRESH_TOKEN);
      hyperlynxApi.markDashboardSeeded(true);
      return;
    }

    try {
      setError(null);

      await hyperlynxApi.register(email, password, name);
      await login(email, password);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    if (hyperlynxApi.isDemoMode()) {
      setError(null);
      setUser({ id: 'demo-user', email: email || DEMO_USER.email, name: DEMO_USER.name });
      setAccessToken(DEMO_ACCESS_TOKEN);
      setRefreshToken(DEMO_REFRESH_TOKEN);
      localStorage.setItem(ACCESS_TOKEN_KEY, DEMO_ACCESS_TOKEN);
      localStorage.setItem(REFRESH_TOKEN_KEY, DEMO_REFRESH_TOKEN);
      hyperlynxApi.markDashboardSeeded(true);
      return;
    }

    try {
      setError(null);

      const data = await hyperlynxApi.login(email, password);
      const name = [data.user.first_name, data.user.last_name].filter(Boolean).join(' ') || data.user.username;

      setUser({
        id: String(data.user.id),
        email: data.user.email,
        name,
      });
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);

      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setError(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        signup,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
