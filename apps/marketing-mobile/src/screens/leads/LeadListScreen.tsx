import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { getFirebaseInstance, collection, query, where, getDocs, limit, orderBy } from '../../services/firebase';
import { Search, UserCheck, Phone, Filter } from 'lucide-react-native';

export interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  assignedTo?: string;
  source?: string;
  propertyInterest?: string;
  createdAt?: string;
}

interface LeadListScreenProps {
  onSelectLead?: (leadId: string) => void;
}

export const LeadListScreen: React.FC<LeadListScreenProps> = ({ onSelectLead }) => {
  const router = useRouter();
  const { user } = useAuth();

  const [filter, setFilter] = useState<'MY_LEADS' | 'ALL'>('MY_LEADS');
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { db } = getFirebaseInstance();
      if (!db) {
        setLeads([]);
        return;
      }

      const leadsRef = collection(db, 'leads');
      let snap;

      if (filter === 'MY_LEADS' && user?.uid) {
        try {
          const q = query(leadsRef, where('assignedTo', '==', user.uid), limit(50));
          snap = await getDocs(q);
        } catch {
          // Fallback if index not yet ready
          snap = await getDocs(query(leadsRef, limit(50)));
        }
      } else {
        const q = query(leadsRef, limit(50));
        snap = await getDocs(q);
      }

      const loadedLeads: LeadItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        loadedLeads.push({
          id: docSnap.id,
          name: data.fullName || data.name || 'Unnamed Prospect',
          phone: data.phone || data.phoneNumber || 'No phone',
          email: data.email,
          status: (data.status || 'NEW').toUpperCase(),
          assignedTo: data.assignedTo || data.agentId,
          source: data.source || 'Direct',
          propertyInterest: data.propertyInterest || data.interestedProjectName,
          createdAt: data.createdAt,
        });
      });

      setLeads(loadedLeads);
    } catch (err) {
      console.warn('Error fetching Firestore leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter, user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeads();
  };

  const handleLeadPress = (id: string) => {
    if (onSelectLead) {
      onSelectLead(id);
    } else {
      router.push(`/lead/${id}`);
    }
  };

  const filteredLeads = leads.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'NEW':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'FOLLOW_UP':
      case 'CONTACTED':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'SITE_VISIT_SCHEDULED':
      case 'VISITING':
        return { bg: '#e0e7ff', text: '#4338ca' };
      case 'BOOKED':
      case 'WON':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'LOST':
      case 'CANCELLED':
        return { bg: '#fee2e2', text: '#b91c1c' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Leads Workspace</Text>
        <Text style={styles.subTitle}>
          {filter === 'MY_LEADS'
            ? `Assigned to ${user?.displayName || 'You'}`
            : 'All Company Pipeline Leads'}
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'MY_LEADS' && styles.activeBtn]}
          onPress={() => setFilter('MY_LEADS')}
        >
          <Text style={filter === 'MY_LEADS' ? styles.activeText : styles.inactiveText}>
            My Leads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'ALL' && styles.activeBtn]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={filter === 'ALL' ? styles.activeText : styles.inactiveText}>
            Team Leads
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Search size={18} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone, or status..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Leads List */}
      {loading && !refreshing ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading live Firestore leads...</Text>
        </View>
      ) : filteredLeads.length === 0 ? (
        <View style={styles.centerState}>
          <UserCheck size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No Leads Found</Text>
          <Text style={styles.emptySub}>
            {searchQuery
              ? 'No matching leads found for your search query.'
              : filter === 'MY_LEADS'
              ? 'You do not have any leads assigned currently.'
              : 'No leads available in this category.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const badge = getStatusBadgeStyle(item.status);
            return (
              <TouchableOpacity style={styles.card} onPress={() => handleLeadPress(item.id)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusText, { color: badge.text }]}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.phoneRow}>
                  <Phone size={14} color="#64748b" style={{ marginRight: 4 }} />
                  <Text style={styles.phone}>{item.phone}</Text>
                </View>

                {item.propertyInterest && (
                  <Text style={styles.interestText}>Interested in: {item.propertyInterest}</Text>
                )}
                {item.source && <Text style={styles.sourceText}>Source: {item.source}</Text>}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  subTitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeBtn: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  activeText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  inactiveText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a', padding: 0 },
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  phone: { fontSize: 14, color: '#475569' },
  interestText: { fontSize: 12, color: '#2563eb', marginTop: 6, fontWeight: '500' },
  sourceText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#334155', marginTop: 12 },
  emptySub: { fontSize: 13, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});

export default LeadListScreen;
