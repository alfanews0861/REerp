import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initFirebase } from '@real-estate-erp/firebase';

try {
  initFirebase({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy_api_key_for_bootstrap',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'real-estate-erp',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'real-estate-erp.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:123456',
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
