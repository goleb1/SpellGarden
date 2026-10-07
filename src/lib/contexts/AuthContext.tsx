"use client";

import React, { createContext, useEffect, useState } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { User } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        setUser(user);
        // We now know who is playing, so the game can load their progress
        // without waiting on the user-record update below.
        setLoading(false);
        if (user) {
          // Create or update user document in Firestore
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
            });
          } else {
            await setDoc(userRef, {
              lastLogin: new Date().toISOString(),
            }, { merge: true });
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError("Failed to update user data. Please try again.");
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error signing in with Google:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in. Please contact the administrator.');
      } else {
        setError(err.message || 'Failed to sign in with Google. Please try again.');
      }
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Failed to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
