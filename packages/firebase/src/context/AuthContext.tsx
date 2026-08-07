import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, CustomClaims, AuthState } from '@real-estate-erp/types';
import { subscribeToAuthChanges, signOutUser as firebaseSignOut } from '../auth';
import { getParsedClaims, validateAnonymousDisabled } from '../authentication/tokenManager';
import { getFirebaseInstance } from '../config';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [customClaims, setCustomClaims] = useState<CustomClaims | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshClaims = async () => {
    try {
      const { auth } = getFirebaseInstance();
      if (auth.currentUser) {
        validateAnonymousDisabled(auth.currentUser);
        const claims = await getParsedClaims(auth.currentUser);
        setCustomClaims(claims);
        const rawToken = await auth.currentUser.getIdToken(true);
        setToken(rawToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to refresh token claims';
      setError(msg);
    }
  };

  useEffect(() => {
    const { auth } = getFirebaseInstance();
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      setIsLoading(true);
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        setCustomClaims(null);
        setIsLoading(false);
        return;
      }

      try {
        validateAnonymousDisabled(firebaseUser);
        const claims = await getParsedClaims(firebaseUser);
        const rawToken = await firebaseUser.getIdToken();
        setCustomClaims(claims);
        setToken(rawToken);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication verification failed';
        setError(msg);
      }
    });

    const unsubscribeProfile = subscribeToAuthChanges((profile) => {
      setUser(profile);
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile();
    };
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut();
      setUser(null);
      setToken(null);
      setCustomClaims(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logout failed';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session: null,
    isAuthenticated: !!user,
    isLoading,
    token,
    customClaims,
    error,
    isRemembered: true,
    signOut: handleSignOut,
    refreshClaims,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
