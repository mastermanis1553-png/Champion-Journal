import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../utils/firebase';
import { 
  onAuthStateChanged, 
  signInWithRedirect, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  getRedirectResult
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userApproved, setUserApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Error Message Helper (Moved outside to be clean)
  const getErrorMessage = (code) => {
    const errorMap = {
      'auth/email-already-in-use': 'Email already registered. Please login.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Try later.',
    };
    return errorMap[code] || 'An authentication error occurred.';
  };

  useEffect(() => {
    // 1. Check for Redirect Result (Google Login)
    const handleRedirect = async () => {
      try {
        await getRedirectResult(auth);
      } catch (err) {
        console.error("Redirect Error:", err);
        setError(err.message);
      }
    };
    handleRedirect();

    // 2. Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          let userDocSnap = await getDoc(userDocRef);

          // Agar Firestore mein entry nahi hai (Pehli baar login)
          if (!userDocSnap.exists()) {
            const newUserData = {
              email: currentUser.email,
              uid: currentUser.uid,
              approved: false, // Default: Not approved
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || null,
              authMethod: currentUser.providerData[0]?.providerId || 'email'
            };
            await setDoc(userDocRef, newUserData);
            
            // Re-fetch to be sure
            userDocSnap = await getDoc(userDocRef);
          }

          const userData = userDocSnap.data();

          if (userData.approved === true) {
            setUser(currentUser);
            setUserApproved(true);
            setError(null);
          } else {
            // ✅ DO NOT SignOut here. Just set states.
            // UI will check userApproved and block access.
            setUser(currentUser); 
            setUserApproved(false);
            setError('Account Pending Approval. Please contact admin.');
          }
        } else {
          setUser(null);
          setUserApproved(false);
          setError(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError('Database connection error.');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Email Signup
  const signupWithEmail = async (email, password) => {
    try {
      setError(null);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Firestore entry logic handled by onAuthStateChanged listener above
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
      throw new Error(msg);
    }
  };

  // Email Login
  const loginWithEmail = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err.code);
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginWithGoogle = () => signInWithRedirect(auth, googleProvider);

  const logout = () => signOut(auth);

  const value = {
    user,
    userApproved,
    loading,
    error,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);