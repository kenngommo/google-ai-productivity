import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../translations';

export type Language = 'vi' | 'en';

type TranslationKey = keyof typeof translations['vi'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Vietnamese is the default language as requested
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: TranslationKey): string => {
    const translationSet = translations[language];
    // Fallback to Vietnamese if translation key does not exist (fallback safety)
    return (translationSet[key] || translations['vi'][key] || key) as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
