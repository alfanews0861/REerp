import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/Card';

export default function NetworkScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Network & Commission</Text>
      
      <Card title="My Profile" style={styles.card}>
        <Text style={styles.text}>Name: John Doe</Text>
        <Text style={styles.text}>Position: Sales Manager (SM)</Text>
        <Text style={styles.text}>Reporting To: Jane Smith (GM)</Text>
      </Card>

      <Card title="Commission Status" style={styles.card}>
        <Text style={styles.text}>Earned: ₹5,00,000</Text>
        <Text style={styles.text}>Pending: ₹1,50,000</Text>
        <Text style={styles.text}>Paid: ₹3,50,000</Text>
      </Card>

      <Card title="My Sub-Agents" style={styles.card}>
        <Text style={styles.text}>- Agent A (Exec)</Text>
        <Text style={styles.text}>- Agent B (Exec)</Text>
        <Text style={styles.text}>- Agent C (Exec)</Text>
      </Card>

      <Card title="My Recent Sales" style={styles.card}>
        <Text style={styles.text}>- Plot 12, Phase 1 (₹10,00,000)</Text>
        <Text style={styles.text}>- Plot 45, Phase 2 (₹15,00,000)</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
});
