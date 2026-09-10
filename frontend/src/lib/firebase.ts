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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0PVFpQxF4KYt-Hq-AsQvKhHuRLQRmTLk",
  authDomain: "medibridge-lk-89007.firebaseapp.com",
  projectId: "medibridge-lk-89007",
  storageBucket: "medibridge-lk-89007.firebasestorage.app",
  messagingSenderId: "836727892805",
  appId: "1:836727892805:web:d66ebb38a6731d145eac2c",
  measurementId: "G-9S9B2MVJ1T"
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
