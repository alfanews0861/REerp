import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export * from './triggers/authTriggers';
export * from './triggers/scheduledTasks';
export * from './callables/setUserRole';
export * from './callables/syncCustomClaims';
export * from './triggers/onCompanyCreated';
export * from './triggers/onBranchCreated';
export * from './triggers/onDepartmentCreated';
export * from './triggers/onTeamUpdated';
export * from './triggers/projectTriggers';
export * from './triggers/leadTriggers';
