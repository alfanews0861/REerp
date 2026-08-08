import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data
const mockVisits = [
  { id: '1', customerName: 'John Doe', status: 'SCHEDULED', time: '10:00 AM' },
  { id: '2', customerName: 'Jane Smith', status: 'COMPLETED', time: '02:00 PM' },
];

export default function VisitsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockVisits[0] }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/visits/${item.id}`)}
    >
      <Text style={styles.title}>{item.customerName}</Text>
      <Text style={styles.subtitle}>{item.status} - {item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockVisits}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});
