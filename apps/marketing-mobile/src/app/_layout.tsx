import { Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { QueryProvider } from '../providers/QueryProvider';
import { LocationProvider } from '../providers/LocationProvider';
import { Button } from '../components/Button';
import { useEffect } from 'react';
import { registerBackgroundSync } from '../services/backgroundSync';
import { initFirebase } from '@real-estate-erp/firebase';

// Safe initialization of Firebase for background tasks & mobile sync
const firebaseApiKey =
  process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
  process.env.VITE_FIREBASE_API_KEY;

if (firebaseApiKey) {
  try {
    initFirebase(
      {
        apiKey: firebaseApiKey,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID || '',
      },
      process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
    );
  } catch (fbErr) {
    console.warn('Firebase initialization notice:', fbErr);
  }
}

export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error?.message || 'An unexpected error occurred.'}</Text>
      <Button title="Try Again" onPress={retry} variant="primary" />
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    try {
      registerBackgroundSync().catch((err) => {
        console.warn('Background sync registration notice:', err);
      });
    } catch (err) {
      console.warn('Failed to invoke registerBackgroundSync:', err);
    }
  }, []);

  return (
    <QueryProvider>
      <LocationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="lead/[id]" options={{ title: 'Lead Details', headerShown: true }} />
          <Stack.Screen name="commission/index" options={{ title: 'My Commission', headerShown: true }} />
          <Stack.Screen name="network/index" options={{ title: 'My Network & Team', headerShown: true }} />
          <Stack.Screen name="visit/[id]" options={{ title: 'Visit Details', headerShown: true }} />
          <Stack.Screen name="visit/start" options={{ title: 'Start Site Visit', headerShown: true }} />
          <Stack.Screen name="visit/complete" options={{ title: 'Complete Site Visit', headerShown: true }} />
        </Stack>
      </LocationProvider>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
});
