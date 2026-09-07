"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { getBranches, type Branch } from "@/hooks/useBranch";
import { getPackage, type Package } from "@/hooks/usePackage";
import { createBooking, verifyVoucher } from "@/hooks/useBooking";
import "@/locales/i18n";

const TYPE_FILTER_OPTIONS = ["all", "service", "promotion"] as const;
type TypeFilterOption = (typeof TYPE_FILTER_OPTIONS)[number];

const SORT_OPTIONS = [
  "recommended",
  "priceAsc",
  "priceDesc",
  "durationAsc",
  "durationDesc",
  "nameAsc",
] as const;
type SortKeyOption = (typeof SORT_OPTIONS)[number];

const GROUP_KEYS = ["service", "promotion"] as const;

function isTypeFilterOption(value: string): value is TypeFilterOption {
  return TYPE_FILTER_OPTIONS.some((option) => option === value);
}

function isSortKeyOption(value: string): value is SortKeyOption {
  return SORT_OPTIONS.some((option) => option === value);
}

// Authentic Branches matching Figma Screenshot exactly
const DEFAULT_BRANCHES: Branch[] = [
  {
    id: "branch-rimping",
    name: "Rimping",
    address: "129 Lamphun Road, Watket, Muang, Chiangmai 50000",
    pictureUrl: "/branch-1.jpg",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "",
    phone: "053-123456",
    description: "ริมปิง",
  },
  {
    id: "branch-charoenmuang",
    name: "Chareonmuang (เจริญเมือง)",
    address: "9/3 Charoenmuang soi3, Watket, Muang, Chiangmai 50000",
    pictureUrl: "/branch-2.jpg",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "",
    phone: "053-234567",
    description: "เจริญเมือง",
  },
  {
    id: "branch-rimping2",
    name: "Rimping2",
    address: "5/1 Osathaphan Rd, Tambon Wat Ket, Muang, Chiang Mai 50000",
    pictureUrl: "/branch-4.jpg",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "",
    phone: "053-345678",
    description: "ริมปิง 2",
  },
  {
    id: "branch-chiangkang",
    name: "ChiangKang (อรศิริน วิลล์มอนต์ เชีย...)",
    address: "106/17 Onsirin Business2, Chai Sathan, Saraphi District, Chiang Mai 50140",
    pictureUrl: "/branch-3.jpg",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "",
    phone: "053-456789",
    description: "เชียงคาน",
  },
  {
    id: "branch-phrasingh",
    name: "Phrasingh (พระสิงห์)",
    address: "Arak Rd Soi5, Tambon Si Phum, Muang, Chiang Mai 50200",
    pictureUrl: "/branch-5.jpg",
    googleMapUrl: "https://maps.google.com",
    googleMapEmbedUrl: "",
    phone: "053-567890",
    description: "พระสิงห์",
  },
];

// Authentic Packages matching Figma Screenshot exactly
const DEFAULT_PACKAGES: Package[] = [
  {
    id: "fin-3",
    title: "Fin3 (150 mins)",
    description: "150 mins • Body Scrub and aroma oil massage",
    duration: 150,
    price: "990",
    type: "promotion",
    isActive: true,
    note: "",
    pictureUrl: "/aromapics.png",
  },
  {
    id: "fin-2",
    title: "Fin2 (120 mins)",
    description: "120 mins • Thai Lanna Massage using balm and oil with Hot compress ball massage 2 hours",
    duration: 120,
    price: "899",
    type: "promotion",
    isActive: true,
    note: "",
    pictureUrl: "/figma-assets/487480568_1222783176523000_6232950887757154845_n.jpg",
  },
  {
    id: "fin-1",
    title: "Fin 1 (120 mins)",
    description: "120 mins • Thai Lanna Massage using balm and oil with Thai stretching and deep tissue",
    duration: 120,
    price: "799",
    type: "promotion",
    isActive: true,
    note: "",
    pictureUrl: "/figma-assets/360_F_676368959_pUZwtpsC8wqsEXy7vqR6UlLbxDCkoBdT.jpg",
  },
  {
    id: "thai-herbal-hot-compress",
    title: "Thai Herbal hot compress",
    description: "90 mins • นวดประคบสมุนไพรด้วย 90 นาที",
    duration: 90,
    price: "750",
    type: "service",
    isActive: true,
    note: "",
    pictureUrl: "/figma-assets/499423492_1317171240414602_1759116723071476687_n.jpg",
  },
  {
    id: "traditional-thai-lanna",
    title: "Traditional Thai Lanna Massage",
    description: "90 mins • นวดไทยล้านนา สไตล์การนวดพื้นเมืองล้านนาแบบผสมผสาน",
    duration: 90,
    price: "600",
    type: "service",
    isActive: true,
    note: "",
    pictureUrl: "/figma-assets/1fff3681-6558-40ee-81ae-c652f729444a1762428977626.webp",
  },
  {
    id: "aroma-oil-massage",
    title: "Aroma Oil Massage",
    description: "60 mins • Aroma Oil Massage",
    duration: 60,
    price: "500",
    type: "service",
    isActive: true,
    note: "",
    pictureUrl: "/aromapics.png",
  },
  {
    id: "thai-massage",
    title: "Thai Massage",
    description: "60 mins • Traditional Thai Massage",
    duration: 60,
    price: "450",
    type: "service",
    isActive: true,
    note: "",
    pictureUrl: "/figma-assets/498205899_1317171190414607_4302194740465620141_n.jpg",
  },
];

export default function BookingPage() {
  // Data state
  const [branches, setBranches] = useState<Branch[]>(DEFAULT_BRANCHES);
  const [packages, setPackages] = useState<Package[]>(DEFAULT_PACKAGES);

  // Selections: Default to Chareonmuang like the mockup
  const [selectedBranchId, setSelectedBranchId] = useState("branch-charoenmuang");
  const [selectedPackageId, setSelectedPackageId] = useState("");

  // UX controls
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilterOption>("all");
  const [sortKey, setSortKey] = useState<SortKeyOption>("recommended");
  const [groupByType, setGroupByType] = useState(false);

  // Booking inputs
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [voucher, setVoucher] = useState("");

  // Voucher validation
  const [voucherStatus, setVoucherStatus] = useState<
    "idle" | "checking" | "valid" | "invalid"
  >("idle");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherId, setVoucherId] = useState<string | null>(null);

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const readyText = useCallback(
    (k: string, fb: string) => (i18n.isInitialized ? t(k) : fb),
    [i18n.isInitialized, t]
  );

  const handleTypeFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (isTypeFilterOption(value)) {
      setTypeFilter(value);
    }
  };

  const handleSortKeyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (isSortKeyOption(value)) {
      setSortKey(value);
    }
  };

  // Fetch branches from API, keep default mockup branches if backend is empty
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getBranches();
        if (active && data && data.length > 0) {
          // Merge or supplement
          setBranches(data);
          setSelectedBranchId(data[0].id);
        }
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fetch packages from API, keep default mockup packages if backend is empty
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPackage();
        if (active && data && data.length > 0) {
          setPackages(data);
        }
      } catch (e) {
        console.error("Failed to load packages", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Restore persisted selections & read query params
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const qPackage = params.get("packageId");
        const qBranch = params.get("branchId");
        if (qPackage) setSelectedPackageId(qPackage);
        if (qBranch) setSelectedBranchId(qBranch);
      }

      const raw = localStorage.getItem("booking_persist_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        branchId?: string;
        packageId?: string;
        date?: string;
        time?: string;
      };
      if (parsed.branchId) setSelectedBranchId(parsed.branchId);
      if (parsed.packageId) setSelectedPackageId(parsed.packageId);
      if (parsed.date) {
        const today = new Date().toISOString().split("T")[0];
        if (parsed.date >= today) setDate(parsed.date);
      }
      if (parsed.time) setTime(parsed.time);
    } catch {}
  }, []);

  // Persist selections
  useEffect(() => {
    const payload = JSON.stringify({
      branchId: selectedBranchId || undefined,
      packageId: selectedPackageId || undefined,
      date: date || undefined,
      time: time || undefined,
    });
    try {
      localStorage.setItem("booking_persist_v1", payload);
    } catch {}
  }, [selectedBranchId, selectedPackageId, date, time]);

  // Handle Voucher validation
  const validateVoucherCode = async (codeToVerify?: string) => {
    const code = (codeToVerify ?? voucher).trim();
    if (!code) {
      setVoucherStatus("idle");
      setVoucherMessage("");
      setVoucherId(null);
      return;
    }
    setVoucherStatus("checking");
    setVoucherMessage(readyText("booking.validatingVoucher", "Validating voucher…"));
    try {
      const result = await verifyVoucher(code);
      if (result.isValid) {
        setVoucherStatus("valid");
        setVoucherMessage(readyText("booking.voucherApplied", "Voucher applied successfully!"));
        setVoucherId(result.id || null);
      } else {
        setVoucherStatus("invalid");
        setVoucherMessage(readyText("booking.voucherNotValid", "Voucher code is invalid or expired."));
        setVoucherId(null);
      }
    } catch {
      setVoucherStatus("invalid");
      setVoucherMessage(readyText("booking.voucherValidationError", "Unable to validate voucher."));
      setVoucherId(null);
    }
  };

  // Auto hide feedback toasts
  useEffect(() => {
    if (!successId) return;
    const t = setTimeout(() => setSuccessId(null), 6000);
    return () => clearTimeout(t);
  }, [successId]);

  useEffect(() => {
    if (!submitError) return;
    const t = setTimeout(() => setSubmitError(null), 6000);
    return () => clearTimeout(t);
  }, [submitError]);

  // Derived data
  const activePackages = packages.filter((p) => p.isActive);
  const filtered = activePackages.filter((p) => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "priceAsc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "priceDesc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "durationAsc": {
        const da = typeof a.duration === "number" ? a.duration : parseInt(String(a.duration));
        const db = typeof b.duration === "number" ? b.duration : parseInt(String(b.duration));
        return da - db;
      }
      case "durationDesc": {
        const da = typeof a.duration === "number" ? a.duration : parseInt(String(a.duration));
        const db = typeof b.duration === "number" ? b.duration : parseInt(String(b.duration));
        return db - da;
      }
      case "nameAsc":
        return a.title.localeCompare(b.title);
      case "recommended":
      default:
        return 0;
    }
  });

  const grouped = groupByType
    ? {
        service: sorted.filter((p) => p.type === "service"),
        promotion: sorted.filter((p) => p.type === "promotion"),
      }
    : null;

  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) ||
    branches.find((b) => b.id === "branch-charoenmuang") ||
    branches[0];

  const selectedPackage = activePackages.find((p) => p.id === selectedPackageId);
  const baseReady = !!(selectedBranchId && selectedPackageId && date && time);
  const voucherReady = voucher.trim() === "" ? true : voucherStatus === "valid";
  const canSubmit = baseReady && voucherReady && !isSubmitting && voucherStatus !== "checking";

  const togglePackage = (id: string) => {
    setSelectedPackageId((prev) => (prev === id ? "" : id));
  };

  const resetForm = () => {
    setSelectedPackageId("");
    setDate("");
    setTime("");
    setVoucher("");
    setVoucherStatus("idle");
    setVoucherMessage("");
    setVoucherId(null);
  };

  return (
    <main className="min-h-screen w-full pb-20 relative">
      {/* Authentic Spa Interior Background with ambient warm lighting & Thai Pattern */}
      <div className="fixed inset-0 -z-20">
        <Image
          src="/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg"
          alt="Spa ambience"
          fill
          priority
          className="object-cover object-center filter blur-md scale-105 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#180E09]/90 via-[#27170F]/85 to-[#180E09]/92" />
        <div className="absolute inset-0 thai-pattern-bg opacity-15" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        {/* Page Header with High-Contrast Elegant Gold Colors */}
        <div className="text-center mb-8 animate-fadeInUp">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FBF5E8] tracking-wide mb-2 drop-shadow-md font-medium">
            Book Appointment
          </h1>
          <p className="text-[#DFC39C] text-xs sm:text-sm md:text-base font-light max-w-xl mx-auto">
            Schedule your perfect Thai massage experience
          </p>

          {/* Golden Lotus Ornament Divider */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-16 md:w-28 h-[1px] bg-gradient-to-r from-transparent to-[#D29F38]" />
            <span className="text-[#D29F38] text-base">🪷</span>
            <div className="w-16 md:w-28 h-[1px] bg-gradient-to-l from-transparent to-[#D29F38]" />
          </div>

          {/* 3 Value Proposition Badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8 text-[#E4B34B] text-xs md:text-[13px] font-medium mt-2">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Professional Therapists
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Premium Environment
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#E4B34B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Relax &amp; Rejuvenate
            </span>
          </div>
        </div>

        {/* Top Two Column Layout: Section 1 (Branch) & Section 2 (Appointment Details) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Section 1: Select Branch */}
          <section className="bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] flex flex-col justify-between">
            <div>
              {/* Header with circular gold storefront icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C99127] text-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                    Select Branch
                  </h2>
                  <p className="text-xs text-[#7D6C63]">
                    Choose your preferred branch
                  </p>
                </div>
              </div>

              {/* Branches Grid (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {branches.map((b) => {
                  const isSelected = selectedBranchId === b.id;
                  const initialLetter = b.name.trim().charAt(0).toUpperCase();
                  return (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setSelectedBranchId(b.id)}
                      className={`relative text-left rounded-xl p-3 flex items-center gap-2.5 transition-all duration-200 border ${
                        isSelected
                          ? "bg-[#FDF9EE] border-2 border-[#C59226] shadow-sm"
                          : "bg-[#F3EEE6] hover:bg-[#EBE3D7] border-[#DFD6C8]"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#BA8223] text-white"
                            : "bg-[#4B3931] text-white"
                        }`}
                      >
                        {initialLetter}
                      </div>
                      <span className="text-xs font-semibold text-[#38281F] truncate leading-tight flex-1">
                        {b.name}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#C59226] text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Branch Image Card */}
            {selectedBranch && (
              <div className="mt-4 relative rounded-xl overflow-hidden shadow-md border border-[#E3D8C8]">
                <div className="relative h-44 sm:h-48 w-full bg-[#38281F]/20">
                  <Image
                    src={selectedBranch.pictureUrl || "/branch-2.jpg"}
                    alt={selectedBranch.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Bottom info banner */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/75 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-1.5 text-[#34D399] font-medium">
                      <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>Selected Branch</span>
                    </div>
                    <span className="font-semibold text-white/95 truncate max-w-[55%] text-right">
                      {selectedBranch.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Appointment Details */}
          <section className="bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] space-y-4">
            {/* Header with circle 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8DCBE] text-[#8C6418] flex items-center justify-center font-serif font-bold text-lg shadow-sm flex-shrink-0">
                2
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                  Appointment Details
                </h2>
                <p className="text-xs text-[#7D6C63]">
                  Review your selections and choose date &amp; time
                </p>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-[#F4EFE6] rounded-xl p-4 border border-[#E2D7C7] text-xs">
              <div className="flex items-center gap-2 mb-3 text-[#38281F] font-semibold text-[13px]">
                <svg className="w-4 h-4 text-[#8C6418]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[#6D5D55]">
                <span className="text-[#84746C]">Branch</span>
                <span className="font-semibold text-[#38281F] text-right truncate">
                  {selectedBranch?.name || "-"}
                </span>

                <span className="text-[#84746C]">Package</span>
                <span className="font-semibold text-[#38281F] text-right truncate">
                  {selectedPackage?.title || "-"}
                </span>

                <span className="text-[#84746C]">Date</span>
                <span className="font-semibold text-[#38281F] text-right">
                  {date || "-"}
                </span>

                <span className="text-[#84746C]">Time</span>
                <span className="font-semibold text-[#38281F] text-right">
                  {time || "-"}
                </span>

                {voucher.trim() !== "" && voucherStatus === "valid" && (
                  <>
                    <span className="text-[#84746C]">Voucher</span>
                    <span className="font-semibold text-[#059669] text-right">
                      Applied ({voucher})
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Date and Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Select Date */}
              <div>
                <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                  <span className="text-[#BA8223]">📅</span> Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Select Time */}
              <div>
                <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                  <span className="text-[#BA8223]">🕒</span> Select Time
                </label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="text-[#998A82]">
                      Choose a time...
                    </option>
                    {Array.from({ length: 24 }, (_, h) =>
                      Array.from({ length: 2 }, (_, half) => {
                        if (h < 10 || h > 21) return null; // 10:00 - 22:00
                        const hour = h.toString().padStart(2, "0");
                        const minute = (half * 30).toString().padStart(2, "0");
                        const val = `${hour}:${minute}`;
                        return (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        );
                      })
                    )
                      .flat()
                      .filter(Boolean)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-[#BA8223] text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Voucher Code (optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#38281F] mb-1.5 flex items-center gap-1.5">
                <span className="text-[#BA8223]">🏷️</span> Voucher Code (optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  placeholder="Enter voucher code"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] placeholder-[#9E9087] focus:outline-none focus:ring-2 focus:ring-[#BA8223] shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => validateVoucherCode()}
                  className="px-5 py-2.5 bg-[#BA8223] hover:bg-[#A3701B] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {voucherMessage && (
                <p
                  className={`text-[11px] mt-1.5 font-medium ${
                    voucherStatus === "valid"
                      ? "text-[#059669]"
                      : voucherStatus === "invalid"
                      ? "text-[#DC2626]"
                      : "text-[#D97706]"
                  }`}
                >
                  {voucherMessage}
                </p>
              )}
            </div>

            {/* CTA Book Appointment Button */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={async () => {
                if (!canSubmit) return;
                setIsSubmitting(true);
                setSubmitError(null);
                setSuccessId(null);
                try {
                  const dateIso = new Date(`${date}T${time}:00`).toISOString();
                  const res = await createBooking({
                    branchId: selectedBranchId,
                    packageId: selectedPackageId,
                    date: dateIso,
                    voucherId:
                      voucher.trim() && voucherStatus === "valid"
                        ? voucherId ?? undefined
                        : undefined,
                  });
                  setSuccessId(res.id || "CONFIRMED");
                  resetForm();
                } catch (e: unknown) {
                  setSubmitError(
                    e instanceof Error
                      ? e.message
                      : "Failed to create booking. Please try again."
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                canSubmit
                  ? "bg-gradient-to-r from-[#A8711D] via-[#BA8223] to-[#A8711D] hover:from-[#966316] hover:to-[#966316] text-white cursor-pointer active:scale-[0.99]"
                  : "bg-[#D6CBC0] text-[#7A6C63] cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>📅</span>
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </section>
        </div>

        {/* Section 3: Select Package (Bottom Full Width Card) */}
        <section className="bg-[#FAF7F2] rounded-2xl shadow-xl p-5 md:p-6 border border-[#EAE2D5] mt-6">
          {/* Header Row: Title & Right Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE2D5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#BA8223] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm flex-shrink-0">
                3
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-[#38281F]">
                  Select Package
                </h2>
                <p className="text-xs text-[#7D6C63]">
                  Choose the perfect package for you
                </p>
              </div>
            </div>

            {/* Filters on Right */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search packages..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] placeholder-[#9E9087] focus:outline-none focus:ring-2 focus:ring-[#BA8223]"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9E9087]">
                  🔍
                </span>
              </div>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={handleTypeFilterChange}
                className="px-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="service">Services</option>
                <option value="promotion">Promotions</option>
              </select>

              {/* Sort Filter */}
              <select
                value={sortKey}
                onChange={handleSortKeyChange}
                className="px-3 py-2 rounded-lg bg-white border border-[#DCD3C5] text-xs text-[#38281F] focus:outline-none focus:ring-2 focus:ring-[#BA8223] cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="durationAsc">Duration: Shortest</option>
                <option value="durationDesc">Duration: Longest</option>
                <option value="nameAsc">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Sub Bar: Toggle & Showing Count */}
          <div className="flex items-center justify-between py-3 text-xs text-[#7D6C63]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={groupByType}
                onChange={(e) => setGroupByType(e.target.checked)}
                className="w-4 h-4 accent-[#BA8223] rounded cursor-pointer"
              />
              <span className="font-medium text-[#4B3931]">Group by type</span>
            </label>
            <span>Showing {sorted.length} packages</span>
          </div>

          {/* Package Rows List */}
          <div className="space-y-2.5">
            {grouped
              ? GROUP_KEYS.map((group) => {
                  const list = grouped[group];
                  if (!list.length) return null;
                  return (
                    <div key={group} className="space-y-2 pt-2">
                      <h3 className="text-xs uppercase tracking-wider text-[#917E73] font-bold px-1">
                        {group === "service" ? "Services" : "Promotions"}
                      </h3>
                      {list.map((p) => renderPackageRow(p))}
                    </div>
                  );
                })
              : sorted.map((p) => renderPackageRow(p))}

            {sorted.length === 0 && (
              <div className="text-center py-10 text-xs text-[#8A7970]">
                No packages match your search criteria.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Floating Feedback Toasts */}
      {(submitError || successId) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full space-y-3">
          {submitError && (
            <div className="bg-white border-l-4 border-red-500 rounded-xl p-4 shadow-2xl flex items-start gap-3">
              <span className="text-red-500 text-lg">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Failed</p>
                <p className="text-xs text-gray-600 mt-0.5">{submitError}</p>
              </div>
            </div>
          )}
          {successId && (
            <div className="bg-white border-l-4 border-emerald-500 rounded-xl p-4 shadow-2xl flex items-start gap-3">
              <span className="text-emerald-500 text-lg">🎉</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">Booking Confirmed!</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Thank you for booking with Getthawa. We look forward to seeing you.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );

  function renderPackageRow(p: Package) {
    const isSelected = selectedPackageId === p.id;
    const isPromotion = p.type === "promotion";
    const avatarLetter = isPromotion ? "P" : "S";
    const priceNum = Number.parseFloat(p.price);

    return (
      <button
        key={p.id}
        type="button"
        onClick={() => togglePackage(p.id)}
        className={`w-full text-left rounded-xl p-3 sm:p-3.5 transition-all duration-200 flex items-center justify-between gap-3 border cursor-pointer ${
          isSelected
            ? "bg-[#FCF7EB] border-2 border-[#C59226] ring-1 ring-[#C59226]/50 shadow-sm"
            : "bg-[#F5F0E8] hover:bg-[#EFE7DC] border-[#DFD6C8]"
        }`}
      >
        {/* Left: Avatar + Thumbnail + Details */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar Icon ([P] or [S]) */}
          <div
            className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs flex-shrink-0 ${
              isPromotion ? "bg-[#4B3931]" : "bg-[#6A574E]"
            }`}
          >
            {avatarLetter}
          </div>

          {/* Thumbnail Image */}
          <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#38281F]/15 border border-[#DDD3C4]">
            <Image
              src={p.pictureUrl || "/aromapics.png"}
              alt={p.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="font-semibold text-xs sm:text-sm text-[#38281F] truncate">
                {p.title}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                  isPromotion
                    ? "bg-[#FEE2E2] text-[#DC2626]"
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}
              >
                {isPromotion ? "PROMO" : "SERVICE"}
              </span>
            </div>
            <p className="text-[11px] text-[#7D6C63] truncate">
              {p.duration} mins • {p.description || "Traditional Thai massage"}
            </p>
          </div>
        </div>

        {/* Right: Price & Chevron */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="font-bold text-sm sm:text-base text-[#BA8223] whitespace-nowrap">
            ฿{Number.isFinite(priceNum) ? priceNum.toLocaleString() : p.price}
          </span>
          <span
            className={`text-sm font-semibold transition-colors ${
              isSelected ? "text-[#BA8223]" : "text-[#B8ACA1]"
            }`}
          >
            ›
          </span>
        </div>
      </button>
    );
  }
}
