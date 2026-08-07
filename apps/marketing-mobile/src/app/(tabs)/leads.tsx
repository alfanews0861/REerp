import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';

const MOCK_LEADS = [
  { id: '1', name: 'Alice Smith', status: 'New', phone: '+1234567890' },
  { id: '2', name: 'Bob Johnson', status: 'Follow Up', phone: '+0987654321' },
];

export default function LeadsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_LEADS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Button
              title="View Details"
              onPress={() => router.push(`/lead/${item.id}`)}
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
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  status: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});
