import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Today's Dashboard</Text>
      
      <Card title="Today's Tasks" style={styles.card}>
        <Text style={styles.text}>- Call 3 new leads</Text>
        <Text style={styles.text}>- Follow up with John Doe</Text>
      </Card>

      <Card title="Today's Leads" style={styles.card}>
        <Text style={styles.text}>5 New Leads</Text>
        <Button title="View Leads" onPress={() => router.push('/leads')} variant="outline" />
      </Card>

      <Card title="Today's Visits" style={styles.card}>
        <Text style={styles.text}>2 Site Visits Scheduled</Text>
        <Button title="View Visits" onPress={() => router.push('/visits')} variant="outline" />
      </Card>

      <Card title="My Network & Commission" style={styles.card}>
        <Text style={styles.text}>Network Level: SM (Sales Manager)</Text>
        <Text style={styles.text}>Pending Commission: ₹15,000</Text>
        <View style={styles.buttonRow}>
          <Button
            title="View Commissions"
            onPress={() => router.push('/commission')}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title="View Team Network"
            onPress={() => router.push('/network')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
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
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
