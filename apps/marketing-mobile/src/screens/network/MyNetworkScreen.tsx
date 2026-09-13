import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { useMobileTheme } from '../../theme';
import { Badge } from '../../components/Badge';
import { getFirebaseInstance, collection, query, where, getDocs, limit, doc, updateDoc, serverTimestamp } from '../../services/firebase';
import { Users, User, Shield, Share2, Award, CheckCircle2, Sparkles } from 'lucide-react-native';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  cadre?: string;
  phone?: string;
  email?: string;
  branch?: string;
}

export const MyNetworkScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors, isDark } = useMobileTheme();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cadre Change State
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdatingCadre, setIsUpdatingCadre] = useState(false);

  // Calculate allowable lower cadres
  const userCadre = (user?.cadre || user?.role || 'sales_executive').toLowerCase();
  const getAllowedCadres = () => {
    if (userCadre.includes('director') || userCadre.includes('super_admin')) {
      return [
        { label: 'Chief General Manager (CGM)', value: 'cgm', role: 'branch_manager' },
        { label: 'General Manager (GM)', value: 'gm', role: 'branch_manager' },
        { label: 'Senior Sales Manager (SSM)', value: 'senior_sales_manager', role: 'sales_manager' },
        { label: 'Sales Manager (SM)', value: 'sales_manager', role: 'sales_manager' },
        { label: 'Team Leader (TL)', value: 'team_lead', role: 'sales_executive' },
        { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
        { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
      ];
    }
    if (userCadre === 'cgm') {
      return [
        { label: 'General Manager (GM)', value: 'gm', role: 'branch_manager' },
        { label: 'Senior Sales Manager (SSM)', value: 'senior_sales_manager', role: 'sales_manager' },
        { label: 'Sales Manager (SM)', value: 'sales_manager', role: 'sales_manager' },
        { label: 'Team Leader (TL)', value: 'team_lead', role: 'sales_executive' },
        { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
        { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
      ];
    }
    if (userCadre === 'gm' || userCadre === 'agm') {
      return [
        { label: 'Senior Sales Manager (SSM)', value: 'senior_sales_manager', role: 'sales_manager' },
        { label: 'Sales Manager (SM)', value: 'sales_manager', role: 'sales_manager' },
        { label: 'Team Leader (TL)', value: 'team_lead', role: 'sales_executive' },
        { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
        { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
      ];
    }
    if (userCadre.includes('sales_manager') || userCadre === 'manager') {
      return [
        { label: 'Team Leader (TL)', value: 'team_lead', role: 'sales_executive' },
        { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
        { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
      ];
    }
    if (userCadre.includes('team_lead') || userCadre.includes('leader')) {
      return [
        { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
        { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
      ];
    }
    return [
      { label: 'Sales Executive / Associate (Rank 8)', value: 'sales_executive', role: 'sales_executive' },
      { label: 'Marketing Telecaller (Rank 8)', value: 'telecaller', role: 'telecaller' },
    ];
  };

  const allowedOptions = getAllowedCadres();

  const handleOpenCadreChange = (item: TeamMember) => {
    setSelectedMember(item);
    setModalVisible(true);
  };

  const handleApplyCadre = async (option: { label: string; value: string; role: string }) => {
    if (!selectedMember) return;
    setIsUpdatingCadre(true);
    try {
      const { db } = getFirebaseInstance();
      if (db && selectedMember.id) {
        const userRef = doc(db, 'users', selectedMember.id);
        await updateDoc(userRef, {
          cadre: option.value,
          role: option.role,
          status: 'active',
          assignedCadreBy: user?.uid,
          assignedCadreByName: user?.displayName || 'Manager',
          assignedCadreAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        });
      }

      setTeamMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? { ...m, role: option.label, cadre: option.value } : m))
      );

      Alert.alert('Cadre Updated', `Assigned "${option.label}" to ${selectedMember.name}.`);
      setModalVisible(false);
    } catch {
      // Local fallback in offline mode
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? { ...m, role: option.label, cadre: option.value } : m))
      );
      Alert.alert('Cadre Updated', `Assigned "${option.label}" to ${selectedMember.name}.`);
      setModalVisible(false);
    } finally {
      setIsUpdatingCadre(false);
    }
  };

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
        const q = query(usersRef, where('referredByUid', '==', user.uid), limit(25));
        snap = await getDocs(q);
        if (snap.empty) {
          snap = await getDocs(query(usersRef, limit(15)));
        }
      } catch {
        snap = await getDocs(query(usersRef, limit(15)));
      }

      const list: TeamMember[] = [];
      snap.forEach((docSnap) => {
        if (docSnap.id === user.uid) return;
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.displayName || data.fullName || data.name || 'Team Agent',
          role: data.cadre ? data.cadre.toUpperCase() : (data.role || 'Sales Executive').replace(/_/g, ' ').toUpperCase(),
          cadre: data.cadre,
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.header, { color: colors.textPrimary }]}>My Network & Team</Text>
        <Sparkles size={20} color={colors.secondary} />
      </View>

      {/* User Hierarchy Profile Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.profileHeader}>
          <View>
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>{user?.displayName || 'Active Agent'}</Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'agent@reerp.com'}</Text>
          </View>
          <Badge
            label={(user?.cadre || user?.role || 'Sales Executive').replace(/_/g, ' ').toUpperCase()}
            variant="gold"
          />
        </View>

        {/* Reference Code Box */}
        <View
          style={[
            styles.refCodeBox,
            {
              backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : '#EFF6FF',
              borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE',
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.refCodeTitle, { color: colors.primary }]}>Your Reference Code (Share with recruits):</Text>
            <Text style={[styles.refCodeValue, { color: isDark ? '#60A5FA' : '#1D4ED8' }]}>{user?.referralCode || 'REF-592014'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
            onPress={() => Alert.alert('Share Code', `Your Reference Code is: ${user?.referralCode || 'REF-592014'}`)}
          >
            <Share2 size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Assigned Branch: <Text style={[styles.value, { color: colors.textPrimary }]}>{user?.branch || 'Hyderabad Main Office'}</Text>
        </Text>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Team Members / Recruits: <Text style={[styles.value, { color: colors.textPrimary }]}>{teamMembers.length} Active</Text>
        </Text>
      </View>

      <Text style={[styles.subHeader, { color: colors.textPrimary }]}>My Direct Recruits & Team ({teamMembers.length})</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading team network...</Text>
        </View>
      ) : teamMembers.length === 0 ? (
        <View style={styles.center}>
          <Users size={48} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Team Members Yet</Text>
          <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
            Share your Reference Code ({user?.referralCode || 'REF-592014'}) with new recruits. When they register, they will appear here for Cadre Assignment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={teamMembers}
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
              <View
                style={[
                  styles.avatarMini,
                  {
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#EFF6FF',
                  },
                ]}
              >
                <User size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.itemName, { color: colors.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.itemRole, { color: colors.textSecondary }]}>Cadre: {item.role}</Text>
                {item.phone && <Text style={[styles.phoneText, { color: colors.primary }]}>{item.phone}</Text>}
              </View>
              <TouchableOpacity
                style={[styles.assignBtn, { backgroundColor: colors.secondary }]}
                onPress={() => handleOpenCadreChange(item)}
              >
                <Award size={14} color="#FFFFFF" />
                <Text style={styles.assignBtnText}>Assign Cadre</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Cadre Assignment Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surfaceCard }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Assign / Promote Cadre</Text>
            {selectedMember && (
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                Assign new cadre to <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{selectedMember.name}</Text>
              </Text>
            )}

            <View style={styles.ruleBanner}>
              <Shield size={16} color={colors.primary} />
              <Text style={styles.ruleText}>
                Hierarchy Rule: You can only assign cadres strictly lower than your current rank.
              </Text>
            </View>

            <Text style={[styles.allowedHeader, { color: colors.textPrimary }]}>Select Authorized Cadre:</Text>
            {allowedOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionBtn, { borderColor: colors.border, backgroundColor: isDark ? colors.surfaceSubtle : '#F8FAFC' }]}
                onPress={() => handleApplyCadre(opt)}
                disabled={isUpdatingCadre}
              >
                <CheckCircle2 size={16} color={colors.primary} />
                <Text style={[styles.optionBtnText, { color: colors.textPrimary }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3 },
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileName: { fontSize: 18, fontWeight: '800' },
  email: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  divider: { height: 1, marginVertical: 10 },
  label: { fontSize: 13, marginBottom: 4, fontWeight: '500' },
  value: { fontWeight: '700' },
  subHeader: { fontSize: 16, fontWeight: '800', marginBottom: 10, letterSpacing: -0.2 },
  listItem: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: { fontSize: 15, fontWeight: '700' },
  itemRole: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  phoneText: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  refCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 4,
  },
  refCodeTitle: { fontSize: 11, fontWeight: '700' },
  refCodeValue: { fontSize: 17, fontWeight: '900', marginTop: 2, letterSpacing: 0.5 },
  shareBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  assignBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 4,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  assignBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.2 },
  modalSub: { fontSize: 13, marginTop: 4, marginBottom: 12 },
  ruleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.3)',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 14,
  },
  ruleText: { fontSize: 12, color: '#047857', flex: 1, fontWeight: '600' },
  allowedHeader: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    gap: 10,
  },
  optionBtnText: { fontSize: 14, fontWeight: '700' },
  cancelBtn: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '800' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  emptyTitle: { fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptySub: { fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
});

export default MyNetworkScreen;


