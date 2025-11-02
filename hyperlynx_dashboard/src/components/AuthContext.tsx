import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setUser(null);
        setAccessToken(null);
      } else if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
        });
        setAccessToken(session.access_token);
      }
    } catch (err) {
      console.error('Session check exception:', err);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      
      console.log('Starting signup process for:', email);
      
      // Call the backend signup endpoint
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-7f9a4697/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();
      console.log('Signup response:', { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to create account';
        console.error('Signup failed:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log('User created, attempting sign in...');

      // Now sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error after signup:', signInError);
        throw signInError;
      }

      console.log('Sign in successful');

      if (signInData.session) {
        setUser({
          id: signInData.user.id,
          email: signInData.user.email || '',
          name: signInData.user.user_metadata?.name,
        });
        setAccessToken(signInData.session.access_token);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account';
      console.error('Signup process error:', errorMessage, err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      console.log('Starting login process for:', email);
      
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful');

      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
        });
        setAccessToken(session.access_token);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      console.error('Login process error:', errorMessage, err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
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
