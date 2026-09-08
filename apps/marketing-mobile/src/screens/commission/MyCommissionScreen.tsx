import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface CommissionItem {
  id: string;
  bookingId: string;
  amount: string;
  status: 'PAID' | 'PENDING';
  date?: string;
}

export const MyCommissionScreen: React.FC = () => {
  const dummyCommissions: CommissionItem[] = [
    { id: '1', bookingId: 'BK-10293', amount: '₹15,000', status: 'PENDING', date: 'Yesterday' },
    { id: '2', bookingId: 'BK-9912', amount: '₹25,000', status: 'PAID', date: '3 days ago' },
    { id: '3', bookingId: 'BK-8741', amount: '₹1,00,000', status: 'PAID', date: '2 weeks ago' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Commissions</Text>
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.paidCard]}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>₹1,25,000</Text>
        </View>
        <View style={[styles.summaryCard, styles.pendingCard]}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={styles.summaryValue}>₹15,000</Text>
        </View>
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
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.amount}>{item.amount}</Text>
              {item.date && <Text style={styles.dateText}>{item.date}</Text>}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
  paidCard: { backgroundColor: '#4338ca' },
  pendingCard: { backgroundColor: '#d97706' },
  summaryLabel: { color: '#e0e7ff', fontSize: 13, fontWeight: '500' },
  summaryValue: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 8, marginBottom: 12 },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingId: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  amount: { fontSize: 16, fontWeight: 'bold', color: '#1f2937' },
  dateText: { fontSize: 12, color: '#64748b', marginTop: 2 },
});

const getStatusStyle = (status: 'PAID' | 'PENDING') => ({
  fontSize: 12,
  fontWeight: 'bold' as const,
  color: status === 'PAID' ? '#16a34a' : '#d97706',
  marginTop: 4,
});

export default MyCommissionScreen;
