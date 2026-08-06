"use client";

import { useTranslation } from "react-i18next";
import { getLocaleFontClass } from "@/lib/fonts";

export function useLocaleFontClass() {
  const { i18n } = useTranslation();
  const language = i18n.language ?? i18n.resolvedLanguage ?? "";
  return getLocaleFontClass(language);
}
