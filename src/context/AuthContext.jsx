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

  useEffect(() => {

    // ✅ ADDED: redirect result handler
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("Redirect login success");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        setError(err.message);
      }
    };

    checkRedirect();
    // ✅ END

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
         console.log("USER:", currentUser);
         console.log("DATA:", userDocSnap.data());


          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.approved === true) {
              setUser(currentUser);
              setUserApproved(true);
              setError(null);
            } else {
              setUser(null);
              setUserApproved(false);
              setError('Your account is not approved yet. Please wait for admin approval.');
              await signOut(auth);
            }
          } else {
            setUser(null);
            setUserApproved(false);
            await signOut(auth);
          }
        } else {
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

  const signupWithEmail = async (email, password) => {
    try {
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

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

  const loginWithEmail = async (email, password) => {
    try {
      setError(null);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
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

      await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });

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

  const loginWithGoogle = async () => {
    try {
      setError(null);

      await signInWithRedirect(auth, googleProvider);

    } catch (err) {
      const errorMessage = err.message;
      setError(errorMessage);
      setUser(null);
      setUserApproved(false);
      throw new Error(errorMessage);
    }
  };

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