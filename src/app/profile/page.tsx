"use client";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/stores/store";
import Reveal from "@/components/Reveal";
import { useLocaleFontClass } from "@/hooks/useLocaleFontClass";
import { cancelBooking } from "@/hooks/useBooking";
import { getBaseUrl } from "@/lib/api";
import "@/locales/i18n";

type BookingUser = {
  id: string;
  displayName: string;
  pictureUrl: string;
};

type BookingBranch = {
  id: string;
  name: string;
};

type BookingPackage = {
  id: string;
  title: string;
};

type BookingVoucher = {
  id: string;
  code: string;
  discount: string; // string from API
} | null;

type Booking = {
  id: string;
  // raw relational ids (when backend returns flat relations)
  userId?: string;
  branchId?: string;
  packageId?: string;
  voucherId?: string | null;
  date: string; // ISO
  totalPrice: string | number; // API may return string or number
  status?: string; // booking status from API (pending|confirmed|completed|canceled|refunded ...)
  user?: BookingUser;
  branch?: BookingBranch;
  package?: BookingPackage;
  voucher?: BookingVoucher;
};

type RawBookingRelation = {
  id?: unknown;
  userId?: unknown;
  branchId?: unknown;
  packageId?: unknown;
  voucherId?: unknown;
  name?: unknown;
  title?: unknown;
  displayName?: unknown;
  pictureUrl?: unknown;
  avatar?: unknown;
  code?: unknown;
  discount?: unknown;
  percent?: unknown;
} | null;

type RawBooking = {
  id?: unknown;
  bookingId?: unknown;
  userId?: unknown;
  user_id?: unknown;
  branchId?: unknown;
  branch_id?: unknown;
  packageId?: unknown;
  package_id?: unknown;
  voucherId?: unknown;
  voucher_id?: unknown;
  date?: unknown;
  bookingDate?: unknown;
  createdAt?: unknown;
  totalPrice?: unknown;
  total_price?: unknown;
  amount?: unknown;
  status?: unknown;
  bookingStatus?: unknown;
  user?: RawBookingRelation;
  branch?: RawBookingRelation;
  package?: RawBookingRelation;
  voucher?: RawBookingRelation;
};

const toStringOrUndefined = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  return String(value);
};

const toStringOrNull = (value: unknown): string | null => {
  if (value === undefined || value === null) return null;
  return String(value);
};

function normalizeBooking(raw: RawBooking): Booking {
  const statusValue = raw?.status ?? raw?.bookingStatus;
  const userIdValue = raw?.userId ?? raw?.user_id ?? raw?.user?.id;
  const branchIdValue = raw?.branchId ?? raw?.branch_id ?? raw?.branch?.id;
  const packageIdValue = raw?.packageId ?? raw?.package_id ?? raw?.package?.id;
  const voucherIdValue = raw?.voucherId ?? raw?.voucher_id ?? raw?.voucher?.id;
  const totalPriceValue =
    raw?.totalPrice ?? raw?.total_price ?? raw?.amount ?? "0";
  const totalPrice =
    typeof totalPriceValue === "number"
      ? totalPriceValue
      : String(totalPriceValue ?? "0");

  const normalized: Booking = {
    id: String(raw?.id ?? raw?.bookingId ?? ""),
    userId: toStringOrUndefined(userIdValue),
    branchId: toStringOrUndefined(branchIdValue),
    packageId: toStringOrUndefined(packageIdValue),
    voucherId: toStringOrNull(voucherIdValue),
    date: String(raw?.date ?? raw?.bookingDate ?? raw?.createdAt ?? ""),
    totalPrice,
    status:
      statusValue === undefined || statusValue === null
        ? undefined
        : String(statusValue),
    user: raw?.user
      ? {
          id: String(raw.user?.id ?? raw.user?.userId ?? raw.userId ?? ""),
          displayName: String(raw.user?.displayName ?? raw.user?.name ?? ""),
          pictureUrl: String(raw.user?.pictureUrl ?? raw.user?.avatar ?? ""),
        }
      : undefined,
    branch: raw?.branch
      ? {
          id: String(
            raw.branch?.id ?? raw.branch?.branchId ?? raw.branchId ?? ""
          ),
          name: String(raw.branch?.name ?? ""),
        }
      : undefined,
    package: raw?.package
      ? {
          id: String(
            raw.package?.id ?? raw.package?.packageId ?? raw.packageId ?? ""
          ),
          title: String(raw.package?.title ?? raw.package?.name ?? ""),
        }
      : undefined,
    voucher: raw?.voucher
      ? {
          id: String(
            raw.voucher?.id ?? raw.voucher?.voucherId ?? raw.voucherId ?? ""
          ),
          code: String(raw.voucher?.code ?? ""),
          discount: String(raw.voucher?.discount ?? raw.voucher?.percent ?? ""),
        }
      : null,
  };

  return normalized;
}

async function fetchBookings(): Promise<Booking[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/booking`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!res.ok) {
    // If unauthorized, middleware should have redirected; otherwise surface empty list
    return [];
  }
  try {
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item) => normalizeBooking(item as RawBooking));
    }
    if (data && Array.isArray((data as { bookings?: unknown }).bookings)) {
      return (data as { bookings: RawBooking[] }).bookings.map(
        normalizeBooking
      );
    }
    return [];
  } catch {
    return [];
  }
}

export default function ProfilePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // new state
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const { t, i18n } = useTranslation();
  const readyText = (k: string, fb: string) => (i18n.isInitialized ? t(k) : fb);
  const localeFontClass = useLocaleFontClass();
  useEffect(() => {
    let cancelled = false;
    fetchBookings()
      .then((data) => {
        if (cancelled) return;
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch bookings:", err);
        if (cancelled) return;
        setBookings([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelingId(bookingId);
    try {
      await cancelBooking(bookingId);
      // Update the booking status to canceled instead of removing it
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "canceled" } : b))
      );
      setShowCancelDialog(null);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert(
        error instanceof Error ? error.message : "Failed to cancel booking"
      );
    } finally {
      setCancelingId(null);
    }
  };

  const canCancelBooking = (booking: Booking) => {
    const status = (booking.status || "").toLowerCase();
    return (
      !status.includes("cancel") &&
      !status.includes("complete") &&
      !status.includes("refund")
    );
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="card-modern animate-shimmer h-24"></div>
      <div className="space-y-4">
        <div className="card-modern animate-shimmer h-32"></div>
        <div className="card-modern animate-shimmer h-32"></div>
        <div className="card-modern animate-shimmer h-32"></div>
      </div>
    </div>
  );

  // Sort latest first (descending by date) - memoized
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      if (isNaN(ta) || isNaN(tb)) return 0;
      return tb - ta;
    });
  }, [bookings]);

  // Slice for quick look
  const previewCount = 5;
  const bookingsToShow = showAll
    ? sortedBookings
    : sortedBookings.slice(0, previewCount);

  // status styling helper
  function getStatusStyles(status?: string) {
    const s = (status || "").toLowerCase();
    if (s.includes("cancel"))
      return {
        text: "text-red-400",
        dot: "bg-red-400",
        bg: "bg-red-400/10",
        label: status || "Canceled",
      };
    if (s.includes("refund"))
      return {
        text: "text-purple-300",
        dot: "bg-purple-300",
        bg: "bg-purple-300/10",
        label: status || "Refunded",
      };
    if (s.includes("complete") || s === "done")
      return {
        text: "text-green-400",
        dot: "bg-green-400",
        bg: "bg-green-400/10",
        label: status || "Completed",
      };
    if (s.includes("confirm") || s === "approved")
      return {
        text: "text-blue-300",
        dot: "bg-blue-300",
        bg: "bg-blue-300/10",
        label: status || "Confirmed",
      };
    if (s.includes("pending") || !s)
      return {
        text: "text-amber-300",
        dot: "bg-amber-300",
        bg: "bg-amber-300/10",
        label: status || "Pending",
      };
    return {
      text: "text-slate-200",
      dot: "bg-slate-200",
      bg: "bg-slate-200/10",
      label: status || "Unknown",
    };
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#382924] via-[#4A332B] to-[#58392F] text-white relative overflow-hidden -mt-[70px] pt-[70px]">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DCA900]/5 to-transparent animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#DCA900]/10 rounded-full blur-3xl animate-floatY"></div>
      <div
        className="absolute bottom-0 left-0 w-72 h-72 bg-[#DCA900]/5 rounded-full blur-2xl animate-floatY"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Enhanced User Card */}
            <Reveal delay={200} className="mb-12">
              <div className="card-modern p-8 mt-10 text-center group hover:shadow-glow transition-all duration-500">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    {user?.pictureUrl ? (
                      <div className="relative">
                        <Image
                          src={user.pictureUrl}
                          alt={user.displayName || "Profile"}
                          width={120}
                          height={120}
                          className="rounded-full object-cover ring-4 ring-[#DCA900]/30 shadow-xl transition-all duration-300 group-hover:ring-[#DCA900]/50 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#DCA900]/20 to-transparent"></div>
                      </div>
                    ) : (
                      <div className="w-[120px] h-[120px] rounded-full glass-strong flex items-center justify-center ring-4 ring-[#DCA900]/30 shadow-xl group-hover:ring-[#DCA900]/50 transition-all duration-300 group-hover:scale-105">
                        <svg
                          className="w-12 h-12 text-[#DCA900]"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 9.5V11C15 11.6 14.6 12 14 12H13V16L17 22H19L15.5 16.5H16C17.1 16.5 18 15.6 18 14.5V9.5H21ZM11 16V12H10C9.4 12 9 11.6 9 11V9.5L3 9V7L9 7.5V9H10C10.6 9 11 9.4 11 10V16L7 22H9L11 18.5V16Z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  </div>

                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 archivo-700">
                      {user?.displayName ||
                        bookings[0]?.user?.displayName ||
                        "Welcome!"}
                    </h2>
                    <p className="text-white/70 text-sm font-mono bg-white/5 px-3 py-1 rounded-full inline-block mb-4">
                      ID: {user?.id || bookings[0]?.user?.id || "Not available"}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{bookings.length} Bookings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Enhanced Booking History */}
            <Reveal delay={400}>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`${localeFontClass} text-2xl md:text-3xl text-gradient flex items-center gap-3`}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                    </svg>
                    {readyText("profile.bookingHistory", "Booking History")}
                  </h2>
                  {bookings.length > 0 && (
                    <div className="glass px-4 py-2 rounded-full">
                      <span className="text-[#DCA900] font-semibold">
                        {bookings.length} total
                      </span>
                    </div>
                  )}
                </div>

                {bookings.length === 0 ? (
                  <Reveal delay={600}>
                    <div className="card-modern text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 glass-strong rounded-full flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-[#DCA900]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No bookings yet
                      </h3>
                      <p className="text-white/70 mb-6">
                        {readyText(
                          "profile.noBookings",
                          "Start your wellness journey by booking your first service!"
                        )}
                      </p>
                      <button className="btn-modern">Book Now</button>
                    </div>
                  </Reveal>
                ) : (
                  <div className="grid gap-6 custom-scrollbar max-h-[70vh] overflow-y-auto pr-2">
                    {bookingsToShow.map((b, index) => {
                      const dt = new Date(b.date);
                      const dateStr = isNaN(dt.getTime())
                        ? b.date
                        : dt.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                      const statusStyles = getStatusStyles(b.status);
                      const priceNum = Number(b.totalPrice);
                      return (
                        <Reveal key={b.id} delay={200 + index * 50}>
                          <div className="card-modern group cursor-pointer overflow-hidden">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Left side - Main info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                                      <svg
                                        className="w-6 h-6 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M12,2A3,3 0 0,1 15,5V7A1,1 0 0,1 14,8H13V16L17,20H19L15.5,16.5H16A1,1 0 0,1 17,15.5V9.5H21V7.5L15,8V6A3,3 0 0,1 12,3A3,3 0 0,1 9,6V8L3,7.5V9.5H7V15.5A1,1 0 0,1 8,16.5H8.5L5,20H7L11,16V8H10A1,1 0 0,1 9,7V5A3,3 0 0,1 12,2Z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-bold text-white group-hover:text-[#DCA900] transition-colors">
                                        {b.package?.title ||
                                          `Package #${b.packageId ?? "-"}`}
                                      </h3>
                                      <p className="text-[#DCA900] font-medium">
                                        {b.branch?.name ||
                                          `Branch #${b.branchId ?? "-"}`}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-[#DCA900]">
                                      ฿
                                      {isNaN(priceNum)
                                        ? b.totalPrice
                                        : priceNum.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-white/60 font-mono">
                                      #{b.id.slice(-8)}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                  <div className="glass p-3 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <svg
                                        className="w-4 h-4 text-[#DCA900]"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                      </svg>
                                      <span className="text-white/70 font-medium">
                                        Date & Time
                                      </span>
                                    </div>
                                    <p className="text-white">{dateStr}</p>
                                  </div>

                                  {b.voucher && (
                                    <div className="glass p-3 rounded-lg">
                                      <div className="flex items-center gap-2 mb-2">
                                        <svg
                                          className="w-4 h-4 text-[#DCA900]"
                                          fill="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path d="M12.79 21L3 11.21v2c0 .53.21 1.04.59 1.41l7.79 7.79c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.79 21z" />
                                          <path d="M11.38 17.41c.78.78 2.05.78 2.83 0l6.21-6.21c.78-.78.78-2.05 0-2.83L12.63.58C12.25.21 11.74 0 11.21 0H5C3.9 0 3 .9 3 2v6.21c0 .53.21 1.04.59 1.41l7.79 7.79z" />
                                          <circle
                                            cx="7.25"
                                            cy="4.25"
                                            r="1.25"
                                          />
                                        </svg>
                                        <span className="text-white/70 font-medium">
                                          Voucher
                                        </span>
                                      </div>
                                      <p className="text-[#DCA900] font-semibold">
                                        {b.voucher.code}
                                      </p>
                                      <p className="text-green-400 text-xs">
                                        -{b.voucher.discount}% discount
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right side - Status badge and actions */}
                              <div className="lg:w-auto flex lg:flex-col justify-between lg:justify-start items-end lg:items-center gap-2">
                                <div
                                  className={`px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 ${statusStyles.bg}`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${statusStyles.dot}`}
                                  ></span>
                                  <span
                                    className={`${statusStyles.text} text-sm font-medium`}
                                  >
                                    {statusStyles.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {canCancelBooking(b) && (
                                    <button
                                      onClick={() => setShowCancelDialog(b.id)}
                                      disabled={cancelingId === b.id}
                                      className="group relative text-red-400 hover:text-white hover:bg-red-500 transition-all duration-300 p-3 rounded-xl border border-red-400/30 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                                      title="Cancel booking"
                                    >
                                      {cancelingId === b.id ? (
                                        <svg
                                          className="w-5 h-5 animate-spin"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                          ></circle>
                                          <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <>
                                          <svg
                                            className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2.5}
                                              d="M6 18L18 6M6 6l12 12"
                                            />
                                          </svg>
                                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                            Cancel
                                          </span>
                                        </>
                                      )}
                                    </button>
                                  )}

                                  <button className="text-white/60 hover:text-[#DCA900] transition-colors p-2">
                                    <svg
                                      className="w-5 h-5"
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
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      );
                    })}
                    {sortedBookings.length > previewCount && (
                      <div className="flex justify-center mt-2">
                        <button
                          onClick={() => setShowAll((v) => !v)}
                          className="btn-modern px-6 py-2 text-sm"
                        >
                          {showAll
                            ? "Show Less"
                            : `Show All (${sortedBookings.length})`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </>
        )}
      </div>

      {/* Cancel Booking Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="card-modern max-w-md w-full mx-auto transform animate-scaleIn shadow-2xl border border-red-500/20">
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/30 to-red-600/20 rounded-full flex items-center justify-center ring-4 ring-red-500/20 animate-pulse">
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Cancel Booking
              </h3>

              <p className="text-white/80 mb-8 leading-relaxed">
                Are you sure you want to cancel this booking?
                <br />
                <span className="text-red-300 text-sm font-medium">
                  This action cannot be undone.
                </span>
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCancelDialog(null)}
                  className="px-8 py-3 rounded-xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium transform hover:scale-105"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancelBooking(showCancelDialog)}
                  disabled={cancelingId === showCancelDialog}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 font-medium shadow-lg hover:shadow-red-500/25 transform hover:scale-105 disabled:transform-none"
                >
                  {cancelingId === showCancelDialog && (
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {cancelingId === showCancelDialog
                    ? "Canceling..."
                    : "Yes, Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
