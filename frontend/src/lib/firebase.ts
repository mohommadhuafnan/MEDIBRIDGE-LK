import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration (supports Vercel env vars with defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD0PVFpQxF4KYt-Hq-AsQvKhHuRLQRmTLk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "medibridge-lk-89007.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "medibridge-lk-89007",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "medibridge-lk-89007.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "836727892805",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:836727892805:web:d66ebb38a6731d145eac2c",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-9S9B2MVJ1T"
};

// Initialize Firebase safely for SSR (Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally only in browser environment
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics optional or blocked by client adblockers
  });
}

export {
  app,
  auth,
  googleProvider,
  analytics,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  firebaseSignOut,
  updateProfile,
};
export type { FirebaseUser };
