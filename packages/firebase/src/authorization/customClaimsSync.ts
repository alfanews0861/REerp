import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseInstance } from '../config';

export async function requestCustomClaimsSync(uid: string): Promise<void> {
  const { app } = getFirebaseInstance();
  const functions = getFunctions(app);
  const syncCustomClaimsFn = httpsCallable<{ uid: string }, { success: boolean }>(
    functions,
    'syncCustomClaims'
  );

  await syncCustomClaimsFn({ uid });
}
