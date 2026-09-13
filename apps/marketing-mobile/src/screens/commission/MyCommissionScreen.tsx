import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { getFirebaseInstance, collection, query, where, getDocs, limit } from '../../services/firebase';
import { Award, IndianRupee } from 'lucide-react-native';

interface CommissionItem {
  id: string;
  bookingId: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  date?: string;
  projectName?: string;
}

export const MyCommissionScreen: React.FC = () => {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<CommissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const { db } = getFirebaseInstance();
      if (!db || !user?.uid) {
        setCommissions([]);
        return;
      }

      const commRef = collection(db, 'commissions');
      let snap;

      try {
        const q = query(commRef, where('agentId', '==', user.uid), limit(50));
        snap = await getDocs(q);
      } catch {
        snap = await getDocs(query(commRef, limit(20)));
      }

      const list: CommissionItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          bookingId: data.bookingId || data.dealId || `BK-${docSnap.id.slice(0, 5)}`,
          amount: Number(data.amount || data.netCommission || data.commissionAmount || 0),
          status: (data.status === 'PAID' || data.payoutStatus === 'PAID') ? 'PAID' : 'PENDING',
          date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'Recent',
          projectName: data.projectName || data.ventureName,
        });
      });

      setCommissions(list);
    } catch (err) {
      console.warn('Error fetching commissions:', err);
      setCommissions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCommissions();
  };

  const totalPaid = commissions
    .filter((c) => c.status === 'PAID')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalPending = commissions
    .filter((c) => c.status === 'PENDING')
    .reduce((acc, c) => acc + c.amount, 0);

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Commissions</Text>
      <Text style={styles.subTitle}>Earnings for {user?.displayName || 'Active Agent'}</Text>

      {/* Summary Row */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, styles.paidCard]}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPaid)}</Text>
        </View>
        <View style={[styles.summaryCard, styles.pendingCard]}>
          <Text style={styles.summaryLabel}>Pending Payout</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalPending)}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Transaction History</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading commission records...</Text>
        </View>
      ) : commissions.length === 0 ? (
        <View style={styles.center}>
          <Award size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No Commission Records</Text>
          <Text style={styles.emptySub}>
            Commissions will automatically populate here as your plot bookings are approved.
          </Text>
        </View>
      ) : (
        <FlatList
          data={commissions}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.bookingId}>{item.bookingId}</Text>
                {item.projectName && <Text style={styles.projectName}>{item.projectName}</Text>}
                <Text style={item.status === 'PAID' ? styles.statusPaid : styles.statusPending}>
                  {item.status}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
                {item.date && <Text style={styles.dateText}>{item.date}</Text>}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  header: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subTitle: { fontSize: 13, color: '#64748b', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center' },
  paidCard: { backgroundColor: '#4338ca' },
  pendingCard: { backgroundColor: '#d97706' },
  summaryLabel: { color: '#e0e7ff', fontSize: 13, fontWeight: '600' },
  summaryValue: { color: '#ffffff', fontSize: 20, fontWeight: '800', marginTop: 4 },
  subHeader: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bookingId: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  projectName: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusPaid: { fontSize: 11, fontWeight: '800', color: '#16a34a', marginTop: 4 },
  statusPending: { fontSize: 11, fontWeight: '800', color: '#d97706', marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  dateText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});

export default MyCommissionScreen;
