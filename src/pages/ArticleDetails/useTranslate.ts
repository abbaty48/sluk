import { useState } from "react";
import { useTranslation } from "react-i18next";

export function useTranslateSummary(stopSpeech: () => void) {
  const [lang, setLang] = useState<string>("en");
  const { t, i18n } = useTranslation();

  // Language switcher
  const changeLanguage = (lang: string) => {
    setLang(lang);
    stopSpeech();
    i18n.changeLanguage(lang);
  };

  return { t, i18n, lang, changeLanguage };
}
