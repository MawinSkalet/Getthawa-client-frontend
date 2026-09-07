"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBranches, type Branch } from "@/hooks/useBranch";
import LocationClient from "@/components/LocationClient";
import I18nText from "@/components/I18nText";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import BranchReviewPanel from "@/components/BranchReviewPanel";

// Coordinates for the 5 authentic branches in Chiang Mai
const BRANCH_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Rimping: { lat: 18.7847, lng: 99.0048 },
  Chareonmuang: { lat: 18.7852, lng: 99.0085 },
  "เจริญเมือง": { lat: 18.7852, lng: 99.0085 },
  Rimping2: { lat: 18.7892, lng: 99.0062 },
  ChiangKang: { lat: 18.7452, lng: 99.0281 },
  "เชียงขาง": { lat: 18.7452, lng: 99.0281 },
  Phrasingh: { lat: 18.7885, lng: 98.9805 },
  "พระสิงห์": { lat: 18.7885, lng: 98.9805 },
};

// Haversine formula to compute distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationSection() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [nearestBranchId, setNearestBranchId] = useState<string | null>(null);
  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(true);
  const heroBg = branches[0]?.pictureUrl || "/aromapics.png";
  const searchParams = useSearchParams();
  const localeFontClass = useLocaleFontClass();

  const activeBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    if (selectedBranchId) {
      const match = branches.find((branch) => branch.id === selectedBranchId);
      if (match) return match;
    }
    return branches[0];
  }, [branches, selectedBranchId]);

  // Load branches
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getBranches();
        if (!cancelled && data && data.length > 0) {
          setBranches(data);
        }
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Geolocation: Auto-detect user position and set nearest branch as default map selection
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator) || branches.length === 0) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let minDistance = Infinity;
        let closestId: string | null = null;

        branches.forEach((b) => {
          const entry = Object.entries(BRANCH_COORDINATES).find(([k]) => b.name.includes(k));
          if (entry) {
            const dist = getDistanceKm(latitude, longitude, entry[1].lat, entry[1].lng);
            if (dist < minDistance) {
              minDistance = dist;
              closestId = b.id;
            }
          }
        });

        if (closestId) {
          setNearestBranchId(closestId);
          setNearestDistanceKm(Math.round(minDistance * 10) / 10);

          // If no specific branch was requested via URL query/hash, default to nearest branch!
          const { hash, search } = window.location;
          const hasUrlBranch = (search && search.includes("branch=")) || (hash && hash.includes("branch="));
          if (!hasUrlBranch) {
            setSelectedBranchId(closestId);
          }
        }
      },
      (err) => {
        // Fallback silently if user denies geolocation or on timeout
        console.log("Geolocation fallback to default branch:", err.message);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  }, [branches]);

  // Auto-select branch when arriving with #location?branch=ID or ?branch=ID#location
  useEffect(() => {
    const applyBranchFromUrl = () => {
      try {
        let branchId: string | null = null;
        const { hash, search } = window.location;

        if (hash && hash.startsWith("#location")) {
          const qIndex = hash.indexOf("?");
          if (qIndex !== -1) {
            const qs = new URLSearchParams(hash.substring(qIndex + 1));
            branchId = qs.get("branch");
          }
        }

        if (!branchId && search) {
          const qs = new URLSearchParams(search);
          branchId = qs.get("branch");
        }

        if (branchId) {
          setSelectedBranchId(branchId);
          setIsPanelVisible(true);
        }
      } catch {}
    };

    applyBranchFromUrl();
    window.addEventListener("hashchange", applyBranchFromUrl);
    return () => window.removeEventListener("hashchange", applyBranchFromUrl);
  }, []);

  // Keep selection in sync when query param changes
  useEffect(() => {
    if (!searchParams) return;
    const branchParam = searchParams.get("branch");
    if (branchParam) {
      setSelectedBranchId(branchParam);
      setIsPanelVisible(true);
    }
  }, [searchParams]);

  return (
    <section
      id="location"
      className="scroll-mt-[140px] w-full px-0 py-16 md:py-24 text-white relative overflow-hidden"
    >
      {/* Full section background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBg}
          alt=""
          fill
          priority
          className="object-cover w-full h-full opacity-45"
        />
        <div className="absolute inset-0 bg-[#2a1d19]/65 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#382924]/50 via-[#4A332B]/70 to-[#58392F]/85" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative rounded-3xl px-6 md:px-10 py-8 md:py-10 bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
          <div className="absolute -top-20 -right-12 w-64 h-64 rounded-full bg-[#DCA900]/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-[#DCA900]/10 blur-3xl" />

          <h2
            className={`${localeFontClass} text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-4 text-center drop-shadow-[0_2px_6px_rgba(220,169,0,0.35)]`}
          >
            <I18nText
              i18nKey="sections.location.title"
              fallback="Our Locations"
            />
          </h2>
          <p className="text-white/85 text-base md:text-lg text-center max-w-2xl mx-auto leading-relaxed">
            <I18nText
              i18nKey="sections.location.helper"
              fallback="Explore our branches directly on the interactive map."
            />
            {nearestDistanceKm !== null && (
              <span className="block mt-2 text-xs text-[#34D399] font-medium">
                📍 ระบบได้เลือกสาขาที่ใกล้ที่สุดตามตำแหน่งของคุณให้เรียบร้อยแล้ว (~{nearestDistanceKm} กม.)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Unified map + overlay panel */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
          {/* Map container */}
          <div className="relative h-[620px] md:h-[680px]">
            <LocationClient
              branches={branches}
              selectedBranchId={selectedBranchId}
              onBranchSelect={setSelectedBranchId}
            />
          </div>

          {/* Toggle button when panel is hidden */}
          {!isPanelVisible && (
            <div className="absolute top-4 left-4 z-20">
              <button
                onClick={() => setIsPanelVisible(true)}
                className="group p-3 rounded-xl bg-gradient-to-br from-[#402e28]/90 via-[#50352d]/85 to-[#573a30]/90 border border-white/15 backdrop-blur-md shadow-[0_8px_25px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 cursor-pointer"
                title="Show branches panel"
              >
                <svg
                  className="w-6 h-6 text-[#DCA900] group-hover:text-white transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Overlay Branch Panel */}
          <div
            className={`absolute top-4 left-4 w-[300px] md:w-[350px] max-h-[calc(100%-2rem)] flex flex-col transition-all duration-500 ease-in-out z-20 ${
              isPanelVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#402e28]/90 via-[#50352d]/85 to-[#573a30]/90 border border-white/15 backdrop-blur-md shadow-[0_8px_30px_-6px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-full">
              {/* Header with hide button */}
              <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-[#DCA900] flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  <I18nText
                    i18nKey="sections.location.branches"
                    fallback="Branches"
                  />
                </h3>
                <button
                  onClick={() => setIsPanelVisible(false)}
                  className="group p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-110 cursor-pointer"
                  title="Hide branches panel"
                >
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Branch List */}
              <div className="overflow-y-auto custom-scrollbar px-3.5 py-3 space-y-2.5">
                {branches.length === 0 && (
                  <div className="text-center py-6 text-white/60 text-sm">
                    <I18nText
                      i18nKey="sections.location.noBranches"
                      fallback="No branches available."
                    />
                  </div>
                )}
                {branches.map((branch, index) => {
                  const isSelected = selectedBranchId === branch.id;
                  const isNearest = nearestBranchId === branch.id;

                  return (
                    <div
                      key={branch.id}
                      className={`group rounded-xl p-3 transition-all duration-300 hover:scale-[1.01] cursor-pointer border ${
                        isSelected
                          ? "bg-[#DCA900]/25 border-[#DCA900] shadow-[0_0_20px_-4px_rgba(220,169,0,0.45)] ring-1 ring-[#DCA900]"
                          : "hover:bg-white/10 border-white/10 bg-black/20 hover:border-[#DCA900]/40"
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => {
                        setSelectedBranchId(branch.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all duration-300 ${
                            isSelected
                              ? "ring-[#DCA900]"
                              : "ring-white/10 group-hover:ring-[#DCA900]/50"
                          }`}
                        >
                          <Image
                            src={branch.pictureUrl || "/branch-1.jpg"}
                            alt={branch.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="50px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            <h4
                              className={`font-semibold text-xs transition-colors duration-200 truncate ${
                                isSelected
                                  ? "text-[#FFD84D]"
                                  : "text-white group-hover:text-[#FFD84D]"
                              }`}
                            >
                              {branch.name}
                            </h4>
                            {isNearest && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/40">
                                ใกล้คุณที่สุด
                              </span>
                            )}
                          </div>
                          <p className="text-white/70 text-[11px] leading-snug line-clamp-1">
                            {branch.address || "Chiang Mai"}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#DCA900] text-[#241712] flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-white/10 text-center text-[11px] text-white/55">
                <I18nText
                  i18nKey="sections.location.tip"
                  fallback="Click branch to focus map location."
                />
              </div>
            </div>
          </div>

          {/* Overlay Review Panel on wide screens */}
          <div className="absolute top-4 right-4 hidden xl:flex h-[calc(100%-2rem)] w-[360px] z-20">
            <BranchReviewPanel branch={activeBranch} />
          </div>
        </div>

        {/* Review Panel below map for smaller screens */}
        <div className="mt-6 xl:hidden">
          <BranchReviewPanel branch={activeBranch} />
        </div>
      </div>
    </section>
  );
}
