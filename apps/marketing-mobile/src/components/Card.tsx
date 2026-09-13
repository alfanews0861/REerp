import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useMobileTheme } from '../theme';

export interface CardProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'gold' | 'sapphire' | 'dark' | 'glass';
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerRight,
  children,
  style,
  variant = 'default',
  noPadding = false,
}) => {
  const { colors, shadows } = useMobileTheme();

  const getVariantStyles = (): { card: ViewStyle; title: TextStyle; subtitle: TextStyle } => {
    switch (variant) {
      case 'gold':
        return {
          card: {
            backgroundColor: colors.surfaceCard,
            borderLeftWidth: 4,
            borderLeftColor: colors.secondary,
            ...shadows.md,
          },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
        };
      case 'sapphire':
        return {
          card: {
            backgroundColor: colors.surfaceCard,
            borderLeftWidth: 4,
            borderLeftColor: colors.primary,
            ...shadows.md,
          },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
        };
      case 'dark':
        return {
          card: {
            backgroundColor: colors.primaryDark,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            ...shadows.lg,
          },
          title: { color: '#FFFFFF' },
          subtitle: { color: '#94A3B8' },
        };
      case 'glass':
        return {
          card: {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            ...shadows.sm,
          },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
        };
      case 'default':
      default:
        return {
          card: {
            backgroundColor: colors.surfaceCard,
            borderColor: colors.border,
            ...shadows.sm,
          },
          title: { color: colors.textPrimary },
          subtitle: { color: colors.textSecondary },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View
      style={[
        styles.baseCard,
        variantStyles.card,
        noPadding ? styles.noPadding : styles.padding,
        style,
      ]}
    >
      {(title || subtitle || headerRight) && (
        <View style={styles.headerRow}>
          <View style={styles.headerTitles}>
            {title && (
              <Text style={[styles.title, variantStyles.title]}>{title}</Text>
            )}
            {subtitle && (
              <Text style={[styles.subtitle, variantStyles.subtitle]}>
                {subtitle}
              </Text>
            )}
          </View>
          {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
        </View>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
  },
  padding: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitles: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});

