import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./public/locales/en.translation.json" with { type: "json" };
import translationAR from "./public/locales/ar.translation.json" with { type: "json" };
import translationHA from "./public/locales/ha.translation.json" with { type: "json" };
import translationFR from "./public/locales/fr.translation.json" with { type: "json" };
import translationCN from "./public/locales/ch.translation.json" with { type: "json" };

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
  ha: {
    translation: translationHA,
  },
  fr: {
    translation: translationFR,
  },
  ch: {
    translation: translationCN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
