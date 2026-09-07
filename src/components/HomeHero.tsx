"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import "@/locales/i18n";

export default function HomeHero() {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const heroFontClass = useLocaleFontClass();

  useEffect(() => {
    if (i18n.isInitialized) setReady(true);
    else i18n.on("initialized", () => setReady(true));
  }, [i18n]);

  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[650px] lg:min-h-[780px] w-full overflow-hidden flex items-center justify-center pt-24 pb-16"
      >
        {/* Background Image with warm dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg"
            alt="Relaxing Thai massage at Getthawha"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Ambient Warm Gradient Vignette matching Figma Image 1 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-[#382218]" />
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          {/* Main Title with Gold Ornaments */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-3 md:gap-5 mb-2">
              <Image
                src="/figma-assets/golden-flower-motif.png"
                alt="Thai floral ornament"
                width={42}
                height={42}
                className="object-contain inline-block drop-shadow-[0_2px_8px_rgba(229,184,105,0.7)]"
              />
              <h1
                className={`${heroFontClass} text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-[0.15em] text-[#E5B869] drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)]`}
              >
                GETTHAWHA
              </h1>
              <Image
                src="/figma-assets/golden-flower-motif.png"
                alt="Thai floral ornament"
                width={42}
                height={42}
                className="object-contain inline-block drop-shadow-[0_2px_8px_rgba(229,184,105,0.7)]"
              />
            </div>
            <p
              className={`${heroFontClass} text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white font-serif tracking-[0.25em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]`}
            >
              THAI MASSAGE
            </p>
          </div>

          {/* Description Text */}
          <p
            className={`${heroFontClass} text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-light text-shadow`}
          >
            {ready
              ? t("hero.description")
              : "Experience authentic Thai massage techniques in a serene environment designed for ultimate relaxation and recovery."}
          </p>

          {/* CTA Buttons */}
          <div className="hero-actions flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href="/booking"
              className={`${heroFontClass} px-8 py-3.5 rounded-full text-base font-semibold text-[#200800] bg-gradient-to-r from-[#DFAB36] via-[#E5B869] to-[#DFAB36] hover:brightness-110 shadow-lg shadow-[#E5B869]/20 hover:scale-105 transition-all duration-300`}
            >
              {ready ? t("hero.booking") : "Book Now"}
            </Link>
            <Link
              href="/#services"
              prefetch={false}
              className={`${heroFontClass} px-8 py-3.5 rounded-full text-base font-medium text-white/90 hover:text-white border border-[#E5B869]/40 hover:border-[#E5B869] bg-black/30 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
            >
              {ready ? t("hero.viewServices") : "View Services"}
            </Link>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 max-w-4xl mx-auto pt-4">
            {[
              { src: "/certifications/home-pic2.png", alt: "Ministry of Public Health Certification" },
              { src: "/certifications/home-pic3.png", alt: "Thai Spa Certification" },
              { src: "/certifications/home-pic4.png", alt: "Thai Traditional Massage Certification" },
              { src: "/certifications/home-pic5.png", alt: "SHA Plus Certification" },
              { src: "/certifications/home-pic6.jpeg", alt: "Chiang Mai Brand" },
              { src: "/certifications/home-pic7.png", alt: "TAG Thai Certification" },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 p-2 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-md"
              >
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={56}
                  height={56}
                  className="object-contain max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT Section (Matching Figma Image 1) */}
      <section
        id="about"
        className="relative scroll-mt-[100px] w-full py-16 md:py-24 px-4 md:px-8 text-white border-t border-[#4A3228]"
      >
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Badge Header */}
          <div className="flex flex-col items-center justify-center mb-6 text-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
              <span className="text-[#E5B869] text-xs">❖</span>
              <span className="text-[#E5B869] font-bold text-xs md:text-sm tracking-[0.3em] uppercase">
                ABOUT
              </span>
              <span className="text-[#E5B869] text-xs">❖</span>
              <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
            </div>
            <h2
              className={`${heroFontClass} text-2xl sm:text-3xl md:text-5xl font-serif text-[#E5B869] font-semibold mt-2 drop-shadow-sm`}
            >
              Where Tradition Meets Modern Wellness
            </h2>
          </div>

          {/* Quote Block with Golden Left Accent Line */}
          <div className="max-w-3xl mx-auto border-l-2 border-[#E5B869] pl-6 py-2 my-8 text-white/90 space-y-3">
            <p className="text-sm md:text-base leading-relaxed font-light">
              Inspired by centuries of Thai healing traditions, GETTHAWHА brings together authentic techniques, mindful care, and modern wellness.
            </p>
            <p className="text-sm md:text-base leading-relaxed font-light">
              Every treatment is thoughtfully crafted to restore balance, ease tension, and create a moment of tranquility for both body and mind.
            </p>
          </div>

          {/* 5 Distinct Architectural Arch Gallery Cards matching Figma Image 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mt-12">
            {[
              {
                src: "/figma-assets/498205899_1317171190414607_4302194740465620141_n.jpg",
                alt: "Getthawha Wooden Reception Area",
                shapeClass: "rounded-tr-[70px] rounded-bl-[20px] rounded-tl-xl rounded-br-xl",
              },
              {
                src: "/figma-assets/images.jpg",
                alt: "Getthawha Teakwood Logo Wall Sign",
                shapeClass: "rounded-t-full rounded-b-xl",
              },
              {
                src: "/figma-assets/1.png",
                alt: "Thai Massage Bed & Towel Art",
                shapeClass: "rounded-tl-[70px] rounded-br-[20px] rounded-tr-xl rounded-bl-xl",
              },
              {
                src: "/figma-assets/79144015_564793101019583_7341423754087497728_n.jpg",
                alt: "Foot Massage Relax Lounge",
                shapeClass: "rounded-2xl",
              },
              {
                src: "/figma-assets/499423492_1317171240414602_1759116723071476687_n.jpg",
                alt: "Traditional Massage Room Beds",
                shapeClass: "rounded-t-full rounded-b-xl",
              },
            ].map((card, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden aspect-[3/4] border border-[#E5B869]/30 shadow-2xl hover:border-[#E5B869]/80 transition-all duration-500 hover:-translate-y-2 ${card.shapeClass}`}
              >
                <Image
                  src={card.src}
                  alt={card.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
