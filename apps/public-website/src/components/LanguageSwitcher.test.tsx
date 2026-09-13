// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageProvider, useI18n } from '../providers/LanguageContext';

afterEach(() => {
  cleanup();
});

const TestConsumer = () => {
  const { language, t } = useI18n();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-title">{t('hero_title')}</span>
      <LanguageSwitcher />
    </div>
  );
};

describe('LanguageProvider (English Only)', () => {
  it('renders default English language and English translated title', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('translated-title').textContent).toContain('Prime HMDA & DTCP');
  });
});
