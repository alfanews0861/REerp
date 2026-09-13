export interface MobileColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accentGold: string;
  accentGoldLight: string;
  accentEmerald: string;
  accentEmeraldLight: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceCard: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textGold: string;
  border: string;
  borderFocus: string;
  borderGold: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  status: {
    lead: string;
    hot: string;
    warm: string;
    cold: string;
    booked: string;
    sold: string;
    cancelled: string;
  };
  gradients: {
    primary: readonly [string, string];
    gold: readonly [string, string];
    emerald: readonly [string, string];
    dark: readonly [string, string];
    cardLuxury: readonly [string, string];
  };
}

export const lightColors: MobileColors = {
  // Brand & Accent Colors
  primary: '#1E40AF', // Deep Imperial Sapphire
  primaryLight: '#3B82F6',
  primaryDark: '#0F172A',
  
  secondary: '#D97706', // Royal Champagne Gold / Amber
  secondaryLight: '#F59E0B',
  secondaryDark: '#B45309',

  accentGold: '#D97706',
  accentGoldLight: '#FDE68A',
  accentEmerald: '#059669',
  accentEmeraldLight: '#D1FAE5',

  // Surfaces & Backgrounds
  background: '#F8FAFC', // Crisp Pearl Slate
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceCard: '#FFFFFF',

  // Text & Content
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textGold: '#B45309',

  // Borders & Dividers
  border: '#E2E8F0',
  borderFocus: '#1E40AF',
  borderGold: '#FDE68A',

  // Semantic Status
  success: '#059669',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  info: '#0284C7',
  infoLight: '#E0F2FE',

  // Status Chip Colors
  status: {
    lead: '#64748B',
    hot: '#DC2626',
    warm: '#D97706',
    cold: '#0284C7',
    booked: '#7C3AED',
    sold: '#059669',
    cancelled: '#64748B',
  },

  // Gradient Colors
  gradients: {
    primary: ['#1E40AF', '#0F172A'] as const,
    gold: ['#F59E0B', '#D97706'] as const,
    emerald: ['#10B981', '#059669'] as const,
    dark: ['#1E293B', '#0F172A'] as const,
    cardLuxury: ['#FFFFFF', '#F8FAFC'] as const,
  },
};

export const darkColors: MobileColors = {
  // Brand & Accent Colors
  primary: '#3B82F6', // Glowing Sapphire Token
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',

  secondary: '#F59E0B', // Radiant Champagne Gold Token
  secondaryLight: '#FBBF24',
  secondaryDark: '#D97706',

  accentGold: '#F59E0B',
  accentGoldLight: '#78350F',
  accentEmerald: '#10B981',
  accentEmeraldLight: '#064E3B',

  // Surfaces & Backgrounds
  background: '#0B0F17', // OLED Obsidian Canvas
  surface: '#111827',
  surfaceSubtle: '#1E293B',
  surfaceCard: '#111827',

  // Text & Content
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0F172A',
  textGold: '#FBBF24',

  // Borders & Dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocus: '#3B82F6',
  borderGold: 'rgba(245, 158, 11, 0.3)',

  // Semantic Status
  success: '#10B981',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#78350F',
  error: '#F87171',
  errorLight: '#7F1D1D',
  info: '#38BDF8',
  infoLight: '#082F49',

  // Status Chip Colors
  status: {
    lead: '#64748B',
    hot: '#F87171',
    warm: '#FBBF24',
    cold: '#38BDF8',
    booked: '#A855F7',
    sold: '#10B981',
    cancelled: '#475569',
  },

  // Gradient Colors
  gradients: {
    primary: ['#3B82F6', '#1D4ED8'] as const,
    gold: ['#FBBF24', '#D97706'] as const,
    emerald: ['#34D399', '#059669'] as const,
    dark: ['#1E293B', '#0B0F17'] as const,
    cardLuxury: ['#111827', '#0F172A'] as const,
  },
};

