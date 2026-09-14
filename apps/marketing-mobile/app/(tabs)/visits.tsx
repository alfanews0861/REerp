import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/AuthProvider';
import { getFirebaseInstance, collection, query, getDocs, limit } from '../../src/services/firebase';
import { MapPin, Calendar, Clock } from 'lucide-react-native';

interface SiteVisitItem {
  id: string;
  propertyName: string;
  clientName?: string;
  scheduledTime: string;
  status: string;
}

export default function VisitsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [visits, setVisits] = useState<SiteVisitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const { db } = getFirebaseInstance();
      if (!db) {
        setVisits([]);
        return;
      }

      const snap = await getDocs(query(collection(db, 'site_visits'), limit(25)));
      const list: SiteVisitItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          propertyName: data.projectName || data.propertyName || data.ventureName || 'ISKON City - 2',
          clientName: data.clientName || data.leadName,
          scheduledTime: data.scheduledTime || data.visitDate || '10:30 AM',
          status: (data.status || 'SCHEDULED').toUpperCase(),
        });
      });

      setVisits(list);
    } catch (err) {
      console.warn('Error fetching visits:', err);
      setVisits([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVisits();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scheduled Site Visits</Text>
      <Text style={styles.subTitle}>Assigned to {user?.displayName || 'Active Agent'}</Text>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading scheduled site visits...</Text>
        </View>
      ) : visits.length === 0 ? (
        <View style={styles.center}>
          <MapPin size={48} color="#cbd5e1" />
          <Text style={styles.emptyTitle}>No Scheduled Visits</Text>
          <Text style={styles.emptySub}>
            New site visit appointments booked for your prospects will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
          }
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.property}>{item.propertyName}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>

              {item.clientName && (
                <Text style={styles.clientName}>Client: {item.clientName}</Text>
              )}

              <View style={styles.timeRow}>
                <Clock size={14} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.time}>{item.scheduledTime}</Text>
              </View>

              <View style={styles.buttonRow}>
                <Button
                  title="View Details"
                  variant="outline"
                  onPress={() => router.push(`/visit/${item.id}`)}
                  style={styles.actionButton}
                />
                <Button
                  title="Start Visit"
                  onPress={() =>
                    router.push({
                      pathname: '/visit/start',
                      params: { visitId: item.id },
                    })
                  }
                  style={styles.actionButton}
                />
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  property: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  clientName: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  time: {
    fontSize: 13,
    color: '#64748b',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
});
