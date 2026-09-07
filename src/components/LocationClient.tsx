"use client";
import { useMemo, useState, useEffect } from "react";
import type { Branch } from "@/hooks/useBranch";

type Props = {
  branches: Branch[];
  selectedBranchId?: string | null;
  onBranchSelect?: (branchId: string) => void;
};

export default function LocationClient({
  branches,
  selectedBranchId,
  onBranchSelect,
}: Props) {
  const defaultBranchId = branches[0]?.id ?? "";
  const [activeBranchId, setActiveBranchId] = useState<string>(defaultBranchId);

  // Sync with parent's selectedBranchId
  useEffect(() => {
    if (selectedBranchId) {
      setActiveBranchId(selectedBranchId);
    } else if (branches.length > 0 && !activeBranchId) {
      setActiveBranchId(branches[0].id);
    }
  }, [selectedBranchId, branches, activeBranchId]);

  const activeBranch = useMemo(() => {
    return branches.find((b) => b.id === activeBranchId) || branches[0] || null;
  }, [branches, activeBranchId]);

  useEffect(() => {
    if (onBranchSelect && activeBranchId) {
      onBranchSelect(activeBranchId);
    }
  }, [activeBranchId, onBranchSelect]);

  if (!branches || branches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-white/80">
          No branches available.
        </p>
      </div>
    );
  }

  // Generate working Google Maps embed URL
  const getEmbedUrl = (b: Branch | null): string => {
    if (!b) return "";
    if (b.googleMapEmbedUrl && b.googleMapEmbedUrl.includes("output=embed")) {
      return b.googleMapEmbedUrl;
    }
    const query = encodeURIComponent(`${b.name} ${b.address || "Chiang Mai"}`);
    return `https://maps.google.com/maps?q=${query}&hl=th&z=16&output=embed`;
  };

  const mapEmbedUrl = getEmbedUrl(activeBranch);
  const openMapUrl =
    activeBranch?.googleMapUrl ||
    (activeBranch
      ? `https://maps.google.com/?q=${encodeURIComponent(`${activeBranch.name} ${activeBranch.address || "Chiang Mai"}`)}`
      : "#");

  return (
    <div className="relative w-full h-full">
      {/* Map taking full space */}
      <div className="w-full h-full rounded-lg overflow-hidden bg-[#241712]">
        {mapEmbedUrl ? (
          <iframe
            key={activeBranch?.id || "map"}
            title={`Map of ${activeBranch?.name ?? "branch"}`}
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-white/5">
            <p className="text-white/80">
              Map unavailable for this branch.
            </p>
          </div>
        )}
      </div>

      {/* Open in Google Maps link - positioned at bottom right */}
      {openMapUrl !== "#" && (
        <div className="absolute bottom-4 right-4 z-20">
          <a
            href={openMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold rounded-lg shadow-xl transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4 text-[#EA4335]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
