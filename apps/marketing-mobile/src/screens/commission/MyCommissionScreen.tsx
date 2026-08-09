import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export const MyCommissionScreen = () => {
  const dummyCommissions = [
    { id: '1', bookingId: 'BK-10293', amount: '₹15,000', status: 'PENDING' },
    { id: '2', bookingId: 'BK-9912', amount: '₹25,000', status: 'PAID' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Commissions</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Earned (Paid)</Text>
        <Text style={styles.summaryValue}>₹1,25,000</Text>
      </View>
      <Text style={styles.subHeader}>Recent Transactions</Text>
      <FlatList
        data={dummyCommissions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.bookingId}>{item.bookingId}</Text>
              <Text style={getStatusStyle(item.status)}>{item.status}</Text>
            </View>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  summaryCard: { backgroundColor: '#4F46E5', padding: 20, borderRadius: 12, alignItems: 'center' },
  summaryLabel: { color: '#E0E7FF', fontSize: 14 },
  summaryValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  listItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingId: { fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' }
});

const getStatusStyle = (status: string) => ({
  fontSize: 12,
  fontWeight: 'bold' as const,
  color: status === 'PAID' ? '#16A34A' : '#D97706',
  marginTop: 4
});

export default MyCommissionScreen;
