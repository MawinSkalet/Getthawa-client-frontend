import Image from "next/image";
import { getPackage } from "@/hooks/usePackage";
import I18nText from "@/components/I18nText";
import ServiceSlider from "@/components/ServiceSlider";
import LocaleFont from "@/components/LocaleFont";

export async function ServicesSection() {
  const data = await getPackage();
  const services = data.filter((p) => p.type === "service" && p.isActive);

  // Transform services data to ServiceSlider format
  const serviceCards = services.slice(0, 4).map((service) => ({
    id: service.id,
    title: service.title,
    description:
      service.description ||
      "Experience our premium Thai massage service with expert techniques.",
    image: service.pictureUrl || "/aromapics.png",
    bgImage: service.pictureUrl || "/aromapics.png",
    cta: "Book Now",
    href: "/booking",
    price: service.price,
    duration: service.duration.toString(),
  }));

  // New: background image source (first service or fallback)
  const heroBg = serviceCards[0]?.bgImage || "/aromapics.png";

  return (
    <section
      id="services"
      className="scroll-mt-[140px] w-full px-0 pt-4 text-white relative overflow-hidden"
    >
      {/* Full section background image + overlays (added) */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          className="object-cover w-full h-full opacity-55"
        />
        <div className="absolute inset-0 bg-[#2a1d19]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#382924]/40 via-[#4A332B]/65 to-[#58392F]/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Section Header (wrapped in translucent panel to let bg flow) */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="relative rounded-3xl px-6 py-8 md:py-10 bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-[#DCA900]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[#DCA900]/10 blur-3xl" />
          <LocaleFont
            as="h2"
            className="text-[#DCA900] text-3xl md:text-5xl text-center mb-0 drop-shadow-[0_2px_6px_rgba(220,169,0,0.35)]"
          >
            <I18nText
              i18nKey="sections.services.title"
              fallback="Get to know our services"
            />
          </LocaleFont>
        </div>
      </div>

      {/* Full Width Service Cards Slider */}
      <ServiceSlider cards={serviceCards} tallCards />
    </section>
  );
}
