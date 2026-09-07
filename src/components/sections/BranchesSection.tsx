import Image from "next/image";
import Link from "next/link";
import { getBranches } from "@/hooks/useBranch";
import I18nText from "@/components/I18nText";
import LocaleFont from "@/components/LocaleFont";

const fallbackBranches = [
  {
    id: "branch-rimping",
    name: "Rimping",
    address: "129 Lamphun Road, Watket, Muang, Chiangmai 50000",
    pictureUrl: "/branch-1.jpg",
  },
  {
    id: "branch-charoenmuang",
    name: "Charoenmuang",
    address: "9/3 Charoenmuang soi3, Watket, Muang, Chiangmai 50000",
    pictureUrl: "/figma-assets/d1d08844-1250-482d-93a5-584e57a90e051762676750450.webp",
  },
  {
    id: "branch-rimping2",
    name: "Rimping2",
    address: "5/1 Osathaphan Rd, Tambon Wat Ket, Muang, Chiang Mai 50000",
    pictureUrl: "/branch-4.jpg",
  },
  {
    id: "branch-chiangkang",
    name: "ChiangKang",
    address: "106/17 Onsirin Business2, Chai Sathan, Saraphi District, Chiang Mai 50140",
    pictureUrl: "/branch-3.jpg",
  },
  {
    id: "branch-phrasingh",
    name: "Phrasingh",
    address: "Arak Rd Soi5, Tambon Si Phum, Muang, Chiang Mai 50200",
    pictureUrl: "/branch-5.jpg",
  },
];

export async function BranchesSection() {
  let branches = [] as Awaited<ReturnType<typeof getBranches>>;
  try {
    branches = await getBranches();
  } catch (e) {
    console.error("Failed to load branches", e);
  }

  // Merge backend branches with the authentic Figma pictures & addresses if matching
  const displayBranches = fallbackBranches.map((fallback) => {
    const matched = branches?.find(
      (b) => b.name?.toLowerCase().includes(fallback.name.toLowerCase()) || b.id === fallback.id
    );
    return {
      id: matched?.id || fallback.id,
      name: fallback.name,
      address: fallback.address,
      pictureUrl: fallback.pictureUrl,
    };
  });

  const row1 = displayBranches.slice(0, 3);
  const row2 = displayBranches.slice(3, 5);

  return (
    <section
      id="branches"
      className="scroll-mt-[100px] w-full py-16 md:py-24 px-4 md:px-8 text-white relative border-t border-[#4A3228]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Badge Header matching Figma Image 4 */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="text-[#E5B869] font-bold text-xs md:text-sm tracking-[0.3em] uppercase">
              LOCATION
            </span>
            <span className="text-[#E5B869] text-xs">❖</span>
            <span className="w-10 h-[1px] bg-[#E5B869]/60"></span>
          </div>
          <LocaleFont
            as="h2"
            className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#E5B869] font-semibold mt-1"
          >
            <I18nText i18nKey="sections.branches.title" fallback="Our Branches Across Chiang Mai" />
          </LocaleFont>
        </div>

        {/* 5 Branches in 2 Rows (3 on top, 2 centered below) matching Figma Image 4 */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {row1.map((b) => (
              <BranchCard key={b.id} branch={b} />
            ))}
          </div>

          {/* Row 2: 2 cards centered */}
          <div className="flex flex-wrap justify-center gap-6">
            {row2.map((b) => (
              <div key={b.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <BranchCard branch={b} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BranchCard({ branch }: { branch: { id: string; name: string; address: string; pictureUrl: string } }) {
  const locationHref = `/?branch=${encodeURIComponent(branch.id)}#location`;
  const bookingHref = `/booking?branchId=${encodeURIComponent(branch.id)}`;

  return (
    <div className="group relative h-[360px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#5A362B] hover:border-[#E5B869]/80 transition-all duration-300 shadow-2xl flex flex-col justify-end hover:-translate-y-1.5">
      {/* Background Storefront Photo */}
      <Image
        src={branch.pictureUrl}
        alt={`${branch.name} branch`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark Vignette Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content overlay matching Figma Image 4 */}
      <div className="relative z-10 p-5">
        <h3 className="text-[#f5b324] font-bold text-base md:text-lg mb-1 drop-shadow-md">
          {branch.name}
        </h3>
        <p className="text-white/95 text-xs leading-relaxed font-light mb-4 drop-shadow-sm line-clamp-2">
          {branch.address}
        </p>

        {/* Action buttons (always accessible, preserving full booking & map flow) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/20">
          <Link
            href={locationHref}
            className="text-xs text-[#E5B869] hover:underline font-medium flex items-center gap-1"
          >
            <span>📍</span>
            <span>View Map</span>
          </Link>
          <Link
            href={bookingHref}
            className="px-4 py-1.5 rounded-full text-xs font-bold text-[#200800] bg-gradient-to-r from-[#DFAB36] via-[#E5B869] to-[#DFAB36] hover:brightness-110 shadow-sm transition-all duration-200"
          >
            Book Branch
          </Link>
        </div>
      </div>
    </div>
  );
}
