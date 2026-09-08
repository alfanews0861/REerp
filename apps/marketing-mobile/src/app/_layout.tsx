import { Stack } from 'expo-router';
import { QueryProvider } from '../providers/QueryProvider';
import { LocationProvider } from '../providers/LocationProvider';
import { useEffect } from 'react';
import { registerBackgroundSync } from '../services/backgroundSync';

export default function RootLayout() {
  useEffect(() => {
    registerBackgroundSync().catch(console.error);
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
