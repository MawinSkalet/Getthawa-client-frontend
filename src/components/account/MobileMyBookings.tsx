"use client";

import { useState } from "react";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import type { Branch } from "@/hooks/useBranch";
import type { Package } from "@/hooks/usePackage";
import type { CustomerBooking } from "@/lib/customerBookings";
import AccountIcon from "./AccountIcon";
import AccountMobileShell, { MobileHeading } from "./AccountMobileShell";

type Props = {
  upcoming: CustomerBooking[];
  history: CustomerBooking[];
  branches: Branch[];
  packages: Package[];
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  details: CustomerBooking | null;
  cancelling: string | null;
  cancelId: string | null;
  cancelError: string | null;
  onDetails: (booking: CustomerBooking | null) => void;
  onCancelPrompt: (id: string | null) => void;
  onCancel: (id: string) => void;
  onRetry: () => void;
};

export function MobileBookingStatus({ status = "pending" }: { status?: string }) {
  const { tr } = useSiteTranslation();
  const value = status.toLowerCase();
  const key = /cancel|refund/.test(value) ? "Cancelled" : /complete|done/.test(value) ? "Completed" : /confirm|approved/.test(value) ? "Confirmed" : "Pending";
  return <span className={`gt-status gt-${key.toLowerCase()}`}><AccountIcon name={key === "Cancelled" ? "close" : key === "Pending" ? "clock" : "check"} />{tr(key)}</span>;
}

export default function MobileMyBookings(p: Props) {
  const { tr, locale } = useSiteTranslation();
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const money = (value: string | number) => `฿${Number(value).toLocaleString(locale)}`;
  const info = (booking: CustomerBooking) => {
    const branch = p.branches.find(item => item.id === booking.branchId) || booking.branch;
    const pkg = p.packages.find(item => item.id === booking.packageId) || booking.package;
    const value = new Date(booking.date);
    const valid = Number.isFinite(value.getTime());
    return {
      branch: branch?.name || tr("Branch"),
      map: branch?.googleMapUrl,
      title: tr(pkg?.title.replace(/\s*\(\d+\s*mins?\)\s*$/i, "") || "Massage service"),
      image: pkg?.pictureUrl || branch?.pictureUrl || "/aromapics.png",
      duration: pkg?.duration,
      date: valid ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", calendar: "gregory", timeZone: "Asia/Bangkok" }).format(value) : booking.date,
      day: valid ? new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "Asia/Bangkok" }).format(value) : "",
      time: valid ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Bangkok" }).format(value) : "",
      future: p.upcoming.some(item => item.id === booking.id),
    };
  };
  const list = tab === "upcoming" ? p.upcoming : p.history;
  const detail = p.details && info(p.details);
  const back = () => { p.onDetails(null); p.onCancelPrompt(null); window.scrollTo({ top: 0 }); };
  return <AccountMobileShell active="bookings" onBack={p.details ? back : undefined}>
    <div className="gt-body">
      {p.details && detail ? <>
        <button type="button" className="gt-quiet" onClick={back}><AccountIcon name="back" /> {tr("Back to My Booking")}</button>
        <MobileHeading title="Booking details" subtitle="Your appointment details" />
        <div className="gt-field-row"><MobileBookingStatus status={p.details.status} /></div>
        <div className="gt-summary"><dl>{[["Booking reference", p.details.id], ["Branch", detail.branch], ["Service", detail.title], ["Date and time", `${detail.date} · ${detail.time}`], ["Duration", detail.duration ? tr("{{duration}} min", { duration: detail.duration }) : "—"], ...(p.details.voucher?.code ? [["Voucher", p.details.voucher.code]] : [])].map(([label, value]) => <div key={label}><dt>{tr(label)}</dt><dd>{value}</dd></div>)}<div className="gt-grand"><dt>{tr("Total")}</dt><dd>{money(p.details.totalPrice)}</dd></div></dl></div>
        {detail.map && <a className="gt-secondary gt-new-booking" href={detail.map} target="_blank" rel="noreferrer"><AccountIcon name="pin" />{tr("View branch location")} · {detail.branch}</a>}
        {detail.future && (p.cancelId === p.details.id ? <div className="gt-confirm-cancel" role="alert"><h3>{tr("Cancel booking?")}</h3><p>{detail.date} · {detail.time}<br />{tr("You can book again whenever you are ready.")}</p>{p.cancelError && <p className="gt-error">{p.cancelError}</p>}<div className="gt-inline-actions"><button type="button" className="gt-secondary" disabled={Boolean(p.cancelling)} onClick={() => p.onCancelPrompt(null)}>{tr("Keep booking")}</button><button type="button" className="gt-secondary gt-danger" disabled={Boolean(p.cancelling)} onClick={() => p.onCancel(p.details!.id)}>{tr(p.cancelling ? "Cancelling…" : "Cancel booking")}</button></div></div> : <button type="button" className="gt-quiet gt-danger gt-new-booking" onClick={() => p.onCancelPrompt(p.details!.id)}>{tr("Cancel this booking")}</button>)}
      </> : <>
        <MobileHeading title="My Booking" subtitle="View your booking status and details." />
        {!p.authenticated && !p.loading ? <div className="gt-empty"><p>{tr("Sign in to see your bookings.")}</p><Link className="gt-primary gt-new-booking" href="/login?next=%2Fprofile">{tr("Sign in")}</Link></div> : p.loading ? <div className="gt-loading" aria-busy="true" aria-label={tr("Loading bookings")} /> : p.error ? <div className="gt-empty"><p className="gt-error" role="alert">{tr(p.error)}</p><button type="button" className="gt-secondary" onClick={p.onRetry}>{tr("Try again")}</button></div> : <>
          <div className="gt-account-tabs" role="group" aria-label={tr("Booking type")}><button type="button" aria-pressed={tab === "upcoming"} onClick={() => setTab("upcoming")}>{tr("Upcoming")}<span className="gt-count">{p.upcoming.length}</span></button><button type="button" aria-pressed={tab === "history"} onClick={() => setTab("history")}>{tr("History")}<span className="gt-count">{p.history.length}</span></button></div>
          <div className="gt-list-heading"><h2>{tr(tab === "upcoming" ? "Your appointments" : "Past bookings")}</h2><span>{tr("{{count}} bookings", { count: list.length })}</span></div>
          {list.map(booking => { const b = info(booking); return <article className="gt-booking-card" key={booking.id}>
            <div className="gt-booking-top"><div className="gt-date">{b.date}<small>{b.day} · {b.time}</small></div><MobileBookingStatus status={booking.status} /></div>
            <div className="gt-card-service"><SiteImage src={b.image} alt="" width={58} height={62} /><div><h3>{b.title}</h3><p>{b.branch}{b.duration ? ` · ${tr("{{duration}} min", { duration: b.duration })}` : ""}</p></div></div>
            {(!booking.status || booking.status.toLowerCase() === "pending") && <p className="gt-note">{tr("The shop is reviewing your booking request.")}</p>}
            <div className="gt-card-bottom"><strong>{money(booking.totalPrice)}</strong><div className="gt-actions">{/complete|done/i.test(booking.status || "") ? <Link href={`/reviews?branchId=${encodeURIComponent(booking.branchId || "")}`} className="gt-link">{tr("Write a review")}</Link> : b.future && b.map ? <a href={b.map} className="gt-link" target="_blank" rel="noreferrer">{tr("Map")}</a> : null}<button type="button" className="gt-secondary" onClick={() => { p.onDetails(booking); window.scrollTo({ top: 0 }); }}>{tr("Details")}</button></div></div>
          </article>; })}
          {!list.length && <p className="gt-empty">{tr("No appointments in this section yet.")}</p>}
          <Link href="/booking" className="gt-primary gt-new-booking"><AccountIcon name="plus" />{tr("Book another service")}</Link>
        </>}
      </>}
    </div>
  </AccountMobileShell>;
}
