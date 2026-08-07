import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { getFirebaseInstance } from '../config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signInWithGoogle(): Promise<UserCredential> {
  const { auth, db } = getFirebaseInstance();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Google User',
        photoURL: user.photoURL || undefined,
        role: 'customer',
        status: 'active',
        permissions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  }

  return credential;
}
