import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

export const onUserCreated = functions.identity.beforeUserCreated(async (event) => {
  const user = event.data;
  const db = admin.firestore();

  // Initialize base user document in Firestore upon Auth signup
  await db.collection('users').doc(user.uid).set(
    {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      role: 'client',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
});
