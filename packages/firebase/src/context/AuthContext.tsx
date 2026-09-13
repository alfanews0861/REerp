import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, CustomClaims, AuthState } from '@real-estate-erp/types';
import { subscribeToAuthChanges, signOutUser as firebaseSignOut } from '../auth';
import { getParsedClaims, validateAnonymousDisabled } from '../authentication/tokenManager';
import { getFirebaseInstance } from '../config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

const CACHE_USER_KEY = 'reerp_auth_user_cache';
const CACHE_TOKEN_KEY = 'reerp_auth_token_cache';
const CACHE_CLAIMS_KEY = 'reerp_auth_claims_cache';

const getInitialCached = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getInitialCached<UserProfile>(CACHE_USER_KEY));
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(CACHE_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [customClaims, setCustomClaims] = useState<CustomClaims | null>(() => getInitialCached<CustomClaims>(CACHE_CLAIMS_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(() => !getInitialCached<UserProfile>(CACHE_USER_KEY));
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      const { auth, db } = getFirebaseInstance();
      if (auth.currentUser && db) {
        const userDocSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUser((prev) => {
            if (!prev) return null;
            const updated: UserProfile = {
              ...prev,
              displayName: data.displayName || prev.displayName,
              phoneNumber: data.phoneNumber || prev.phoneNumber,
              photoURL: data.photoURL !== undefined ? data.photoURL : prev.photoURL,
              role: data.role || prev.role,
              status: data.status || prev.status,
              cadre: data.cadre || prev.cadre,
              registrationType: data.registrationType || prev.registrationType,
              isProfileCompleted: data.isProfileCompleted !== undefined ? data.isProfileCompleted : prev.isProfileCompleted,
              referralCode: data.referralCode || prev.referralCode,
              referredByCode: data.referredByCode || prev.referredByCode,
              referredByUid: data.referredByUid || prev.referredByUid,
              referredByName: data.referredByName || prev.referredByName,
              referredByCadre: data.referredByCadre || prev.referredByCadre,
              hierarchyPath: data.hierarchyPath || prev.hierarchyPath,
              kycDetails: data.kycDetails || prev.kycDetails,
              updatedAt: new Date().toISOString(),
            };
            if (typeof window !== 'undefined') {
              localStorage.setItem(CACHE_USER_KEY, JSON.stringify(updated));
            }
            return updated;
          });
        }
      }
    } catch (err: unknown) {
      console.warn('Failed to refresh profile:', err);
    }
  };

  const refreshClaims = async () => {
    try {
      const { auth } = getFirebaseInstance();
      if (auth.currentUser) {
        validateAnonymousDisabled(auth.currentUser);
        const claims = await getParsedClaims(auth.currentUser);
        setCustomClaims(claims);
        const rawToken = await auth.currentUser.getIdToken(true);
        setToken(rawToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_CLAIMS_KEY, JSON.stringify(claims));
          localStorage.setItem(CACHE_TOKEN_KEY, rawToken);
        }
        await refreshProfile();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to refresh token claims';
      setError(msg);
    }
  };

  useEffect(() => {
    const { auth } = getFirebaseInstance();
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        setCustomClaims(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CACHE_USER_KEY);
          localStorage.removeItem(CACHE_TOKEN_KEY);
          localStorage.removeItem(CACHE_CLAIMS_KEY);
        }
        setIsLoading(false);
        return;
      }

      try {
        validateAnonymousDisabled(firebaseUser);
        const claims = await getParsedClaims(firebaseUser);
        const rawToken = await firebaseUser.getIdToken();
        setCustomClaims(claims);
        setToken(rawToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_CLAIMS_KEY, JSON.stringify(claims));
          localStorage.setItem(CACHE_TOKEN_KEY, rawToken);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication verification failed';
        setError(msg);
      }
    });

    const unsubscribeProfile = subscribeToAuthChanges((profile) => {
      setUser(profile);
      if (profile) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CACHE_USER_KEY, JSON.stringify(profile));
        }
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(CACHE_USER_KEY);
        }
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CACHE_USER_KEY);
        localStorage.removeItem(CACHE_TOKEN_KEY);
        localStorage.removeItem(CACHE_CLAIMS_KEY);
      }
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
    refreshProfile,
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
