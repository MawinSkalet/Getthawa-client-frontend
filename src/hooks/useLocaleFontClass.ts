"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocaleFontClass, defaultFont } from "@/lib/fonts";

export function useLocaleFontClass() {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return defaultFont.className;
  }

  const language = i18n.language ?? i18n.resolvedLanguage ?? "";
  return getLocaleFontClass(language);
}
