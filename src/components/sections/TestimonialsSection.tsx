import AutoScrollTrack from "@/components/AutoScrollTrack";
import LocaleFont from "@/components/LocaleFont";
import { getTestimonials } from "@/hooks/useReview";

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
    author: "Beam",
    message:
      "Excellent traditional massage! Felt so relieved after the session. Highly recommend to everyone visiting Chiang Mai.",
    location: "Thailand",
    rating: 5,
  },
  {
    id: "fallback-2",
    author: "Andreas Kraus",
    message:
      "Excellent massage! I had a full body massage and a foot massage and both were super relieving. Very friendly staff!",
    location: "Germany",
    rating: 5,
  },
  {
    id: "fallback-3",
    author: "Samantha Lee",
    message:
      "Staff is skilled and attentive. The place is calming and clean. I left feeling renewed and relaxed after a long trip.",
    location: "USA",
    rating: 5,
  },
  {
    id: "fallback-4",
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
          <span
            key={index}
            className={`text-sm ${
              filled ? "text-[#E5B869]" : "text-white/20"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export async function TestimonialsSection() {
  let reviews = [] as Awaited<ReturnType<typeof getTestimonials>>;
  try {
    reviews = await getTestimonials();
  } catch (e) {
    console.error("Failed to load reviews for testimonials", e);
  }

  const testimonials: DisplayTestimonial[] = reviews && reviews.length > 0
    ? reviews.map((r) => ({
        id: r.id,
        author: r.user?.displayName || "Valued Guest",
        message: r.comment,
        branch: r.branch?.name || null,
        rating: r.rating || 5,
      }))
    : fallbackTestimonials;

  const items = testimonials;

  return (
    <section
      id="testimonials"
      className="scroll-mt-[100px] w-full py-16 md:py-24 px-4 md:px-8 bg-[#241510] text-white relative border-t border-[#4A3228]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Rounded Box Header matching Figma Image 4 */}
        <div className="flex justify-center mb-12">
          <div className="rounded-2xl px-10 sm:px-16 py-4 bg-[#3E2821] border border-[#5E3F35] shadow-2xl text-center">
            <h2 className="text-[#E5B869] font-serif text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide">
              Testimonials
            </h2>
          </div>
        </div>

        {/* Testimonials Marquee Track */}
        <div className="tt-marquee-container group relative overflow-hidden scrollbar-none">
          {/* Gradient Edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-20 bg-gradient-to-r from-[#241510] to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-20 bg-gradient-to-l from-[#241510] to-transparent z-20" />

          <AutoScrollTrack>
            {items.map((t, idx) => (
              <figure
                key={`${t.id}-${idx}`}
                className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 rounded-2xl border border-[#5E3F35] bg-[#35201A]/90 p-6 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#E5B869]/50 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <LocaleFont
                      as="p"
                      className="text-[#E5B869] font-serif font-bold text-base md:text-lg"
                    >
                      {t.author}
                    </LocaleFont>
                    <RatingStars rating={t.rating} />
                  </div>

                  <p className="text-white/85 text-base leading-relaxed font-light">
                    &ldquo;{t.message || "Wonderful experience and very relaxing."}&rdquo;
                  </p>
                </div>

                {t.branch && (
                  <div className="mt-4 pt-3 border-t border-[#5E3F35]/60 text-xs text-white/60 flex items-center gap-1">
                    <span>📍</span>
                    <span>{t.branch}</span>
                  </div>
                )}
              </figure>
            ))}
          </AutoScrollTrack>
        </div>
      </div>
    </section>
  );
}
