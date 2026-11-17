import { afterEach, describe, expect, it, vi } from 'vitest';
import { get } from 'svelte/store';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

async function loadLanguage(browserLanguage: string, savedLanguage: string | null = null) {
  const storage = {
    getItem: vi.fn(() => savedLanguage),
    setItem: vi.fn(),
  };
  vi.stubGlobal('window', {});
  vi.stubGlobal('navigator', { language: browserLanguage });
  vi.stubGlobal('localStorage', storage);
  const module = await import('./language');
  return { ...module, storage };
}

describe('language selection', () => {
  it.each([
    'fr',
    'fr-FR',
    'fr-CA',
    'FR-ca',
    'fr-gallo',
    'es-MX',
    'ES-mx',
    'it-CH',
    'pt-BR',
    'ro-MD',
    'ca-ES-valencia',
    'gl-ES',
    'ht-HT',
  ])('defaults to French for the browser locale %s', async (locale) => {
    const { language } = await loadLanguage(locale);
    expect(get(language)).toBe('fr');
  });

  it.each(['en-US', 'de-FR', 'eu-ES', 'br-FR', 'rom', 'esx', 'zhx-CN'])(
    'does not match unrelated browser locale %s as French',
    async (locale) => {
      const { language } = await loadLanguage(locale);
      expect(get(language)).toBe('en');
    },
  );

  it.each([
    ['zh-CN', 'zh-CN'],
    ['zh-Hans', 'zh-CN'],
    ['zh-Hans-HK', 'zh-CN'],
    ['zh-SG', 'zh-CN'],
    ['ZH-sg-u-nu-hanidec', 'zh-CN'],
    ['zh-MY', 'zh-CN'],
    ['zh', 'zh-CN'],
    ['zh-tw', 'zh-TW'],
    ['zh-Hant', 'zh-TW'],
    ['zh-hant-SG', 'zh-TW'],
    ['zh-hanT-HK', 'zh-TW'],
    ['zh-HK', 'zh-TW'],
    ['zh-MO', 'zh-TW'],
    ['zh-MM', 'zh-CN'],
  ] as const)('detects Chinese locale %s', async (locale, expected) => {
    const { language } = await loadLanguage(locale);
    expect(get(language)).toBe(expected);
  });

  it('restores a saved French preference before the browser locale', async () => {
    const { language } = await loadLanguage('en-US', 'fr');
    expect(get(language)).toBe('fr');
  });

  it('keeps an existing saved preference ahead of French browser detection', async () => {
    const { language } = await loadLanguage('es-MX', 'zh-CN');
    expect(get(language)).toBe('zh-CN');
  });

  it('keeps a saved English preference for a Romance browser locale', async () => {
    const { language } = await loadLanguage('it-IT', 'en');
    expect(get(language)).toBe('en');
  });

  it('saves French when selected', async () => {
    const { language, setLanguage, storage } = await loadLanguage('en-US');
    setLanguage('fr');
    expect(get(language)).toBe('fr');
    expect(storage.setItem).toHaveBeenLastCalledWith('language', 'fr');
  });
});
