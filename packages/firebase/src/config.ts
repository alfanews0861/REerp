import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { FirebaseClientConfig } from '@real-estate-erp/types';

export interface FirebaseInstance {
  app: any;
  auth: any;
  db: any;
  storage: any;
  functions: any;
  messaging: any | null;
}

let firebaseInstance: FirebaseInstance | null = null;

export function initFirebase(config: FirebaseClientConfig, useEmulator: boolean = false, emulatorHost: string = 'localhost'): FirebaseInstance {
  if (firebaseInstance) {
    return firebaseInstance;
  }

  const app = !getApps().length ? initializeApp(config) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app, 'us-central1');

  let messaging: Messaging | null = null;
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      }
    }).catch(console.error);
  }

  if (useEmulator && typeof window !== 'undefined') {
    connectAuthEmulator(auth, `http://${emulatorHost}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, emulatorHost, 8080);
    connectStorageEmulator(storage, emulatorHost, 9199);
    connectFunctionsEmulator(functions, emulatorHost, 5001);
  }

  firebaseInstance = {
    app,
    auth,
    db,
    storage,
    functions,
    messaging,
  };

  return firebaseInstance;
}

export function getFirebaseInstance(): FirebaseInstance {
  if (!firebaseInstance) {
    throw new Error('Firebase has not been initialized. Call initFirebase() first.');
  }
  return firebaseInstance;
}
