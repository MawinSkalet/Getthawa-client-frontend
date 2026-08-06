"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBranches, type Branch } from "@/hooks/useBranch";
import LocationClient from "@/components/LocationClient";
import I18nText from "@/components/I18nText";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import BranchReviewPanel from "@/components/BranchReviewPanel";

export function LocationSection() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getBranches();
        if (!cancelled) setBranches(data);
      } catch (e) {
        console.error("Failed to load branches", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-select branch when arriving with #location?branch=ID or ?branch=ID#location
  useEffect(() => {
    const applyBranchFromUrl = () => {
      try {
        let branchId: string | null = null;
        const { hash, search } = window.location;

        // Pattern: #location?branch=ID
        if (hash && hash.startsWith("#location")) {
          const qIndex = hash.indexOf("?");
          if (qIndex !== -1) {
            const qs = new URLSearchParams(hash.substring(qIndex + 1));
            branchId = qs.get("branch");
          }
        }

        // Fallback: ?branch=ID#location
        if (!branchId && search) {
          const qs = new URLSearchParams(search);
          branchId = qs.get("branch");
        }

        if (branchId) {
          setSelectedBranchId(branchId);
          setIsPanelVisible(true);
        }
      } catch {
        // no-op
      }
    };

    applyBranchFromUrl();
    window.addEventListener("hashchange", applyBranchFromUrl);
    return () => window.removeEventListener("hashchange", applyBranchFromUrl);
  }, []);

  // Keep selection in sync when the query param changes on the same page
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

      {/* Modern Header with glass background */}
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
          <p className="text-white/85 text-lg text-center max-w-2xl mx-auto leading-relaxed">
            <I18nText
              i18nKey="sections.location.helper"
              fallback="Explore our branches directly on the interactive map."
            />
          </p>
        </div>
      </div>

      {/* REPLACED previous two-column grid with unified map + overlay panel */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
          {/* Map */}
          <div className="relative h-[620px] md:h-[680px]">
            <LocationClient
              branches={branches}
              selectedBranchId={selectedBranchId}
              onBranchSelect={setSelectedBranchId}
            />
          </div>

          {/* Toggle button when panel is hidden */}
          {!isPanelVisible && (
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setIsPanelVisible(true)}
                className="group p-3 rounded-xl bg-gradient-to-br from-[#402e28]/90 via-[#50352d]/85 to-[#573a30]/90 border border-white/15 backdrop-blur-md shadow-[0_8px_25px_-6px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_35px_-6px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105"
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
            className={`absolute top-4 left-4 w-[300px] md:w-[340px] max-h-[calc(100%-2rem)] flex flex-col transition-all duration-500 ease-in-out ${
              isPanelVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            <div className="rounded-2xl bg-gradient-to-br from-[#402e28]/85 via-[#50352d]/80 to-[#573a30]/85 border border-white/10 backdrop-blur-md shadow-[0_8px_30px_-6px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col h-full">
              {/* Header with hide button */}
              <div className="px-5 pt-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#DCA900] flex items-center gap-2">
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
                  className="group p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200 hover:scale-110"
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
              <div className="overflow-y-auto custom-scrollbar px-4 py-4 space-y-3">
                {branches.length === 0 && (
                  <div className="text-center py-6 text-white/60 text-sm">
                    <I18nText
                      i18nKey="sections.location.noBranches"
                      fallback="No branches available."
                    />
                  </div>
                )}
                {branches.map((branch, index) => (
                  <div
                    key={branch.id}
                    className={`group glass rounded-xl p-3.5 transition-all duration-500 hover:scale-[1.02] cursor-pointer border ${
                      selectedBranchId === branch.id
                        ? "bg-[#DCA900]/20 border-[#DCA900]/60 shadow-[0_0_22px_-4px_rgba(220,169,0,0.4)]"
                        : "hover:bg-white/10 border-white/5 hover:border-[#DCA900]/40 hover:shadow-[0_0_22px_-4px_rgba(220,169,0,0.35)]"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* ENHANCED: This image box now handles map focus logic */}
                      <div
                        className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all duration-500 ${
                          selectedBranchId === branch.id
                            ? "ring-[#DCA900]/80"
                            : "ring-white/10 group-hover:ring-[#DCA900]/60"
                        }`}
                      >
                        <Image
                          src={branch.pictureUrl || "/aromapics.png"}
                          alt={branch.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-500 ${
                            selectedBranchId === branch.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        />
                        {/* Focus indicator */}
                        <div
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                            selectedBranchId === branch.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-white drop-shadow-lg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-semibold transition-colors duration-300 text-sm mb-1 truncate ${
                            selectedBranchId === branch.id
                              ? "text-[#DCA900]"
                              : "text-white group-hover:text-[#DCA900]"
                          }`}
                        >
                          {branch.name}
                        </h4>
                        <p className="text-white/65 text-[11px] leading-snug line-clamp-2">
                          {branch.description ||
                            "Premium Thai massage and wellness center"}
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-6px] group-hover:translate-x-0">
                        <svg
                          className="w-4 h-4 text-[#DCA900]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-white/10 text-center text-[11px] text-white/50">
                <I18nText
                  i18nKey="sections.location.tip"
                  fallback="Click branch to focus map location. Use arrow to hide panel."
                />
              </div>
            </div>
          </div>

          {/* Overlay Review Panel on wide screens */}
          <div className="absolute top-4 right-4 hidden xl:flex h-[calc(100%-2rem)] w-[360px]">
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
