import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useLocation } from '../../src/providers/LocationProvider';

export default function StartVisitScreen() {
  const { visitId } = useLocalSearchParams();
  const router = useRouter();
  const { location, errorMsg, requestPermission } = useLocation();

  const handleStart = () => {
    // Logic to start the visit in the backend/cache
    Alert.alert('Success', 'Visit Started!');
    router.replace({ pathname: '/visit/complete', params: { visitId } });
  };

  return (
    <View style={styles.container}>
      <Card title="Start Site Visit">
        <Text style={styles.info}>Visit ID: {visitId}</Text>
        
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : location ? (
          <Text style={styles.location}>
            GPS Check In: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.info}>Fetching location...</Text>
        )}

        <Button title="Check In & Start" onPress={handleStart} style={styles.button} disabled={!location} />
        {!location && <Button title="Retry Location" onPress={requestPermission} variant="secondary" />}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
    justifyContent: 'center',
  },
  info: {
    fontSize: 16,
    marginBottom: 12,
    color: '#334155',
  },
  location: {
    fontSize: 14,
    color: '#16a34a',
    marginBottom: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
});
