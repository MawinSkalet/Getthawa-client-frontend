"use client";

import AccountIcon from "@/components/account/AccountIcon";
import MobileMyBookings from "@/components/account/MobileMyBookings";
import AccountNavigation from "@/components/account/AccountNavigation";
import SiteImage from "@/components/SiteImage";
import SiteText from "@/components/SiteText";
import { cancelBooking } from "@/hooks/useBooking";
import { getBranches, type Branch } from "@/hooks/useBranch";
import { getPackage, type Package } from "@/hooks/usePackage";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import { getCustomerBookings, type CustomerBooking } from "@/lib/customerBookings";
import type { RootState } from "@/stores/store";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const fallbackBranchImages: Array<[string, string]> = [
  ["rimping2", "/branch-4.jpg"],
  ["chiangkang", "/branch-3.jpg"],
  ["phrasingh", "/branch-5.jpg"],
  ["charoenmuang", "/figma-assets/d1d08844-1250-482d-93a5-584e57a90e051762676750450.webp"],
  ["rimping", "/branch-1.jpg"],
];

const combine = (...classes: Array<string | false>) => classes.filter(Boolean).join(" ");
const normalized = (value?: string) => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

function branchFor(booking: CustomerBooking, branches: Branch[]) {
  return branches.find((branch) => branch.id === booking.branchId) ||
    branches.find((branch) => normalized(branch.name) === normalized(booking.branch?.name)) ||
    null;
}

function branchImage(booking: CustomerBooking, branches: Branch[]) {
  const branch = branchFor(booking, branches);
  if (branch?.pictureUrl) return branch.pictureUrl;
  if (booking.branch?.pictureUrl) return booking.branch.pictureUrl;
  const name = normalized(branch?.name || booking.branch?.name);
  return fallbackBranchImages.find(([key]) => name.includes(key))?.[1] || "/branch-1.jpg";
}

function bookingPackage(booking: CustomerBooking, packages: Package[]) {
  return packages.find((item) => item.id === booking.packageId || item.id === booking.package?.id) || null;
}

function bookingTitle(booking: CustomerBooking, packages: Package[], tr: (text: string) => string) {
  const title = booking.package?.title || bookingPackage(booking, packages)?.title;
  return title ? tr(title) : tr("Massage service");
}

function bookingDuration(booking: CustomerBooking, packages: Package[]) {
  return booking.package?.duration || bookingPackage(booking, packages)?.duration;
}

function formatBookingDate(value: string, locale: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return { date: value || "—", time: "", day: "—" };
  return {
    date: new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" }).format(date),
    time: new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" }).format(date),
    day: new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: "Asia/Bangkok" }).format(date),
  };
}

function statusKey(status?: string) {
  const value = (status || "").toLowerCase();
  if (value.includes("cancel")) return "Cancelled";
  if (value.includes("refund")) return "Refunded";
  if (value.includes("complete") || value === "done") return "Completed";
  if (value.includes("confirm") || value === "approved") return "Confirmed";
  if (value.includes("pending") || !value) return "Pending";
  return status || "Unknown";
}

function statusClass(status?: string) {
  const value = statusKey(status);
  if (value === "Completed") return "bg-[#eee9e1] text-[#665a4d]";
  if (value === "Confirmed") return "bg-[#edf3e9] text-[#3c6047]";
  if (value === "Cancelled" || value === "Refunded") return "bg-[#faeee9] text-[#934d3e]";
  return "bg-[#f6ead0] text-[#765716]";
}

function isCompleted(status?: string) {
  const value = (status || "").toLowerCase();
  return value.includes("complete") || value === "done";
}

function canCancel(booking: CustomerBooking) {
  const value = (booking.status || "").toLowerCase();
  return !value.includes("cancel") && !value.includes("complete") && value !== "done" && !value.includes("refund");
}

function formatPrice(value: string | number, locale: string) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount.toLocaleString(locale, { maximumFractionDigits: 2 }) : String(value);
}

function BookingStatus({ status }: { status?: string }) {
  const label = statusKey(status);
  const icon = label === "Completed" || label === "Confirmed" ? "check" : label === "Cancelled" || label === "Refunded" ? "close" : "clock";
  return (
    <span className={combine("inline-flex min-h-7 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium", statusClass(status))}>
      <AccountIcon name={icon} className="h-3.5 w-3.5" />
      <SiteText text={label} />
    </span>
  );
}

function LoadingState() {
  return (
    <div className="space-y-5" aria-label="Loading bookings" aria-busy="true">
      <div className="h-12 animate-pulse rounded-lg bg-[#efe7d9]" />
      <div className="h-56 animate-pulse rounded-xl bg-[#efe7d9]" />
      <div className="h-48 animate-pulse rounded-xl bg-[#efe7d9]" />
    </div>
  );
}

export default function ProfilePage() {
  const { tr, locale } = useSiteTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailsBooking, setDetailsBooking] = useState<CustomerBooking | null>(null);
  const [cancelDialogId, setCancelDialogId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [observedAt, setObservedAt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setError(null);
      try {
        const [bookingData, branchData, packageData] = await Promise.all([
          getCustomerBookings(), getBranches(), getPackage(),
        ]);
        if (!cancelled) {
          setBookings(bookingData.filter((booking) => booking.id));
          setBranches(branchData);
          setPackages(packageData);
          setObservedAt(Date.now());
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Failed to load bookings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    const refreshOnFocus = () => { setLoading(true); void load(); };
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, []);

  const refreshBookings = async () => {
    setRefreshing(true);
    setError(null);
    try {
      setBookings((await getCustomerBookings()).filter((booking) => booking.id));
      setObservedAt(Date.now());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load bookings");
    } finally {
      setRefreshing(false);
    }
  };

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => {
      const first = new Date(a.date).getTime();
      const second = new Date(b.date).getTime();
      return (Number.isFinite(second) ? second : 0) - (Number.isFinite(first) ? first : 0);
    }),
    [bookings]
  );

  const upcomingBookings = useMemo(() => {
    return sortedBookings
      .filter((booking) => {
        const date = new Date(booking.date).getTime();
        return Number.isFinite(date) && date >= observedAt && !isCompleted(booking.status) && canCancel(booking);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [sortedBookings, observedAt]);

  const upcomingIds = useMemo(() => new Set(upcomingBookings.map((booking) => booking.id)), [upcomingBookings]);
  const historyBookings = useMemo(
    () => sortedBookings.filter((booking) => !upcomingIds.has(booking.id)),
    [sortedBookings, upcomingIds]
  );
  const visibleHistory = useMemo(() => {
    const search = query.trim().toLowerCase();
    return historyBookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || statusKey(booking.status).toLowerCase() === statusFilter;
      const searchable = [bookingTitle(booking, packages, (text) => text), booking.branch?.name, booking.status, booking.voucher?.code];
      const matchesSearch = !search || searchable.filter(Boolean).some((value) => String(value).toLowerCase().includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [historyBookings, packages, query, statusFilter]);

  const handleCancel = async (bookingId: string) => {
    setCancelingId(bookingId);
    setCancelError(null);
    try {
      await cancelBooking(bookingId);
      setBookings((previous) => previous.map((booking) => booking.id === bookingId ? { ...booking, status: "cancelled" } : booking));
      setCancelDialogId(null);
      setDetailsBooking((current) => current?.id === bookingId ? { ...current, status: "cancelled" } : current);
    } catch (cause) {
      setCancelError(cause instanceof Error ? cause.message : "Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  const appointmentCard = (booking: CustomerBooking, featured = false) => {
    const date = formatBookingDate(booking.date, locale);
    const branch = branchFor(booking, branches);
    const packageDetails = bookingPackage(booking, packages);
    const duration = bookingDuration(booking, packages);
    const title = bookingTitle(booking, packages, tr);
    const branchName = booking.branch?.name || branch?.name || tr("Branch");
    const image = packageDetails?.pictureUrl || booking.package?.pictureUrl || branchImage(booking, branches);
    return (
      <article key={booking.id} className={combine("overflow-hidden rounded-xl border border-[#d7c5a7] bg-[#fffdf8]", featured ? "grid sm:grid-cols-[170px_minmax(0,1fr)]" : "grid sm:grid-cols-[74px_minmax(0,1fr)_auto]")}>
        {featured ? (
          <div className="relative h-40 sm:h-full sm:min-h-[210px]">
            <SiteImage src={image} alt={title} fill sizes="(max-width: 640px) 100vw, 170px" className="object-cover" />
            <span className="absolute bottom-3 left-3 rounded bg-[#fffdf8]/95 px-2.5 py-1 text-xs font-medium text-[#493024]"><SiteText text="Next appointment" /></span>
          </div>
        ) : (
          <div className="flex items-center gap-3 border-b border-[#eee6d9] p-4 sm:flex-col sm:justify-center sm:border-b-0 sm:border-r sm:text-center">
            <AccountIcon name="calendar" className="h-5 w-5 text-[#8f6d2e]" />
            <div>
              <strong className="block font-serif text-xl leading-6 text-[#38281f]">{date.day}</strong>
              <span className="text-xs text-[#766557]">{date.date}</span>
            </div>
          </div>
        )}
        <div className={combine("min-w-0 p-4 sm:p-5", featured && "sm:col-start-2")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-[#38281f]">
                <AccountIcon name="calendar" className="h-4 w-4 text-[#8f6d2e]" />
                <span>{date.date}</span>
                {date.time && <span className="text-[#766557]">· {date.time}</span>}
              </div>
              <h3 className="mt-3 truncate font-serif text-lg text-[#38281f]">{title}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-[#766557]">
                <AccountIcon name="pin" className="h-4 w-4" />
                <span>{branchName}</span>
                {duration ? <span>· {duration} <SiteText text="min" /></span> : null}
              </p>
            </div>
            <div className="ml-auto text-right">
              <BookingStatus status={booking.status} />
              <p className="mt-2 font-serif text-xl text-[#493024]">฿{formatPrice(booking.totalPrice, locale)}</p>
            </div>
          </div>
          {featured && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5d9c7] pt-3">
              {branch?.address || booking.branch?.address
                ? <p className="max-w-[50%] truncate text-xs text-[#766557]">{branch?.address || booking.branch?.address}</p>
                : <span />}
              <div className="ml-auto flex flex-wrap gap-2">
                {(branch?.googleMapUrl || booking.branch?.googleMapUrl) && (
                  <a href={branch?.googleMapUrl || booking.branch?.googleMapUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#cdbb9f] bg-[#fffdf8] px-3 text-xs font-medium text-[#493024] hover:bg-[#f3eee4]">
                    <AccountIcon name="pin" className="h-4 w-4" /><SiteText text="View map" />
                  </a>
                )}
                <button type="button" onClick={() => setDetailsBooking(booking)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#493024] px-3 text-xs font-medium text-[#fff7e7] hover:bg-[#38281f]">
                  <SiteText text="Booking details" /><AccountIcon name="arrow" className="h-4 w-4" />
                </button>
                {canCancel(booking) && <button type="button" onClick={() => { setCancelError(null); setCancelDialogId(booking.id); }} className="inline-flex min-h-10 items-center rounded-md px-3 text-xs font-medium text-[#934d3e] hover:bg-[#faeee9]"><SiteText text="Cancel booking" /></button>}
              </div>
            </div>
          )}
        </div>
        {!featured && (
          <div className="flex items-center justify-between gap-3 border-t border-[#eee6d9] px-4 py-3 sm:flex-col sm:justify-center sm:border-l sm:border-t-0">
            <p className="font-serif text-lg text-[#493024]">฿{formatPrice(booking.totalPrice, locale)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDetailsBooking(booking)} className="min-h-9 rounded-md border border-[#cdbb9f] px-3 text-xs text-[#493024] hover:bg-[#f3eee4]"><SiteText text="Details" /></button>
              {canCancel(booking) && <button type="button" onClick={() => { setCancelError(null); setCancelDialogId(booking.id); }} className="min-h-9 rounded-md px-2 text-xs text-[#934d3e] hover:bg-[#faeee9]"><SiteText text="Cancel" /></button>}
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <>
    <MobileMyBookings upcoming={upcomingBookings} history={historyBookings} branches={branches} packages={packages} loading={loading} error={error} authenticated={Boolean(user.id)} details={detailsBooking} cancelling={cancelingId} cancelId={cancelDialogId} cancelError={cancelError} onDetails={setDetailsBooking} onCancelPrompt={id => { setCancelError(null); setCancelDialogId(id); }} onCancel={id => void handleCancel(id)} onRetry={() => void refreshBookings()} />
    <main className="hidden lg:block min-h-[calc(100vh-76px)] bg-[#faf6ee] text-[#38281f] md:min-h-[calc(100vh-104px)]">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-9 lg:px-8">
        <AccountNavigation active="booking" />
        <section className="min-w-0">
          <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-3xl tracking-tight text-[#38281f] sm:text-[38px]"><SiteText text="My Booking" /></h1>
              <p className="mt-2 text-sm text-[#766557]"><SiteText text="Manage your appointments and booking history." /></p>
            </div>
            <Link href="/booking" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#d7aa4b] bg-[#e5b653] px-4 text-sm font-semibold text-[#342418] transition hover:bg-[#edc86f] sm:w-auto">
              <AccountIcon name="plus" /><SiteText text="Book another service" />
            </Link>
          </header>

          {loading ? <LoadingState /> : error ? (
            <div className="rounded-xl border border-[#e5d9c7] bg-[#fffdf8] p-8 text-center">
              <p className="text-sm text-[#934d3e]">{error}</p>
              <button type="button" onClick={refreshBookings} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#cdbb9f] px-4 text-sm hover:bg-[#f3eee4]"><AccountIcon name="refresh" /><SiteText text="Try again" /></button>
            </div>
          ) : (
            <>
              {!user.id && <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e5d9c7] bg-[#fffdf8] p-4 text-sm text-[#766557]"><SiteText text="Sign in to see your bookings." /><Link href="/login?next=%2Fprofile" className="inline-flex min-h-9 items-center rounded-md bg-[#493024] px-3 text-xs font-semibold text-[#fff7e7]"><SiteText text="Sign in" /></Link></div>}
              <section aria-labelledby="upcoming-title">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 id="upcoming-title" className="font-serif text-xl text-[#38281f]"><SiteText text="Upcoming appointments" /></h2>
                  <span className="text-xs text-[#766557]"><SiteText text="{{count}} appointments" values={{ count: upcomingBookings.length }} /></span>
                </div>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-3">
                    {appointmentCard(upcomingBookings[0], true)}
                    {upcomingBookings.slice(1).map((booking) => appointmentCard(booking))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#d7c5a7] bg-[#fffdf8] px-5 py-7">
                    <h3 className="font-serif text-lg text-[#38281f]"><SiteText text="No upcoming appointments" /></h3>
                    <p className="mt-1 text-sm text-[#766557]"><SiteText text="Your upcoming appointments will appear here." /></p>
                    <Link href="/booking" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#493024] px-4 text-sm font-medium text-[#fff7e7] hover:bg-[#38281f]"><AccountIcon name="plus" /><SiteText text="Book a service" /></Link>
                  </div>
                )}
              </section>

              <section aria-labelledby="history-title" className="mt-8">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 id="history-title" className="font-serif text-xl text-[#38281f]"><SiteText text="Booking history" /></h2>
                    <p className="mt-1 text-xs text-[#766557]"><SiteText text="{{count}} past bookings" values={{ count: historyBookings.length }} /></p>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:flex sm:flex-row">
                    <label className="relative col-span-2 min-w-0 sm:col-span-1 sm:w-56">
                      <AccountIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#766557]" />
                      <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tr("Search service or branch")} aria-label={tr("Search service or branch")} className="h-10 w-full rounded-md border border-[#d8c9b4] bg-[#fffdf8] pl-9 pr-3 text-sm text-[#38281f] outline-none placeholder:text-[#938170] focus:border-[#b7892f]" />
                    </label>
                    <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label={tr("Filter bookings by status")} className="h-10 min-w-0 w-full rounded-md border border-[#d8c9b4] bg-[#fffdf8] px-3 text-sm text-[#493024] outline-none focus:border-[#b7892f] sm:w-auto">
                      <option value="all">{tr("All statuses")}</option><option value="completed">{tr("Completed")}</option><option value="cancelled">{tr("Cancelled")}</option><option value="refunded">{tr("Refunded")}</option><option value="pending">{tr("Pending")}</option><option value="confirmed">{tr("Confirmed")}</option>
                    </select>
                    <button type="button" onClick={refreshBookings} disabled={refreshing} aria-label={tr("Refresh bookings")} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#d8c9b4] bg-[#fffdf8] text-[#493024] hover:bg-[#f3eee4] disabled:opacity-50"><AccountIcon name="refresh" className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} /></button>
                  </div>
                </div>

                {visibleHistory.length === 0 ? (
                  <div className="rounded-xl border border-[#e5d9c7] bg-[#fffdf8] p-7 text-center text-sm text-[#766557]">
                    <AccountIcon name="receipt" className="mx-auto mb-3 h-7 w-7 text-[#a78343]" />
                    <SiteText text={historyBookings.length ? "No bookings match your search." : "Your completed and cancelled bookings will appear here."} />
                  </div>
                ) : (
                  <>
                    <div className="hidden overflow-hidden rounded-xl border border-[#e5d9c7] bg-[#fffdf8] sm:block">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[690px] border-collapse text-left text-sm">
                          <thead className="bg-[#f3eee4] text-xs text-[#766557]"><tr>
                            <th className="px-4 py-3 font-medium"><SiteText text="Date and time" /></th><th className="px-4 py-3 font-medium"><SiteText text="Service" /></th><th className="px-4 py-3 font-medium"><SiteText text="Branch" /></th><th className="px-4 py-3 font-medium"><SiteText text="Status" /></th><th className="px-4 py-3 text-right font-medium"><SiteText text="Total" /></th><th className="px-4 py-3"><span className="sr-only"><SiteText text="Details" /></span></th>
                          </tr></thead>
                          <tbody>
                            {visibleHistory.map((booking) => {
                              const date = formatBookingDate(booking.date, locale);
                              const duration = bookingDuration(booking, packages);
                              const branch = branchFor(booking, branches);
                              return (
                                <tr key={booking.id} className="border-t border-[#eee6d9]">
                                  <td className="whitespace-nowrap px-4 py-3.5 text-[#493024]">{date.date}<small className="mt-0.5 block text-xs text-[#766557]">{date.time}</small></td>
                                  <td className="max-w-[250px] px-4 py-3.5"><span className="block truncate font-medium text-[#38281f]">{bookingTitle(booking, packages, tr)}</span>{duration ? <small className="text-xs text-[#766557]">{duration} <SiteText text="min" /></small> : null}</td>
                                  <td className="max-w-[170px] truncate px-4 py-3.5 text-[#766557]">{booking.branch?.name || branch?.name || "—"}</td>
                                  <td className="px-4 py-3.5"><BookingStatus status={booking.status} /></td>
                                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold text-[#493024]">฿{formatPrice(booking.totalPrice, locale)}</td>
                                  <td className="px-4 py-3.5 text-right"><button type="button" onClick={() => setDetailsBooking(booking)} className="inline-flex min-h-9 items-center gap-1 text-xs font-medium text-[#805a1e] underline underline-offset-2"><SiteText text="Details" /><AccountIcon name="arrow" className="h-3.5 w-3.5" /></button></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="border-t border-[#eee6d9] px-4 py-3 text-xs text-[#766557]"><SiteText text="Showing {{shown}} of {{total}} bookings" values={{ shown: visibleHistory.length, total: historyBookings.length }} /></div>
                    </div>
                    <div className="space-y-3 sm:hidden">
                      {visibleHistory.map((booking) => {
                        const date = formatBookingDate(booking.date, locale);
                        const branch = branchFor(booking, branches);
                        return (
                          <article key={booking.id} className="rounded-xl border border-[#e5d9c7] bg-[#fffdf8] p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0"><p className="text-xs text-[#766557]">{date.date}{date.time ? " · " + date.time : ""}</p><h3 className="mt-1 truncate font-medium text-[#38281f]">{bookingTitle(booking, packages, tr)}</h3><p className="mt-1 truncate text-xs text-[#766557]">{booking.branch?.name || branch?.name || "—"}</p></div>
                              <BookingStatus status={booking.status} />
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-[#eee6d9] pt-3"><strong className="font-serif text-lg text-[#493024]">฿{formatPrice(booking.totalPrice, locale)}</strong><button type="button" onClick={() => setDetailsBooking(booking)} className="min-h-9 px-2 text-xs font-medium text-[#805a1e] underline underline-offset-2"><SiteText text="Details" /></button></div>
                          </article>
                        );
                      })}
                    </div>
                  </>
                )}
              </section>
            </>
          )}
          <p className="mt-5 flex items-center gap-2 text-xs text-[#766557]"><AccountIcon name="clock" className="h-3.5 w-3.5" /><SiteText text="Appointment times are shown in Thailand time." /></p>
        </section>
      </div>

      {detailsBooking && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#241811]/60 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-details-title">
          <div className="w-full max-w-lg rounded-xl border border-[#d7c5a7] bg-[#fffdf8] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs uppercase tracking-wide text-[#8f6d2e]"><SiteText text="Booking details" /></p><h2 id="booking-details-title" className="mt-1 font-serif text-2xl text-[#38281f]">{bookingTitle(detailsBooking, packages, tr)}</h2></div>
              <button type="button" onClick={() => setDetailsBooking(null)} aria-label={tr("Close")} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#766557] hover:bg-[#f3eee4]"><AccountIcon name="close" /></button>
            </div>
            <div className="mt-5 space-y-3 border-y border-[#e5d9c7] py-4 text-sm">
              <p className="flex justify-between gap-4"><span className="text-[#766557]"><SiteText text="Date and time" /></span><span className="text-right">{formatBookingDate(detailsBooking.date, locale).date} · {formatBookingDate(detailsBooking.date, locale).time}</span></p>
              <p className="flex justify-between gap-4"><span className="text-[#766557]"><SiteText text="Branch" /></span><span className="text-right">{detailsBooking.branch?.name || branchFor(detailsBooking, branches)?.name || "—"}</span></p>
              <p className="flex justify-between gap-4"><span className="text-[#766557]"><SiteText text="Duration" /></span><span>{bookingDuration(detailsBooking, packages) ? <>{bookingDuration(detailsBooking, packages)} <SiteText text="min" /></> : "—"}</span></p>
              <p className="flex justify-between gap-4"><span className="text-[#766557]"><SiteText text="Status" /></span><BookingStatus status={detailsBooking.status} /></p>
              <p className="flex justify-between gap-4 font-semibold"><span className="text-[#766557]"><SiteText text="Total" /></span><span>฿{formatPrice(detailsBooking.totalPrice, locale)}</span></p>
              {detailsBooking.voucher?.code && <p className="flex justify-between gap-4"><span className="text-[#766557]"><SiteText text="Voucher" /></span><span>{detailsBooking.voucher.code}</span></p>}
            </div>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {canCancel(detailsBooking) && <button type="button" onClick={() => { setCancelError(null); setCancelDialogId(detailsBooking.id); }} className="min-h-10 rounded-md px-3 text-sm font-medium text-[#934d3e] hover:bg-[#faeee9]"><SiteText text="Cancel booking" /></button>}
              <button type="button" onClick={() => setDetailsBooking(null)} className="min-h-10 rounded-md bg-[#493024] px-4 text-sm font-medium text-[#fff7e7] hover:bg-[#38281f]"><SiteText text="Close" /></button>
            </div>
          </div>
        </div>
      )}

      {cancelDialogId && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#241811]/65 p-4" role="dialog" aria-modal="true" aria-labelledby="cancel-booking-title">
          <div className="w-full max-w-md rounded-xl border border-[#d7c5a7] bg-[#fffdf8] p-6 shadow-2xl sm:p-7">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#faeee9] text-[#934d3e]"><AccountIcon name="close" className="h-5 w-5" /></div>
            <h2 id="cancel-booking-title" className="mt-4 text-center font-serif text-2xl text-[#38281f]"><SiteText text="Cancel booking?" /></h2>
            <p className="mt-2 text-center text-sm leading-6 text-[#766557]"><SiteText text="Are you sure you want to cancel this booking? This action cannot be undone." /></p>
            {cancelError && <p role="alert" className="mt-4 rounded-md bg-[#faeee9] px-3 py-2 text-sm text-[#934d3e]">{cancelError}</p>}
            <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
              <button type="button" onClick={() => setCancelDialogId(null)} disabled={Boolean(cancelingId)} className="min-h-11 rounded-md border border-[#cdbb9f] px-4 text-sm font-medium text-[#493024] hover:bg-[#f3eee4] disabled:opacity-50"><SiteText text="Keep booking" /></button>
              <button type="button" onClick={() => void handleCancel(cancelDialogId)} disabled={cancelingId === cancelDialogId} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#934d3e] px-4 text-sm font-semibold text-white hover:bg-[#7d4033] disabled:opacity-60">
                {cancelingId === cancelDialogId && <AccountIcon name="refresh" className="h-4 w-4 animate-spin" />}
                <SiteText text={cancelingId === cancelDialogId ? "Cancelling…" : "Confirm cancellation"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
