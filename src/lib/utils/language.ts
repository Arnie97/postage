import { writable } from 'svelte/store';

export type Language = 'en' | 'fr' | 'zh-TW' | 'zh-CN';

const DEFAULT_LANGUAGE: Language = 'en';

// Get saved language from localStorage or use default
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const saved = localStorage.getItem('language') as Language;
  if (saved && ['en', 'fr', 'zh-TW', 'zh-CN'].includes(saved)) {
    return saved;
  }

  // Auto-detect from browser
  const browserLocale = navigator.language.toLowerCase();
  const languageCode = browserLocale.split('-')[0];
  const matchesBrowserLanguage = (languages: string[]): boolean =>
    languages.some((language) => {
      const pattern = language.toLowerCase();
      return pattern.includes('-') ? browserLocale.startsWith(pattern) : languageCode === pattern;
    });

  if (matchesBrowserLanguage(['zh-Hant', 'zh-TW', 'zh-HK', 'zh-MO'])) return 'zh-TW';
  if (matchesBrowserLanguage(['zh-Hans', 'zh-CN', 'zh-SG', 'zh-MY', 'zh'])) return 'zh-CN';
  if (matchesBrowserLanguage(['fr', 'es', 'it', 'pt', 'ro', 'ca', 'gl', 'ht'])) return 'fr';
  return DEFAULT_LANGUAGE;
};

export const language = writable<Language>(getInitialLanguage());

// Save to localStorage when language changes
language.subscribe((lang) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
});

export const setLanguage = (lang: Language) => {
  language.set(lang);
};
