import Image from "next/image";
import { getPackage } from "@/hooks/usePackage";
import I18nText from "@/components/I18nText";
import ServiceSlider from "@/components/ServiceSlider";
import LocaleFont from "@/components/LocaleFont";

export async function PromotionSection() {
  const data = await getPackage();
  const promotions = data.filter((p) => p.type === "promotion" && p.isActive);

  // New: adapt promotions to ServiceSlider card format (highlight bundles)
  const promotionCards = promotions.map((promo) => ({
    id: promo.id,
    title: promo.title,
    description:
      promo.description ||
      promo.note ||
      "Exclusive bundled experience combining multiple signature treatments.",
    image: promo.pictureUrl || "/aromapics.png",
    bgImage: promo.pictureUrl || "/aromapics.png",
    cta: "Book Bundle",
    href: "/booking",
    price: promo.price,
    duration: promo.duration?.toString?.() || String(promo.duration || ""),
  }));

  // New: background image (first promotion or fallback)
  const heroBg = promotionCards[0]?.bgImage || "/aromapics.png";

  return (
    <section
      id="promotion"
      className="scroll-mt-[140px] w-full px-0 pt-4 md:pt-6  text-white relative -mt-2"
    >
      {/* Full section background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          className="object-cover w-full h-full opacity-55"
        />
        {/* Soft color wash + vignette */}
        <div className="absolute inset-0 bg-[#2a1d19]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#382924]/40 via-[#4A332B]/65 to-[#58392F]/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Header with adaptive translucent background (simplified to let image show through) */}
      <div className="max-w-6xl mx-auto px-4 mb-10">
        <div className="relative overflow-hidden rounded-3xl px-6 md:px-10 py-8 md:py-10 border border-white/10 bg-white/5 backdrop-blur-md">
          {/* Decorative subtle glows */}
          <div className="absolute -top-20 -right-10 w-64 h-64 rounded-full bg-[#DCA900]/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-[#DCA900]/10 blur-3xl" />
          <LocaleFont
            as="h2"
            className="text-[#DCA900] text-3xl md:text-5xl text-center mb-4 drop-shadow-[0_2px_6px_rgba(220,169,0,0.35)]"
          >
            <I18nText
              i18nKey="sections.promotion.title"
              fallback="Special Promotions"
            />
          </LocaleFont>
          <p className="text-center text-white/85 max-w-3xl mx-auto text-sm md:text-base leading-relaxed">
            <I18nText
              i18nKey="sections.promotion.description"
              fallback="Enhanced bundles combining our most loved services for superior value and experience."
            />
          </p>
        </div>
      </div>

      {/* Slider / Empty state */}
      {promotionCards.length > 0 ? (
        <ServiceSlider cards={promotionCards} tallCards />
      ) : (
        <div className="glass rounded-3xl p-12 text-center max-w-4xl mx-auto bg-white/10 backdrop-blur-md">
          <p className="text-white/70 text-lg">
            <I18nText
              i18nKey="sections.promotion.empty"
              fallback="No promotions available at the moment. Check back soon!"
            />
          </p>
        </div>
      )}
    </section>
  );
}
