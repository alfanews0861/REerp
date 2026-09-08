import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Mock Lead Type
interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  isAssignedToMe: boolean;
}

const mockLeads: Lead[] = [
  { id: '1', name: 'John Doe', phone: '+91 9876543210', status: 'NEW', isAssignedToMe: true },
  { id: '2', name: 'Jane Smith', phone: '+91 9123456780', status: 'FOLLOW_UP', isAssignedToMe: true },
  { id: '3', name: 'Robert King', phone: '+91 8888888888', status: 'NEW', isAssignedToMe: false },
];

import { useRouter } from 'expo-router';

interface LeadListScreenProps {
  onSelectLead?: (leadId: string) => void;
}

export const LeadListScreen: React.FC<LeadListScreenProps> = ({ onSelectLead }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'MY_LEADS'>('MY_LEADS');

  const displayedLeads = filter === 'MY_LEADS' 
    ? mockLeads.filter(l => l.isAssignedToMe) 
    : mockLeads;

  const handleLeadPress = (id: string) => {
    if (onSelectLead) {
      onSelectLead(id);
    } else {
      router.push(`/lead/${id}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads Workspace</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'MY_LEADS' && styles.activeBtn]}
          onPress={() => setFilter('MY_LEADS')}
        >
          <Text style={filter === 'MY_LEADS' ? styles.activeText : styles.inactiveText}>My Leads</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, filter === 'ALL' && styles.activeBtn]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={filter === 'ALL' ? styles.activeText : styles.inactiveText}>Team Leads</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => handleLeadPress(item.id)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  title: { fontSize: 20, fontWeight: 'bold' },
  filterContainer: { flexDirection: 'row', padding: 16 },
  filterBtn: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, marginHorizontal: 4 },
  activeBtn: { backgroundColor: '#2563eb' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  inactiveText: { color: '#4b5563' },
  card: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  name: { fontSize: 16, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#4b5563', marginVertical: 4 },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#1e40af', fontSize: 12, fontWeight: 'bold' }
});

export default LeadListScreen;
