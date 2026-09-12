// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageProvider, useI18n } from '../providers/LanguageContext';

afterEach(() => {
  cleanup();
  localStorage.clear();
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

describe('LanguageSwitcher & i18n Provider', () => {
  it('renders default English language and allows switching to Telugu', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-lang').textContent).toBe('en');
    expect(screen.getByTestId('translated-title').textContent).toContain('Prime HMDA & DTCP');

    // Open language menu
    const button = screen.getByRole('button', { name: /English/i });
    fireEvent.click(button);

    // Select Telugu
    const teluguOption = screen.getByText('తెలుగు');
    expect(teluguOption).toBeInTheDocument();
    fireEvent.click(teluguOption);

    // Language state should now be 'te' and translated title should be in Telugu
    expect(screen.getByTestId('current-lang').textContent).toBe('te');
    expect(screen.getByTestId('translated-title').textContent).toContain('HMDA & DTCP ఆమోదిత');
    expect(localStorage.getItem('real_estate_erp_lang')).toBe('te');
  });
});
