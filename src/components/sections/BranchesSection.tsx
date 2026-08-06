import Image from "next/image";
import Link from "next/link";
import { getBranches } from "@/hooks/useBranch";
import I18nText from "@/components/I18nText";
import LocaleFont from "@/components/LocaleFont";

export async function BranchesSection() {
  let branches = [] as Awaited<ReturnType<typeof getBranches>>;
  try {
    branches = await getBranches();
  } catch (e) {
    console.error("Failed to load branches", e);
  }

  return (
    <section
      id="branches"
      className="scroll-mt-[140px] max-w-6xl mx-auto px-3 py-8 text-white"
    >
      <LocaleFont
        as="h2"
        className="text-[#DCA900] text-3xl md:text-5xl text-center"
      >
        <I18nText i18nKey="sections.branches.title" fallback="Branches" />
      </LocaleFont>
      {branches.length === 0 ? (
        <p className="mt-8 text-center text-white/80">
          <I18nText
            i18nKey="sections.branches.empty"
            fallback="No branches available."
          />
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((b) => {
            const imageSrc = b.pictureUrl || "/branch-1.jpg";
            const mapUrl = b.googleMapUrl || "#";
            const locationHref = `/?branch=${encodeURIComponent(
              b.id
            )}#location`;
            const phoneDisplay = b.phone || "";
            const phoneHref = phoneDisplay
              ? `tel:${phoneDisplay.replace(/[^\d+]/g, "")}`
              : undefined;
            return (
              <li
                key={b.id}
                className="group relative rounded-xl overflow-hidden bg-white/5 ring-1 ring-[#DCA900]/30 shadow-lg backdrop-blur-sm hover:ring-2 hover:ring-[#DCA900]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#DCA900]/20 hover:scale-[1.02]"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                  tabIndex={0}
                  aria-label={`${b.name} branch - ${
                    b.address || "Branch location"
                  }`}
                >
                  {/* Stretched link so clicking anywhere jumps to location and preselects branch */}
                  <Link
                    href={locationHref}
                    className="absolute inset-0 z-[5]"
                    aria-label={`View ${b.name} on map`}
                    title={`View ${b.name} on map`}
                  />
                  <Image
                    src={imageSrc}
                    alt={`${b.name} branch exterior`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-focus-within:scale-110"
                  />

                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none" />

                  {/* Details overlay - slides up from bottom */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 translate-y-6 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 z-10 pointer-events-none">
                    <div className="transform transition-all duration-500 delay-100 group-hover:scale-100 group-focus-within:scale-100 scale-95">
                      <LocaleFont
                        as="h3"
                        className="text-xl md:text-2xl text-[#DCA900] font-semibold mb-2 drop-shadow-lg"
                      >
                        {b.name}
                      </LocaleFont>
                      {b.address && (
                        <p className="text-white text-sm md:text-base mb-4 leading-relaxed drop-shadow-md">
                          📍 {b.address}
                        </p>
                      )}

                      {/* Action buttons with staggered animation */}
                      <div className="flex flex-wrap gap-2">
                        {phoneHref && (
                          <a
                            href={phoneHref}
                            className="inline-flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm px-3 py-2 text-sm font-medium text-white hover:bg-white/30 transition-all duration-200 transform hover:scale-105 pointer-events-auto"
                            aria-label={`Call ${b.name}`}
                            style={{ animationDelay: "200ms" }}
                          >
                            📞 <span className="ml-1">{phoneDisplay}</span>
                          </a>
                        )}
                        {mapUrl !== "#" && (
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-lg bg-[#DCA900] text-[#200800] px-3 py-2 text-sm font-bold hover:brightness-110 transition-all duration-200 transform hover:scale-105 shadow-lg pointer-events-auto"
                            aria-label={`Open map for ${b.name}`}
                            style={{ animationDelay: "300ms" }}
                          >
                            🗺️{" "}
                            <span className="ml-1">
                              <I18nText
                                i18nKey="sections.branches.viewMap"
                                fallback="View Map"
                              />
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
