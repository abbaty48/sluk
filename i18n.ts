import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./src/locales/en.translation.json" with { type: "json" };
import translationAR from "./src/locales/ar.translation.json" with { type: "json" };
import translationHA from "./src/locales/ha.translation.json" with { type: "json" };
import translationFR from "./src/locales/fr.translation.json" with { type: "json" };
import translationCN from "./src/locales/ch.translation.json" with { type: "json" };

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
