import {
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseInstance } from '../config';

/**
 * Initialize a RecaptchaVerifier for Phone OTP verification.
 */
export function setupRecaptcha(
  containerIdOrElement: string | HTMLElement,
  parameters: {
    size?: 'invisible' | 'normal' | 'compact';
    callback?: (response: unknown) => void;
    'expired-callback'?: () => void;
  } = { size: 'invisible' }
): RecaptchaVerifier {
  const { auth } = getFirebaseInstance();
  return new RecaptchaVerifier(auth, containerIdOrElement, parameters);
}

/**
 * Send SMS OTP to the given phone number using Firebase Auth.
 */
export async function sendPhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const { auth } = getFirebaseInstance();
  try {
    if (typeof window !== 'undefined') {
      await setPersistence(auth, browserLocalPersistence);
    }
  } catch {
    // Ignore in non-browser or test environments
  }
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

/**
 * Verify SMS OTP code and sync user profile in Firestore.
 */
export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  verificationCode: string,
  defaultRole: string = 'customer'
): Promise<UserCredential> {
  const { db } = getFirebaseInstance();
  const credential = await confirmationResult.confirm(verificationCode);
  const user = credential.user;

  if (user && db) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        const generatedReferralCode = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
        await setDoc(userRef, {
          uid: user.uid,
          phoneNumber: user.phoneNumber || '',
          displayName: user.displayName || user.phoneNumber || 'User',
          role: defaultRole,
          status: 'pending',
          isProfileCompleted: false,
          referralCode: generatedReferralCode,
          permissions: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch {
      // Safe ignore in offline/emulator mode
    }
  }

  return credential;
}
