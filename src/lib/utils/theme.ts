import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';

// Check for saved theme preference or default to 'light'
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

// Create theme store
export const theme = writable<Theme>(getInitialTheme());

// Theme setter function
export const setTheme = (newTheme: Theme) => {
  theme.set(newTheme);
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  theme.subscribe((currentTheme) => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  });
}
