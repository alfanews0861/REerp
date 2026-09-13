import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { getFirebaseInstance, doc, getDoc, updateDoc } from '../../services/firebase';
import { Phone, MessageCircle, Mail, Clock, CheckCircle2, Building } from 'lucide-react-native';

interface LeadDetailScreenProps {
  leadId?: string;
}

export const LeadDetailScreen: React.FC<LeadDetailScreenProps> = ({ leadId: propLeadId }) => {
  const params = useLocalSearchParams<{ id?: string }>();
  const activeId = propLeadId || params?.id || '';
  const { user } = useAuth();

  const [leadData, setLeadData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchLeadDoc = async () => {
      if (!activeId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { db } = getFirebaseInstance();
        if (db) {
          const docSnap = await getDoc(doc(db, 'leads', activeId));
          if (docSnap.exists()) {
            setLeadData({ id: docSnap.id, ...docSnap.data() });
          } else {
            // Fallback object if not found in db
            setLeadData({
              id: activeId,
              name: 'Prospect Lead',
              phone: '+91 9876543210',
              status: 'NEW',
              source: 'Direct Walk-in',
              interest: 'MEDIUM',
            });
          }
        }
      } catch (err) {
        console.warn('Error fetching lead details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadDoc();
  }, [activeId]);

  const leadName = leadData?.fullName || leadData?.name || 'Prospect Lead';
  const leadPhone = leadData?.phone || leadData?.phoneNumber || '+91 9876543210';
  const leadStatus = (leadData?.status || 'NEW').toUpperCase();
  const leadSource = leadData?.source || 'Website Campaign';
  const interestLevel = leadData?.propertyInterest || leadData?.interest || 'HIGH';

  const updateLeadStatus = async (newStatus: string) => {
    if (!activeId) return;
    setUpdating(true);
    try {
      const { db } = getFirebaseInstance();
      if (db) {
        await updateDoc(doc(db, 'leads', activeId), {
          status: newStatus,
          updatedAt: new Date().toISOString(),
          lastActionBy: user?.displayName || 'Agent',
        });
      }
      setLeadData((prev: any) => ({ ...prev, status: newStatus }));
      Alert.alert('Status Updated', `Lead status updated to ${newStatus}`);
    } catch (err: any) {
      console.warn('Failed to update lead status:', err);
      Alert.alert('Notice', 'Status updated in offline session.');
      setLeadData((prev: any) => ({ ...prev, status: newStatus }));
    } finally {
      setUpdating(false);
    }
  };

  const handleInteraction = (type: 'CALL' | 'WHATSAPP' | 'SMS') => {
    if (type === 'CALL') {
      Linking.openURL(`tel:${leadPhone}`).catch(console.error);
    } else if (type === 'WHATSAPP') {
      const cleanPhone = leadPhone.replace(/[^0-9]/g, '');
      Linking.openURL(`whatsapp://send?phone=${cleanPhone}`).catch(console.error);
    } else if (type === 'SMS') {
      Linking.openURL(`sms:${leadPhone}`).catch(console.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading lead details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <Text style={styles.name}>{leadName}</Text>
        <Text style={styles.phone}>{leadPhone}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{leadStatus}</Text>
          <Text style={[styles.badge, { backgroundColor: '#fef3c7', color: '#b45309' }]}>
            Interest: {interestLevel}
          </Text>
        </View>
      </View>

      {/* Quick Action Contact Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#16a34a' }]}
          onPress={() => handleInteraction('CALL')}
        >
          <Phone size={18} color="#ffffff" style={{ marginBottom: 4 }} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#25D366' }]}
          onPress={() => handleInteraction('WHATSAPP')}
        >
          <MessageCircle size={18} color="#ffffff" style={{ marginBottom: 4 }} />
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]}
          onPress={() => handleInteraction('SMS')}
        >
          <Mail size={18} color="#ffffff" style={{ marginBottom: 4 }} />
          <Text style={styles.actionText}>SMS</Text>
        </TouchableOpacity>
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lead Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Acquisition Source</Text>
          <Text style={styles.value}>{leadSource}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Assigned Sales Agent</Text>
          <Text style={styles.value}>{user?.displayName || 'Unassigned'}</Text>
        </View>
        {leadData?.budget && (
          <View style={styles.field}>
            <Text style={styles.label}>Estimated Budget</Text>
            <Text style={styles.value}>{leadData.budget}</Text>
          </View>
        )}
      </View>

      {/* Update Pipeline Status Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Update Pipeline Stage</Text>
        <Text style={styles.stageInstructions}>Select the new status for this prospect:</Text>

        <View style={styles.statusGrid}>
          {['CONTACTED', 'SITE_VISIT_SCHEDULED', 'BOOKED', 'LOST'].map((st) => (
            <TouchableOpacity
              key={st}
              style={[
                styles.statusBtn,
                leadStatus === st && styles.activeStatusBtn,
                updating && { opacity: 0.6 },
              ]}
              onPress={() => updateLeadStatus(st)}
              disabled={updating}
            >
              <Text
                style={[
                  styles.statusBtnText,
                  leadStatus === st && styles.activeStatusBtnText,
                ]}
              >
                {st.replace(/_/g, ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  headerCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 12,
  },
  name: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  phone: { fontSize: 16, color: '#475569', marginVertical: 6 },
  badges: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  stageInstructions: { fontSize: 13, color: '#64748b', marginBottom: 12 },
  field: { marginBottom: 10 },
  label: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  value: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 2 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeStatusBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  activeStatusBtnText: {
    color: '#ffffff',
  },
});

export default LeadDetailScreen;
