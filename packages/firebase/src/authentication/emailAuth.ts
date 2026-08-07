import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  UserCredential,
} from 'firebase/auth';
import { getFirebaseInstance } from '../config';
import { validatePassword } from './passwordPolicy';
import { UserRole } from '@real-estate-erp/types';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signInWithEmail(
  email: string,
  pass: string,
  remember: boolean = true
): Promise<UserCredential> {
  const { auth } = getFirebaseInstance();
  const persistence = remember ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
  return await signInWithEmailAndPassword(auth, email, pass);
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string,
  role: UserRole = 'customer'
): Promise<UserCredential> {
  const validation = validatePassword(pass);
  if (!validation.isValid) {
    throw new Error(`Password policy violation: ${validation.errors.join(' ')}`);
  }

  const { auth, db } = getFirebaseInstance();
  const credential = await createUserWithEmailAndPassword(auth, email, pass);

  if (credential.user) {
    await updateProfile(credential.user, { displayName });

    await setDoc(
      doc(db, 'users', credential.user.uid),
      {
        uid: credential.user.uid,
        email,
        displayName,
        role,
        status: 'active',
        permissions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return credential;
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { auth } = getFirebaseInstance();
  await firebaseSendPasswordResetEmail(auth, email);
}

export async function updateUserPassword(newPassword: string): Promise<void> {
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    throw new Error(`Password policy violation: ${validation.errors.join(' ')}`);
  }

  const { auth } = getFirebaseInstance();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user active.');
  }

  await firebaseUpdatePassword(currentUser, newPassword);
}
