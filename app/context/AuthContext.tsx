// app/context/AuthContext.tsx - Updated with host profile caching
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'User' | 'Host' | 'Admin';
  profession: string;
  phone: string;
  refId: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}

interface HostProfileCache {
  hasProfile: boolean;
  data: any | null;
  lastChecked: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'User' | 'Host' | 'Admin';
    profession?: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  clearError: () => void;
  hostProfile: HostProfileCache;
  refreshHostProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HOST_PROFILE_CACHE_KEY = 'hostProfileCache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function loadCachedHostProfile(): HostProfileCache {
  try {
    const cached = localStorage.getItem(HOST_PROFILE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Only use cache if it's less than 5 minutes old
      if (Date.now() - parsed.lastChecked < CACHE_TTL) {
        return parsed;
      }
    }
  } catch {}
  return { hasProfile: false, data: null, lastChecked: 0 };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostProfile, setHostProfile] = useState<HostProfileCache>({
    hasProfile: false,
    data: null,
    lastChecked: 0,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skills-k6pv.onrender.com';

  const fetchHostProfile = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/host/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const cache: HostProfileCache = {
            hasProfile: true,
            data: result.data,
            lastChecked: Date.now(),
          };
          setHostProfile(cache);
          localStorage.setItem(HOST_PROFILE_CACHE_KEY, JSON.stringify(cache));
          return;
        }
      }

      const cache: HostProfileCache = { hasProfile: false, data: null, lastChecked: Date.now() };
      setHostProfile(cache);
      localStorage.setItem(HOST_PROFILE_CACHE_KEY, JSON.stringify(cache));
    } catch {
      const cache: HostProfileCache = { hasProfile: false, data: null, lastChecked: Date.now() };
      setHostProfile(cache);
      localStorage.setItem(HOST_PROFILE_CACHE_KEY, JSON.stringify(cache));
    }
  }, [baseUrl]);

  const refreshHostProfile = useCallback(async () => {
    if (token) {
      await fetchHostProfile(token);
    }
  }, [token, fetchHostProfile]);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Load cached host profile instantly
          const cached = loadCachedHostProfile();
          setHostProfile(cached);

          // Refresh in background if cache is stale (> 5 min)
          if (Date.now() - cached.lastChecked > CACHE_TTL) {
            fetchHostProfile(storedToken);
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [fetchHostProfile]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);

        // Store in localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Fetch host profile immediately after login (non-blocking)
        fetchHostProfile(data.token);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'User' | 'Host' | 'Admin';
    profession?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      // Registration successful - user still needs to login
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    setHostProfile({ hasProfile: false, data: null, lastChecked: 0 });

    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem(HOST_PROFILE_CACHE_KEY);
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    clearError,
    hostProfile,
    refreshHostProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
