// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

const AuthContext = createContext();

// 🚨 SIRF YE EMAILS ACCESS KAR PAYENGE
const ALLOWED_EMAILS = [
  "mastermanis1553@gmail.com", 
  "affan.champion@gmail.com"
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ALLOWED_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else {
        setUser(null);
        if(currentUser) signOut(auth);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Google Login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (!ALLOWED_EMAILS.includes(result.user.email)) {
      await signOut(auth);
      throw new Error("UNAUTHORIZED: Your email is not whitelisted.");
    }
  };

  // Email Login (WAPAS AA GYA)
  const loginWithEmail = async (email, password) => {
    if (!ALLOWED_EMAILS.includes(email)) {
      throw new Error("UNAUTHORIZED: This email does not have access.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginWithEmail, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);