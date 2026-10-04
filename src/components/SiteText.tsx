"use client";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";

export default function SiteText({ text, values }: { text: string; values?: Record<string, string | number> }) {
  const { tr } = useSiteTranslation();
  return <>{tr(text, values)}</>;
}
