import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  activeLeads: number;
  totalSales: string;
}

export const MyNetworkScreen: React.FC = () => {
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Agent Vikram', role: 'Sales Executive', activeLeads: 8, totalSales: '₹25,00,000' },
    { id: '2', name: 'Agent Priya', role: 'Sales Executive', activeLeads: 12, totalSales: '₹40,00,000' },
    { id: '3', name: 'Agent Rahul', role: 'Associate', activeLeads: 5, totalSales: '₹12,00,000' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Network & Team</Text>
      
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>John Doe</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sales Manager (SM)</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.label}>Reports To: <Text style={styles.value}>Jane Smith (GM)</Text></Text>
        <Text style={styles.label}>Direct Reportees: <Text style={styles.value}>{teamMembers.length} Agents</Text></Text>
      </View>

      <Text style={styles.subHeader}>My Sub-Agents / Team ({teamMembers.length})</Text>
      <FlatList
        data={teamMembers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemRole}>{item.role}</Text>
              <Text style={styles.leadCount}>Active Leads: {item.activeLeads}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.salesLabel}>Volume</Text>
              <Text style={styles.salesAmount}>{item.totalSales}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f1f5f9' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  subHeader: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16, marginBottom: 12 },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#1e40af', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  value: { fontSize: 14, color: '#0f172a', fontWeight: '600' },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  itemRole: { fontSize: 13, color: '#64748b', marginTop: 2 },
  leadCount: { fontSize: 12, color: '#2563eb', marginTop: 4, fontWeight: '500' },
  salesLabel: { fontSize: 11, color: '#94a3b8' },
  salesAmount: { fontSize: 15, fontWeight: 'bold', color: '#16a34a', marginTop: 2 },
});

export default MyNetworkScreen;
