"use client";
import { useTranslation } from "react-i18next";
import { useHydrated } from "@/hooks/useHydrated";
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
  const hydrated = useHydrated();

  const fallbackText = fallback ?? (children as string) ?? i18nKey;
  const text = hydrated ? t(i18nKey, { ...values, defaultValue: fallbackText }) : fallbackText;

  return (
    <span className={className} suppressHydrationWarning>
      {text}
    </span>
  );
}
