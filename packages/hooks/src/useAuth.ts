import { useAuthContext } from '@real-estate-erp/firebase';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendPasswordResetEmail,
  updateUserPassword,
} from '@real-estate-erp/firebase';

export function useAuth() {
  const authContext = useAuthContext();

  return {
    ...authContext,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    sendPasswordResetEmail,
    updateUserPassword,
  };
}
