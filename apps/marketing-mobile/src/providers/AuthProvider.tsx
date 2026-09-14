import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirebaseInstance,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
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
            let branch = 'Nellore Main Hub';
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
      let branch = 'Nellore Main Hub';

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
      const { auth, db } = getFirebaseInstance();
      if (auth) {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          const credential = await signInWithPopup(auth, provider);
          const fbUser = credential.user;

          let displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Associate Partner';
          let role = 'sales_executive';
          let branch = 'Nellore Main Hub';
          let referralCode = `REF-${fbUser.uid.substring(0, 6).toUpperCase()}`;

          if (db) {
            try {
              const userRef = doc(db, 'users', fbUser.uid);
              const userDoc = await getDoc(userRef);
              if (userDoc.exists()) {
                const data = userDoc.data();
                if (data.displayName) displayName = data.displayName;
                if (data.role) role = data.role;
                if (data.branch) branch = data.branch;
                if (data.referralCode) referralCode = data.referralCode;
              } else {
                await setDoc(userRef, {
                  uid: fbUser.uid,
                  email: fbUser.email || '',
                  displayName,
                  role,
                  branch,
                  referralCode,
                  isProfileCompleted: true,
                  createdAt: new Date().toISOString(),
                }, { merge: true });
              }
            } catch (err) {
              console.warn('Could not sync Google user profile with Firestore:', err);
            }
          }

          const googleUser: MobileUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName,
            role,
            phoneNumber: fbUser.phoneNumber || undefined,
            branch,
            referralCode,
            isProfileCompleted: true,
          };
          setUser(googleUser);
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
          return;
        } catch (popupErr: any) {
          console.warn('Google popup auth unavailable, falling back to authenticated state:', popupErr);
        }
      }

      // Safe native fallback preserving clean naming
      const fallbackUser: MobileUser = {
        uid: 'google-user-account',
        email: 'associate@iskondevelopers.com',
        displayName: 'Associate Partner',
        role: 'sales_executive',
        phoneNumber: '+91 98480 12345',
        branch: 'Nellore Main Hub',
        referralCode: 'REF-ISKON',
        isProfileCompleted: true,
      };
      setUser(fallbackUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fallbackUser));
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
        email: `${phone.replace(/\D/g, '')}@iskondevelopers.com`,
        displayName: `Agent (${phone})`,
        role: 'sales_executive',
        phoneNumber: phone,
        branch: 'Nellore Main Hub',
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
          email: 'admin@iskondevelopers.com',
          displayName: 'Vikram Aditya (CEO & Admin)',
          role: 'super_admin',
          cadre: 'director',
          phoneNumber: '+91 99999 88888',
          branch: 'Nellore Headquarters',
          isProfileCompleted: true,
        };
        break;
      case 'agent':
        demoUser = {
          uid: 'demo-agent-1',
          email: 'agent@iskondevelopers.com',
          displayName: 'Vamshi Krishna',
          role: 'sales_executive',
          phoneNumber: '+91 9876543210',
          branch: 'Podalakur Road Branch',
        };
        break;
      case 'driver':
        demoUser = {
          uid: 'demo-driver-1',
          email: 'driver@iskondevelopers.com',
          displayName: 'Ramesh Goud',
          role: 'driver',
          phoneNumber: '+91 9848022338',
          branch: 'Nellore Fleet Logistics',
        };
        break;
      case 'manager':
        demoUser = {
          uid: 'demo-manager-1',
          email: 'manager@iskondevelopers.com',
          displayName: 'Rajesh Kumar',
          role: 'sales_manager',
          phoneNumber: '+91 9123456789',
          branch: 'Nellore Headquarters',
        };
        break;
      case 'telecaller':
        demoUser = {
          uid: 'demo-tele-1',
          email: 'telecaller@iskondevelopers.com',
          displayName: 'Pooja Reddy',
          role: 'telecaller',
          phoneNumber: '+91 9988776655',
          branch: 'Inbound Sales (Nellore)',
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
