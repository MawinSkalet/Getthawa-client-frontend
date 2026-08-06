"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import "@/locales/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomeHero() {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroFontClass = useLocaleFontClass();

  useEffect(() => {
    if (i18n.isInitialized) setReady(true);
    else i18n.on("initialized", () => setReady(true));
  }, [i18n]);

  // Zoom and blur scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate zoom and blur values based on scroll position
  const scrollProgress = Math.min(scrollY / 2000, 1); // Normalize scroll to 0-1 over 2000px (covers multiple sections)
  const zoomScale = 1.2 - scrollProgress * 0.02; // Zoom OUT from 1x to 0.6x (scale down)
  const blurAmount = scrollProgress * 15; // Blur from 0px  to 15px (stronger blur for extended range)
  const opacity = Math.max(1 - scrollProgress * 0.9, 0); // Fade OUT from 1 to 0 (complete fade)

  return (
    <>
      {/* Hero */}
      <section
        id="home"
        className="relative h-[600px] md:h-[700px] w-full overflow-hidden scroll-mt-[140px] flex items-center justify-center"
      >
        {/* Background Image with Zoom and Blur Effect - Fixed Position to Show Behind Other Sections */}
        <div
          className="fixed inset-0 z-0"
          style={{
            transform: `scale(${zoomScale}) translateY(${scrollY * 0.3}px)`,
            filter: `blur(${blurAmount}px)`,
            opacity: opacity,
            transition: "none", // Disable CSS transitions for smooth scroll effect
          }}
        >
          <Image
            src="/home-pic1_upScale1.png"
            alt="Relaxing Thai massage at Getthawha"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Modern Gradient Overlay - Also Fixed to Show Behind Other Sections */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent" />
        <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#200800]/60 via-transparent to-transparent" />

        {/* Hero Content - Static (no scroll effects) */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fadeInUp">
          {/* Main Title with Enhanced Typography */}
          <div className="mb-8">
            <h1
              className={`${heroFontClass} text-5xl md:text-7xl lg:text-8xl font-bold text-gradient mb-3 animate-slideInRight`}
            >
              {ready ? t("hero.title") : "GETTHAWHA"}
            </h1>
            <p
              className={`${heroFontClass} text-2xl md:text-3xl lg:text-4xl text-white/95 tracking-wider animate-slideInRight`}
              style={{ animationDelay: "0.2s" }}
            >
              {ready ? t("hero.subtitle") : "THAI MASSAGE"}
            </p>
          </div>

          {/* Subtitle with Glassmorphism */}
          <div
            className="rounded-2xl p-6 mb-8 z-50 max-w-2xl mx-auto animate-scaleIn"
            style={{ animationDelay: "0.4s" }}
          >
            <p className={`${heroFontClass} text-white/90 text-lg md:text-xl leading-relaxed`}>
              {ready
                ? t("hero.description")
                : "Experience authentic Thai massage techniques in a serene environment designed for ultimate relaxation and recovery."}
            </p>
          </div>

          {/* Modern CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              href="/booking"
              className={`${heroFontClass} btn-modern text-lg px-8 py-4 min-w-[200px] group`}
            >
              <span className="relative z-10">
                {ready ? t("hero.booking") : "Book Now"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </Link>
            <Link
              href="/#services"
              prefetch={false}
              className={`${heroFontClass} hover-lift rounded-2xl px-8 py-4 min-w-[200px] text-lg font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300`}
            >
              {ready ? t("hero.viewServices") : "View Services"}
            </Link>
          </div>

          {/* Certification Badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 mt-15 animate-fadeInUp"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic2.png"
                alt="Ministry of Public Health Certification"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic3.png"
                alt="Thai Spa Certification"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic4.png"
                alt="Thai Traditional Massage Certification"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic5.png"
                alt="SHA Plus Certification"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic6.jpeg"
                alt="Chiang Mai Brand"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
            <div className="rounded-xl p-4 hover:scale-105 transition-transform duration-300">
              <Image
                src="/certifications/home-pic7.png"
                alt="TAG Thai Certification"
                width={80}
                height={80}
                className="object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* Top Navigation Panel */}
        <div
          className="absolute top-6 right-6 rounded-2xl p-3 flex items-center gap-3 animate-fadeInUp"
          style={{ animationDelay: "0.8s" }}
        >
          <LanguageSwitcher />
        </div>

        {/* Floating Elements for Visual Interest */}
        <div
          className="absolute bottom-10 left-10 w-20 h-20 rounded-full animate-floatY hidden md:block"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-20 right-20 w-16 h-16 rounded-full animate-floatY hidden lg:block"
          style={{ animationDelay: "1.5s" }}
        />
      </section>

      {/* Modern About Section */}
      <section
        id="about"
        className="scroll-mt-[140px] max-w-7xl mx-auto py-16 md:py-24 px-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image with Modern Styling */}
          <div className="flex justify-center lg:justify-start animate-fadeInUp">
            <div className="relative w-full max-w-[450px] aspect-[4/5] card-modern overflow-hidden group">
              <Image
                src="/home-pic8.jpg"
                alt="Getthawha massage interior"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(min-width: 1024px) 450px, 90vw"
              />
              {/* Modern Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Content with Enhanced Typography */}
          <div className="animate-slideInRight">
            <h2
              className={`${heroFontClass} text-5xl md:text-6xl lg:text-xl6 font-bold text-gradient mb-3 animate-slideInRight`}
              style={{
                filter: "drop-shadow(0 0 8px rgba(220, 169, 0, 0.4))",
              }}
            >
              {ready ? t("hero.title") : "GETTHAWHA"}
              <br />
              <span
                className={`${heroFontClass} text-4xl md:text-4xl lg:text-xl4 font-bold text-gradient mb-3 animate-slideInRight`}
                style={{
                  filter: "drop-shadow(0 0 8px rgba(220, 169, 0, 0.4))",
                }}
              >
                {ready ? t("hero.subtitle") : "THAI MASSAGE"}
              </span>
            </h2>

            <p
              className={`${heroFontClass} text-white text-lg md:text-xl leading-relaxed mb-8 max-w-prose font-medium`}
              style={{
                textShadow: "1px 1px 4px rgba(0, 0, 0, 0.8)",
                background: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(5px)",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {ready
                ? t("hero.aboutDescription")
                : "We research, develop, and deliver high-quality massage services that help you relax and recover. Our experienced therapists combine traditional Thai techniques with modern wellness practices."}
            </p>

            {/* Modern Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/booking"
                className={`${heroFontClass} btn-modern flex-1 sm:flex-none text-center font-semibold`}
                style={{
                  boxShadow:
                    "0 6px 20px rgba(220, 169, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {ready ? t("hero.bookNow") : "Book Now"}
              </Link>
              <Link
                href="/#services"
                prefetch={false}
                className={`${heroFontClass} rounded-2xl px-6 py-3 text-center font-semibold text-white border-2 border-white/30 hover:border-white/60 transition-all duration-300`}
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(15px)",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                {ready ? t("hero.viewServices") : "View Services"}
              </Link>
              <a
                href="https://www.facebook.com/getthawhathaimassage"
                target="_blank"
                rel="noopener noreferrer"
                className={`${heroFontClass} rounded-2xl px-6 py-3 text-center font-semibold text-white border-2 border-blue-500/50 hover:border-blue-400/80 hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2`}
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  backdropFilter: "blur(15px)",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
                  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {ready ? t("hero.learnMore") : "Learn More"}
              </a>
            </div>

            {/* Contact Information with Enhanced Cards */}
            <div className="space-y-3">
              <div
                className="rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-white text-lg">📞</span>
                </div>
                <div>
                  <a
                    href="tel:0876579546"
                    className={`${heroFontClass} text-white font-semibold hover:text-[#DCA900] transition-colors`}
                    style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}
                  >
                    087-657-9546
                  </a>
                  <span className="mx-2 text-white/70">|</span>
                  <a
                    href="tel:053247661"
                    className={`${heroFontClass} text-white font-semibold hover:text-[#DCA900] transition-colors`}
                    style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}
                  >
                    053-247-661
                  </a>
                </div>
              </div>

              <div
                className="rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-white text-lg">✉️</span>
                </div>
                <a
                  href="mailto:pawinee.qa@gmail.com"
                  className={`${heroFontClass} text-white font-semibold hover:text-[#DCA900] transition-colors`}
                  style={{ textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)" }}
                >
                  pawinee.qa@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
