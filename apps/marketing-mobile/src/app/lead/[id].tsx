import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';

export default function LeadDetailsScreen() {
  const { id } = useLocalSearchParams();
  const lead = {
    name: 'Alice Smith',
    phone: '+1234567890',
    status: 'New',
    notes: 'Interested in Sunset Villas'
  };

  const handleCall = () => Linking.openURL(`tel:${lead.phone}`);
  const handleSMS = () => Linking.openURL(`sms:${lead.phone}`);
  const handleWhatsApp = () => Linking.openURL(`whatsapp://send?phone=${lead.phone}`);

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.name}>{lead.name}</Text>
        <Text style={styles.status}>Status: {lead.status}</Text>
        
        <View style={styles.actions}>
          <Button title="Call" onPress={handleCall} style={styles.actionButton} />
          <Button title="SMS" onPress={handleSMS} style={styles.actionButton} />
          <Button title="WhatsApp" onPress={handleWhatsApp} style={styles.actionButton} />
        </View>
      </Card>

      <Card title="Timeline">
        <Text style={styles.timelineItem}>- Created on Aug 7, 2026</Text>
        <Text style={styles.timelineItem}>- Sent brochure via Email</Text>
      </Card>

      <Card title="Notes">
        <Text style={styles.notes}>{lead.notes}</Text>
        <Input label="Add Note" placeholder="Enter new note..." />
        <Button title="Save Note" onPress={() => {}} />
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
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  timelineItem: {
    fontSize: 14,
    color: '#475569',
    marginVertical: 4,
  },
  notes: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 12,
  },
});
