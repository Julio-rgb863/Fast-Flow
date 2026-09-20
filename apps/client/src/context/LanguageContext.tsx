import { createContext, useContext, useState, type ReactNode } from 'react';
import { pt, type Translations } from '../locales/pt';
import { en } from '../locales/en';

export type Language = 'pt' | 'en';

interface LanguageContextData {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const dictionaries: Record<Language, Translations> = {
  pt,
  en,
};

const LanguageContext = createContext({} as LanguageContextData);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('fastflow_lang');
    if (stored === 'pt' || stored === 'en') return stored;
    if (typeof navigator !== 'undefined' && navigator.language?.startsWith('en')) {
      return 'en';
    }
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('fastflow_lang', lang);
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  const t = dictionaries[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
