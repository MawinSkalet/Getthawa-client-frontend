"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";

// Treatments specified in Figma design Image 2 and Image 5
const signatureTreatments = [
  {
    id: "herbal-compress",
    title: "Thai Herbal hot compress",
    description:
      "Experience the healing power of traditional Thai herbal compress therapy. Warm herbal poultices infused with natural ingredients help relieve muscle tension, improve circulation, reduce stiffness, and promote deep relaxation. Perfect for soothing tired muscles after a long day.",
    image: "/figma-assets/ac8af604-4988-4c30-b503-36b759edac281762412860821.png",
  },
  {
    id: "aroma-oil",
    title: "Aroma Oil Massage",
    description:
      "Relax your body and calm your mind with our Aroma Oil Massage. Using premium aromatic essential oils and gentle flowing strokes, this treatment relieves stress, nourishes the skin, eases muscle fatigue, and creates a peaceful sense of well-being.",
    image: "/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg",
  },
  {
    id: "lanna-massage",
    title: "Traditional Thai Lanna Massage",
    description:
      "Discover the unique heritage of Northern Thailand with our Traditional Thai Lanna Massage. This signature treatment combines herbal balm, therapeutic oil, and deep pressure techniques to release muscle tension, restore flexibility, and leave your body feeling refreshed and energized.",
    image: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
  },
  {
    id: "thai-massage",
    title: "Thai Massage",
    description:
      "Experience the authentic art of Traditional Thai Massage. Combining acupressure, rhythmic stretching, and gentle body movements, this treatment helps improve flexibility, relieve muscle tension, stimulate circulation, and restore your body's natural balance—all without the use of oils.",
    image: "/figma-assets/79144015_564793101019583_7341423754087497728_n.jpg",
  },
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [resetting, setResetting] = useState(false);
  const localeFontClass = useLocaleFontClass();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!reduced.matches && !document.hidden) {
        timer = setInterval(() => setActiveIndex(index => Math.min(index + 1, signatureTreatments.length)), 6000);
      }
    };
    sync();
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); reduced.removeEventListener("change", sync); document.removeEventListener("visibilitychange", sync); };
  }, []);
  useEffect(() => {
    if (!resetting) return;
    const timer = setTimeout(() => setResetting(false), 60);
    return () => clearTimeout(timer);
  }, [resetting]);

  return (
    <section
      id="services"
      className="scroll-mt-[100px] w-full py-16 md:py-24 px-4 md:px-8 text-white relative border-t border-[#4A3228]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top-Left Thai Kanok Corner Decoration */}
        <div className="absolute -top-10 -left-4 md:-left-8 w-20 h-20 md:w-32 md:h-32 opacity-85 pointer-events-none select-none">
          <Image
            src="/Lnav.png"
            alt="Thai Kanok ornament"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
        {/* Bottom-Right Thai Kanok Corner Decoration */}
        <div className="absolute -bottom-10 -right-4 md:-right-8 w-20 h-20 md:w-32 md:h-32 opacity-85 pointer-events-none select-none">
          <Image
            src="/Rnav.png"
            alt="Thai Kanok ornament"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>

        {/* Section Header Badge */}
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="text-[#E5B869] font-bold text-xs md:text-sm tracking-[0.3em] uppercase">
              SERVICE
            </span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
          </div>
          <p className="text-white/80 text-sm md:text-base font-light">
            Discover treatments designed to relax, restore, and renew.
          </p>
        </div>

        <div className="service-feature" role="region" aria-roledescription="carousel" aria-label="Signature treatments">
          <div className="treatment-window">
            <div className="treatment-track" style={{ transform: `translateX(-${activeIndex * 100}%)`, transition: resetting ? "none" : undefined }}
              onTransitionEnd={event => {
                if (event.target === event.currentTarget && activeIndex === signatureTreatments.length) {
                  setResetting(true);
                  setActiveIndex(0);
                }
              }}>
              {[...signatureTreatments, signatureTreatments[0]].map((treatment, index) => (
                <article className="treatment-slide" key={index} aria-hidden={index !== activeIndex}>
                  <div className="treatment-image">
                    <Image src={treatment.image} alt={treatment.title} fill className="object-cover" sizes="(min-width: 1024px) 720px, 90vw" />
                  </div>
                  <h3 className={`${localeFontClass} text-2xl sm:text-3xl font-serif text-[#E5B869] mt-6 mb-3`}>{treatment.title}</h3>
                  <p className="text-white/85 text-base leading-relaxed max-w-2xl mx-auto">{treatment.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-3 mt-7" aria-hidden="true">
            {signatureTreatments.map((treatment, index) => <span key={treatment.id} className={`h-2 w-2 rounded-full transition-colors ${index === activeIndex % signatureTreatments.length ? "bg-[#E5B869]" : "bg-white/30"}`} />)}
          </div>
        </div>

        <div className="service-overview grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-16">
          {signatureTreatments.map(treatment => (
            <article key={treatment.id} className="text-center">
              <div className="relative aspect-[16/10] overflow-hidden rounded-tl-[56px] rounded-br-[56px] mb-4">
                <Image src={treatment.image} alt={treatment.title} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 90vw" />
              </div>
              <h4 className="font-serif text-[#E5B869] mb-2">{treatment.title}</h4>
              <p className="text-white/80 text-sm leading-relaxed">{treatment.description}</p>
            </article>
          ))}
        </div>

        {/* Menu Poster Showcase & ASK FOR SERVICE Button (Figma Image 3) */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-[#4A3228]">
          <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-2 border-[#E5B869]/40 shadow-2xl mb-8 bg-[#2A1711]">
            <Image
              src="/figma-assets/massage-menu-poster.png"
              alt="Getthawha Thai Massage Menu"
              width={800}
              height={1060}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Gold Pill Button matching Figma Image 3 */}
          <Link
            href="/booking"
            className="px-10 py-3.5 rounded-full text-base sm:text-lg font-serif font-bold text-[#200800] bg-gradient-to-r from-[#DFAB36] via-[#E5B869] to-[#DFAB36] hover:brightness-110 shadow-xl shadow-[#E5B869]/25 hover:scale-105 transition-all duration-300 tracking-wider uppercase border border-[#fff]/20"
          >
            ASK FOR SERVICE
          </Link>
        </div>
      </div>
    </section>
  );
}
