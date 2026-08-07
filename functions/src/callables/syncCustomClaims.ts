import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

export const syncCustomClaims = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { uid } = request.data;
  const targetUid = uid || request.auth.uid;

  const db = admin.firestore();
  const userSnap = await db.collection('users').doc(targetUid).get();

  if (!userSnap.exists) {
    throw new HttpsError('not-found', 'User profile not found.');
  }

  const userData = userSnap.data();
  if (!userData) {
    throw new HttpsError('internal', 'Invalid user data.');
  }

  const role = userData.role || 'customer';
  const permissions = userData.permissions || [];

  const claims = {
    role,
    permissions,
    tenantId: userData.tenantId || null,
    admin: role === 'super_admin',
  };

  await admin.auth().setCustomUserClaims(targetUid, claims);

  return { success: true, claims };
});
