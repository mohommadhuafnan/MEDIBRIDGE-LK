'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  firebaseSignOut,
  updateProfile,
} from '../lib/firebase';

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
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
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
  signInWithGoogle: async () => ({ success: false }),
  sendPasswordReset: async () => ({ success: false }),
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
        console.error('Failed to parse saved user:', e);
      }
    }
    setLoading(false);
  }, []);

  const routeUserAfterAuth = (userData: User) => {
    if (!userData.onboarding_completed) {
      router.push('/onboarding');
    } else if (userData.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (userData.role === 'PHARMACIST') {
      router.push('/pharmacy/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);

    // Try Firebase Authentication first if available
    try {
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (fbErr: any) {
      // If user is not yet in Firebase or user signed up via local backend, fall through to backend auth
      console.warn('[Firebase Auth] Notice:', fbErr?.code || fbErr?.message);
    }

    // Authenticate with MediBridge LK Backend
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
      routeUserAfterAuth(res.user);
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid email or password' };
  };

  const register = async (fullName: string, email: string, password: string, role?: UserRole) => {
    setLoading(true);

    // Register with Firebase Auth
    try {
      if (auth) {
        const fbCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(fbCred.user, { displayName: fullName });
      }
    } catch (fbErr: any) {
      console.warn('[Firebase Auth] Notice on signup:', fbErr?.code || fbErr?.message);
    }

    // Register with MediBridge LK Backend
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // 1. Trigger Firebase Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();

      // 2. Synchronize with MediBridge backend
      const res = await apiFetch('/auth/google', {
        method: 'POST',
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName || 'Google User',
          google_id: fbUser.uid,
          photo_url: fbUser.photoURL,
          id_token: idToken,
        }),
      });

      setLoading(false);

      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('medibridge_token', res.token);
        localStorage.setItem('medibridge_user', JSON.stringify(res.user));
        routeUserAfterAuth(res.user);
        return { success: true };
      }

      return { success: false, message: res.message || 'Backend authentication failed after Google login' };
    } catch (err: any) {
      setLoading(false);
      console.error('[Google Sign-In Error]', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google Sign-In popup was closed before completing.' };
      } else if (err.code === 'auth/cancelled-popup-request') {
        return { success: false, message: 'Authentication was cancelled.' };
      } else if (err.code === 'auth/unauthorized-domain') {
        return { success: false, message: 'This domain is not authorized in Firebase Console. Please add it to Authorized Domains.' };
      }
      return { success: false, message: err.message || 'Failed to authenticate with Google' };
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      console.error('[Firebase Reset Password Error]', err);
      if (err.code === 'auth/user-not-found') {
        return { success: false, message: 'No registered user found with this email.' };
      } else if (err.code === 'auth/invalid-email') {
        return { success: false, message: 'Please provide a valid email address.' };
      }
      return { success: false, message: err.message || 'Failed to send reset email' };
    }
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

  const logout = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn('Firebase sign out notice:', e);
    }
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
        signInWithGoogle,
        sendPasswordReset,
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
