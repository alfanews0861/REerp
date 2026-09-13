import { describe, it, expect } from 'vitest';
import { getTranslation, SUPPORTED_LANGUAGES } from './i18n';

describe('i18n English-Only Translation System', () => {
  it('should have English as the only supported language', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(1);
    expect(SUPPORTED_LANGUAGES[0].code).toBe('en');
    expect(SUPPORTED_LANGUAGES[0].label).toBe('English');
  });

  it('should return English translation for valid keys', () => {
    const text = getTranslation('nav_home');
    expect(text).toBe('Home');

    const heroTitle = getTranslation('hero_title');
    expect(heroTitle).toContain('HMDA & DTCP');

    const vastu = getTranslation('vastu_compliant');
    expect(vastu).toBe('100% Vaastu Compliant');
  });

  it('should fallback to key if key is not found', () => {
    const fallbackText = getTranslation('non_existent_key_xyz');
    expect(fallbackText).toBe('non_existent_key_xyz');
  });
});

