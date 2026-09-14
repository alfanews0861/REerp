import { Stack } from 'expo-router';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { QueryProvider } from '../src/providers/QueryProvider';
import { LocationProvider } from '../src/providers/LocationProvider';
import { Button } from '../src/components/Button';
import React, { useEffect } from 'react';
import { registerBackgroundSync } from '../src/services/backgroundSync';
// IMPORTANT: Import directly from local mobile-safe firebase wrapper, NOT from '@real-estate-erp/firebase'.
// The shared package imports 'firebase/messaging' (browser-only ServiceWorker/navigator APIs)
// and 'session/deviceValidation' (localStorage/navigator) which fatally crash React Native
// at bundle evaluation time before any React component can mount.
import { initFirebase } from '../src/services/firebase';

// Global error protection to prevent silent blank screens on native
if (typeof (global as any).ErrorUtils !== 'undefined') {
  const originalHandler = (global as any).ErrorUtils.getGlobalHandler?.();
  (global as any).ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
    console.warn('App error intercepted:', error?.message || error, 'isFatal:', isFatal);
    if (!isFatal && originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

export class SafeRootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.warn('RootErrorBoundary caught error:', error?.message, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView contentContainerStyle={styles.errorContainer}>
          <Text style={styles.errorTitle}>App Notice</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected issue occurred while starting the application.'}
          </Text>
          <Button
            title="Reload Application"
            onPress={() => this.setState({ hasError: false, error: null })}
            variant="primary"
          />
        </ScrollView>
      );
    }
    return this.props.children;
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

import { AuthProvider } from '../src/providers/AuthProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileThemeProvider } from '../src/theme';

export default function RootLayout() {
  useEffect(() => {
    // Safe initialization inside useEffect
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

    try {
      registerBackgroundSync?.().catch((err: any) => {
        console.warn('Background sync registration notice:', err);
      });
    } catch (err) {
      console.warn('Failed to invoke registerBackgroundSync:', err);
    }
  }, []);

  return (
    <SafeRootErrorBoundary>
      <SafeAreaProvider>
        <MobileThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <LocationProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    headerStyle: {
                      backgroundColor: '#0F172A',
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                      fontWeight: '700',
                    },
                  }}
                  initialRouteName="index"
                >
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="register-profile" options={{ title: 'Profile Registration', headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="lead/[id]" options={{ title: 'Lead Details', headerShown: true }} />
                  <Stack.Screen name="commission/index" options={{ title: 'My Commission', headerShown: true }} />
                  <Stack.Screen name="network/index" options={{ title: 'My Network & Team', headerShown: true }} />
                  <Stack.Screen name="inventory" options={{ title: 'Plot Inventory & Status', headerShown: true }} />
                  <Stack.Screen name="public-site" options={{ title: 'Public Portal', headerShown: false }} />
                  <Stack.Screen name="visit/[id]" options={{ title: 'Visit Details', headerShown: true }} />
                  <Stack.Screen name="visit/start" options={{ title: 'Start Site Visit', headerShown: true }} />
                  <Stack.Screen name="visit/complete" options={{ title: 'Complete Site Visit', headerShown: true }} />
                </Stack>
              </LocationProvider>
            </AuthProvider>
          </QueryProvider>
        </MobileThemeProvider>
      </SafeAreaProvider>
    </SafeRootErrorBoundary>
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
