import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations } from '../i18n/types';
import { TRANSLATIONS } from '../i18n/translations';
import { LOCALIZED_SIDE_EFFECTS, LocalizedSideEffectInfo } from '../i18n/sideEffectsLocalized';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  sideEffects: LocalizedSideEffectInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('compose_lab_lang') as Language;
      if (saved && (saved === 'es' || saved === 'pt' || saved === 'en')) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'pt'; // Default to PT / ES as requested by the user
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('compose_lab_lang', lang);
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language === 'pt' ? 'pt-BR' : language;
    } catch {
      // Ignore
    }
  }, [language]);

  const t = TRANSLATIONS[language];
  const sideEffects = LOCALIZED_SIDE_EFFECTS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, sideEffects }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
