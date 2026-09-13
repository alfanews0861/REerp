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
import { Users, User, Shield } from 'lucide-react-native';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  branch?: string;
}

export const MyNetworkScreen: React.FC = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const { db } = getFirebaseInstance();
      if (!db || !user?.uid) {
        setTeamMembers([]);
        return;
      }

      const usersRef = collection(db, 'users');
      let snap;

      try {
        // Query users reporting to current user or in same branch
        const q = query(usersRef, where('reportsTo', '==', user.uid), limit(25));
        snap = await getDocs(q);
        if (snap.empty) {
          // If no direct reportees, fetch active sales colleagues
          snap = await getDocs(query(usersRef, limit(15)));
        }
      } catch {
        snap = await getDocs(query(usersRef, limit(15)));
      }

      const list: TeamMember[] = [];
      snap.forEach((docSnap) => {
        if (docSnap.id === user.uid) return; // Skip self in team list
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.displayName || data.fullName || data.name || 'Team Agent',
          role: (data.role || 'Sales Executive').replace(/_/g, ' ').toUpperCase(),
          phone: data.phoneNumber || data.phone,
          email: data.email,
          branch: data.branch || 'Hyderabad',
        });
      });

      setTeamMembers(list);
    } catch (err) {
      console.warn('Error fetching team network:', err);
      setTeamMembers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTeam();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Network & Team</Text>

      {/* User Hierarchy Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.profileName}>{user?.displayName || 'Active Agent'}</Text>
            <Text style={styles.email}>{user?.email || 'agent@reerp.com'}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {(user?.role || 'Sales Executive').replace(/_/g, ' ').toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.label}>
          Assigned Branch: <Text style={styles.value}>{user?.branch || 'Hyderabad Main Office'}</Text>
        </Text>
        <Text style={styles.label}>
          Team Members / Colleagues: <Text style={styles.value}>{teamMembers.length} Active</Text>
        </Text>
      </View>

      <Text style={styles.subHeader}>My Team Members ({teamMembers.length})</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading team network...</Text>
        </View>
      ) : teamMembers.length === 0 ? (
        <View style={styles.center}>
          <Users size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No Team Members Found</Text>
          <Text style={styles.emptySub}>
            Direct reportees and branch colleagues will appear here when configured in the Admin Portal.
          </Text>
        </View>
      ) : (
        <FlatList
          data={teamMembers}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <View style={styles.avatarMini}>
                <User size={18} color="#2563eb" />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemRole}>{item.role}</Text>
                {item.phone && <Text style={styles.phoneText}>{item.phone}</Text>}
              </View>
              <View style={styles.branchBadge}>
                <Text style={styles.branchBadgeText}>{item.branch}</Text>
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
  header: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileName: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  email: { fontSize: 13, color: '#64748b', marginTop: 2 },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: '#1e40af', fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  label: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  value: { color: '#0f172a', fontWeight: '700' },
  subHeader: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  itemRole: { fontSize: 12, color: '#64748b', marginTop: 2 },
  phoneText: { fontSize: 12, color: '#2563eb', marginTop: 2 },
  branchBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  branchBadgeText: { fontSize: 11, color: '#475569', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});

export default MyNetworkScreen;
