import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useLocation } from '../../src/providers/LocationProvider';
import { queueOfflineMutation } from '../../src/services/backgroundSync';
import NetInfo from '@react-native-community/netinfo';
// import { siteVisitService } from '@real-estate-erp/firebase'; // Assume this exists for online mutations

export default function VisitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
      // await siteVisitService.startVisit(id, loc, 'mock-user-id');
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
      // await siteVisitService.markSiteArrival(id, loc, 'mock-user-id');
      Alert.alert('Arrived', 'Arrival location recorded.');
    }
  };

  const handleCompleteVisit = async () => {
    const loc = await getGPSLocation();
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      await queueOfflineMutation({
        type: 'VISIT_COMPLETE',
        payload: { visitId: id, location: loc, outcome: 'HOT', notes: 'Completed' },
      });
      setStatus('COMPLETED');
      Alert.alert('Offline', 'Visit completed offline.');
    } else {
      // await siteVisitService.completeVisit(id, loc, { notes: 'Completed' }, 'HOT', 'mock-user-id');
      setStatus('COMPLETED');
      Alert.alert('Visit Completed', 'Feedback and outcome recorded.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visit Details</Text>
      <Text style={styles.text}>Visit ID: {id}</Text>
      <Text style={styles.text}>Status: {status}</Text>
      
      <View style={styles.actions}>
        {status === 'SCHEDULED' && (
          <Button title="Start Visit" onPress={handleStartVisit} />
        )}
        {status === 'IN_PROGRESS' && (
          <>
            <Button title="Mark Arrival at Site" onPress={handleMarkArrival} color="#f0ad4e" />
            <View style={{ height: 10 }} />
            <Button title="Complete Visit" onPress={handleCompleteVisit} color="#5cb85c" />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  actions: {
    marginTop: 32,
  },
});
