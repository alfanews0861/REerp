import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { PUBLIC_PLOTS, PUBLIC_VENTURES, PublicPlot, PublicVenture } from '../../data/publicVenturesData';
import {
  fetchLivePlots,
  fetchLiveVentures,
  updateLivePlotStatus,
} from '../../services/publicDataService';
import {
  Layers,
  Search,
  CheckCircle2,
  Lock,
  Edit,
  Building,
  RefreshCw,
} from 'lucide-react-native';

export const AdminInventoryScreen: React.FC = () => {
  const [plots, setPlots] = useState<PublicPlot[]>(PUBLIC_PLOTS);
  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [selectedVenture, setSelectedVenture] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [livePlots, liveVentures] = await Promise.all([
        fetchLivePlots(selectedVenture),
        fetchLiveVentures(),
      ]);
      setPlots(livePlots);
      setVentures(liveVentures);
    } catch (err) {
      console.warn('Live inventory fetch error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedVenture]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredPlots = plots.filter((plot) => {
    if (selectedVenture !== 'ALL' && plot.projectId !== selectedVenture) return false;
    if (selectedStatus !== 'ALL' && plot.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        plot.plotNumber.toLowerCase().includes(q) ||
        plot.projectName.toLowerCase().includes(q) ||
        plot.facing.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTogglePlotStatus = async (plotId: string, currentStatus: PublicPlot['status']) => {
    let nextStatus: PublicPlot['status'] = 'AVAILABLE';
    if (currentStatus === 'AVAILABLE') nextStatus = 'FAST_SELLING';
    else if (currentStatus === 'FAST_SELLING') nextStatus = 'BOOKED';
    else if (currentStatus === 'BOOKED') nextStatus = 'REGISTERED';
    else nextStatus = 'AVAILABLE';

    // Optimistic UI update
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, status: nextStatus } : p))
    );

    // Save to Firestore
    await updateLivePlotStatus(plotId, nextStatus);
    Alert.alert('Plot Status Updated', `Plot #${plotId} is now marked as ${nextStatus} in Firestore.`);
  };

  const getStatusColor = (status: PublicPlot['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return '#059669';
      case 'FAST_SELLING':
        return '#D97706';
      case 'BOOKED':
        return '#7C3AED';
      case 'REGISTERED':
        return '#DC2626';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E40AF']}
          tintColor="#1E40AF"
        />
      }
    >
      {/* Top Admin Stat Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerBadge}>
          <Layers size={16} color="#F59E0B" />
          <Text style={styles.headerBadgeText}>EXECUTIVE INVENTORY DESK</Text>
        </View>
        <Text style={styles.headerTitle}>Real-time Plot Inventory</Text>
        <Text style={styles.headerSub}>
          Live status tracking and inventory control across all ventures.
        </Text>

        {/* Quick Inventory Breakdown */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{plots.length}</Text>
            <Text style={styles.statLbl}>Total Plots</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: '#059669' }]}>
              {plots.filter((p) => p.status === 'AVAILABLE').length}
            </Text>
            <Text style={styles.statLbl}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: '#D97706' }]}>
              {plots.filter((p) => p.status === 'FAST_SELLING').length}
            </Text>
            <Text style={styles.statLbl}>Fast Selling</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statVal, { color: '#DC2626' }]}>
              {plots.filter((p) => p.status === 'BOOKED' || p.status === 'REGISTERED').length}
            </Text>
            <Text style={styles.statLbl}>Booked</Text>
          </View>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plot number, project..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Venture Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <TouchableOpacity
          style={[styles.filterChip, selectedVenture === 'ALL' && styles.filterChipActive]}
          onPress={() => setSelectedVenture('ALL')}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedVenture === 'ALL' && styles.filterChipTextActive,
            ]}
          >
            All Ventures
          </Text>
        </TouchableOpacity>

        {ventures.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.filterChip, selectedVenture === v.id && styles.filterChipActive]}
            onPress={() => setSelectedVenture(v.id)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedVenture === v.id && styles.filterChipTextActive,
              ]}
            >
              {v.name.split(' - ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Plots List */}
      <View style={styles.plotsList}>
        {filteredPlots.map((plot) => {
          const statusColor = getStatusColor(plot.status);
          return (
            <View key={plot.id} style={styles.plotCard}>
              <View style={styles.plotCardTop}>
                <View>
                  <Text style={styles.plotNumber}>Plot #{plot.plotNumber}</Text>
                  <Text style={styles.plotProject}>{plot.projectName}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}
                  onPress={() => handleTogglePlotStatus(plot.id, plot.status)}
                >
                  <Text style={[styles.statusBadgeText, { color: statusColor }]}>
                    {plot.status.replace('_', ' ')} ▾
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.plotDetailsRow}>
                <Text style={styles.plotDetailText}>
                  {plot.facing} Facing • {plot.areaSqYds} Sq.Yds ({plot.dimensions})
                </Text>
                <Text style={styles.plotPriceText}>
                  ₹{(plot.totalPrice / 100000).toFixed(2)} Lakhs
                </Text>
              </View>

              <View style={styles.plotFooter}>
                <Text style={styles.plotRate}>
                  ₹{plot.pricePerSqYd.toLocaleString('en-IN')}/Sq.Yd
                </Text>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => handleTogglePlotStatus(plot.id, plot.status)}
                >
                  <RefreshCw size={12} color="#1E40AF" />
                  <Text style={styles.editBtnText}>Cycle Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginBottom: 6,
  },
  headerBadgeText: {
    color: '#FDE68A',
    fontSize: 10,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#334155',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  chipScroll: {
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  plotsList: {
    gap: 10,
  },
  plotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  plotCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  plotNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  plotProject: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  plotDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  plotDetailText: {
    fontSize: 12,
    color: '#475569',
  },
  plotPriceText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  plotFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  plotRate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editBtnText: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '700',
  },
});
