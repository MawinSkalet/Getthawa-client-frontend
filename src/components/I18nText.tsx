"use client";
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
  const { t, i18n } = useTranslation();
  const text = i18n.isInitialized
    ? t(i18nKey, values)
    : fallback ?? (children as string) ?? i18nKey;
  return <span className={className}>{text}</span>;
}
