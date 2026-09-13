import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { useMobileTheme } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'gold' | 'emerald' | 'dark' | 'outline' | 'glass';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}) => {
  const { colors, shadows } = useMobileTheme();

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'gold':
        return {
          button: {
            backgroundColor: colors.secondary,
            ...shadows.gold,
          },
          text: { color: '#FFFFFF' },
        };
      case 'emerald':
        return {
          button: {
            backgroundColor: colors.success,
            ...shadows.md,
          },
          text: { color: '#FFFFFF' },
        };
      case 'dark':
        return {
          button: {
            backgroundColor: colors.primaryDark,
            ...shadows.md,
          },
          text: { color: '#FFFFFF' },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.surfaceSubtle,
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: { color: colors.textPrimary },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'glass':
        return {
          button: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          text: { color: '#FFFFFF' },
        };
      case 'primary':
      default:
        return {
          button: {
            backgroundColor: colors.primary,
            ...shadows.sapphire,
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'small':
        return {
          button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
          text: { fontSize: 13, fontWeight: '700' },
        };
      case 'large':
        return {
          button: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
          text: { fontSize: 16, fontWeight: '800' },
        };
      case 'medium':
      default:
        return {
          button: { paddingVertical: 11, paddingHorizontal: 22, borderRadius: 12 },
          text: { fontSize: 14, fontWeight: '700' },
        };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.baseButton,
        variantStyle.button,
        sizeStyle.button,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.baseText,
              variantStyle.text,
              sizeStyle.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  baseText: {
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

