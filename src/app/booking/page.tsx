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

export default function BookingPage() {
  // Data state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  // Selections
  const [selectedBranchId, setSelectedBranchId] = useState("");
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

  // Fetch branches
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getBranches();
        if (active) setBranches(data);
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Fetch packages
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPackage();
        if (active) setPackages(data);
      } catch (e) {
        console.error("Failed to load packages", e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Restore persisted selections & inputs
  useEffect(() => {
    try {
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

  // Voucher validation (debounced)
  useEffect(() => {
    const code = voucher.trim();
    if (!code) {
      setVoucherStatus("idle");
      setVoucherMessage("");
      setVoucherId(null);
      return;
    }
    let active = true;
    setVoucherStatus("checking");
    setVoucherMessage(
      readyText("booking.validatingVoucher", "Validating voucher…")
    );
    const timer = setTimeout(async () => {
      try {
        const result = await verifyVoucher(code);
        if (!active) return;
        if (result.isValid) {
          setVoucherStatus("valid");
          setVoucherMessage(
            readyText("booking.voucherApplied", "Voucher applied")
          );
          setVoucherId(result.id || null);
        } else {
          setVoucherStatus("invalid");
          setVoucherMessage(
            readyText("booking.voucherNotValid", "Voucher code not valid")
          );
          setVoucherId(null);
        }
      } catch {
        if (!active) return;
        setVoucherStatus("invalid");
        setVoucherMessage(
          readyText(
            "booking.voucherValidationError",
            "Unable to validate voucher"
          )
        );
        setVoucherId(null);
      }
    }, 450);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [voucher, readyText]);

  // Auto hide feedback toasts
  useEffect(() => {
    if (!successId) return;
    const t = setTimeout(() => setSuccessId(null), 5000);
    return () => clearTimeout(t);
  }, [successId]);
  useEffect(() => {
    if (!submitError) return;
    const t = setTimeout(() => setSubmitError(null), 5000);
    return () => clearTimeout(t);
  }, [submitError]);

  // Derived data
  const activePackages = packages.filter((p) => p.isActive);
  // Filter & search
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
  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortKey) {
      case "priceAsc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "priceDesc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "durationAsc": {
        const da =
          typeof a.duration === "number"
            ? a.duration
            : parseInt(String(a.duration));
        const db =
          typeof b.duration === "number"
            ? b.duration
            : parseInt(String(b.duration));
        return da - db;
      }
      case "durationDesc": {
        const da =
          typeof a.duration === "number"
            ? a.duration
            : parseInt(String(a.duration));
        const db =
          typeof b.duration === "number"
            ? b.duration
            : parseInt(String(b.duration));
        return db - da;
      }
      case "nameAsc":
        return a.title.localeCompare(b.title);
      case "recommended":
      default:
        // Keep original order (assumed: API returns curated order)
        return 0;
    }
  });
  // Group if enabled
  const grouped = groupByType
    ? {
        service: sorted.filter((p) => p.type === "service"),
        promotion: sorted.filter((p) => p.type === "promotion"),
      }
    : null;
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const selectedPackage = activePackages.find(
    (p) => p.id === selectedPackageId
  );
  const baseReady = !!(selectedBranchId && selectedPackageId && date && time);
  const voucherReady = voucher.trim() === "" ? true : voucherStatus === "valid";
  const canSubmit =
    baseReady && voucherReady && !isSubmitting && voucherStatus !== "checking";

  const togglePackage = (id: string) => {
    setSelectedPackageId((prev) => (prev === id ? "" : id));
  };

  const resetForm = () => {
    setSelectedBranchId("");
    setSelectedPackageId("");
    setDate("");
    setTime("");
    setVoucher("");
    setVoucherStatus("idle");
    setVoucherMessage("");
    setVoucherId(null);
  };

  // bg-gradient-to-b from-[#382924]/80 via-[#58392F]/85 to-[#382924]/90
  return (
    // REPLACED main wrapper to match profile background
    <main className="min-h-screen w-full pb-16 bg-gradient-to-br from-[#382924] via-[#4A332B] to-[#58392F] text-white relative overflow-hidden -mt-[70px] pt-[70px]">
      {/* Background decorations (added to mirror profile page) */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DCA900]/5 to-transparent animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DCA900]/10 rounded-full blur-3xl animate-floatY"></div>
      <div
        className="absolute bottom-0 left-0 w-72 h-72 bg-[#DCA900]/5 rounded-full blur-2xl animate-floatY"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Wrapped existing content to layer above decorations */}
      <div className="relative z-10">
        {/* Compact Header */}
        <div className="text-center py-6 px-4">
          <div className="animate-fadeInUp">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient mb-2 animate-slideInRight">
              {readyText("booking.title", "Book Appointment")}
            </h1>
            <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base mb-4">
              {readyText(
                "booking.subtitle",
                "Schedule your perfect Thai massage experience"
              )}
            </p>
            <div className="w-16 h-1 bg-gradient-primary mx-auto rounded-full shadow-glow"></div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {/* Left Column: Branch + Packages */}
            <div className="space-y-4">
              {/* Branch Selection */}
              <section
                className="animate-slideInUp opacity-0"
                style={{ animationDelay: "0.15s" }}
              >
                <div className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <span className="text-white text-sm">🏢</span>
                    </div>
                    <h2 className="text-base font-semibold text-gradient tracking-wide">
                      {readyText("booking.selectBranch", "Select Branch")}
                    </h2>
                  </div>
                  {branches.length === 0 ? (
                    <div className="text-center py-6 text-sm text-white/70">
                      {readyText(
                        "booking.noBranchesAvailable",
                        "No branches available"
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {branches.map((b, i) => (
                        <label
                          key={b.id}
                          className="group cursor-pointer animate-scaleIn opacity-0"
                          style={{ animationDelay: `${0.25 + i * 0.08}s` }}
                        >
                          <input
                            type="radio"
                            name="branch"
                            value={b.id}
                            className="sr-only"
                            checked={selectedBranchId === b.id}
                            onChange={() => setSelectedBranchId(b.id)}
                          />
                          <div
                            className={`relative rounded-lg p-3 transition-all duration-300 ${
                              selectedBranchId === b.id
                                ? "bg-gradient-to-r from-[#DCA900]/25 to-[#DCA900]/10 ring-2 ring-[#DCA900] scale-[1.02]"
                                : "glass group-hover:scale-[1.02] group-hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white/80 group-hover:bg-white/25 transition-colors">
                                <span className="text-sm font-semibold">
                                  {b.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-[13px] leading-tight text-white/90 truncate">
                                {b.name}
                              </span>
                            </div>
                            {selectedBranchId === b.id && (
                              <div className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#DCA900] rounded-full flex items-center justify-center animate-bounceIn">
                                <span className="text-white text-[10px]">
                                  ✓
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {/* Branch Image Preview */}
                  {selectedBranch && (
                    <div className="mt-3 animate-fadeInUp">
                      <div className="relative rounded-lg overflow-hidden group ring-1 ring-white/10">
                        <Image
                          src={selectedBranch.pictureUrl || "/branch-1.jpg"}
                          alt={selectedBranch.name}
                          width={800}
                          height={450}
                          className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
                          <span className="font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            {readyText(
                              "booking.selectedBranch",
                              "Selected Branch"
                            )}
                            :
                          </span>
                          <span className="text-white/90 font-semibold truncate max-w-[55%]">
                            {selectedBranch.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Package (Service + Promotion) Selection */}
              <section
                className="animate-slideInUp opacity-0"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <span className="text-white text-sm">🧾</span>
                    </div>
                    <h2 className="text-base font-semibold text-gradient tracking-wide">
                      {readyText("booking.selectPackage", "Select Package")}
                    </h2>
                  </div>
                  {/* Controls */}
                  <div className="grid gap-2 md:grid-cols-2 mb-3">
                    <div className="flex gap-2">
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={readyText(
                          "booking.searchPackages",
                          "Search packages"
                        )}
                        className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-[12.5px] text-white placeholder-white/40 focus:ring-2 focus:ring-[#DCA900] focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-2 text-[12px]">
                      <select
                        value={typeFilter}
                        onChange={handleTypeFilterChange}
                        className="flex-1 px-2.5 py-2 rounded-lg bg-white/10 border border-white/15 text-white focus:ring-2 focus:ring-[#DCA900] focus:border-transparent"
                      >
                        <option value="all" className="bg-[#382924]">
                          {readyText("booking.allTypes", "All Types")}
                        </option>
                        <option value="service" className="bg-[#382924]">
                          {readyText("booking.service", "Service")}
                        </option>
                        <option value="promotion" className="bg-[#382924]">
                          {readyText("booking.promotion", "Promo")}
                        </option>
                      </select>
                      <select
                        value={sortKey}
                        onChange={handleSortKeyChange}
                        className="flex-1 px-2.5 py-2 rounded-lg bg-white/10 border border-white/15 text-white focus:ring-2 focus:ring-[#DCA900] focus:border-transparent"
                      >
                        <option value="recommended" className="bg-[#382924]">
                          {readyText("booking.sortRecommended", "Recommended")}
                        </option>
                        <option value="priceAsc" className="bg-[#382924]">
                          {readyText("booking.sortPriceLow", "Price ↑")}
                        </option>
                        <option value="priceDesc" className="bg-[#382924]">
                          {readyText("booking.sortPriceHigh", "Price ↓")}
                        </option>
                        <option value="durationAsc" className="bg-[#382924]">
                          {readyText("booking.sortDurationShort", "Duration ↑")}
                        </option>
                        <option value="durationDesc" className="bg-[#382924]">
                          {readyText("booking.sortDurationLong", "Duration ↓")}
                        </option>
                        <option value="nameAsc" className="bg-[#382924]">
                          {readyText("booking.sortNameAsc", "Name A-Z")}
                        </option>
                      </select>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-between text-[12px]">
                      <label className="flex items-center gap-2 select-none">
                        <input
                          type="checkbox"
                          checked={groupByType}
                          onChange={(e) => setGroupByType(e.target.checked)}
                          className="accent-[#DCA900] w-4 h-4"
                        />
                        <span className="text-white/80">
                          {readyText("booking.groupByType", "Group by type")}
                        </span>
                      </label>
                      <span className="text-white/50">
                        {readyText("booking.showing", "Showing")}{" "}
                        {sorted.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2.5 custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
                    {/* Grouped */}
                    {grouped
                      ? GROUP_KEYS.map((group) => {
                          const list = grouped[group];
                          if (!list.length) return null;
                          return (
                            <div key={group} className="space-y-2">
                              <h3 className="text-xs uppercase tracking-wider text-white/50 font-medium mt-4 first:mt-0">
                                {group === "service"
                                  ? readyText("booking.services", "Services")
                                  : readyText(
                                      "booking.promotions",
                                      "Promotions"
                                    )}
                              </h3>
                              {list.map((p, i2) => {
                                const price = Number.parseFloat(p.price);
                                const isSelected = selectedPackageId === p.id;
                                const isPromotion = p.type === "promotion";
                                return (
                                  <div
                                    key={p.id}
                                    className="animate-slideInLeft opacity-0"
                                    style={{
                                      animationDelay: `${0.4 + i2 * 0.06}s`,
                                    }}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => togglePackage(p.id)}
                                      className={`w-full text-left rounded-lg p-3.5 transition-all duration-300 group ${
                                        isSelected
                                          ? "bg-gradient-to-r from-[#DCA900]/20 to-[#DCA900]/10 ring-2 ring-[#DCA900] scale-[1.02]"
                                          : "glass hover:scale-[1.01] hover:bg-white/10"
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                            isSelected
                                              ? "bg-[#DCA900] text-white"
                                              : "bg-white/20 text-white/80 group-hover:bg-white/30"
                                          }`}
                                        >
                                          <span className="text-sm font-bold">
                                            {isPromotion ? "P" : "S"}
                                          </span>
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-semibold text-[15px] text-white leading-tight flex items-center gap-1">
                                              {p.title}
                                              <span
                                                className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${
                                                  isPromotion
                                                    ? "bg-pink-500/20 text-pink-300"
                                                    : "bg-amber-500/20 text-amber-300"
                                                }`}
                                              >
                                                {isPromotion
                                                  ? readyText(
                                                      "booking.promotion",
                                                      "Promo"
                                                    )
                                                  : readyText(
                                                      "booking.service",
                                                      "Service"
                                                    )}
                                              </span>
                                            </h3>
                                            <p className="text-[15px] font-bold text-[#DCA900]">
                                              ฿
                                              {Number.isFinite(price)
                                                ? price
                                                : p.price}
                                            </p>
                                          </div>
                                          <p className="text-white/70 text-[11px] leading-snug">
                                            {p.duration}{" "}
                                            {readyText("booking.mins", "mins")}{" "}
                                            •{" "}
                                            {p.description ||
                                              readyText(
                                                "booking.noDescription",
                                                "No description"
                                              )}
                                          </p>
                                        </div>
                                        {isSelected && (
                                          <div className="w-5 h-5 bg-[#DCA900] rounded-full flex items-center justify-center animate-bounceIn">
                                            <span className="text-white text-[11px]">
                                              ✓
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })
                      : sorted.map((p, i) => {
                          const price = Number.parseFloat(p.price);
                          const isSelected = selectedPackageId === p.id;
                          const isPromotion = p.type === "promotion";
                          return (
                            <div
                              key={p.id}
                              className="animate-slideInLeft opacity-0"
                              style={{ animationDelay: `${0.4 + i * 0.08}s` }}
                            >
                              <button
                                type="button"
                                onClick={() => togglePackage(p.id)}
                                className={`w-full text-left rounded-lg p-3.5 transition-all duration-300 group ${
                                  isSelected
                                    ? "bg-gradient-to-r from-[#DCA900]/20 to-[#DCA900]/10 ring-2 ring-[#DCA900] scale-[1.02]"
                                    : "glass hover:scale-[1.01] hover:bg-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                      isSelected
                                        ? "bg-[#DCA900] text-white"
                                        : "bg-white/20 text-white/80 group-hover:bg-white/30"
                                    }`}
                                  >
                                    <span className="text-sm font-bold">
                                      {isPromotion ? "P" : "S"}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-0.5">
                                      <h3 className="font-semibold text-[15px] text-white leading-tight flex items-center gap-1">
                                        {p.title}
                                        <span
                                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide ${
                                            isPromotion
                                              ? "bg-pink-500/20 text-pink-300"
                                              : "bg-amber-500/20 text-amber-300"
                                          }`}
                                        >
                                          {isPromotion
                                            ? readyText(
                                                "booking.promotion",
                                                "Promo"
                                              )
                                            : readyText(
                                                "booking.service",
                                                "Service"
                                              )}
                                        </span>
                                      </h3>
                                      <p className="text-[15px] font-bold text-[#DCA900]">
                                        ฿
                                        {Number.isFinite(price)
                                          ? price
                                          : p.price}
                                      </p>
                                    </div>
                                    <p className="text-white/70 text-[11px] leading-snug">
                                      {p.duration}{" "}
                                      {readyText("booking.mins", "mins")} •{" "}
                                      {p.description ||
                                        readyText(
                                          "booking.noDescription",
                                          "No description"
                                        )}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <div className="w-5 h-5 bg-[#DCA900] rounded-full flex items-center justify-center animate-bounceIn">
                                      <span className="text-white text-[11px]">
                                        ✓
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </button>
                            </div>
                          );
                        })}
                  </div>
                  {selectedPackage && (
                    <div className="mt-3 animate-fadeInUp">
                      <div className="relative rounded-lg overflow-hidden group ring-1 ring-white/10">
                        <Image
                          src={
                            selectedPackage.pictureUrl ||
                            (selectedPackage.type === "promotion"
                              ? "/home-pic5.png"
                              : "/aromapics.png")
                          }
                          alt={selectedPackage.title}
                          width={800}
                          height={450}
                          className="w-full h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
                          <span className="font-medium flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                selectedPackage.type === "promotion"
                                  ? "bg-pink-400"
                                  : "bg-amber-400"
                              }`}
                            ></span>
                            {selectedPackage.type === "promotion"
                              ? readyText(
                                  "booking.selectedPromotion",
                                  "Selected Promotion"
                                )
                              : readyText(
                                  "booking.selectedService",
                                  "Selected Service"
                                )}
                            :
                          </span>
                          <span className="text-white/90 font-semibold truncate max-w-[55%]">
                            {selectedPackage.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Summary & Actions */}
            <div
              className="space-y-4 lg:sticky lg:top-20 self-start animate-slideInUp opacity-0"
              style={{ animationDelay: "0.45s" }}
            >
              <div className="glass rounded-xl p-4 border border-white/10 space-y-4">
                {/* Summary */}
                <div className="glass rounded-lg p-3 border border-white/10">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#DCA900]/30 flex items-center justify-center text-[10px]">
                      📋
                    </span>
                    <span className="text-base font-semibold text-gradient tracking-wide">
                      {readyText("booking.summary", "Summary")}
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11.5px] leading-snug">
                    <div className="text-white/60">
                      {readyText("booking.branch", "Branch")}
                    </div>
                    <div className="text-white/90 font-medium truncate">
                      {selectedBranch?.name || "-"}
                    </div>
                    <div className="text-white/60">
                      {readyText("booking.package", "Package")}
                    </div>
                    <div className="text-white/90 font-medium truncate">
                      {selectedPackage?.title || "-"}
                    </div>
                    <div className="text-white/60">
                      {readyText("booking.date", "Date")}
                    </div>
                    <div className="text-white/90 font-medium truncate">
                      {date || "-"}
                    </div>
                    <div className="text-white/60">
                      {readyText("booking.time", "Time")}
                    </div>
                    <div className="text-white/90 font-medium truncate">
                      {time || "-"}
                    </div>
                    {voucher.trim() !== "" && voucherStatus === "valid" && (
                      <>
                        <div className="text-white/60">
                          {readyText("booking.voucher", "Voucher")}
                        </div>
                        <div className="text-emerald-400 font-medium truncate">
                          {readyText("booking.applied", "Applied")}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-white/90">
                      {readyText("booking.selectDate", "Select Date")}
                    </label>
                    <div className="relative">
                      <select
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-white/10 border border-white/15 text-[12.5px] text-white focus:ring-2 focus:ring-[#DCA900] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:bg-white/15"
                      >
                        <option value="" className="bg-[#382924] text-white">
                          {readyText("booking.chooseDatePlaceholder", "Choose")}
                        </option>
                        {Array.from({ length: 30 }, (_, i) => {
                          const d = new Date();
                          d.setDate(d.getDate() + i);
                          const dateStr = d.toISOString().split("T")[0];
                          const label = d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                          return (
                            <option
                              key={dateStr}
                              value={dateStr}
                              className="bg-[#382924] text-white"
                            >
                              {label}
                            </option>
                          );
                        })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <span className="text-[#DCA900] text-[10px]">▼</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-medium text-white/90">
                      {readyText("booking.selectTime", "Select Time")}
                    </label>
                    <div className="relative">
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-white/10 border border-white/15 text-[12.5px] text-white focus:ring-2 focus:ring-[#DCA900] focus:border-transparent transition-all duration-300 appearance-none cursor-pointer hover:bg-white/15"
                      >
                        <option value="" className="bg-[#382924] text-white">
                          {readyText("booking.chooseTimePlaceholder", "Choose")}
                        </option>
                        {Array.from({ length: 24 }, (_, h) =>
                          Array.from({ length: 2 }, (_, half) => {
                            if (h < 8 || h > 21) return null; // business hours
                            const hour = h.toString().padStart(2, "0");
                            const minute = (half * 30)
                              .toString()
                              .padStart(2, "0");
                            const val = `${hour}:${minute}`;
                            return (
                              <option
                                key={val}
                                value={val}
                                className="bg-[#382924] text-white"
                              >
                                {val}
                              </option>
                            );
                          })
                        )
                          .flat()
                          .filter(Boolean)}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <span className="text-[#DCA900] text-[10px]">▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voucher */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-medium text-white/90">
                    {readyText("booking.voucherCode", "Voucher (optional)")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={voucher}
                      onChange={(e) => setVoucher(e.target.value)}
                      placeholder={readyText(
                        "booking.enterVoucherCode",
                        "Code"
                      )}
                      className={`w-full px-3 py-2 pr-10 rounded-lg bg-white/10 border transition-all duration-300 text-[12.5px] text-white placeholder-white/40 ${
                        voucher.trim() === ""
                          ? "border-white/15 focus:ring-2 focus:ring-[#DCA900] focus:border-transparent"
                          : voucherStatus === "valid"
                          ? "border-green-500 ring-1 ring-green-500/50"
                          : voucherStatus === "invalid"
                          ? "border-red-500 ring-1 ring-red-500/50"
                          : "border-yellow-500 ring-1 ring-yellow-500/50"
                      }`}
                    />
                    {voucher.trim() !== "" && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {voucherStatus === "checking" && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {voucherStatus === "valid" && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounceIn">
                            <span className="text-white text-[10px]">✓</span>
                          </div>
                        )}
                        {voucherStatus === "invalid" && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounceIn">
                            <span className="text-white text-[10px]">✕</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {voucher.trim() !== "" && voucherMessage && (
                    <p
                      className={`text-[11px] mt-1 ${
                        voucherStatus === "valid"
                          ? "text-green-400"
                          : voucherStatus === "invalid"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {voucherMessage}
                    </p>
                  )}
                </div>

                {/* Book Button */}
                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={async () => {
                    if (!canSubmit) return;
                    setIsSubmitting(true);
                    setSubmitError(null);
                    setSuccessId(null);
                    try {
                      const dateIso = new Date(
                        `${date}T${time}:00`
                      ).toISOString();
                      const res = await createBooking({
                        branchId: selectedBranchId,
                        packageId: selectedPackageId,
                        date: dateIso,
                        voucherId:
                          voucher.trim() && voucherStatus === "valid"
                            ? voucherId ?? undefined
                            : undefined,
                      });
                      setSuccessId(res.id || "");
                      resetForm();
                    } catch (e: unknown) {
                      setSubmitError(
                        e instanceof Error
                          ? e.message
                          : readyText(
                              "booking.bookingError",
                              "Failed to create booking"
                            )
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className={`group relative w-full px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-300 transform ${
                    canSubmit
                      ? "btn-modern hover:scale-[1.03] shadow-lg shadow-[#DCA900]/25"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <span className={isSubmitting ? "opacity-0" : "opacity-100"}>
                    {readyText("booking.book", "Book Now")}
                  </span>
                  {!isSubmitting && canSubmit && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out rounded-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Toasts */}
        {(submitError || successId) && (
          <div className="fixed top-20 right-6 z-50 space-y-3">
            {submitError && (
              <div className="glass rounded-2xl p-4 border-l-4 border-red-500 bg-red-500/10 animate-slideInRight">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {readyText("booking.bookingError", "Booking Failed")}
                    </p>
                    <p className="text-red-200 text-sm break-all">
                      {submitError}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {successId && (
              <div className="glass rounded-2xl p-4 border-l-4 border-green-500 bg-green-500/10 animate-slideInRight">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {readyText("booking.bookingSuccess", "Booking Confirmed")}
                    </p>
                    <p className="text-green-200 text-sm">
                      {readyText("booking.reference", "Reference")}: {successId}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
