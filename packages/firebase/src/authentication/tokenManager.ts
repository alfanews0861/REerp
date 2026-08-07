import { getIdToken, getIdTokenResult, IdTokenResult, User } from 'firebase/auth';
import { getFirebaseInstance } from '../config';
import { CustomClaims } from '@real-estate-erp/types';

export async function refreshToken(forceRefresh: boolean = true): Promise<string> {
  const { auth } = getFirebaseInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No active authenticated user to refresh token for.');
  }
  return await getIdToken(currentUser, forceRefresh);
}

export async function getParsedClaims(user: User): Promise<CustomClaims> {
  const tokenResult: IdTokenResult = await getIdTokenResult(user, true);
  return tokenResult.claims as CustomClaims;
}

export function validateAnonymousDisabled(user: User | null): void {
  if (user && user.isAnonymous) {
    const { auth } = getFirebaseInstance();
    auth.signOut();
    throw new Error('Anonymous authentication is disabled for Enterprise access.');
  }
}
