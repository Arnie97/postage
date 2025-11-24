import { writable } from 'svelte/store';

export type Language = 'en' | 'zh-TW' | 'zh-CN';

const DEFAULT_LANGUAGE: Language = 'en';

// Get saved language from localStorage or use default
const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const saved = localStorage.getItem('language') as Language;
  if (saved && ['en', 'zh-TW', 'zh-CN'].includes(saved)) {
    return saved;
  }

  // Auto-detect from browser
  const browserLang = navigator.language;
  if (browserLang.startsWith('zh-TW') || browserLang === 'zh-Hant') return 'zh-TW';
  if (browserLang.startsWith('zh-CN') || browserLang === 'zh-Hans') return 'zh-CN';

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
