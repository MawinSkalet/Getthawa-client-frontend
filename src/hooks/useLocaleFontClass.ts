"use client";

import { useTranslation } from "react-i18next";
import { getLocaleFontClass, defaultFont } from "@/lib/fonts";
import { useHydrated } from "@/hooks/useHydrated";

export function useLocaleFontClass() {
  const { i18n } = useTranslation();
  const hydrated = useHydrated();

  if (!hydrated) {
    return defaultFont.className;
  }

  const language = i18n.language ?? i18n.resolvedLanguage ?? "";
  return getLocaleFontClass(language);
}
