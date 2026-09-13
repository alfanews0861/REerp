import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useMobileTheme } from '../theme';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'gold' | 'emerald' | 'error' | 'info' | 'neutral' | 'dark';
  size?: 'small' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  icon,
}) => {
  const { colors, isDark } = useMobileTheme();

  const getVariantStyles = (): { badge: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'gold':
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7',
            borderColor: isDark ? 'rgba(245, 158, 11, 0.4)' : '#FDE68A',
          },
          text: { color: isDark ? '#FBBF24' : '#B45309' },
        };
      case 'emerald':
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7',
            borderColor: isDark ? 'rgba(16, 185, 129, 0.4)' : '#A7F3D0',
          },
          text: { color: isDark ? '#34D399' : '#047857' },
        };
      case 'error':
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
            borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#FECACA',
          },
          text: { color: isDark ? '#F87171' : '#B91C1C' },
        };
      case 'info':
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#E0F2FE',
            borderColor: isDark ? 'rgba(56, 189, 248, 0.4)' : '#BAE6FD',
          },
          text: { color: isDark ? '#38BDF8' : '#0369A1' },
        };
      case 'dark':
        return {
          badge: {
            backgroundColor: isDark ? '#1E293B' : '#0F172A',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#1E293B',
          },
          text: { color: '#FFFFFF' },
        };
      case 'neutral':
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
          },
          text: { color: isDark ? '#94A3B8' : '#475569' },
        };
      case 'primary':
      default:
        return {
          badge: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#DBEAFE',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.4)' : '#BFDBFE',
          },
          text: { color: isDark ? '#60A5FA' : '#1D4ED8' },
        };
    }
  };

  const isSmall = size === 'small';
  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.baseBadge,
        variantStyles.badge,
        isSmall ? styles.smallBadge : styles.mediumBadge,
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.baseText,
          variantStyles.text,
          isSmall ? styles.smallText : styles.mediumText,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  baseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mediumBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  baseText: {
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 11,
  },
  icon: {
    marginRight: 4,
  },
});
