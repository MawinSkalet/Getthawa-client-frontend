import Image from "next/image";
import PromotionImage from "@/components/PromotionImage";
import Link from "next/link";
import { getPackage } from "@/hooks/usePackage";
import I18nText from "@/components/I18nText";
import LocaleFont from "@/components/LocaleFont";

export async function PromotionSection() {
  const data = await getPackage();
  const promotions = data.filter((p) => p.type === "promotion" && p.isActive);

  type PromoGroup = {
    id: string;
    title: string;
    description: string;
    priceText: string;
    imageSrc: string;
  };

  const promoMap = new Map<string, PromoGroup>();

  promotions.forEach((p) => {
    const cleanTitle = p.title.replace(/\s*\(\d+\s*mins?\)/i, "").trim();
    
    let imageSrc = p.pictureUrl;
    if (cleanTitle.includes("ชุดสุดคุ้ม") || cleanTitle.includes("Lanna")) {
      imageSrc = "/home-pic1.jpg";
    } else if (cleanTitle.includes("ออฟฟิศ") || cleanTitle.includes("Office")) {
      imageSrc = "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg";
    } else if (cleanTitle.includes("อบตัว") || cleanTitle.includes("Scrub")) {
      imageSrc = "/figma-assets/1fff3681-6558-40ee-81ae-c652f729444a1762428977626.webp";
    }

    if (!promoMap.has(cleanTitle)) {
      promoMap.set(cleanTitle, {
        id: p.id,
        title: cleanTitle,
        description: `${p.duration} นาที • ฿${Math.round(Number(p.price)).toLocaleString()}`,
        priceText: `฿${Math.round(Number(p.price)).toLocaleString()}`,
        imageSrc,
      });
    } else {
      const existing = promoMap.get(cleanTitle)!;
      existing.description = `90 นาที (฿${Math.round(Number(existing.priceText.replace("฿", "")))}) • ${p.duration} นาที (฿${Math.round(Number(p.price)).toLocaleString()})`;
    }
  });

  const displayPromos = Array.from(promoMap.values());

  return (
    <section
      id="promotion"
      className="scroll-mt-[100px] w-full py-16 md:py-20 px-4 md:px-8 text-white relative border-t border-[#4A3228]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Badge Header matching Figma */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="text-[#E5B869] font-bold text-xs md:text-sm tracking-[0.3em] uppercase">
              PROMOTION
            </span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
          </div>
          <LocaleFont
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#E5B869] font-semibold mt-1"
          >
            <I18nText
              i18nKey="sections.promotion.title"
              fallback="Special Promotions & Packages"
            />
          </LocaleFont>
          <p className="text-[#D8C0B2] text-xs sm:text-sm mt-2 max-w-lg">
            ชุดสุดคุ้มเพื่อสุขภาพ ราคาสุดพิเศษจากเก็ดถะหวา นวดแผนไทย
          </p>
        </div>

        {/* Promotion Cards Grid: 3 cards matching Booking Page */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayPromos.length > 0 ? (
            displayPromos.map((promo) => {
              const bookingHref = `/booking?packageId=${encodeURIComponent(promo.id)}`;

              return (
                <div
                  key={promo.id}
                  className="group relative rounded-2xl bg-[#3E2821]/90 border border-[#5E3F35] shadow-xl overflow-hidden flex flex-col justify-between hover:border-[#E5B869]/60 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Arched Top Image */}
                  <div className="relative aspect-[4/3] rounded-t-[40px] rounded-b-lg overflow-hidden m-3.5 mb-2 border border-white/10 bg-[#251610]">
                    <PromotionImage src={promo.imageSrc} alt={promo.title} />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-[10px] font-bold text-[#E5B869] bg-[#E5B869]/15 px-2.5 py-0.5 rounded-full mb-1.5 uppercase tracking-wider">
                        PROMO
                      </span>
                      <h3 className="text-white font-medium text-base line-clamp-1 mb-1">
                        {promo.title}
                      </h3>
                      <p className="text-xs text-[#C7B5AA] mb-3">
                        {promo.description}
                      </p>
                    </div>

                    {/* Price and Book Button Row */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#5E3F35]/50">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1da824] text-white shadow-sm">
                        {promo.priceText}
                      </span>
                      <Link
                        href={bookingHref}
                        className="px-5 py-1.5 rounded-full text-xs font-bold text-[#200800] bg-gradient-to-r from-[#DFAB36] via-[#E5B869] to-[#DFAB36] hover:brightness-110 shadow-md transition-all duration-200"
                      >
                        BOOK
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Fallback Featured Card */
            <div className="group relative rounded-2xl bg-[#3E2821]/90 border border-[#5E3F35] shadow-xl overflow-hidden flex flex-col justify-between hover:border-[#E5B869]/60 transition-all duration-300 hover:-translate-y-1 max-w-sm mx-auto col-span-3">
              <div className="relative w-72 aspect-[4/3] rounded-t-[40px] rounded-b-lg overflow-hidden m-3.5 mb-2 border border-white/10">
                <Image
                  src="/home-pic1.jpg"
                  alt="นวดไทยล้านนา ประคบสมุนไพร"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="300px"
                />
              </div>

              <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
                <h3 className="text-white font-medium text-base line-clamp-1 mb-3">
                  นวดไทยล้านนา ประคบสมุนไพร ชุดสุดคุ้ม
                </h3>

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#5E3F35]/50">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1da824] text-white shadow-sm">
                    ฿899
                  </span>
                  <Link
                    href="/booking"
                    className="px-5 py-1.5 rounded-full text-xs font-bold text-[#200800] bg-gradient-to-r from-[#DFAB36] via-[#E5B869] to-[#DFAB36] hover:brightness-110 shadow-md transition-all duration-200"
                  >
                    BOOK
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
