import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export const MyNetworkScreen = () => {
  const dummyChildren = [
    { id: '1', name: 'Agent X', role: 'Executive' },
    { id: '2', name: 'Agent Y', role: 'Executive' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Network</Text>
      <View style={styles.card}>
        <Text style={styles.label}>My Position: <Text style={styles.value}>Sales Manager (SM)</Text></Text>
        <Text style={styles.label}>Parent: <Text style={styles.value}>General Manager A1</Text></Text>
      </View>
      <Text style={styles.subHeader}>My Sub-Agents / Team</Text>
      <FlatList
        data={dummyChildren}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemRole}>{item.role}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F5F5F5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, elevation: 2 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#000', fontWeight: '500' },
  listItem: { backgroundColor: '#FFF', padding: 12, borderRadius: 6, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemRole: { fontSize: 14, color: '#666' }
});

export default MyNetworkScreen;
