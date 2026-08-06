"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";

interface SliderCard {
  id: string | number;
  title: string;
  description: string;
  image: string;
  bgImage: string;
  cta: string;
  href: string;
  price?: string;
  duration?: string;
}

interface ServiceSliderProps {
  cards: SliderCard[];
  tallCards?: boolean;
}

// No default mock cards; consumers must pass cards from the API

export default function ServiceSlider({
  cards,
  tallCards = false,
}: ServiceSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const localeFontClass = useLocaleFontClass();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, cards.length]);

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  if (!cards || cards.length === 0) {
    return null; // nothing to render if no data
  }
  const activeCard = cards[activeIndex];

  // Dynamic height classes (taller variant for services page)
  const cardHeightClass = tallCards ? "h-[28rem] lg:h-[36rem]" : "h-80 lg:h-96";
  // Adjusted to ensure CTA never overflows: give more room to content
  const imageHeightClass = tallCards ? "h-64 lg:h-[21rem]" : "h-48 lg:h-56";
  const contentHeightClass = tallCards ? "h-44 lg:h-60" : "h-32 lg:h-40";

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Dynamic Background with Smooth Transitions */}
      <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
        <Image
          src={activeCard.bgImage}
          alt={`Background for ${activeCard.title}`}
          fill
          priority
          className="object-cover transition-transform duration-1000 ease-in-out"
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#200800]/80 via-transparent to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Card Slider */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-4 mb-8 p-10">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`group cursor-pointer transition-all duration-500 ease-out ${
                  index === activeIndex
                    ? "lg:col-span-2 scale-105 lg:scale-110"
                    : "hover:scale-105"
                }`}
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={`card-modern overflow-hidden ${cardHeightClass} relative ${
                    index === activeIndex
                      ? "border-[#DCA900] border-2 shadow-glow"
                      : "border-white/10 hover:border-[#DCA900]/50"
                  }`}
                >
                  {/* Card Image */}
                  <div
                    className={`relative ${imageHeightClass} overflow-hidden`}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(min-width: 1024px) 400px, 90vw"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                        index === activeIndex
                          ? "opacity-40"
                          : "opacity-60 group-hover:opacity-40"
                      }`}
                    />
                  </div>

                  {/* Card Content */}
                  <div
                    className={`p-6 ${contentHeightClass} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          className={`${
                            localeFontClass
                          } text-lg lg:text-xl font-bold text-white line-clamp-2 ${
                            index === activeIndex ? "text-[#DCA900]" : ""
                          }`}
                        >
                          {card.title}
                        </h3>
                        {card.duration && (
                          <div className="flex items-center text-xs text-white/60 ml-2">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {card.duration}min
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-white/80 text-sm line-clamp-2 transition-all duration-300 ${
                          index === activeIndex
                            ? "line-clamp-3 text-white/90"
                            : ""
                        }`}
                      >
                        {card.description}
                      </p>
                      <div className="mt-4 flex justify-between">
                        {card.price && (
                          <div className="mt-2">
                            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm px-3 py-1 text-sm font-medium border border-white/10">
                              <span className="text-[#DCA900] mr-1">฿</span>
                              {card.price}
                            </span>
                          </div>
                        )}

                        {/* CTA Button - Always visible with different styles based on active state */}
                        <Link
                          href={card.href}
                          className={`btn-modern text-sm px-4 py-2 self-start transition-all duration-300 ${
                            index === activeIndex
                              ? "animate-fadeInUp opacity-100 scale-100"
                              : "opacity-80 hover:opacity-100 scale-95 hover:scale-100"
                          }`}
                          style={{
                            animationDelay:
                              index === activeIndex ? "0.3s" : "0s",
                          }}
                        >
                          {card.cta}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {index === activeIndex && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-[#DCA900] rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-3 mb-8">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-[#DCA900] scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          {/* Active Card Details - Mobile */}
          <div className="lg:hidden glass rounded-2xl p-6 mx-4 animate-fadeInUp">
            <h2
              className={`${localeFontClass} text-2xl font-bold text-[#DCA900] mb-3`}
            >
              {activeCard.title}
            </h2>
            <p className="text-white/90 mb-4 leading-relaxed">
              {activeCard.description}
            </p>
            <Link href={activeCard.href} className="btn-modern inline-block">
              {activeCard.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
        <div
          className="h-full bg-gradient-to-r from-[#DCA900] to-[#E5B800] transition-all duration-300 ease-out"
          style={{ width: `${((activeIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
