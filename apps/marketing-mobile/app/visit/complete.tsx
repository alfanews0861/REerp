import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useLocation } from '../../src/providers/LocationProvider';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

export default function CompleteVisitScreen() {
  const { visitId } = useLocalSearchParams();
  const router = useRouter();
  const { location } = useLocation();
  const [photo, setPhoto] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(null);
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
    }
  };

  const handleComplete = () => {
    // Logic to complete the visit in backend/cache
    alert('Visit Completed & Synced!');
    router.replace('/visits');
  };

  return (
    <ScrollView style={styles.container}>
      <Card title="Complete Site Visit">
        <Text style={styles.info}>Visit ID: {visitId}</Text>
        
        {location && (
          <Text style={styles.location}>
            GPS Check Out: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
          </Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo</Text>
          {photo && <Image source={{ uri: photo }} style={styles.imagePreview} />}
          <Button title={photo ? "Retake Photo" : "Take Photo"} onPress={takePhoto} variant="secondary" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Note</Text>
          {audioUri && <Text style={styles.successText}>Voice note recorded!</Text>}
          <Button
            title={recording ? "Stop Recording" : "Record Voice Note"}
            onPress={recording ? stopRecording : startRecording}
            variant={recording ? "outline" : "secondary"}
          />
        </View>

        <Button title="Check Out & Complete" onPress={handleComplete} style={styles.completeButton} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    color: '#334155',
  },
  location: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 16,
    fontWeight: '500',
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  successText: {
    color: '#16a34a',
    marginBottom: 8,
  },
  completeButton: {
    marginTop: 24,
  },
});
