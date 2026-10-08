"use client";

import { useState } from "react";
import Link from "next/link";
import SiteImage from "@/components/SiteImage";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import type { Branch } from "@/hooks/useBranch";
import type { ServiceGroup } from "@/lib/bookingCatalog";
import AccountIcon from "./AccountIcon";
import AccountMobileShell, { MobileHeading } from "./AccountMobileShell";

type Step = 1 | 2 | 3;
type Inputs = { date: string; time: string; email: string; phone: string; voucher: string };
type Props = {
  branches: Branch[];
  branch?: Branch;
  groups: ServiceGroup[];
  group?: ServiceGroup;
  packageId: string;
  duration: number;
  price: number;
  discount: number;
  step: Step;
  inputs: Inputs;
  voucherStatus: string;
  voucherMessage: string;
  submitting: boolean;
  canSubmit: boolean;
  ready: boolean;
  error: string | null;
  success: string | null;
  onBranch: (id: string) => void;
  onService: (group: ServiceGroup, duration: number) => void;
  onStep: (step: Step) => void;
  onInput: (key: keyof Inputs, value: string) => void;
  onVoucher: () => void;
  onSubmit: () => void;
};

const categories = ["All", "Thai Massage", "Oil Massage", "Foot Massage"];
const initialTimes = ["09:30", "11:00", "13:00", "14:00", "15:30", "17:00"];
const allTimes = Array.from({ length: 22 }, (_, i) => {
  const minutes = 570 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

export default function MobileBooking(p: Props) {
  const { tr, locale } = useSiteTranslation();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showAllTimes, setShowAllTimes] = useState(false);
  const [formError, setFormError] = useState("");
  const money = (value: number) => `฿${value.toLocaleString(locale)}`;
  const changeStep = (step: Step) => { setFormError(""); p.onStep(step); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => {
    if (p.step === 1 && p.ready) changeStep(2);
    else if (p.step === 2) {
      const date = new Date(`${p.inputs.date}T${p.inputs.time}:00+07:00`);
      if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) { setFormError(tr("Please select a future appointment time (Thailand time).")); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.inputs.email.trim())) { setFormError(tr("Enter a valid email address.")); return; }
      if (p.inputs.phone.trim() && !/^[\d+().\s-]{5,32}$/.test(p.inputs.phone.trim())) { setFormError(tr("Enter a valid phone number.")); return; }
      changeStep(3);
    } else if (p.step === 3 && p.canSubmit) p.onSubmit();
  };
  const shown = p.groups.filter(group => {
    const title = `${group.baseTitle} ${tr(group.baseTitle)}`.toLowerCase();
    const match = category === "All" || (category === "Thai Massage" ? /thai|ไทย|lanna|ล้านนา/.test(title) : category === "Oil Massage" ? /oil|aroma|น้ำมัน|ออยล์/.test(title) : /foot|เท้า/.test(title));
    return match && title.includes(search.toLowerCase().trim());
  });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const summaryDate = p.inputs.date ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", calendar: "gregory" }).format(new Date(`${p.inputs.date}T12:00:00`)) : "—";
  const footer = p.success ? undefined : <footer className="gt-footer gt-booking-footer">
    <div className="gt-total"><small>{tr("Total")} · {tr("{{duration}} min", { duration: p.duration })}</small><strong>{money(p.price)}</strong></div>
    <button type="button" className="gt-primary" disabled={p.submitting || (p.step === 1 && !p.ready) || (p.step === 3 && !p.canSubmit)} onClick={next}>{tr(p.submitting ? "Submitting…" : p.step === 3 ? "Send booking request" : "Next")}<AccountIcon name={p.submitting ? "refresh" : "arrow"} className={p.submitting ? "animate-spin" : undefined} /></button>
  </footer>;
  return <AccountMobileShell active="booking" onBack={p.step > 1 && !p.success ? () => changeStep((p.step - 1) as Step) : undefined} footer={footer}>
    <div className="gt-body">
      <MobileHeading title="Booking" subtitle={p.success ? "Booking details" : "Book your time to unwind."} />
      {p.success ? <>
        <div className="gt-success-state"><span className="gt-success-symbol"><AccountIcon name="check" /></span><h2>{tr("Booking request sent")}</h2><p>{tr("The shop will confirm your appointment. Track its status in My Booking.")}</p><span className="gt-status"><AccountIcon name="clock" />{tr("Pending")}</span></div>
        <Link href="/profile" className="gt-primary gt-new-booking">{tr("View my bookings")}<AccountIcon name="arrow" /></Link>
      </> : <>
        <ol className="gt-steps" aria-label={tr("Booking steps")}>{["Select service", "Date & time", "Review"].map((title, index) => <li key={title} aria-current={p.step === index + 1 ? "step" : undefined} className={p.step > index + 1 ? "gt-done" : ""}><span className="gt-step-number">{p.step > index + 1 ? <AccountIcon name="check" /> : index + 1}</span>{tr(title)}</li>)}</ol>
        {p.step === 1 ? <>
          <label className="gt-label" htmlFor="mobile-branch"><AccountIcon name="pin" />{tr("Select Branch")}</label>
          <select id="mobile-branch" className="gt-field" value={p.branch?.id || ""} onChange={event => p.onBranch(event.target.value)}>{!p.branches.length && <option value="">{tr("Loading branches…")}</option>}{p.branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select>
          {p.branch && <div className="gt-branch-preview"><SiteImage src={p.branch.pictureUrl || "/branch-1.jpg"} alt={p.branch.name} width={74} height={68} /><div><strong>{p.branch.address}</strong><p>{tr("Open 09:30–20:00")}</p>{p.branch.googleMapUrl && <a className="gt-link" href={p.branch.googleMapUrl} target="_blank" rel="noreferrer"><AccountIcon name="pin" />{tr("View branch location")}</a>}</div></div>}
          <h2>{tr("Select service")}</h2>
          <div className="gt-search"><AccountIcon name="search" /><input type="search" className="gt-field" aria-label={tr("Search services")} placeholder={tr("Search massage services")} value={search} onChange={event => setSearch(event.target.value)} /></div>
          <div className="gt-chips" role="group" aria-label={tr("Service type")}>{categories.map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{tr(item)}</button>)}</div>
          {shown.map(group => { const active = p.group === group; return <article key={`${group.type}:${group.baseTitle}`} className={`gt-service ${active ? "gt-active" : ""}`}>
            <button type="button" className="gt-service-choice" aria-pressed={active} onClick={() => p.onService(group, group.variants[0].duration)}><SiteImage src={group.pictureUrl || "/aromapics.png"} alt="" width={62} height={64} /><span><strong>{tr(group.baseTitle)}</strong><small>{active ? tr("Choose a duration below") : tr("From {{price}} · {{duration}} min", { price: money(group.variants[0].price), duration: group.variants[0].duration })}</small></span><AccountIcon name={active ? "selected" : "chevron"} /></button>
            {active && <div className="gt-durations" role="group" aria-label={tr("Duration")}>{group.variants.map(variant => <button key={variant.id} type="button" aria-pressed={p.packageId === variant.id} onClick={() => p.onService(group, variant.duration)}>{tr("{{duration}} min", { duration: variant.duration })}<b>{money(variant.price)}</b></button>)}</div>}
          </article>; })}
          {!shown.length && <p className="gt-empty">{tr("No services match your search criteria.")}</p>}
        </> : p.step === 2 ? <>
          <div className="gt-selection"><SiteImage src={p.group?.pictureUrl || "/aromapics.png"} alt="" width={66} height={66} /><span><h3>{tr(p.group?.baseTitle || "Massage service")}</h3><small>{p.branch?.name} · {tr("{{duration}} min", { duration: p.duration })}</small></span><button type="button" className="gt-link" onClick={() => changeStep(1)}>{tr("Edit")}</button></div>
          <label htmlFor="mobile-booking-date" className="gt-label"><AccountIcon name="calendar" />{tr("Appointment date")}</label><input id="mobile-booking-date" type="date" className="gt-field" min={today} value={p.inputs.date} onChange={event => p.onInput("date", event.target.value)} />
          <div className="gt-field-row"><span className="gt-label"><AccountIcon name="clock" />{tr("Start time")}</span><div className="gt-times" role="group" aria-label={tr("Select time")}>{(showAllTimes ? allTimes : Array.from(new Set([...initialTimes, ...(p.inputs.time ? [p.inputs.time] : [])])).sort()).map(time => <button key={time} type="button" aria-pressed={p.inputs.time === time} onClick={() => p.onInput("time", time)}>{time}</button>)}</div><button type="button" className="gt-link" onClick={() => setShowAllTimes(!showAllTimes)}>{tr(showAllTimes ? "Show fewer times" : "More times")}</button><p className="gt-note">{tr("{{duration}} min · Thailand time", { duration: p.duration })}</p></div>
          <div className="gt-field-row"><label className="gt-label" htmlFor="mobile-booking-email">{tr("Email for booking details")}</label><input id="mobile-booking-email" className="gt-field" type="email" autoComplete="email" placeholder="name@example.com" value={p.inputs.email} onChange={event => p.onInput("email", event.target.value)} /><p className="gt-note">{tr("We will send your booking details to this email.")}</p></div>
          <div className="gt-field-row"><label className="gt-label" htmlFor="mobile-booking-phone">{tr("Phone number (optional)")}</label><input id="mobile-booking-phone" className="gt-field" type="tel" autoComplete="tel" placeholder={tr("Your contact number")} value={p.inputs.phone} onChange={event => p.onInput("phone", event.target.value)} /></div>
          <button type="button" className="gt-quiet" onClick={() => changeStep(1)}>{tr("Back to services")}</button>
        </> : <>
          <h2>{tr("Check your details")}</h2><div className="gt-summary"><dl>
            {[["Branch", p.branch?.name], ["Service", tr(p.group?.baseTitle || "Massage service")], ["Duration", tr("{{duration}} min", { duration: p.duration })], ["Date and time", `${summaryDate} · ${p.inputs.time}`], ["Email", p.inputs.email], ...(p.inputs.phone ? [["Phone", p.inputs.phone]] : []), ["Service price", money(p.price + p.discount)], ...(p.discount ? [["Discount", `−${money(p.discount)}`]] : [])].map(([label, value]) => <div key={label}><dt>{tr(label || "")}</dt><dd>{value}</dd></div>)}
            <div className="gt-grand"><dt>{tr("Total")}</dt><dd>{money(p.price)}</dd></div>
          </dl></div>
          <details className="gt-voucher"><summary><span><AccountIcon name="ticket" />{tr("Have a voucher code?")}</span></summary><div className="gt-voucher-row"><input className="gt-field" aria-label={tr("Voucher code")} placeholder={tr("Enter voucher code")} value={p.inputs.voucher} onChange={event => p.onInput("voucher", event.target.value)} /><button type="button" className="gt-secondary" disabled={p.voucherStatus === "checking" || !p.inputs.voucher.trim()} onClick={p.onVoucher}>{tr(p.voucherStatus === "checking" ? "Checking…" : "Apply")}</button></div>{p.voucherMessage && <p className={p.voucherStatus === "valid" ? "gt-success" : "gt-error"} role="status">{tr(p.voucherMessage)}</p>}</details>
          <p className="gt-note">{tr("Your booking stays pending until the shop confirms it.")}</p><button type="button" className="gt-quiet" onClick={() => changeStep(2)}>{tr("Edit date, time and contact details")}</button>
        </>}
        {(formError || p.error) && <p className="gt-error" role="alert">{formError || tr(p.error || "")}</p>}
      </>}
    </div>
  </AccountMobileShell>;
}
