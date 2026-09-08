import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface LeadDetailScreenProps {
  leadId?: string;
}

export const LeadDetailScreen: React.FC<LeadDetailScreenProps> = ({ leadId: propLeadId }) => {
  const params = useLocalSearchParams<{ id?: string }>();
  const activeId = propLeadId || params?.id || '1';

  // Mock Lead Data
  const lead = {
    id: activeId,
    name: activeId === '2' ? 'Jane Smith' : 'John Doe',
    phone: activeId === '2' ? '+91 9123456780' : '+91 9876543210',
    status: activeId === '2' ? 'FOLLOW_UP' : 'NEW',
    source: 'Facebook Ads',
    campaign: 'Summer Festive Offer',
    interest: 'MEDIUM'
  };

  const logOfflineInteraction = (type: string) => {
    console.log(`Logging ${type} interaction offline for lead ${lead.id}. Will sync when online.`);
    if (type === 'CALL') {
      Linking.openURL(`tel:${lead.phone}`).catch(console.error);
    } else if (type === 'WHATSAPP') {
      Linking.openURL(`whatsapp://send?phone=${lead.phone}`).catch(console.error);
    } else if (type === 'SMS') {
      Linking.openURL(`sms:${lead.phone}`).catch(console.error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.name}>{lead.name}</Text>
        <Text style={styles.phone}>{lead.phone}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{lead.status}</Text>
          <Text style={[styles.badge, { backgroundColor: '#fef3c7', color: '#b45309' }]}>{lead.interest}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#16a34a' }]} onPress={() => logOfflineInteraction('CALL')}>
          <Text style={styles.actionText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#25D366' }]} onPress={() => logOfflineInteraction('WHATSAPP')}>
          <Text style={styles.actionText}>💬 WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]} onPress={() => logOfflineInteraction('SMS')}>
          <Text style={styles.actionText}>✉️ SMS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Lead Qualification</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Interest Level</Text>
          <Text style={styles.value}>{lead.interest}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Source</Text>
          <Text style={styles.value}>{lead.source}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Campaign</Text>
          <Text style={styles.value}>{lead.campaign}</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Update Qualification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Activity & Follow-ups</Text>
        <TouchableOpacity style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Log New Note / Offline Mode</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  headerCard: { backgroundColor: '#fff', padding: 20, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold' },
  phone: { fontSize: 16, color: '#4b5563', marginVertical: 8 },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { backgroundColor: '#dbeafe', color: '#1e40af', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 16 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 16, borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 12, color: '#6b7280' },
  value: { fontSize: 16, fontWeight: '500' },
  primaryBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#f3f4f6', padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#d1d5db' },
  secondaryBtnText: { color: '#374151', fontWeight: 'bold' }
});

export default LeadDetailScreen;
