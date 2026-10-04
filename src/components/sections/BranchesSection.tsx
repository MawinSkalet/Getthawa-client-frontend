
import SiteText from "@/components/SiteText";
import Image from "@/components/SiteImage";
import Link from "next/link";
import { getBranches } from "@/hooks/useBranch";
import SectionHeading from "@/components/SectionHeading";


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

  const displayBranches = branches.map(branch=>({
    id:branch.id,name:branch.name,address:branch.address,
    pictureUrl:branch.pictureUrl || fallbackBranches.find(item=>item.name.toLowerCase()===branch.name.toLowerCase())?.pictureUrl || "/branch-1.jpg"
  }));

  const row1 = displayBranches.slice(0, 3);
  const row2 = displayBranches.slice(3);

  return (
    <section
      id="branches"
      className="scroll-mt-[100px] w-full py-16 md:py-24 px-4 md:px-8 text-white relative border-t border-[#4A3228]"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading>Location</SectionHeading>

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
  const locationHref = `/location?branch=${encodeURIComponent(branch.id)}#location`;
  const bookingHref = `/booking?branchId=${encodeURIComponent(branch.id)}`;

  return (
    <div className="branch-card group relative h-[360px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#5A362B] hover:border-[#E5B869]/80 transition-all duration-300 shadow-2xl flex flex-col justify-end hover:-translate-y-1.5">
      {/* Background Storefront Photo */}
      <Image
        src={branch.pictureUrl}
        alt={branch.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Dark Vignette Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content overlay matching Figma Image 4 */}
      <div className="relative z-10 p-5">
        <h3 className="text-[#f5b324] font-bold text-base md:text-lg mb-1 drop-shadow-md">
          <SiteText text={branch.name} />
        </h3>
        <p className="text-white/95 text-xs leading-relaxed font-light mb-4 drop-shadow-sm line-clamp-2">
          <SiteText text={branch.address} />
        </p>

        {/* Action buttons (always accessible, preserving full booking & map flow) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/20">
          <Link
            href={locationHref}
          className="inline-flex h-11 min-w-32 flex-1 items-center justify-center gap-2 rounded-lg border border-[#FFF8E7] bg-[#FFF3CE] px-3 text-sm font-bold leading-tight text-[#38251B] shadow-md transition hover:bg-white hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span><SiteText text={"View Map"} /></span>
          </Link>
          <Link
            href={bookingHref}
            className="inline-flex h-11 min-w-32 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-[#D5A44C] bg-[#E5B869] px-3 text-sm font-bold leading-tight text-[#2D1B13] shadow-md transition-all duration-200 hover:bg-[#F0C96B] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          > <SiteText text={"Book Branch"} /> </Link>
        </div>
      </div>
    </div>
  );
}
