import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';

export type Lang = 'en' | 'ur';
export const LANG_STORAGE_KEY = 'lang';

// English ships in the main bundle (it's also what the page is prerendered in). Urdu text and the
// Urdu fonts are fetched only when someone switches to Urdu.
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    lng: 'en', // first render is always English so it matches the prerendered HTML
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    initAsync: false,
    interpolation: { escapeValue: false }, // React escapes; WhatsApp text must stay raw
    detection: { order: ['localStorage'], lookupLocalStorage: LANG_STORAGE_KEY, caches: ['localStorage'] },
    react: { useSuspense: false },
  });

if (typeof document !== 'undefined') {
  i18n.on('languageChanged', (lng) => {
    document.documentElement.lang = lng;
    document.documentElement.dir = i18n.dir(lng);
  });
}

async function loadUrduFonts() {
  await Promise.all([
    import('@fontsource/noto-nastaliq-urdu/400.css'),
    import('@fontsource/noto-nastaliq-urdu/700.css'),
    import('@fontsource/noto-naskh-arabic/400.css'),
    import('@fontsource/noto-naskh-arabic/600.css'),
  ]);
  // Wait (briefly) for the faces so the switch happens once, without a second reflow.
  const ready = Promise.all([
    document.fonts.load('400 20px "Noto Nastaliq Urdu"', 'اردو'),
    document.fonts.load('400 16px "Noto Naskh Arabic"', 'اردو'),
  ]);
  await Promise.race([ready, new Promise((r) => setTimeout(r, 2500))]);
}

/** Switch language: loads Urdu text + fonts on first use, then updates <html lang/dir>. */
export async function setLanguage(lng: Lang): Promise<void> {
  if (lng === 'ur' && !i18n.hasResourceBundle('ur', 'translation')) {
    const [ur] = await Promise.all([import('./locales/ur.json'), loadUrduFonts()]);
    i18n.addResourceBundle('ur', 'translation', ur.default, true, true);
  }
  await i18n.changeLanguage(lng);
}

/** Saved choice, read after hydration. */
export function savedLanguage(): Lang | null {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === 'ur' ? 'ur' : null;
  } catch {
    return null;
  }
}

export default i18n;
