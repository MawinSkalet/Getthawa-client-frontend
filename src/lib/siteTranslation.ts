import copy from "@/locales/copy.json";
import en from "../../public/locales/en/translation.json";
import th from "../../public/locales/th/translation.json";
import zh from "../../public/locales/zh/translation.json";

export type SiteLanguage = "en" | "th" | "zh";
export const languageIndex = { en: 0, th: 1, zh: 2 };
const phrases = new Map<string, string[]>();
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
function collect(english: Record<string, unknown>, thai: Record<string, unknown>, chinese: Record<string, unknown>) {
  for (const [key, value] of Object.entries(english)) {
    if (typeof value === "string") phrases.set(normalize(value), [value, String(thai[key] ?? value), String(chinese[key] ?? value)]);
    else if (value && typeof value === "object") collect(value as Record<string, unknown>, (thai[key] ?? {}) as Record<string, unknown>, (chinese[key] ?? {}) as Record<string, unknown>);
  }
}
collect(en, th, zh);
for (const [key, values] of Object.entries(copy)) phrases.set(normalize(key), values);

export function translateCopy(text: string, language: SiteLanguage, values: Record<string, string | number> = {}): string {
  const normalized = normalize(text);
  const duration = normalized.match(/\s*\((\d+)\s*mins?\)\s*$/i);
  const base = normalized.replace(/\s*\(\d+\s*mins?\)\s*$/i, "").replace(/^\d+\.\d+\s*/, "");
  const entry = phrases.get(normalized) ?? phrases.get(base);
  let translated = entry?.[languageIndex[language]] ?? text;
  if (duration && entry && !phrases.has(normalized)) translated += " (" + translateCopy("{{duration}} min", language, { duration: duration[1] }) + ")";
  return translated.replace(/{{(\w+)}}/g, (match, key) => String(values[key] ?? match));
}
