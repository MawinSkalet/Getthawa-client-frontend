import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PromotionSection } from "@/components/sections/PromotionSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { ContactSection } from "@/components/sections/ContactSection";
import HomeHero from "@/components/HomeHero";
import Reveal from "@/components/Reveal";
import { LocationSection } from "@/components/sections/LocationSection";

export default async function Home() {
  return (
    <main className="text-white">
      <HomeHero />
      {/* Sections with semi-transparent backgrounds to show hero background through */}
      <div className="relative z-10 bg-gradient-to-b from-[#382924]/80 via-[#58392F]/85 to-[#382924]/90">
        <Reveal delay={50}>
          <ServicesSection />
        </Reveal>
        <Reveal delay={100}>
          <PromotionSection />
        </Reveal>
        <Reveal delay={150}>
          <LocationSection />
        </Reveal>
        <Reveal delay={200}>
          <BranchesSection />
        </Reveal>
        <Reveal delay={250}>
          <TestimonialsSection />
        </Reveal>
        <Reveal delay={300}>
          <ContactSection />
        </Reveal>
      </div>
    </main>
  );
}
