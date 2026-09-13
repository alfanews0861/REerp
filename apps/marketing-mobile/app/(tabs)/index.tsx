import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import { useMobileTheme } from '../../src/theme';
import { getFirebaseInstance, collection, query, where, getDocs, limit } from '../../src/services/firebase';
import {
  LogOut,
  User,
  MapPin,
  Users,
  PhoneCall,
  Clock,
  CheckCircle2,
  Car,
  TrendingUp,
  Award,
  CalendarCheck,
  Receipt,
  Sparkles,
  Globe,
  Crown,
  Layers,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colors, isDark } = useMobileTheme();

  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const userRole = (user?.cadre || user?.role || 'sales_executive').toLowerCase();
  const isAdmin =
    userRole.includes('admin') ||
    userRole.includes('director') ||
    userRole.includes('super_admin') ||
    userRole.includes('ceo');
  const isTelecaller = !isAdmin && userRole.includes('telecaller');
  const isDriver = !isAdmin && userRole.includes('driver');
  const isManager =
    !isAdmin &&
    (userRole.includes('manager') ||
      userRole.includes('team_lead') ||
      userRole.includes('cgm') ||
      userRole.includes('gm'));

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
        } catch {
          const allLeadsSnap = await getDocs(query(collection(db, 'leads'), limit(20)));
          setLeadCount(allLeadsSnap.size);
        }

        // Query assigned visits
        try {
          const visitsQuery = query(collection(db, 'site_visits'), limit(20));
          const visitsSnap = await getDocs(visitsQuery);
          setVisitCount(visitsSnap.size);
        } catch {
          setVisitCount(0);
        }
      } else {
        setLeadCount(isAdmin ? 186 : isTelecaller ? 18 : 24);
        setVisitCount(isAdmin ? 14 : 3);
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
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* User Header Profile Card with Public Website Switcher */}
      <View style={styles.userProfileCard}>
        <View style={styles.userInfoRow}>
          <View style={styles.avatar}>
            {isAdmin ? <Crown size={26} color="#F59E0B" /> : <User size={26} color="#ffffff" />}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.displayName || 'Active Agent'}</Text>
            <View style={styles.roleRow}>
              <Badge
                label={formatRole(user?.cadre || user?.role)}
                variant={isAdmin ? 'gold' : 'gold'}
                size="small"
              />
              {user?.branch && <Text style={styles.branchText}>• {user.branch}</Text>}
            </View>
          </View>

          {/* Quick Header Actions: Public Site & Logout */}
          <View style={styles.headerBtnGroup}>
            <TouchableOpacity
              style={styles.publicSiteBtn}
              onPress={() => router.push('/public-site')}
              activeOpacity={0.8}
            >
              <Globe size={13} color="#38BDF8" />
              <Text style={styles.publicSiteText}>Public Site</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={async () => {
                await logout();
                router.replace('/login');
              }}
            >
              <LogOut size={13} color="#F87171" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Cadre Header Banner */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {isAdmin
            ? '👑 Executive Command Center'
            : isTelecaller
            ? '🎧 Telecaller Calling Hub'
            : isDriver
            ? '🚗 Fleet & Driver Console'
            : isManager
            ? '👔 Management & Team Pipeline'
            : '🏃 Field Agent & Marketing Desk'}
        </Text>
        <Sparkles size={18} color={colors.secondary} />
      </View>

      {/* 0. SUPER ADMIN / EXECUTIVE COMMAND CENTER KPI CARDS */}
      {isAdmin && (
        <View style={styles.gridWrapper}>
          <View style={styles.cardRow}>
            <View style={[styles.largeMetricCard, { backgroundColor: '#1E3A8A' }]}>
              <View style={styles.metricIconCircle}>
                <TrendingUp size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.largeMetricNumber}>₹ 18.5 Cr</Text>
              <Text style={styles.largeMetricLabel}>Realized Revenue (92% Target)</Text>
            </View>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#059669' }]}
              onPress={() => router.push('/inventory')}
            >
              <View style={styles.metricIconCircle}>
                <Layers size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.largeMetricNumber}>142 / 210</Text>
              <Text style={styles.largeMetricLabel}>Plots Sold / Booked</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#7C3AED' }]}
              onPress={() => router.push('/leads')}
            >
              <View style={styles.metricIconCircle}>
                <Users size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.largeMetricNumber}>
                {loadingStats ? <ActivityIndicator size="small" color="#FFFFFF" /> : leadCount ?? 186}
              </Text>
              <Text style={styles.largeMetricLabel}>Active CRM Leads</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#D97706' }]}
              onPress={() => router.push('/visits')}
            >
              <View style={styles.metricIconCircle}>
                <MapPin size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.largeMetricNumber}>{visitCount ?? 14}</Text>
              <Text style={styles.largeMetricLabel}>Site Visits Today</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 1. TELECALLER COLORFUL KPI CARDS */}
      {isTelecaller && (
        <View style={styles.gridWrapper}>
          <View style={styles.cardRow}>
            <View style={[styles.largeMetricCard, { backgroundColor: '#4f46e5' }]}>
              <View style={styles.metricIconCircle}>
                <PhoneCall size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>68 / 80</Text>
              <Text style={styles.largeMetricLabel}>Today's Call Target (85%)</Text>
            </View>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#0284c7' }]}
              onPress={() => router.push('/leads')}
            >
              <View style={styles.metricIconCircle}>
                <Clock size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>{loadingStats ? '...' : leadCount ?? 18}</Text>
              <Text style={styles.largeMetricLabel}>Follow-ups Today</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <View style={[styles.largeMetricCard, { backgroundColor: '#059669' }]}>
              <View style={styles.metricIconCircle}>
                <CheckCircle2 size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>12</Text>
              <Text style={styles.largeMetricLabel}>High-Intent Qualified</Text>
            </View>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#d97706' }]}
              onPress={() => router.push('/visits')}
            >
              <View style={styles.metricIconCircle}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>{visitCount ?? 6}</Text>
              <Text style={styles.largeMetricLabel}>Site Visits Booked</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. FIELD AGENT / MARKETING PERSON COLORFUL KPI CARDS */}
      {!isAdmin && !isTelecaller && !isDriver && !isManager && (
        <View style={styles.gridWrapper}>
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#2563eb' }]}
              onPress={() => router.push('/leads')}
            >
              <View style={styles.metricIconCircle}>
                <Users size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>
                {loadingStats ? <ActivityIndicator size="small" color="#ffffff" /> : leadCount ?? 24}
              </Text>
              <Text style={styles.largeMetricLabel}>My Assigned Leads</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#059669' }]}
              onPress={() => router.push('/visits')}
            >
              <View style={styles.metricIconCircle}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>{visitCount ?? 3}</Text>
              <Text style={styles.largeMetricLabel}>Site Visits Today</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#d97706' }]}
              onPress={() => router.push('/commission')}
            >
              <View style={styles.metricIconCircle}>
                <Award size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>₹ 1.85 L</Text>
              <Text style={styles.largeMetricLabel}>Earned Commission</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#7c3aed' }]}
              onPress={() => router.push('/attendance')}
            >
              <View style={styles.metricIconCircle}>
                <CalendarCheck size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>Punched</Text>
              <Text style={styles.largeMetricLabel}>Geo-Shift Status</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. MANAGER / LEADERSHIP KPI CARDS */}
      {isManager && (
        <View style={styles.gridWrapper}>
          <View style={styles.cardRow}>
            <View style={[styles.largeMetricCard, { backgroundColor: '#1d4ed8' }]}>
              <View style={styles.metricIconCircle}>
                <TrendingUp size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>₹ 14.2 Cr</Text>
              <Text style={styles.largeMetricLabel}>Team Pipeline Value</Text>
            </View>

            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#047857' }]}
              onPress={() => router.push('/visits')}
            >
              <View style={styles.metricIconCircle}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>28</Text>
              <Text style={styles.largeMetricLabel}>Team Visits Scheduled</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#6d28d9' }]}
              onPress={() => router.push('/network')}
            >
              <View style={styles.metricIconCircle}>
                <Users size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>16</Text>
              <Text style={styles.largeMetricLabel}>Active Downline Associates</Text>
            </TouchableOpacity>

            <View style={[styles.largeMetricCard, { backgroundColor: '#b45309' }]}>
              <View style={styles.metricIconCircle}>
                <Award size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>84.5%</Text>
              <Text style={styles.largeMetricLabel}>Monthly Target Met</Text>
            </View>
          </View>
        </View>
      )}

      {/* 4. DRIVER KPI CARDS */}
      {isDriver && (
        <View style={styles.gridWrapper}>
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#2563eb' }]}
              onPress={() => router.push('/trips')}
            >
              <View style={styles.metricIconCircle}>
                <Car size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>4</Text>
              <Text style={styles.largeMetricLabel}>Assigned Trips Today</Text>
            </TouchableOpacity>

            <View style={[styles.largeMetricCard, { backgroundColor: '#059669' }]}>
              <View style={styles.metricIconCircle}>
                <MapPin size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>480 KM</Text>
              <Text style={styles.largeMetricLabel}>Total KM Logged</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity
              style={[styles.largeMetricCard, { backgroundColor: '#d97706' }]}
              onPress={() => router.push('/expenses')}
            >
              <View style={styles.metricIconCircle}>
                <Receipt size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>₹ 8,450</Text>
              <Text style={styles.largeMetricLabel}>Fuel Expense Logged</Text>
            </TouchableOpacity>

            <View style={[styles.largeMetricCard, { backgroundColor: '#7c3aed' }]}>
              <View style={styles.metricIconCircle}>
                <CheckCircle2 size={20} color="#ffffff" />
              </View>
              <Text style={styles.largeMetricNumber}>100%</Text>
              <Text style={styles.largeMetricLabel}>On-Time Drop Rate</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quick Action Navigation Grid */}
      <Card title="⚡ Quick Operational Actions" style={styles.card}>
        <View style={styles.buttonRow}>
          <Button
            title="Plot Inventory"
            onPress={() => router.push('/inventory')}
            style={styles.actionButton}
          />
          <Button
            title="Leads Queue"
            onPress={() => router.push('/leads')}
            style={styles.actionButton}
          />
        </View>
        <View style={[styles.buttonRow, { marginTop: 10 }]}>
          <Button
            title="Site Visits"
            onPress={() => router.push('/visits')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="🌐 Public Website"
            onPress={() => router.push('/public-site')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
        <View style={[styles.buttonRow, { marginTop: 10 }]}>
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

      <View style={{ height: 35 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userProfileCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1E40AF',
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  branchText: {
    fontSize: 11,
    color: '#94A3B8',
    marginLeft: 6,
    fontWeight: '500',
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  publicSiteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  publicSiteText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  logoutText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  gridWrapper: {
    gap: 12,
    marginBottom: 18,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  largeMetricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'space-between',
    minHeight: 125,
  },
  metricIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  largeMetricNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  largeMetricLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.92)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  card: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});
