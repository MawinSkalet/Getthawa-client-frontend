import AutoScrollTrack from "@/components/AutoScrollTrack";
import I18nText from "@/components/I18nText";
import LocaleFont from "@/components/LocaleFont";
import { getTestimonials } from "@/hooks/useReview";
import Image from "next/image";
import { Tiro_Gurmukhi } from "next/font/google";

const tiro = Tiro_Gurmukhi({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

type DisplayTestimonial = {
  id: string;
  author: string;
  message?: string | null;
  location?: string | null;
  branch?: string | null;
  rating: number;
};

const fallbackTestimonials: DisplayTestimonial[] = [
  {
    id: "fallback-1",
    author: "Andreas Kraus",
    message:
      "Excellent massage! I had a full body massage and a foot massage and both were super relieving. After the foot massage the pain in my right foot was gone. Very friendly staff and afterwards you will be offered some tea :)",
    location: "Germany",
    rating: 5,
  },
  {
    id: "fallback-2",
    author: "Samantha Lee",
    message:
      "Staff is skilled and attentive. The place is calming and clean. I left feeling renewed and relaxed after a long trip.",
    location: "USA",
    rating: 5,
  },
  {
    id: "fallback-3",
    author: "Kenta Watanabe",
    message:
      "Authentic Thai techniques with just the right pressure. I have chronic back tension and this really helped.",
    location: "Japan",
    rating: 5,
  },
];

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <svg
            key={index}
            className={`h-4 w-4 transition-all duration-300 ${
              filled
                ? "text-[#DCA900] drop-shadow-sm transform scale-110"
                : "text-white/20"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      <span className="ml-1 text-xs font-semibold text-[#DCA900]">
        {rating}.0
      </span>
    </div>
  );
}

export async function TestimonialsSection() {
  let liveTestimonials: DisplayTestimonial[] = [];
  try {
    const data = await getTestimonials();
    liveTestimonials = data.map((review) => ({
      id: review.id,
      author: review.user?.displayName ?? "Guest",
      message: review.comment?.trim() || null,
      location: null,
      branch: review.branch?.name ?? null,
      rating: review.rating,
    }));

    // Filter out testimonials with no meaningful content
    liveTestimonials = liveTestimonials.filter((item) => {
      return Boolean(item.message) || Boolean(item.branch);
    });
  } catch (error) {
    console.error("Failed to load testimonials", error);
  }

  const testimonials = liveTestimonials.length
    ? liveTestimonials
    : fallbackTestimonials;

  // Duplicate to enable seamless loop
  const items: DisplayTestimonial[] = [...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      className="scroll-mt-[140px] w-full px-0 py-16 md:py-24 text-white relative overflow-hidden"
    >
      {/* Full section background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/aromapics.png"
          alt=""
          fill
          priority
          className="object-cover w-full h-full opacity-40"
        />
        <div className="absolute inset-0 bg-[#2a1d19]/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#382924]/50 via-[#4A332B]/70 to-[#58392F]/90" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Modern Header with glass background */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative rounded-2xl px-6 md:px-8 py-6 md:py-8 bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-[#DCA900]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-[#DCA900]/10 blur-3xl" />

          <div className="relative z-10 text-center">
            <h2
              className={`${tiro.className} text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4 drop-shadow-[0_2px_6px_rgba(220,169,0,0.35)]`}
            >
              <I18nText
                i18nKey="sections.testimonials.title"
                fallback="What Our Clients Say"
              />
            </h2>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-[#DCA900]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[#DCA900] font-bold text-base">5.0</span>
              <span className="text-white/60">•</span>
              <span className="text-white/80 text-sm">
                Based on {testimonials.length}+ reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Marquee container */}
      <div className="tt-marquee-container group relative overflow-hidden scrollbar-none">
        {/* Enhanced gradient edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-16 md:w-24 bg-gradient-to-r from-[#382924] via-[#382924]/80 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 md:w-24 bg-gradient-to-l from-[#58392F] via-[#58392F]/80 to-transparent z-20" />

        {/* Track */}
        <AutoScrollTrack>
          {items.map((t, idx) => (
            <figure
              key={`${t.id}-${idx}`}
              className="group/card relative w-[320px] sm:w-[360px] md:w-[400px] shrink-0 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-[#DCA900]/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <LocaleFont
                    as="p"
                    className="text-[#DCA900] text-base md:text-lg"
                  >
                    {t.author}
                  </LocaleFont>
                  {(t.branch || t.location) && (
                    <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
                      {t.branch ?? t.location}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <RatingStars rating={t.rating} />
                  <span className="mt-1 text-xs text-white/50">
                    {t.rating}/5
                  </span>
                </div>
              </div>

              <blockquote className="mt-4 text-sm md:text-base leading-relaxed text-white/95">
                <span className="text-[#DCA900] mr-1 text-xl" aria-hidden>
                  “
                </span>
                {t.message ? (
                  t.message
                ) : (
                  <I18nText
                    i18nKey={
                      t.branch
                        ? "sections.testimonials.ratingOnlyWithBranch"
                        : "sections.testimonials.ratingOnly"
                    }
                    fallback={
                      t.branch
                        ? `Rated ${t.rating}/5 for ${t.branch}.`
                        : `Rated ${t.rating}/5.`
                    }
                    values={{ rating: t.rating, branch: t.branch ?? "" }}
                  />
                )}
                <span className="text-[#DCA900] ml-1 text-xl" aria-hidden>
                  „
                </span>
              </blockquote>
            </figure>
          ))}
        </AutoScrollTrack>
      </div>
    </section>
  );
}
