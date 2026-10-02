import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "../../public/locales/en/translation.json";
import th from "../../public/locales/th/translation.json";
import zh from "../../public/locales/zh/translation.json";
export const languages = ["en", "th", "zh"] as const;
export type Language = (typeof languages)[number];
if (!i18n.isInitialized) {
  if (typeof window !== "undefined") i18n.use(LanguageDetector);
  i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, th: { translation: th }, zh: { translation: zh } },
    fallbackLng: "en", supportedLngs: languages, load: "languageOnly",
    ...(typeof window === "undefined" ? { lng: "en" } : {}),
    interpolation: { escapeValue: false },
    detection: { order: ["cookie", "localStorage", "navigator"], caches: ["cookie"] },
    react: { useSuspense: false },
  });
}
export default i18n;
