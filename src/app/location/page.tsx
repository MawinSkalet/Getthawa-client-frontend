
import SiteText from "@/components/SiteText";
import { Suspense } from "react";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Page() {
  return <main className="bg-[#514741] min-h-screen"><Suspense fallback={<p className="p-16 text-center text-white"><SiteText text={"Loading locations…"} /></p>}><LocationSection /></Suspense><ContactSection /></main>;
}
