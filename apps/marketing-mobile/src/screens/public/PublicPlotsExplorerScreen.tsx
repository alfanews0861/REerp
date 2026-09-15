import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { PUBLIC_PLOTS, PUBLIC_VENTURES, PublicPlot, PublicVenture } from '../../data/publicVenturesData';
import {
  fetchLivePlots,
  fetchLiveVentures,
  createLivePlotHold,
} from '../../services/publicDataService';
import {
  Layers,
  Compass,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';

interface PublicPlotsExplorerScreenProps {
  initialVentureId?: string;
  onBookSiteVisit?: (ventureId?: string) => void;
}

export const PublicPlotsExplorerScreen: React.FC<PublicPlotsExplorerScreenProps> = ({
  initialVentureId,
  onBookSiteVisit,
}) => {
  const [plots, setPlots] = useState<PublicPlot[]>(PUBLIC_PLOTS);
  const [ventures, setVentures] = useState<PublicVenture[]>(PUBLIC_VENTURES);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialVentureId || 'ALL');
  const [selectedFacing, setSelectedFacing] = useState<'ALL' | 'EAST' | 'WEST' | 'NORTH' | 'SOUTH'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'AVAILABLE' | 'FAST_SELLING'>('ALL');
  const [selectedPlot, setSelectedPlot] = useState<PublicPlot | null>(PUBLIC_PLOTS[0]);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Token hold form state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [tokenAmount, setTokenAmount] = useState(25000);
  const [isProcessingToken, setIsProcessingToken] = useState(false);
  const [tokenSuccessReceipt, setTokenSuccessReceipt] = useState<string | null>(null);

  const loadData = async (force: boolean = false) => {
    try {
      const [livePlots, liveVentures] = await Promise.all([
        fetchLivePlots(selectedProjectId, force),
        fetchLiveVentures(force),
      ]);
      setPlots(livePlots);
      setVentures(liveVentures);
      if (livePlots.length > 0 && (!selectedPlot || !livePlots.find((p) => p.id === selectedPlot.id))) {
        setSelectedPlot(livePlots[0]);
      }
    } catch (err) {
      console.warn('Live plots load notice:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  };

  const filteredPlots = plots.filter((plot) => {
    if (selectedProjectId !== 'ALL' && plot.projectId !== selectedProjectId) return false;
    if (selectedFacing !== 'ALL' && plot.facing !== selectedFacing) return false;
    if (selectedStatus !== 'ALL' && plot.status !== selectedStatus) return false;
    return true;
  });

  const handleConfirmTokenHold = async () => {
    if (!buyerName.trim() || !buyerPhone.trim()) {
      Alert.alert('Missing Details', 'Please enter your full name and contact mobile number.');
      return;
    }
    if (!selectedPlot) return;

    setIsProcessingToken(true);
    try {
      const result = await createLivePlotHold({
        plotId: selectedPlot.id,
        plotNumber: selectedPlot.plotNumber,
        projectId: selectedPlot.projectId,
        projectName: selectedPlot.projectName,
        customerName: buyerName.trim(),
        customerPhone: buyerPhone.trim(),
        tokenAmount,
      });

      // Update local state to reflect BOOKED status immediately
      setPlots((prev) =>
        prev.map((p) => (p.id === selectedPlot.id ? { ...p, status: 'BOOKED' } : p))
      );
      setSelectedPlot((prev) => (prev ? { ...prev, status: 'BOOKED' } : null));
      setTokenSuccessReceipt(result.receiptNumber);
    } catch (err: any) {
      Alert.alert('Hold Processing Notice', err?.message || 'Could not complete online hold.');
    } finally {
      setIsProcessingToken(false);
    }
  };

  const getStatusColor = (status: PublicPlot['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return '#059669';
      case 'FAST_SELLING':
        return '#D97706';
      case 'BOOKED':
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
      {/* Header Info Banner */}
      <View style={styles.bannerCard}>
        <View style={styles.bannerRow}>
          <Layers size={20} color="#3B82F6" />
          <Text style={styles.bannerTitle}>Interactive Master Plot Explorer</Text>
        </View>
        <Text style={styles.bannerSubtitle}>
          లేఅవుట్ ప్లాట్లను ఎంచుకోండి • 48 గంటల పాటు ధరను లాక్ చేసుకోండి.
        </Text>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.legendText}>
              Available ({plots.filter((p) => p.status === 'AVAILABLE').length})
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.legendText}>Fast Selling</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>
      </View>

      {/* Project Selector Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        <TouchableOpacity
          style={[styles.projectChip, selectedProjectId === 'ALL' && styles.projectChipActive]}
          onPress={() => setSelectedProjectId('ALL')}
        >
          <Text
            style={[
              styles.projectChipText,
              selectedProjectId === 'ALL' && styles.projectChipTextActive,
            ]}
          >
            All Ventures ({plots.length})
          </Text>
        </TouchableOpacity>

        {ventures.map((v) => (
          <TouchableOpacity
            key={v.id}
            style={[styles.projectChip, selectedProjectId === v.id && styles.projectChipActive]}
            onPress={() => setSelectedProjectId(v.id)}
          >
            <Text
              style={[
                styles.projectChipText,
                selectedProjectId === v.id && styles.projectChipTextActive,
              ]}
            >
              {v.name.split(' - ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Facing Filter Chips */}
      <View style={styles.facingRow}>
        {(['ALL', 'EAST', 'WEST', 'NORTH', 'SOUTH'] as const).map((facing) => (
          <TouchableOpacity
            key={facing}
            style={[styles.facingChip, selectedFacing === facing && styles.facingChipActive]}
            onPress={() => setSelectedFacing(facing)}
          >
            <Compass size={12} color={selectedFacing === facing ? '#FFFFFF' : '#64748B'} />
            <Text
              style={[
                styles.facingChipText,
                selectedFacing === facing && styles.facingChipTextActive,
              ]}
            >
              {facing === 'ALL' ? 'All Facing' : facing}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Interactive Visual Plot Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Layout Plots Map ({filteredPlots.length})</Text>
        <Text style={styles.sectionSubtitle}>Tap a plot to calculate price & freeze rate</Text>
      </View>

      <View style={styles.plotsGrid}>
        {filteredPlots.map((plot) => {
          const isSelected = selectedPlot?.id === plot.id;
          const statusColor = getStatusColor(plot.status);

          return (
            <TouchableOpacity
              key={plot.id}
              style={[
                styles.plotGridItem,
                isSelected && styles.plotGridItemSelected,
                { borderColor: isSelected ? '#2563EB' : statusColor },
              ]}
              onPress={() => setSelectedPlot(plot)}
            >
              <View style={[styles.plotTopBar, { backgroundColor: statusColor }]}>
                <Text style={styles.plotTopBarText}>{plot.facing}</Text>
              </View>
              <Text style={styles.plotNumText}>{plot.plotNumber}</Text>
              <Text style={styles.plotAreaText}>{plot.areaSqYds} Yds</Text>
              <Text style={styles.plotPriceMini}>₹{(plot.totalPrice / 100000).toFixed(1)}L</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Plot Calculator Card */}
      {selectedPlot && (
        <View style={styles.calculatorCard}>
          <View style={styles.calcHeader}>
            <View>
              <View style={styles.calcBadgeRow}>
                <Text style={styles.calcPlotNum}>Plot #{selectedPlot.plotNumber}</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: getStatusColor(selectedPlot.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: getStatusColor(selectedPlot.status) },
                    ]}
                  >
                    {selectedPlot.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <Text style={styles.calcProjectName}>{selectedPlot.projectName}</Text>
            </View>

            <View style={styles.calcPriceBox}>
              <Text style={styles.calcPriceLabel}>Total Value</Text>
              <Text style={styles.calcPriceVal}>
                ₹{(selectedPlot.totalPrice / 100000).toFixed(2)} Lakhs
              </Text>
            </View>
          </View>

          {/* Breakdown Table */}
          <View style={styles.breakdownBox}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Facing & Direction:</Text>
              <Text style={styles.breakdownVal}>
                {selectedPlot.facing} Facing {selectedPlot.isCornerPlot ? '(Corner Plot ⭐)' : ''}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Plot Area (Dimensions):</Text>
              <Text style={styles.breakdownVal}>
                {selectedPlot.areaSqYds} Sq.Yds ({selectedPlot.dimensions} ft)
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Rate:</Text>
              <Text style={styles.breakdownVal}>
                ₹{selectedPlot.pricePerSqYd.toLocaleString('en-IN')} / Sq.Yd
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>48-Hour Token Hold Amount:</Text>
              <Text style={[styles.breakdownVal, { color: '#059669', fontWeight: '800' }]}>
                ₹25,000 (100% Refundable)
              </Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.calcActions}>
            <TouchableOpacity
              style={[
                styles.tokenBtn,
                selectedPlot.status === 'BOOKED' && styles.disabledBtn,
              ]}
              disabled={selectedPlot.status === 'BOOKED'}
              onPress={() => {
                setTokenSuccessReceipt(null);
                setTokenModalOpen(true);
              }}
            >
              <Lock size={16} color="#FFFFFF" />
              <Text style={styles.tokenBtnText}>
                {selectedPlot.status === 'BOOKED'
                  ? 'Plot Already Booked'
                  : 'Hold Plot (48-Hr Price Freeze)'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.visitLinkBtn}
              onPress={() => onBookSiteVisit?.(selectedPlot.projectId)}
            >
              <Sparkles size={16} color="#1E40AF" />
              <Text style={styles.visitLinkBtnText}>Book Free Site Visit Cab</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 48-Hour Token Hold Modal */}
      <Modal
        visible={tokenModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTokenModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>48-Hour Plot Price Freeze</Text>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setTokenModalOpen(false)}
              >
                <X size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {!tokenSuccessReceipt ? (
                <>
                  <View style={styles.tokenInfoBanner}>
                    <ShieldCheck size={20} color="#059669" />
                    <Text style={styles.tokenInfoText}>
                      Plot #{selectedPlot?.plotNumber} will be blocked for you for 48 hours. 100% money-back guarantee if you choose not to proceed!
                    </Text>
                  </View>

                  <View style={styles.formSection}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="e.g. Ramesh Reddy"
                      value={buyerName}
                      onChangeText={setBuyerName}
                    />

                    <Text style={styles.inputLabel}>Mobile Phone Number</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="+91 98480 12345"
                      keyboardType="phone-pad"
                      value={buyerPhone}
                      onChangeText={setBuyerPhone}
                    />

                    <Text style={styles.inputLabel}>Select Refundable Token Amount</Text>
                    <View style={styles.tokenAmountRow}>
                      {[10000, 25000, 50000].map((amt) => (
                        <TouchableOpacity
                          key={amt}
                          style={[
                            styles.amtOption,
                            tokenAmount === amt && styles.amtOptionActive,
                          ]}
                          onPress={() => setTokenAmount(amt)}
                        >
                          <Text
                            style={[
                              styles.amtOptionText,
                              tokenAmount === amt && styles.amtOptionTextActive,
                            ]}
                          >
                            ₹{(amt / 1000).toFixed(0)}k
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={styles.payBtn}
                      onPress={handleConfirmTokenHold}
                      disabled={isProcessingToken}
                    >
                      <CreditCard size={18} color="#FFFFFF" />
                      <Text style={styles.payBtnText}>
                        {isProcessingToken
                          ? 'Generating Secure Hold...'
                          : `Hold Plot with ₹${tokenAmount.toLocaleString('en-IN')}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={styles.successBox}>
                  <View style={styles.successIcon}>
                    <CheckCircle2 size={40} color="#059669" />
                  </View>
                  <Text style={styles.successTitle}>Plot Freeze Confirmed! 🎉</Text>
                  <Text style={styles.successSub}>
                    Plot #{selectedPlot?.plotNumber} at {selectedPlot?.projectName} is locked under your name for 48 hours.
                  </Text>
                  <View style={styles.receiptBox}>
                    <Text style={styles.receiptLabel}>Hold Reference ID</Text>
                    <Text style={styles.receiptVal}>{tokenSuccessReceipt}</Text>
                    <Text style={styles.receiptLabel}>Frozen Rate</Text>
                    <Text style={styles.receiptVal}>
                      ₹{(selectedPlot?.totalPrice ?? 0) / 100000} Lakhs
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => {
                      setTokenModalOpen(false);
                      onBookSiteVisit?.(selectedPlot?.projectId);
                    }}
                  >
                    <Zap size={18} color="#FFFFFF" />
                    <Text style={styles.payBtnText}>Schedule Free Cab Site Visit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
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
  bannerCard: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  chipScroll: {
    marginBottom: 12,
  },
  projectChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  projectChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  projectChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  projectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  facingRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  facingChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 4,
  },
  facingChipActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  facingChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  facingChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
  },
  plotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  plotGridItem: {
    flexBasis: '23%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 6,
  },
  plotGridItemSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    elevation: 4,
  },
  plotTopBar: {
    width: '100%',
    paddingVertical: 2,
    alignItems: 'center',
  },
  plotTopBarText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  plotNumText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 4,
  },
  plotAreaText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  plotPriceMini: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
    marginTop: 2,
  },
  calculatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  calcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  calcBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calcPlotNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  calcProjectName: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  calcPriceBox: {
    alignItems: 'flex-end',
  },
  calcPriceLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  calcPriceVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
  },
  breakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  calcActions: {
    gap: 8,
  },
  tokenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  tokenBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  visitLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  visitLinkBtnText: {
    color: '#1E40AF',
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
    maxHeight: '85%',
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
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  modalScroll: {
    padding: 16,
  },
  tokenInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  tokenInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 17,
  },
  formSection: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  tokenAmountRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  amtOption: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  amtOptionActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  amtOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  amtOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 13,
    gap: 8,
    marginTop: 8,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  successSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
    gap: 4,
  },
  receiptLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  receiptVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
});
