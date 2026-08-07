import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const setUserRole = onCall(async (request) => {
  // Ensure caller is authenticated and is an admin
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const callerRole = request.auth.token.role;
  if (callerRole !== 'admin') {
    throw new HttpsError('permission-denied', 'Only administrators can assign roles.');
  }

  const { targetUid, role } = request.data;
  if (!targetUid || !role) {
    throw new HttpsError('invalid-argument', 'targetUid and role are required parameters.');
  }

  // Set Custom User Claim for Firebase Auth
  await admin.auth().setCustomUserClaims(targetUid, { role });

  // Update user document in Firestore
  await admin.firestore().collection('users').doc(targetUid).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true, message: `Successfully assigned role ${role} to user ${targetUid}` };
});
