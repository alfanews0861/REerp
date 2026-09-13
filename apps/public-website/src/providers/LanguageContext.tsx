import { createContext, useContext, ReactNode, FC } from 'react';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  getTranslation,
  LanguageOption,
} from '@real-estate-erp/utils';

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const language: SupportedLanguage = 'en';

  const setLanguage = (_lang: SupportedLanguage) => {
    // English is fixed
  };

  const t = (key: string): string => {
    return getTranslation(key, 'en');
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useI18n = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'en',
      setLanguage: () => {},
      t: (key: string) => getTranslation(key, 'en'),
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
