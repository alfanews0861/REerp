import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirebaseInstance } from '../config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signInWithGoogle(): Promise<UserCredential> {
  const { auth, db } = getFirebaseInstance();
  try {
    if (typeof window !== 'undefined') {
      await setPersistence(auth, browserLocalPersistence);
    }
  } catch {
    // Ignore in non-browser or test environments
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      const generatedReferralCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
        photoURL: user.photoURL || undefined,
        role: 'customer',
        status: 'pending',
        isProfileCompleted: false,
        referralCode: generatedReferralCode,
        permissions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  return credential;
}
