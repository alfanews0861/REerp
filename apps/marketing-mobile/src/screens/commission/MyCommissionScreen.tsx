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
import { useMobileTheme } from '../../theme';
import { Badge } from '../../components/Badge';
import { getFirebaseInstance, collection, query, where, getDocs, limit } from '../../services/firebase';
import { Award, IndianRupee, Sparkles } from 'lucide-react-native';

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
  const { colors, isDark } = useMobileTheme();
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleRow}>
        <View>
          <Text style={[styles.header, { color: colors.textPrimary }]}>My Commissions</Text>
          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            Earnings for {user?.displayName || 'Active Agent'}
          </Text>
        </View>
        <Sparkles size={22} color={colors.secondary} />
      </View>

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

      <Text style={[styles.subHeader, { color: colors.textPrimary }]}>Transaction History</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading commission records...
          </Text>
        </View>
      ) : commissions.length === 0 ? (
        <View style={styles.center}>
          <Award size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Commission Records</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            Commissions will automatically populate here as your plot bookings are approved.
          </Text>
        </View>
      ) : (
        <FlatList
          data={commissions}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.listItem,
                {
                  backgroundColor: colors.surfaceCard,
                  borderColor: colors.border,
                },
              ]}
            >
              <View>
                <Text style={[styles.bookingId, { color: colors.textPrimary }]}>{item.bookingId}</Text>
                {item.projectName && (
                  <Text style={[styles.projectName, { color: colors.textSecondary }]}>
                    {item.projectName}
                  </Text>
                )}
                <View style={{ marginTop: 6 }}>
                  <Badge
                    label={item.status}
                    variant={item.status === 'PAID' ? 'emerald' : 'gold'}
                    size="small"
                  />
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.amount, { color: colors.textPrimary }]}>
                  {formatCurrency(item.amount)}
                </Text>
                {item.date && (
                  <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.date}</Text>
                )}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  header: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3 },
  subTitle: { fontSize: 13, marginTop: 2 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  paidCard: { backgroundColor: '#059669' },
  pendingCard: { backgroundColor: '#D97706' },
  summaryLabel: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4 },
  summaryValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 4, letterSpacing: -0.5 },
  subHeader: { fontSize: 16, fontWeight: '800', marginBottom: 12, letterSpacing: -0.2 },
  listItem: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  bookingId: { fontSize: 15, fontWeight: '800' },
  projectName: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  amount: { fontSize: 17, fontWeight: '900', letterSpacing: -0.3 },
  dateText: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptySub: { fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
});

export default MyCommissionScreen;

