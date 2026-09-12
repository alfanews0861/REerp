import { describe, it, expect } from 'vitest';
import { getTranslation, TRANSLATIONS, SUPPORTED_LANGUAGES } from './i18n';

describe('i18n Multilingual Translations', () => {
  it('should have English, Telugu, and Hindi defined', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(3);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('te');
    expect(codes).toContain('hi');
  });

  it('should return English translation by default', () => {
    const text = getTranslation('nav_home', 'en');
    expect(text).toBe('Home');
  });

  it('should return Telugu translation accurately', () => {
    const text = getTranslation('nav_home', 'te');
    expect(text).toBe('హోమ్');

    const heroTitle = getTranslation('hero_title', 'te');
    expect(heroTitle).toContain('HMDA & DTCP');

    const vastu = getTranslation('vastu_compliant', 'te');
    expect(vastu).toBe('100% వాస్తు ఆమోదితం');
  });

  it('should return Hindi translation accurately', () => {
    const text = getTranslation('nav_home', 'hi');
    expect(text).toBe('होम');

    const plots = getTranslation('inventory_title', 'hi');
    expect(plots).toContain('खुले भूखंड');
  });

  it('should fallback to English if key is missing in target language', () => {
    const fallbackText = getTranslation('non_existent_key_xyz', 'te');
    expect(fallbackText).toBe('non_existent_key_xyz');
  });
});
