import { ru } from './ru';
import { kk } from './kk';
import { en } from './en';

export type Translation = typeof ru;

export const translations = {
  ru,
  kk,
  en
};

export type LanguageCode = keyof typeof translations;

export const languageNames: Record<LanguageCode, string> = {
  ru: 'Русский',
  kk: 'Қазақша',
  en: 'English'
};

export const defaultLanguage: LanguageCode = 'ru';