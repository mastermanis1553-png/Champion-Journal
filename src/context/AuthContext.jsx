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
  const [userApproved, setUserApproved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  // ============================================
  // SIGNUP WITH EMAIL & PASSWORD
  // ============================================
  const signupWithEmail = async (email, password) => {
    try {
      setError(null);

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create Firestore user document with approval: false
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        approved: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        displayName: '',
        photoURL: null,
        authMethod: 'email'
      });

      // Don't auto-login - user needs approval first
      await signOut(auth);
      setUser(null);
      setUserApproved(false);

      return {
        success: true,
        message: 'Account created! Please wait for admin approval to access the dashboard.'
      };
    } catch (err) {
      const errorMessage = getErrorMessage(err.code);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // LOGIN WITH EMAIL & PASSWORD
  // ============================================
  const loginWithEmail = async (email, password) => {
    try {
      setError(null);

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Check approval status in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // User doc doesn't exist - create it (shouldn't happen but safety measure)
        await setDoc(userDocRef, {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          approved: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          displayName: '',
          photoURL: null,
          authMethod: 'email'
        });
        await signOut(auth);
        throw new Error('Your account is not approved yet. Please wait for admin approval.');
      }

      const userData = userDocSnap.data();

      if (userData.approved !== true) {
        await signOut(auth);
        setUser(null);
        setUserApproved(false);
        throw new Error('Your account is not approved yet. Please wait for admin approval.');
      }

      // Update last login timestamp
      await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });

      // User is approved - set state
      setUser(firebaseUser);
      setUserApproved(true);
      setError(null);

      return { success: true };
    } catch (err) {
      const errorMessage = getErrorMessage(err.code) || err.message;
      setError(errorMessage);
      setUser(null);
      setUserApproved(false);
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // LOGIN WITH GOOGLE
  // ============================================
  const loginWithGoogle = async () => {
    try {
      setError(null);

      // Sign in with Google
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Check if user doc exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // First time Google login - create user doc with approved: false
        await setDoc(userDocRef, {
          email: firebaseUser.email,
          uid: firebaseUser.uid,
          approved: false,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || null,
          authMethod: 'google'
        });
        await signOut(auth);
        throw new Error('Account created! Please wait for admin approval to access the dashboard.');
      }

      const userData = userDocSnap.data();

      if (userData.approved !== true) {
        await signOut(auth);
        throw new Error('Your account is not approved yet. Please wait for admin approval.');
      }

      // Update last login timestamp
      await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });

      // User is approved
      setUser(firebaseUser);
      setUserApproved(true);
      setError(null);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      setUser(null);
      setUserApproved(false);
      throw new Error(errorMessage);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserApproved(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  // ============================================
  // HELPER: Firebase error messages
  // ============================================
  const getErrorMessage = (code) => {
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
  };

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};