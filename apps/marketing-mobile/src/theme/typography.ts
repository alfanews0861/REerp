import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  } as TextStyle,

  h4: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  } as TextStyle,

  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  bodyBold: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,

  badge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  button: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
};

export const TELUGU_FONT = 'Mallanna';

export const isTelugu = (text?: string | null): boolean => {
  if (!text) return false;
  return /[\u0C00-\u0C7F]/.test(text);
};

export const teluguFont: TextStyle = {
  fontFamily: TELUGU_FONT,
};

export const getTeluguFontStyle = (text?: string | null): TextStyle => {
  if (isTelugu(text)) {
    return { fontFamily: TELUGU_FONT };
  }
  return {};
};

