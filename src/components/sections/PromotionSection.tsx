import Image from "next/image";
import PromotionImage from "@/components/PromotionImage";
import Link from "next/link";
import { getPackage } from "@/hooks/usePackage";
import I18nText from "@/components/I18nText";
import LocaleFont from "@/components/LocaleFont";

export async function PromotionSection() {
  const data = await getPackage();
  const promotions = data.filter((p) => p.type === "promotion" && p.isActive);

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
        </div>

        {/* Promotion Cards Grid matching Figma Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {promotions.length > 0 ? (
            promotions.map((promo) => {
              const imageSrc = promo.pictureUrl || "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg";
              const priceText = promo.price ? `${promo.price}` : "990";
              const bookingHref = `/booking?packageId=${encodeURIComponent(promo.id)}`;

              return (
                <div
                  key={promo.id}
                  className="group relative rounded-2xl bg-[#3E2821]/90 border border-[#5E3F35] shadow-xl overflow-hidden flex flex-col justify-between hover:border-[#E5B869]/60 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Arched Top Image */}
                  <div className="relative aspect-[4/3] rounded-t-[40px] rounded-b-lg overflow-hidden m-3.5 mb-2 border border-white/10">
                    <PromotionImage src={imageSrc} alt={promo.title} />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
                    <h3 className="text-white font-medium text-base md:text-lg line-clamp-1 mb-3">
                      {promo.title}
                    </h3>

                    {/* Price and Book Button Row */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#5E3F35]/50">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1da824] text-white shadow-sm">
                        {priceText}
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
            /* Fallback Featured Card matching Figma Image 2 */
            <div className="group relative rounded-2xl bg-[#3E2821]/90 border border-[#5E3F35] shadow-xl overflow-hidden flex flex-col justify-between hover:border-[#E5B869]/60 transition-all duration-300 hover:-translate-y-1 max-w-sm mx-auto sm:col-span-2 md:col-span-3 lg:col-span-4">
              <div className="relative w-72 aspect-[4/3] rounded-t-[40px] rounded-b-lg overflow-hidden m-3.5 mb-2 border border-white/10">
                <Image
                  src="/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg"
                  alt="นวดแผนไทย 24ชม."
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="300px"
                />
              </div>

              <div className="p-4 pt-1 flex-1 flex flex-col justify-between">
                <h3 className="text-white font-medium text-base md:text-lg line-clamp-1 mb-3">
                  นวดแผนไทย 24ชม.
                </h3>

                <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#5E3F35]/50">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1da824] text-white shadow-sm">
                    990
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
