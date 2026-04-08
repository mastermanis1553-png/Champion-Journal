import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

const AuthContext = createContext();

// 🚨 YAHAN APNE AUR APNE DOSTON KE EMAILS DAAL (Strict Security)
const ALLOWED_EMAILS =[
  "tera.email@gmail.com", 
  "affan.champion@gmail.com"
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && ALLOWED_EMAILS.includes(currentUser.email)) {
        setUser(currentUser);
      } else {
        setUser(null);
        if(currentUser) signOut(auth); // Agar unauthorized hai toh turant bahar
      }
      setLoading(false);
    });
    return unsubscribe;
  },[]);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (!ALLOWED_EMAILS.includes(result.user.email)) {
      await signOut(auth);
      throw new Error("UNAUTHORIZED ACCESS: Your email is not whitelisted.");
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);