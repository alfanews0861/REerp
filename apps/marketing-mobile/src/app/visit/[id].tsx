import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocation } from '../../providers/LocationProvider';
import { queueOfflineMutation } from '../../services/backgroundSync';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import NetInfo from '@react-native-community/netinfo';

export default function VisitDetailRoute() {
  const params = useLocalSearchParams<{ id?: string; visitId?: string }>();
  const id = params?.id || params?.visitId || '101';
  const router = useRouter();
  const [status, setStatus] = useState('SCHEDULED');
  const { location, errorMsg, requestPermission } = useLocation();

  const getGPSLocation = async () => {
    await requestPermission();
    if (errorMsg) {
      return { latitude: 0, longitude: 0, status: 'GPS_UNAVAILABLE' };
    }
    if (location) {
      return { 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude,
        status: 'GPS_VERIFIED'
      };
    }
    return { latitude: 0, longitude: 0, status: 'GPS_APPROXIMATE' };
  };

  const handleStartVisit = async () => {
    const loc = await getGPSLocation();
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      await queueOfflineMutation({
        type: 'VISIT_START',
        payload: { visitId: id, location: loc },
      });
      setStatus('IN_PROGRESS');
      Alert.alert('Offline', 'Visit started offline. Will sync later.');
    } else {
      setStatus('IN_PROGRESS');
      Alert.alert('Visit Started', 'GPS coordinates captured.');
    }
  };

  const handleMarkArrival = async () => {
    const loc = await getGPSLocation();
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      await queueOfflineMutation({
        type: 'VISIT_ARRIVAL',
        payload: { visitId: id, location: loc },
      });
      Alert.alert('Offline', 'Arrival recorded offline.');
    } else {
      Alert.alert('Arrived', 'Arrival location recorded.');
    }
  };

  const handleCompleteVisit = async () => {
    router.push({ pathname: '/visit/complete', params: { visitId: id } });
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="Site Visit Overview" style={styles.card}>
        <Text style={styles.text}>Visit ID: <Text style={styles.bold}>{id}</Text></Text>
        <Text style={styles.text}>Status: <Text style={[styles.bold, { color: status === 'IN_PROGRESS' ? '#d97706' : '#2563eb' }]}>{status}</Text></Text>
        {location && (
          <Text style={styles.gpsText}>
            GPS: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        )}
      </Card>
      
      <Card title="Actions" style={styles.card}>
        {status === 'SCHEDULED' && (
          <Button title="Start Visit" onPress={handleStartVisit} />
        )}
        {status === 'IN_PROGRESS' && (
          <View style={styles.buttonStack}>
            <Button title="Mark Arrival at Site" onPress={handleMarkArrival} variant="secondary" />
            <View style={{ height: 10 }} />
            <Button title="Complete Visit & Checkout" onPress={handleCompleteVisit} />
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f5f9',
  },
  card: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  gpsText: {
    fontSize: 13,
    color: '#16a34a',
    marginTop: 4,
    fontWeight: '500',
  },
  buttonStack: {
    marginTop: 8,
  },
});
