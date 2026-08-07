import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export * from './triggers/authTriggers';
export * from './triggers/scheduledTasks';
