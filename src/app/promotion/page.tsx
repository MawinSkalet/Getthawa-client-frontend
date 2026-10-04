import type { Metadata } from "next";
import { PromotionSection } from "@/components/sections/PromotionSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = { title: "Promotions | Getthawha Thai Massage" };

export default function Page() {
  return <main className="promotion-page"><PromotionSection standalone /><ContactSection /></main>;
}
