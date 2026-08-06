"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/locales/i18n";

type Props = {
  i18nKey: string;
  fallback?: string;
  children?: React.ReactNode;
  className?: string;
  values?: Record<string, string | number | boolean | Date | null | undefined>;
};

export default function I18nText({
  i18nKey,
  fallback,
  children,
  className,
  values,
}: Props) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fallbackText = fallback ?? (children as string) ?? i18nKey;
  const text = mounted ? t(i18nKey, values) : fallbackText;

  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
