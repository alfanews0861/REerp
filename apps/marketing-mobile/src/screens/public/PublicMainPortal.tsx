import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PublicVenturesScreen } from './PublicVenturesScreen';
import { PublicPlotsExplorerScreen } from './PublicPlotsExplorerScreen';
import { PublicSiteVisitScreen } from './PublicSiteVisitScreen';
import { PublicAiAssistantScreen } from './PublicAiAssistantScreen';
import { PublicContactScreen } from './PublicContactScreen';
import { PublicPlot } from '../../data/publicVenturesData';
import { MobileAppHeader } from '../../components/MobileAppHeader';
import {
  Building2,
  Layers,
  Car,
  Sparkles,
  PhoneCall,
  LogIn,
} from 'lucide-react-native';

export type PublicTab = 'ventures' | 'plots' | 'visit' | 'ai' | 'contact';

interface PublicMainPortalProps {
  onOpenLogin: () => void;
}

export const PublicMainPortal: React.FC<PublicMainPortalProps> = ({ onOpenLogin }) => {
  const insets = useSafeAreaInsets();
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
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#02280B" />

      {/* Top Main Navigation Header with Logo, Fixed Title & Hamburger Menu */}
      <MobileAppHeader
        showLogo={true}
        showMenu={true}
        subtitle="NUDA & DTCP APPROVED TOWNSHIPS"
        rightElement={
          <TouchableOpacity
            style={styles.adminLoginBtn}
            onPress={onOpenLogin}
            activeOpacity={0.8}
          >
            <LogIn size={14} color="#FFFFFF" />
            <Text style={styles.adminLoginBtnText}>Staff Login</Text>
          </TouchableOpacity>
        }
      />

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
      <View
        style={[
          styles.bottomNav,
          {
            paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          },
        ]}
      >
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
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
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
