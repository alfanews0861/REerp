import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../src/providers/AuthProvider';
import { PublicMainPortal } from '../src/screens/public/PublicMainPortal';

export default function RootIndex() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (user) {
    if (user.isProfileCompleted === false) {
      return <Redirect href="/register-profile" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  // If not logged in, show the comprehensive Public Website / Customer Portal!
  return <PublicMainPortal onOpenLogin={() => router.push('/login')} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
