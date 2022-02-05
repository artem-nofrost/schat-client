import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const defaultLocale =
    localStorage.getItem('lang') === 'en' ? localStorage.getItem('lang') : 'ru';

i18n
    // модуль инициализации
    .use(initReactI18next)
    .init({
        // Стандартный язык
        fallbackLng: defaultLocale,
        debug: false,
        resources: {
            en: {
                translation: require('./locales/en/translation.json'),
            },
            ru: {
                translation: require('./locales/ru/translation.json'),
            },
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
