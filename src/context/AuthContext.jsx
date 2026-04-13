import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../utils/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const[userApproved, setUserApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // HELPER: Firebase error messages (Moved up & changed to standard function to avoid hoisting bugs)
  // ============================================
  function getErrorMessage(code) {
    const errorMap = {
      'auth/email-already-in-use': 'Email already registered. Please login or use a different email.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
      'auth/operation-not-allowed': 'This authentication method is not enabled.',
      'auth/account-exists-with-different-credential': 'An account with this email already exists.'
    };
    return errorMap[code] || 'An authentication error occurred.';
  }

  // ============================================
  // MAIN AUTH STATE LISTENER
  // ============================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          // User is logged in - check approval status
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.approved === true) {
              setUser(currentUser);
              setUserApproved(true);
              setError(null);
            } else {
              // User exists but not approved
              setUser(null);
              setUserApproved(false);
              setError('Your account is not approved yet. Please wait for admin approval.');
              await signOut(auth);
            }
          } else {
            // User doc doesn't exist - sign them out
            setUser(null);
            setUserApproved(false);
            await signOut(auth);
          }
        } else {
          // No user logged in
          setUser(null);
          setUserApproved(false);
          setError(null);
        }
      } catch (err) {
        console.error('Auth state error:', err);
        setError(err.message);
        setUser(null);
        setUserApproved(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  },