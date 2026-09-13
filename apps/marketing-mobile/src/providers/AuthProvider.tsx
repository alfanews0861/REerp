import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirebaseInstance,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  FirebaseUser,
} from '../services/firebase';

export interface MobileUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  cadre?: string;
  referralCode?: string;
  referredByCode?: string;
  isProfileCompleted?: boolean;
  phoneNumber?: string;
  branch?: string;
}

interface AuthContextType {
  user: MobileUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: (role: 'admin' | 'agent' | 'driver' | 'manager' | 'telecaller') => Promise<void>;
  completeProfile: (profileData: { displayName: string; phoneNumber?: string; registrationType: string; refCode?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: async () => {},
  loginWithPhone: async () => {},
  logout: async () => {},
  loginDemo: async () => {},
  completeProfile: async () => {},
});

const AUTH_STORAGE_KEY = 'mobile_auth_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MobileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore cached session on boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const cached = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch (err) {
        console.warn('Failed to restore auth session from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Listen to Firebase Auth state if initialized
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const { auth, db } = getFirebaseInstance();
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
          if (fbUser) {
            let role = 'sales_executive';
            let displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Field Agent';
            let phoneNumber = fbUser.phoneNumber || undefined;
            let branch = 'Hyderabad Main';
            let cadre: string | undefined = undefined;
            let referralCode: string | undefined = undefined;
            let referredByCode: string | undefined = undefined;
            let isProfileCompleted: boolean | undefined = undefined;

            try {
              if (db) {
                const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
                if (userDoc.exists()) {
                  const data = userDoc.data();
                  if (data.role) role = data.role;
                  if (data.displayName) displayName = data.displayName;
                  if (data.phoneNumber) phoneNumber = data.phoneNumber;
                  if (data.branch) branch = data.branch;
                  cadre = data.cadre;
                  referralCode = data.referralCode;
                  referredByCode = data.referredByCode;
                  isProfileCompleted = data.isProfileCompleted;
                }
              }
            } catch (err) {
              console.warn('Could not fetch user profile from Firestore:', err);
            }

            const mobileUser: MobileUser = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName,
              role,
              phoneNumber,
              branch,
              cadre,
              referralCode: referralCode || `REF-${fbUser.uid.substring(0, 6).toUpperCase()}`,
              referredByCode,
              isProfileCompleted: isProfileCompleted ?? (role === 'director' || role === 'super_admin' ? true : false),
            };

            setUser(mobileUser);
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mobileUser));
          } else {
            // Unauthenticated
            setUser(null);
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          }
          setIsLoading(false);
        });
      }
    } catch {
      // Firebase might not be initialized yet in mock/test mode
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const { auth, db } = getFirebaseInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = userCredential.user;

      let role = 'sales_executive';
      let displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Field Agent';
      let phoneNumber = fbUser.phoneNumber || undefined;
      let branch = 'Hyderabad Main';

      try {
        if (db) {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role) role = data.role;
            if (data.displayName) displayName = data.displayName;
            if (data.phoneNumber) phoneNumber = data.phoneNumber;
            if (data.branch) branch = data.branch;
          }
        }
      } catch (err) {
        console.warn('Could not fetch user profile on login:', err);
      }

      const mobileUser: MobileUser = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName,
        role,
        phoneNumber,
        branch,
      };

      setUser(mobileUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mobileUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      // In mobile environment, fallback to structured user profile or native credential
      const googleUser: MobileUser = {
        uid: 'google-mobile-user',
        email: 'employee@reerp.com',
        displayName: 'Google Employee User',
        role: 'sales_executive',
        phoneNumber: '+91 98480 12345',
        branch: 'Hyderabad Main',
      };
      setUser(googleUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithPhone = useCallback(async (phone: string, otp: string) => {
    setIsLoading(true);
    try {
      if (otp.length < 6) {
        throw new Error('Invalid OTP code. Please enter 6-digit OTP.');
      }
      const phoneUser: MobileUser = {
        uid: `phone-${phone.replace(/\D/g, '')}`,
        email: `${phone.replace(/\D/g, '')}@reerp.com`,
        displayName: `Agent (${phone})`,
        role: 'sales_executive',
        phoneNumber: phone,
        branch: 'Hyderabad Main',
      };
      setUser(phoneUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(phoneUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginDemo = useCallback(async (demoRole: 'admin' | 'agent' | 'driver' | 'manager' | 'telecaller') => {
    setIsLoading(true);
    let demoUser: MobileUser;

    switch (demoRole) {
      case 'admin':
        demoUser = {
          uid: 'demo-admin-1',
          email: 'admin@reerp.com',
          displayName: 'Vikram Aditya (CEO & Admin)',
          role: 'super_admin',
          cadre: 'director',
          phoneNumber: '+91 99999 88888',
          branch: 'Corporate Headquarters',
          isProfileCompleted: true,
        };
        break;
      case 'agent':
        demoUser = {
          uid: 'demo-agent-1',
          email: 'agent@reerp.com',
          displayName: 'Vamshi Krishna',
          role: 'sales_executive',
          phoneNumber: '+91 9876543210',
          branch: 'Mokila Branch',
        };
        break;
      case 'driver':
        demoUser = {
          uid: 'demo-driver-1',
          email: 'driver@reerp.com',
          displayName: 'Ramesh Goud',
          role: 'driver',
          phoneNumber: '+91 9848022338',
          branch: 'Fleet Logistics',
        };
        break;
      case 'manager':
        demoUser = {
          uid: 'demo-manager-1',
          email: 'manager@reerp.com',
          displayName: 'Rajesh Kumar',
          role: 'sales_manager',
          phoneNumber: '+91 9123456789',
          branch: 'Headquarters',
        };
        break;
      case 'telecaller':
        demoUser = {
          uid: 'demo-tele-1',
          email: 'telecaller@reerp.com',
          displayName: 'Pooja Reddy',
          role: 'telecaller',
          phoneNumber: '+91 9988776655',
          branch: 'Inbound Sales',
        };
        break;
    }

    setUser(demoUser);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      try {
        const { auth } = getFirebaseInstance();
        if (auth) {
          await fbSignOut(auth);
        }
      } catch {
        // Safe ignore
      }
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeProfile = useCallback(
    async (profileData: { displayName: string; phoneNumber?: string; registrationType: string; refCode?: string }) => {
      if (!user) return;
      const updated: MobileUser = {
        ...user,
        displayName: profileData.displayName,
        phoneNumber: profileData.phoneNumber || user.phoneNumber,
        referredByCode: profileData.refCode,
        isProfileCompleted: true,
      };
      setUser(updated);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        loginWithPhone,
        logout,
        loginDemo,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
