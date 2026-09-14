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
import { useMobileTheme } from '../../theme';
import { Badge } from '../../components/Badge';
import { getFirebaseInstance, collection, query, where, getDocs, limit, orderBy } from '../../services/firebase';
import { Search, UserCheck, Phone, Sparkles, UserPlus, Plus } from 'lucide-react-native';
import { AddLeadModal } from './components/AddLeadModal';

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
  const { colors, isDark } = useMobileTheme();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const userRole = (user?.cadre || user?.role || '').toLowerCase();
  const isAdminOrManager =
    userRole.includes('admin') ||
    userRole.includes('director') ||
    userRole.includes('super_admin') ||
    userRole.includes('manager') ||
    userRole.includes('gm') ||
    userRole.includes('cgm');

  const [filter, setFilter] = useState<'MY_LEADS' | 'ALL'>(isAdminOrManager ? 'ALL' : 'MY_LEADS');
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

      const isTelecaller = userRole.includes('telecaller');

      if (isTelecaller && user?.uid) {
        // Telecaller isolation: Telecallers ONLY see leads assigned directly to them
        try {
          const q = query(leadsRef, where('assignedTo', '==', user.uid), limit(50));
          snap = await getDocs(q);
        } catch {
          snap = await getDocs(query(leadsRef, limit(50)));
        }
      } else if (filter === 'MY_LEADS' && user?.uid && !isAdminOrManager) {
        try {
          const q = query(leadsRef, where('assignedTo', '==', user.uid), limit(50));
          snap = await getDocs(q);
        } catch {
          snap = await getDocs(query(leadsRef, limit(50)));
        }
      } else {
        const q = query(leadsRef, limit(50));
        snap = await getDocs(q);
      }

      const loadedLeads: LeadItem[] = [];
      if (snap && !snap.empty) {
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Lead isolation verification:
          if (isTelecaller && user?.uid) {
            if (data.assignedTo && data.assignedTo !== user.uid && data.assignedTelecallerId !== user.uid) {
              return;
            }
          }

          loadedLeads.push({
            id: docSnap.id,
            name: data.fullName || data.name || data.customerName || 'Unnamed Prospect',
            phone: data.phone || data.phoneNumber || 'No phone',
            email: data.email,
            status: (data.status || 'NEW').toUpperCase(),
            assignedTo: data.assignedTo || data.agentId,
            source: data.source || (data.bookingRef ? 'Public Website' : 'Direct CRM'),
            propertyInterest: data.projectName || data.propertyInterest || data.interestedProjectName || 'Open Venture Enquiry',
            createdAt: data.createdAt,
          });
        });
      }

      setLeads(loadedLeads);
    } catch (err) {
      console.warn('Error fetching leads:', err);
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

  const isTelecallerUser = (user?.cadre || user?.role || '').toLowerCase().includes('telecaller');

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.status.toLowerCase().includes(q) ||
      (lead.propertyInterest && lead.propertyInterest.toLowerCase().includes(q))
    );
  });

  const handleLeadPress = (leadId: string) => {
    if (onSelectLead) {
      onSelectLead(leadId);
    } else {
      router.push(`/lead/${leadId}`);
    }
  };

  const getStatusBadgeVariant = (status: string): 'primary' | 'gold' | 'emerald' | 'error' | 'info' | 'neutral' => {
    switch (status) {
      case 'NEW':
      case 'FRESH':
        return 'info';
      case 'CONTACTED':
      case 'FOLLOW_UP':
        return 'gold';
      case 'SITE_VISIT_SCHEDULED':
      case 'SITE_VISIT_COMPLETED':
        return 'primary';
      case 'BOOKED':
      case 'WON':
        return 'emerald';
      case 'LOST':
      case 'CANCELLED':
        return 'error';
      default:
        return 'neutral';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surfaceCard,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Leads Workspace</Text>
            <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
              {isTelecallerUser
                ? '🔒 Telecaller Private Pool (Strictly Isolated)'
                : filter === 'MY_LEADS'
                ? `Assigned to ${user?.displayName || 'You'}`
                : 'Direct Team & Appointed Telecaller Leads'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerAddBtn}
            onPress={() => setIsAddModalOpen(true)}
            activeOpacity={0.8}
          >
            <UserPlus size={16} color="#FFFFFF" />
            <Text style={styles.headerAddBtnText}>+ Add Lead</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      {!isTelecallerUser && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { borderColor: colors.border, backgroundColor: colors.surfaceCard },
              filter === 'MY_LEADS' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilter('MY_LEADS')}
          >
            <Text
              style={[
                styles.inactiveText,
                { color: colors.textSecondary },
                filter === 'MY_LEADS' && { color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              My Leads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterBtn,
              { borderColor: colors.border, backgroundColor: colors.surfaceCard },
              filter === 'ALL' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilter('ALL')}
          >
            <Text
              style={[
                styles.inactiveText,
                { color: colors.textSecondary },
                filter === 'ALL' && { color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              Team & Telecaller Leads
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Input */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
          },
        ]}
      >
        <Search size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search by name, phone, or status..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Leads List */}
      {loading && !refreshing ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading live Firestore leads...</Text>
        </View>
      ) : filteredLeads.length === 0 ? (
        <View style={styles.centerState}>
          <UserCheck size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Leads Found</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            {searchQuery
              ? 'No matching leads found for your search query.'
              : filter === 'MY_LEADS'
              ? 'మీరు ఇంకా స్వంత కస్టమర్ లీడ్స్‌ను జోడించలేదు. ఇప్పుడే కొత్త లీడ్‌ను జోడించండి!'
              : 'No leads found in this category.'}
          </Text>

          <TouchableOpacity
            style={[styles.switchBtn, { backgroundColor: '#1E40AF', marginTop: 14 }]}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Text style={styles.switchBtnText}>+ Add New Customer Lead</Text>
          </TouchableOpacity>

          {filter === 'MY_LEADS' && !isTelecallerUser && (
            <TouchableOpacity
              style={[styles.switchBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border, marginTop: 8 }]}
              onPress={() => setFilter('ALL')}
            >
              <Text style={[styles.switchBtnText, { color: colors.textSecondary }]}>View All Team & Website Leads</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => {
            const badgeVariant = getStatusBadgeVariant(item.status);
            return (
              <TouchableOpacity
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surfaceCard,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => handleLeadPress(item.id)}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.name, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Badge label={item.status} variant={badgeVariant} size="small" />
                </View>

                <View style={styles.phoneRow}>
                  <Phone size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={[styles.phone, { color: colors.textSecondary }]}>{item.phone}</Text>
                </View>

                {item.propertyInterest && (
                  <Text style={[styles.interestText, { color: colors.primary }]}>
                    Interested in: {item.propertyInterest}
                  </Text>
                )}
                {item.source && (
                  <Text style={[styles.sourceText, { color: colors.textMuted }]}>
                    Source: {item.source}
                  </Text>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Floating Action Button for Instant Lead Creation */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalOpen(true)}
        activeOpacity={0.85}
      >
        <Plus size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>Add Lead</Text>
      </TouchableOpacity>

      {/* Add Lead Bottom Sheet / Modal */}
      <AddLeadModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onLeadAdded={(newLead) => {
          setLeads((prev) => [newLead, ...prev]);
          if (filter !== 'MY_LEADS') setFilter('MY_LEADS');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3 },
  subTitle: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  filterContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  inactiveText: { fontWeight: '700', fontSize: 13 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  card: {
    padding: 15,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  phone: { fontSize: 13, fontWeight: '500' },
  interestText: { fontSize: 12, marginTop: 6, fontWeight: '600' },
  sourceText: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  centerState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptySub: { fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
  switchBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#1E40AF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12.5,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});

export default LeadListScreen;
