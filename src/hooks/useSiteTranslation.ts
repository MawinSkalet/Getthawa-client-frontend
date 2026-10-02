"use client";
import { useCallback, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { translateCopy, type SiteLanguage } from "@/lib/siteTranslation";
import "@/locales/i18n";

const subscribe = () => () => {};
export function useSiteTranslation() {
  const { i18n } = useTranslation();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const resolved = mounted ? (i18n.resolvedLanguage || "en").split("-")[0] : "en";
  const language: SiteLanguage = resolved === "th" || resolved === "zh" ? resolved : "en";
  const tr = useCallback((text: string, values?: Record<string, string | number>) => translateCopy(text, language, values), [language]);
  return { tr, language, locale: language === "th" ? "th-TH" : language === "zh" ? "zh-CN" : "en-US" };
}
