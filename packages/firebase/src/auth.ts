import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  getIdTokenResult,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseInstance } from './config';
import { UserProfile, UserRole } from '@real-estate-erp/types';

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  const { auth, db } = getFirebaseInstance();
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const tokenResult = await getIdTokenResult(firebaseUser);
      let role = tokenResult.claims.role as UserRole;
      let tenantId = tokenResult.claims.tenantId as string | undefined;
      let permissions = (tokenResult.claims.permissions as string[]) || [];

      // If token claims role is not set or invalid, check Firestore users collection
      if (!role || (role as string) === 'client') {
        try {
          const userDocSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            if (data.role) role = data.role as UserRole;
            if (data.tenantId) tenantId = data.tenantId;
            if (data.permissions && Array.isArray(data.permissions) && data.permissions.length > 0) {
              permissions = data.permissions;
            }
          }
        } catch {
          // Ignore firestore read errors in offline/emulator mode
        }
      }

      // Check demo credentials mapping if still unassigned
      if (!role || (role as string) === 'client') {
        const emailLower = (firebaseUser.email || '').toLowerCase();
        if (emailLower === 'admin@reerp.com') role = 'super_admin';
        else if (emailLower === 'manager@reerp.com') role = 'branch_manager';
        else if (emailLower === 'telecaller@reerp.com') role = 'telecaller';
        else if (emailLower === 'agent@reerp.com') role = 'sales_executive';
        else role = 'customer';
      }

      const profile: UserProfile = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        phoneNumber: firebaseUser.phoneNumber || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        role,
        status: 'active',
        tenantId,
        permissions,
        createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      callback(profile);
    } catch {
      callback(null);
    }
  });
}

export async function signOutUser(): Promise<void> {
  const { auth } = getFirebaseInstance();
  await firebaseSignOut(auth);
}
