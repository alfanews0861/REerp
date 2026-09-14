import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMobileTheme } from '../theme';
import { useMobileDrawer } from '../providers/MobileDrawerContext';
import { Menu, Building2, ArrowLeft } from 'lucide-react-native';

export interface MobileAppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  showMenu?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export const MobileAppHeader: React.FC<MobileAppHeaderProps> = ({
  subtitle = 'NUDA & DTCP APPROVED TOWNSHIPS',
  showLogo = true,
  showMenu = true,
  showBack = false,
  onBack,
  rightElement,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useMobileTheme();
  const { openDrawer } = useMobileDrawer();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: '#0F172A', // Crisp Premium Deep Navy Header
          paddingTop: Math.max(insets.top, 16) + 4,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)',
        },
      ]}
    >
      <View style={styles.headerRow}>
        {/* LEFT: Back Button or Hamburger Menu Button */}
        {showBack ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityLabel="Go Back"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openDrawer}
            activeOpacity={0.7}
            accessibilityLabel="Open Navigation Menu"
            accessibilityRole="button"
          >
            <Menu size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        {/* CENTER: Fixed Company Logo + Permanent 'ISKON DEVELOPERS' Title */}
        <TouchableOpacity
          style={styles.brandingContainer}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          {showLogo && (
            <View style={styles.logoBadge}>
              <Building2 size={20} color="#FFFFFF" />
            </View>
          )}

          <View style={styles.titleColumn}>
            <Text style={styles.companyTitle} numberOfLines={1}>
              ISKON DEVELOPERS
            </Text>
            <Text style={styles.companyTagline} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </TouchableOpacity>

        {/* RIGHT: Minimal Spacer or custom element if passed */}
        <View style={styles.rightContainer}>
          {rightElement ? rightElement : <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
  },
  brandingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 6,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: '#1E40AF',
    borderWidth: 1.2,
    borderColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  titleColumn: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  companyTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  companyTagline: {
    fontSize: 9,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 0.6,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
