'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

export type UserRole = 'PATIENT' | 'CAREGIVER' | 'PHARMACIST' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  onboarding_completed: boolean;
  preferred_language?: string;
  district?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  demoLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateOnboarding: (data: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  demoLogin: async () => {},
  logout: () => {},
  updateOnboarding: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('medibridge_token');
    const savedUser = localStorage.getItem('medibridge_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('medibridge_token', res.token);
      localStorage.setItem('medibridge_user', JSON.stringify(res.user));

      if (!res.user.onboarding_completed) {
        router.push('/onboarding');
      } else if (res.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (res.user.role === 'PHARMACIST') {
        router.push('/pharmacy/dashboard');
      } else {
        router.push('/dashboard');
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (fullName: string, email: string, password: string, role?: UserRole) => {
    setLoading(true);
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password, role: role || 'PATIENT' }),
    });
    setLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('medibridge_token', res.token);
      localStorage.setItem('medibridge_user', JSON.stringify(res.user));
      router.push('/onboarding');
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const demoLogin = async (role: UserRole) => {
    setLoading(true);
    const res = await apiFetch('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
    setLoading(false);

    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('medibridge_token', res.token);
      localStorage.setItem('medibridge_user', JSON.stringify(res.user));

      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'PHARMACIST') router.push('/pharmacy/dashboard');
      else router.push('/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medibridge_token');
    localStorage.removeItem('medibridge_user');
    router.push('/');
  };

  const updateOnboarding = async (data: any): Promise<boolean> => {
    const res = await apiFetch('/auth/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.success) {
      const updatedUser = { ...user, ...res.user, onboarding_completed: true };
      setUser(updatedUser);
      localStorage.setItem('medibridge_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
