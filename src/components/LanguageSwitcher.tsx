"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { type Language } from "@/locales/i18n";
import "@/locales/i18n";

export default function LanguageSwitcher({
  variant = "icon",
  className = "",
}: {
  variant?: "icon" | "button";
  className?: string;
}) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [lng, setLng] = useState<Language>("en");

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
      setLng(i18n.language as Language);
    } else {
      const onInit = () => {
        setReady(true);
        setLng(i18n.language as Language);
      };
      i18n.on("initialized", onInit);
      return () => {
        i18n.off("initialized", onInit);
      };
    }
  }, [i18n]);

  const toggleLanguage = async () => {
    const next = (lng === "en" ? "th" : "en") as Language;
    await i18n.changeLanguage(next);
    // Persist for detector
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("i18nextLng", next);
        document.cookie = `i18next=${next}; path=/; max-age=${
          60 * 60 * 24 * 365
        }`;
      }
    } catch {}
    setLng(next);
  };

  if (!ready) return null;

  if (variant === "button") {
    return (
      <button
        onClick={toggleLanguage}
        className={`px-3 py-1 rounded-md border border-white/30 text-white/90 hover:bg-white/10 transition ${className}`}
        aria-label="Change language"
      >
        {lng === "en" ? "ไทย" : "EN"}
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      aria-label="Change language"
      className={`p-1 rounded hover:bg-white/10 transition-colors ${className}`}
    >
      <Image
        src="https://img.icons8.com/ios/50/FFFFFF/globe--v1.png"
        alt="language selector"
        width={30}
        height={30}
      />
    </button>
  );
}
