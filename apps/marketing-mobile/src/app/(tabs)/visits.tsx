import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

const MOCK_VISITS = [
  { id: '101', property: 'Sunset Villas', time: '10:00 AM' },
  { id: '102', property: 'Oceanview Apartments', time: '02:00 PM' },
];

export default function VisitsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_VISITS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.property}>{item.property}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <Button
              title="Start Visit"
              onPress={() => router.push({ pathname: '/visit/start', params: { visitId: item.id } })}
              style={styles.button}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  property: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  time: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
