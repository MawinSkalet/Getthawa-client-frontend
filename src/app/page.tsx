import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PromotionSection } from "@/components/sections/PromotionSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import HomeHero from "@/components/HomeHero";
import MassageMenu from "@/components/MassageMenu";

export default async function Home() {
  return (
    <main className="reference-home overflow-x-hidden min-h-screen">
      {/* Hero & About Sections */}
      <HomeHero />

      {/* Sections follow the supplied reference layout. */}
      <div className="relative z-10">
        {/* 1. Promotion Section */}
        <PromotionSection />

        {/* 2. Service Section (Featured treatment slider + menu) */}
        <ServicesSection menu={<MassageMenu />} />

        {/* 3. Location / Branches Cards */}
        <BranchesSection />

        {/* Guest reviews */}
        <TestimonialsSection />

        {/* Contact details */}
        <ContactSection />
      </div>
    </main>
  );
}
