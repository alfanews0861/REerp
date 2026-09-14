import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initFirebase } from '@real-estate-erp/firebase';

try {
  initFirebase({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDs8O9iZB5o_tq0yokfCPRmdfzFT6zhA9s',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'reerp-b806b.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'reerp-b806b',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'reerp-b806b.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1034937872492',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1034937872492:web:5aecd0c2595978c35a6849',
  }, import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true');
} catch (e) {
  console.warn('Firebase initialization notice:', e);
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
