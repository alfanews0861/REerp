import {
  signInWithPhoneNumber,
  ConfirmationResult,
  RecaptchaVerifier,
  UserCredential,
} from 'firebase/auth';
import { getFirebaseInstance } from '../config';

export async function sendPhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const { auth } = getFirebaseInstance();
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
}

export async function verifyPhoneOtp(
  confirmationResult: ConfirmationResult,
  verificationCode: string
): Promise<UserCredential> {
  return await confirmationResult.confirm(verificationCode);
}
