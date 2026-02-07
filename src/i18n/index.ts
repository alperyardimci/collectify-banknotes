import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { File, Paths } from 'expo-file-system/next';
import en from './locales/en.json';
import tr from './locales/tr.json';

const LANG_FILE = new File(Paths.document, 'language-preference.txt');

const getSavedLanguage = (): string | null => {
  try {
    if (LANG_FILE.exists) {
      return LANG_FILE.text() as unknown as string;
    }
  } catch {}
  return null;
};

const getInitialLanguage = (): string => {
  const saved = getSavedLanguage();
  if (saved === 'en' || saved === 'tr') return saved;
  const deviceLocale = getLocales()[0]?.languageCode ?? 'en';
  return deviceLocale === 'tr' ? 'tr' : 'en';
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, tr: { translation: tr } },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export const changeLanguage = (lng: string) => {
  try {
    LANG_FILE.create();
    LANG_FILE.write(lng);
  } catch {}
  i18n.changeLanguage(lng);
};

export default i18n;
