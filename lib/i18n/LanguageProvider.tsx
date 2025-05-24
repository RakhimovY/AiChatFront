"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, Translation, translations, defaultLanguage } from './index';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with default language, but try to get from localStorage if available
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load language preference from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as LanguageCode | null;
    if (storedLanguage && translations[storedLanguage]) {
      setLanguageState(storedLanguage);
    }
    setIsLoaded(true);
  }, []);

  // Update html lang attribute when language changes
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.lang = language;
      localStorage.setItem('language', language);
    }
  }, [language, isLoaded]);

  const setLanguage = (newLanguage: LanguageCode) => {
    if (translations[newLanguage]) {
      setLanguageState(newLanguage);
    }
  };

  // Get translations for current language
  const t = translations[language];

  const value = {
    language,
    setLanguage,
    t
  };

  // Only render children after language is loaded from localStorage
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
