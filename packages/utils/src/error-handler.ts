export const parseFirebaseErrorMessage = (error: unknown): string => {
  if (!error) return 'An unknown error occurred.';

  const errObj = error as { code?: string; message?: string };
  const code = errObj.code || errObj.message;

  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use.';
    case 'auth/weak-password':
      return 'The password provided is too weak.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    default:
      return errObj.message || 'An unexpected error occurred.';
  }
};
