import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
} from 'react-native';
import { PUBLIC_VENTURES, PublicVenture } from '../../data/publicVenturesData';
import { fetchLiveVentures } from '../../services/publicDataService';
import {
  Search,
  MapPin,
  CheckCircle2,
  Car,
  Layers,
  Sparkles,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  Phone,
} from 'lucide-react-native';

interface PublicVenturesScreenProps {
  onSelectVentureForPlots?: (ventureId: string) => void;
  onBookSiteVisit?: (ventureId?: string) => void;
  onOpenAdminLogin?: () => void;
}

export const PublicVenturesScreen: React.FC<PublicVenturesScreenProps> = ({
  onSelectVentureForPlots,
  onBookSiteVisit,
  onOpenAdminLogin,
}) => {
  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<'ALL' | 'HMDA' | 'DTCP'>('ALL');
  const [selectedVenture, setSelectedVenture] = useState<PublicVenture | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadVentures = async () => {
    try {
      const data = await fetchLiveVentures();
      setVentures(data);
    } catch (err) {
      console.warn('Live ventures fetch error:', err);
    }
  };

  useEffect(() => {
    loadVentures();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVentures();
    setRefreshing(false);
  };

  const filteredVentures = ventures.filter((v) => {
    if (selectedAuthority !== 'ALL' && v.approvalAuthority !== selectedAuthority) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.name.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
      {/* Hero Banner with Telugu/English text */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <ShieldCheck size={16} color="#F59E0B" />
          <Text style={styles.heroBadgeText}>100% HMDA / DTCP APPROVED</Text>
        </View>
        <Text style={styles.heroTitle}>Premium Open Plots in Growth Corridors</Text>
        <Text style={styles.heroSubtitle}>
          మోకిల, శంకర్‌పల్లి, షాద్‌నగర్, కొల్లూరు & శ్రీశైలం హైవేలలో అత్యుత్తమ గేటెడ్ లేఅవుట్లు.
        </Text>

        {/* Quick Search */}
        <View style={styles.searchBar}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, venture name..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>

        {/* Authority Filter Chips */}
        <View style={styles.filterRow}>
          {(['ALL', 'HMDA', 'DTCP'] as const).map((auth) => (
            <TouchableOpacity
              key={auth}
              style={[styles.filterChip, selectedAuthority === auth && styles.filterChipActive]}
              onPress={() => setSelectedAuthority(auth)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedAuthority === auth && styles.filterChipTextActive,
                ]}
              >
                {auth === 'ALL' ? '🌟 All Ventures' : `🛡️ ${auth} Approved`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Ventures ({filteredVentures.length})</Text>
        <Text style={styles.sectionSubtitle}>క్లియర్ టైటిల్ మరియు స్పాట్ రిజిస్ట్రేషన్</Text>
      </View>

      {/* Ventures List */}
      {filteredVentures.map((venture) => (
        <View key={venture.id} style={styles.ventureCard}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: venture.heroImage }} style={styles.ventureImage} />
            <View style={styles.authorityBadge}>
              <Text style={styles.authorityBadgeText}>{venture.approvalAuthority}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.priceTagText}>₹{venture.basePricePerSqYd.toLocaleString('en-IN')}/Sq.Yd</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.ventureName}>{venture.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={14} color="#64748B" />
              <Text style={styles.locationText} numberOfLines={1}>
                {venture.location}
              </Text>
            </View>
            <Text style={styles.ventureTagline} numberOfLines={2}>
              {venture.tagline}
            </Text>

            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{venture.totalAreaAcres} Acres</Text>
                <Text style={styles.metricLabel}>Total Area</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{venture.totalPlots}</Text>
                <Text style={styles.metricLabel}>Total Plots</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={[styles.metricValue, { color: '#059669' }]}>
                  {venture.availablePlots} Left
                </Text>
                <Text style={styles.metricLabel}>Available</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => setSelectedVenture(venture)}
              >
                <Text style={styles.detailsBtnText}>View Details</Text>
                <ChevronRight size={16} color="#1E40AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.plotsBtn}
                onPress={() => onSelectVentureForPlots?.(venture.id)}
              >
                <Layers size={14} color="#FFFFFF" />
                <Text style={styles.plotsBtnText}>Explore Plots</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cabBtn}
                onPress={() => onBookSiteVisit?.(venture.id)}
              >
                <Car size={14} color="#FFFFFF" />
                <Text style={styles.cabBtnText}>Free Cab</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Venture Detail Modal */}
      <Modal
        visible={selectedVenture !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedVenture(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedVenture && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle} numberOfLines={1}>
                    {selectedVenture.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setSelectedVenture(null)}
                  >
                    <X size={20} color="#0F172A" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScroll}>
                  <Image
                    source={{ uri: selectedVenture.heroImage }}
                    style={styles.modalHeroImage}
                  />

                  <View style={styles.modalBody}>
                    <View style={styles.badgeRow}>
                      <View style={styles.pillBadge}>
                        <ShieldCheck size={14} color="#059669" />
                        <Text style={styles.pillBadgeText}>
                          {selectedVenture.approvalAuthority} Approved: {selectedVenture.approvalNumber}
                        </Text>
                      </View>
                      <View style={[styles.pillBadge, { backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.pillBadgeText, { color: '#92400E' }]}>
                          RERA ID: {selectedVenture.reraId}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.priceHeading}>
                      ₹{selectedVenture.basePricePerSqYd.toLocaleString('en-IN')}{' '}
                      <Text style={styles.priceSub}>per Sq.Yard</Text>
                    </Text>

                    <Text style={styles.modalDescription}>{selectedVenture.description}</Text>

                    {/* Highlights */}
                    <Text style={styles.sectionHeading}>🌟 Key Project Highlights</Text>
                    {selectedVenture.highlights.map((h, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <CheckCircle2 size={16} color="#059669" />
                        <Text style={styles.bulletText}>{h}</Text>
                      </View>
                    ))}

                    {/* Connectivity */}
                    <Text style={styles.sectionHeading}>🚗 Proximity & Connectivity</Text>
                    <View style={styles.connectivityGrid}>
                      {selectedVenture.connectivity.map((c, i) => (
                        <View key={i} style={styles.connectItem}>
                          <Clock size={14} color="#2563EB" />
                          <Text style={styles.connectLabel}>{c.label}:</Text>
                          <Text style={styles.connectTime}>{c.time}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Amenities */}
                    <Text style={styles.sectionHeading}>🏡 World-Class Amenities</Text>
                    <View style={styles.amenitiesGrid}>
                      {selectedVenture.amenities.map((a, i) => (
                        <View key={i} style={styles.amenityChip}>
                          <Sparkles size={12} color="#D97706" />
                          <Text style={styles.amenityText}>{a}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Action Call to Action */}
                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.modalPrimaryBtn}
                        onPress={() => {
                          const vId = selectedVenture.id;
                          setSelectedVenture(null);
                          onBookSiteVisit?.(vId);
                        }}
                      >
                        <Car size={18} color="#FFFFFF" />
                        <Text style={styles.modalPrimaryBtnText}>Book Free AC Cab Visit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.modalSecondaryBtn}
                        onPress={() => {
                          const vId = selectedVenture.id;
                          setSelectedVenture(null);
                          onSelectVentureForPlots?.(vId);
                        }}
                      >
                        <Layers size={18} color="#1E40AF" />
                        <Text style={styles.modalSecondaryBtnText}>Explore Available Plots</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

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
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ventureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
    backgroundColor: '#E2E8F0',
  },
  ventureImage: {
    width: '100%',
    height: '100%',
  },
  authorityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  authorityBadgeText: {
    color: '#FDE68A',
    fontWeight: '800',
    fontSize: 11,
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priceTagText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  ventureName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  ventureTagline: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#CBD5E1',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  detailsBtnText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '700',
  },
  plotsBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E40AF',
    borderRadius: 10,
    paddingVertical: 9,
    gap: 4,
  },
  plotsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 9,
    gap: 4,
  },
  cabBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
    marginRight: 10,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  modalScroll: {
    paddingHorizontal: 16,
  },
  modalHeroImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginTop: 14,
    marginBottom: 14,
  },
  modalBody: {
    gap: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  priceHeading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
  },
  priceSub: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalDescription: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  sectionHeading: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bulletText: {
    fontSize: 12.5,
    color: '#334155',
    flex: 1,
  },
  connectivityGrid: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  connectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  connectTime: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '800',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  amenityText: {
    fontSize: 11.5,
    color: '#92400E',
    fontWeight: '600',
  },
  modalActions: {
    marginTop: 18,
    gap: 10,
    marginBottom: 20,
  },
  modalPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 8,
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
  },
  modalSecondaryBtnText: {
    color: '#1E40AF',
    fontSize: 14,
    fontWeight: '800',
  },
});
