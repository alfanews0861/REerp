import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import { getFirebaseInstance, collection, query, where, getDocs, limit } from '../../src/services/firebase';
import { LogOut, User, MapPin, Users, Calendar, Award } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveStats = async () => {
    if (!user) return;
    setLoadingStats(true);
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        // Query assigned leads
        try {
          const leadsQuery = query(
            collection(db, 'leads'),
            where('assignedTo', '==', user.uid),
            limit(50)
          );
          const leadsSnap = await getDocs(leadsQuery);
          setLeadCount(leadsSnap.size);
        } catch (e) {
          // Fallback query if assignedTo not indexed
          const allLeadsSnap = await getDocs(query(collection(db, 'leads'), limit(20)));
          setLeadCount(allLeadsSnap.size);
        }

        // Query assigned visits
        try {
          const visitsQuery = query(
            collection(db, 'site_visits'),
            limit(20)
          );
          const visitsSnap = await getDocs(visitsQuery);
          setVisitCount(visitsSnap.size);
        } catch (e) {
          setVisitCount(0);
        }
      } else {
        setLeadCount(0);
        setVisitCount(0);
      }
    } catch (err) {
      console.warn('Stats fetch notice:', err);
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLiveStats();
  };

  const formatRole = (role?: string) => {
    if (!role) return 'Field Agent';
    return role.replace(/_/g, ' ').toUpperCase();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}
    >
      {/* Logged-in User Header Card */}
      <View style={styles.userProfileCard}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatar}>
            <User size={24} color="#ffffff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.displayName || 'Active Agent'}</Text>
            <View style={styles.roleRow}>
              <Text style={styles.roleBadge}>{formatRole(user?.role)}</Text>
              {user?.branch && <Text style={styles.branchText}>• {user.branch}</Text>}
            </View>
          </View>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await logout();
              router.replace('/login');
            }}
          >
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.header}>Today's Live Workspace</Text>

      {/* Quick Status Cards */}
      <View style={styles.metricsGrid}>
        <TouchableOpacity
          style={[styles.metricBox, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}
          onPress={() => router.push('/leads')}
        >
          <Users size={24} color="#2563eb" />
          <Text style={styles.metricNumber}>
            {loadingStats ? <ActivityIndicator size="small" color="#2563eb" /> : leadCount ?? 0}
          </Text>
          <Text style={styles.metricLabel}>Assigned Leads</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metricBox, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}
          onPress={() => router.push('/visits')}
        >
          <MapPin size={24} color="#16a34a" />
          <Text style={styles.metricNumber}>
            {loadingStats ? <ActivityIndicator size="small" color="#16a34a" /> : visitCount ?? 0}
          </Text>
          <Text style={styles.metricLabel}>Site Visits</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Tasks */}
      <Card title="Today's Operational Actions" style={styles.card}>
        <Text style={styles.taskItem}>✓ Verify your daily shift via GPS Attendance</Text>
        <Text style={styles.taskItem}>✓ Follow up with pending high-priority leads</Text>
        <Text style={styles.taskItem}>✓ Log customer visits and client site tours</Text>
      </Card>

      {/* Network & Commission Navigation */}
      <Card title="My Sales & Team Hierarchy" style={styles.card}>
        <Text style={styles.subText}>View your earned commissions and managed downline hierarchy.</Text>
        <View style={styles.buttonRow}>
          <Button
            title="My Commissions"
            onPress={() => router.push('/commission')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="Team & Network"
            onPress={() => router.push('/network')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </Card>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  userProfileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  branchText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#450a0a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  card: {
    marginBottom: 16,
  },
  taskItem: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 6,
    lineHeight: 20,
  },
  subText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});
