import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLangCode } from 'utils/i18n';
import resources from './i18n/resources';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: typeof window !== 'undefined' ? localStorage.getItem('lang') || getLangCode(navigator.language) : null,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
