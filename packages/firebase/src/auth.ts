import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  getIdTokenResult,
} from 'firebase/auth';
import { getFirebaseInstance } from './config';
import { UserProfile, UserRole } from '@real-estate-erp/types';

export function subscribeToAuthChanges(callback: (user: UserProfile | null) => void): () => void {
  const { auth } = getFirebaseInstance();
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const tokenResult = await getIdTokenResult(firebaseUser);
      const role = (tokenResult.claims.role as UserRole) || 'client';
      const tenantId = tokenResult.claims.tenantId as string | undefined;
      const permissions = (tokenResult.claims.permissions as string[]) || [];

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
