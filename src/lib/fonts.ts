import { Tiro_Gurmukhi, Noto_Sans_Thai } from "next/font/google";

export const defaultFont = Tiro_Gurmukhi({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export const thaiFont = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
});

export const getLocaleFontClass = (language?: string | null) =>
  language?.startsWith("th") ? thaiFont.className : defaultFont.className;
