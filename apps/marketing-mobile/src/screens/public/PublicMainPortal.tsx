import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { PublicVenturesScreen } from './PublicVenturesScreen';
import { PublicPlotsExplorerScreen } from './PublicPlotsExplorerScreen';
import { PublicSiteVisitScreen } from './PublicSiteVisitScreen';
import { PublicAiAssistantScreen } from './PublicAiAssistantScreen';
import { PublicContactScreen } from './PublicContactScreen';
import { PublicPlot } from '../../data/publicVenturesData';
import {
  Building2,
  Layers,
  Car,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  LogIn,
} from 'lucide-react-native';

export type PublicTab = 'ventures' | 'plots' | 'visit' | 'ai' | 'contact';

interface PublicMainPortalProps {
  onOpenLogin: () => void;
}

export const PublicMainPortal: React.FC<PublicMainPortalProps> = ({ onOpenLogin }) => {
  const [activeTab, setActiveTab] = useState<PublicTab>('ventures');
  const [selectedVentureIdForPlots, setSelectedVentureIdForPlots] = useState<string | undefined>();
  const [selectedVentureIdForVisit, setSelectedVentureIdForVisit] = useState<string | undefined>();

  const handleSelectVentureForPlots = (ventureId: string) => {
    setSelectedVentureIdForPlots(ventureId);
    setActiveTab('plots');
  };

  const handleBookSiteVisit = (ventureId?: string) => {
    if (ventureId) setSelectedVentureIdForVisit(ventureId);
    setActiveTab('visit');
  };

  const handleSelectPlotFromAi = (plot: PublicPlot) => {
    setSelectedVentureIdForPlots(plot.projectId);
    setActiveTab('plots');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Top Main Navigation Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.brandLogo}>
            <ShieldCheck size={20} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.brandTitle}>REOS Open Plots</Text>
            <Text style={styles.brandSub}>HMDA & DTCP Gated Layouts</Text>
          </View>
        </View>

        {/* Prominent Admin / Staff Login Gateway */}
        <TouchableOpacity
          style={styles.adminLoginBtn}
          onPress={onOpenLogin}
          activeOpacity={0.8}
        >
          <LogIn size={15} color="#FFFFFF" />
          <Text style={styles.adminLoginBtnText}>Admin / Staff Login</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Content Body */}
      <View style={styles.content}>
        {activeTab === 'ventures' && (
          <PublicVenturesScreen
            onSelectVentureForPlots={handleSelectVentureForPlots}
            onBookSiteVisit={handleBookSiteVisit}
            onOpenAdminLogin={onOpenLogin}
          />
        )}
        {activeTab === 'plots' && (
          <PublicPlotsExplorerScreen
            initialVentureId={selectedVentureIdForPlots}
            onBookSiteVisit={handleBookSiteVisit}
          />
        )}
        {activeTab === 'visit' && (
          <PublicSiteVisitScreen initialVentureId={selectedVentureIdForVisit} />
        )}
        {activeTab === 'ai' && (
          <PublicAiAssistantScreen
            onSelectPlot={handleSelectPlotFromAi}
            onBookSiteVisit={handleBookSiteVisit}
          />
        )}
        {activeTab === 'contact' && (
          <PublicContactScreen onOpenAdminLogin={onOpenLogin} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'ventures' && styles.navItemActive]}
          onPress={() => setActiveTab('ventures')}
        >
          <Building2
            size={20}
            color={activeTab === 'ventures' ? '#2563EB' : '#64748B'}
            strokeWidth={activeTab === 'ventures' ? 2.5 : 2}
          />
          <Text
            style={[styles.navLabel, activeTab === 'ventures' && styles.navLabelActive]}
          >
            Ventures
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'plots' && styles.navItemActive]}
          onPress={() => setActiveTab('plots')}
        >
          <Layers
            size={20}
            color={activeTab === 'plots' ? '#2563EB' : '#64748B'}
            strokeWidth={activeTab === 'plots' ? 2.5 : 2}
          />
          <Text
            style={[styles.navLabel, activeTab === 'plots' && styles.navLabelActive]}
          >
            Plots Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'visit' && styles.navItemActive]}
          onPress={() => setActiveTab('visit')}
        >
          <Car
            size={20}
            color={activeTab === 'visit' ? '#059669' : '#64748B'}
            strokeWidth={activeTab === 'visit' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'visit' && { color: '#059669', fontWeight: '800' },
            ]}
          >
            Free Cab
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'ai' && styles.navItemActive]}
          onPress={() => setActiveTab('ai')}
        >
          <Sparkles
            size={20}
            color={activeTab === 'ai' ? '#D97706' : '#64748B'}
            strokeWidth={activeTab === 'ai' ? 2.5 : 2}
          />
          <Text
            style={[
              styles.navLabel,
              activeTab === 'ai' && { color: '#D97706', fontWeight: '800' },
            ]}
          >
            Gemini AI
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === 'contact' && styles.navItemActive]}
          onPress={() => setActiveTab('contact')}
        >
          <PhoneCall
            size={20}
            color={activeTab === 'contact' ? '#2563EB' : '#64748B'}
            strokeWidth={activeTab === 'contact' ? 2.5 : 2}
          />
          <Text
            style={[styles.navLabel, activeTab === 'contact' && styles.navLabelActive]}
          >
            Contact
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  brandSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  adminLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  adminLoginBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navItemActive: {},
  navLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 3,
  },
  navLabelActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
