"use client";
import SiteText from "@/components/SiteText";

import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import { useEffect, useState } from "react";
import Image from "@/components/SiteImage";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";

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

export function ServicesSection({ menu }: { menu?: React.ReactNode }) {
  const { tr } = useSiteTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoopResetting, setIsLoopResetting] = useState(false);
  const activeTreatment = signatureTreatments[activeIndex % signatureTreatments.length];
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const syncAutoplay = () => {
      if (timer) clearInterval(timer);
      if (reducedMotion.matches || document.hidden) return;
      timer = setInterval(() => {
        setActiveIndex(index => index + 1);
      }, 10000);
    };

    syncAutoplay();
    reducedMotion.addEventListener("change", syncAutoplay);
    document.addEventListener("visibilitychange", syncAutoplay);
    return () => {
      if (timer) clearInterval(timer);
      reducedMotion.removeEventListener("change", syncAutoplay);
      document.removeEventListener("visibilitychange", syncAutoplay);
    };
  }, []);
  return <section id="services" className="services-section">
    <div className="signature-section">
      <SectionHeading>Service</SectionHeading>
      <p><SiteText text={"Discover treatments designed to relax, restore, and renew."} /></p>
      <Image className="service-ornament service-ornament-left" src="/figma-assets/service-ornament.webp" alt="" width={110} height={110} />
      <Image className="service-ornament service-ornament-right" src="/figma-assets/service-ornament.webp" alt="" width={110} height={110} />
      <div role="region" aria-roledescription="carousel" aria-label={tr("Signature treatments")}>
        <div className="service-carousel-viewport">
          <div
            className={`service-carousel-track${isLoopResetting ? " is-resetting" : ""}`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTransitionEnd={event => {
              if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
              if (activeIndex === signatureTreatments.length) {
                setIsLoopResetting(true);
                setActiveIndex(0);
                window.requestAnimationFrame(() => window.requestAnimationFrame(() => setIsLoopResetting(false)));
              }
            }}
          >
            {[...signatureTreatments, signatureTreatments[0]].map((treatment, index) => {
              const isActive = index === activeIndex;
              return (
                <article
                  key={`${treatment.id}-${index}`}
                  className="service-carousel-slide"
                  aria-roledescription="slide"
                  aria-hidden={!isActive}
                  aria-live={isActive ? "polite" : undefined}
                  aria-atomic={isActive ? "true" : undefined}
                >
                  <div className="treatment-image"><Image src={treatment.image} alt={tr(treatment.title)} fill sizes="(min-width: 1024px) 800px, 90vw" /></div>
                  <div className="treatment-description">
                    <h3><Image className="treatment-description-lotus" src="/figma-assets/lotus-logo.png" alt="" width={32} height={19} />{tr(treatment.title)}</h3>
                    <p>{tr(treatment.description)}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="carousel-controls">
          <div className="carousel-dots" role="group" aria-label={tr("Choose a treatment slide")}>{signatureTreatments.map((item, index) => <button type="button" key={item.id} aria-label={tr("Show {{title}}", { title: tr(item.title) })} aria-current={index === activeIndex % signatureTreatments.length ? "true" : undefined} onClick={() => setActiveIndex(index)} />)}</div>
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">{tr(activeTreatment.title)}</span>
      </div>
    </div>
    <div className="menu-section">
      <a href="/figma-assets/massage-menu-poster.png" target="_blank" rel="noreferrer" aria-label={tr("Open full-size massage menu")}>
        <Image src="/figma-assets/massage-menu-poster.png" alt="Getthawha Thai Massage menu and prices" width={800} height={1060} sizes="(min-width: 800px) 760px, 95vw" />
      </a>
      {menu}
      <Link href="/booking" className="gold-button"><SiteText text={"ASK FOR SERVICE"} /></Link>
    </div>
  </section>;
}
