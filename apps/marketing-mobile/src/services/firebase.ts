/**
 * Mobile-safe Firebase initialization.
 *
 * The shared `@real-estate-erp/firebase` package imports `firebase/messaging` and
 * `session/deviceValidation` which use browser-only APIs (ServiceWorker, localStorage,
 * navigator.userAgent, Notification API). These imports crash React Native at bundle
 * evaluation time because those globals don't exist in the Hermes/JSC runtime.
 *
 * This module provides the same `initFirebase` and `getFirebaseInstance` interface but
 * skips messaging entirely, making it safe for React Native.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Re-export Firestore helpers so backgroundSync.ts can use them
export { collection, doc, addDoc, updateDoc } from 'firebase/firestore';

export interface FirebaseInstance {
  app: any;
  auth: any;
  db: any;
  storage: any;
  functions: any;
  messaging: null;
}

let firebaseInstance: FirebaseInstance | null = null;

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function initFirebase(config: FirebaseConfig, _useEmulator: boolean = false): FirebaseInstance {
  if (firebaseInstance) {
    return firebaseInstance;
  }

  const app = !getApps().length ? initializeApp(config) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app, 'us-central1');

  firebaseInstance = {
    app,
    auth,
    db,
    storage,
    functions,
    messaging: null, // Not supported on React Native
  };

  return firebaseInstance;
}

export function getFirebaseInstance(): FirebaseInstance {
  if (!firebaseInstance) {
    throw new Error('Firebase has not been initialized. Call initFirebase() first.');
  }
  return firebaseInstance;
}
