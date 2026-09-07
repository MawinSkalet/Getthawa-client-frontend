import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PromotionSection } from "@/components/sections/PromotionSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import HomeHero from "@/components/HomeHero";
import { LocationSection } from "@/components/sections/LocationSection";

export default async function Home() {
  return (
    <main className="reference-home text-white thai-pattern-bg overflow-x-hidden min-h-screen">
      {/* Hero & About Sections */}
      <HomeHero />

      {/* Main Content Sections matching Figma Flow */}
      <div className="relative z-10">
        {/* 1. Promotion Section */}
        <PromotionSection />

        {/* 2. Service Section (Featured treatment slider + menu) */}
        <ServicesSection />

        {/* 3. Location / Branches Cards */}
        <BranchesSection />

        {/* 4. Interactive Google Maps & Reviews Panel */}
        <LocationSection />

        {/* 5. Testimonials Marquee */}
        <TestimonialsSection />

        {/* 6. Contact Us / Footer */}
        <ContactSection />
      </div>
    </main>
  );
}
