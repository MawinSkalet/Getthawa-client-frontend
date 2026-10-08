"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import type { Branch } from "@/hooks/useBranch";
import type { BranchReview } from "@/hooks/useReview";
import type { CustomerBooking } from "@/lib/customerBookings";
import AccountIcon from "./AccountIcon";
import AccountMobileShell, { MobileHeading } from "./AccountMobileShell";

type Mode = "list" | "form" | "success";
type Props = {
  mode: Mode;
  onMode: (mode: Mode) => void;
  reviews: BranchReview[];
  branches: Branch[];
  eligible: CustomerBooking[];
  selectedBookingId: string;
  branchName: string;
  editing: BranchReview | null;
  rating: number;
  comment: string;
  tab: "approved" | "pending";
  loading: boolean;
  authenticated: boolean;
  error: string | null;
  submitError: string | null;
  submitting: boolean;
  onTab: (tab: "approved" | "pending") => void;
  onSelectBooking: (id: string) => void;
  onRating: (rating: number) => void;
  onComment: (comment: string) => void;
  onWrite: () => void;
  onEdit: (review: BranchReview) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
};

export default function MobileMyReviews(p: Props) {
  const { tr, locale } = useSiteTranslation();
  const date = (value: string) => {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", calendar: "gregory", timeZone: "Asia/Bangkok" }).format(parsed) : "—";
  };
  const branchName = (review: BranchReview) => review.branch?.name || p.branches.find(item => item.id === review.branchId)?.name || tr("Branch");
  const approved = p.reviews.filter(review => review.isApproved);
  const pending = p.reviews.filter(review => !review.isApproved);
  const list = p.tab === "approved" ? approved : pending;
  const latest = p.eligible[0];
  const latestBranch = latest?.branch?.name || p.branches.find(branch => branch.id === latest?.branchId)?.name;
  const stars = (rating: number) => <div className="gt-stars" role="img" aria-label={tr("Rating {{rating}} out of 5", { rating })}>{[1, 2, 3, 4, 5].map(value => <AccountIcon key={value} name="star" className={value <= rating ? "gt-star-filled" : ""} />)}<span>{rating}/5</span></div>;
  const body = !p.authenticated && !p.loading ? <><MobileHeading title="My Review" subtitle="The experiences you share with us." /><div className="gt-empty"><p>{tr("Sign in to see and manage your reviews.")}</p><Link href="/login?next=%2Freviews" className="gt-primary gt-new-booking">{tr("Sign in")}</Link></div></> : p.loading ? <><MobileHeading title="My Review" subtitle="The experiences you share with us." /><div className="gt-loading" aria-busy="true" aria-label={tr("Loading reviews")} /></> : p.error ? <><MobileHeading title="My Review" subtitle="The experiences you share with us." /><div className="gt-empty"><p className="gt-error" role="alert">{tr(p.error)}</p><button type="button" className="gt-secondary" onClick={p.onRetry}>{tr("Try again")}</button></div></> : p.mode === "success" ? <>
    <MobileHeading title="My Review" subtitle="Share your experience with our branches." /><div className="gt-success-state"><span className="gt-success-symbol"><AccountIcon name="check" /></span><h2>{tr("Review submitted")}</h2><p>{tr("Your review will appear after the shop approves it. Follow its status in the pending tab.")}</p><button type="button" className="gt-primary gt-new-booking" onClick={() => { p.onTab("pending"); p.onMode("list"); }}>{tr("View pending reviews")}</button></div>
  </> : p.mode === "form" ? <>
    <button type="button" className="gt-quiet" onClick={() => p.onMode("list")}><AccountIcon name="back" /> {tr("Back to My Review")}</button>
    <MobileHeading title={p.editing ? "Edit review" : "Write a review"} subtitle="Tell us about your visit." />
    {p.editing || p.eligible.length ? <form className="gt-review-form" onSubmit={p.onSubmit}>
      <label className="gt-label" htmlFor="mobile-review-branch">{tr("Branch visited")}</label><select id="mobile-review-branch" className="gt-field" value={p.editing ? p.editing.id : p.selectedBookingId} disabled={Boolean(p.editing)} onChange={event => p.onSelectBooking(event.target.value)}>{p.editing ? <option value={p.editing.id}>{p.branchName}</option> : p.eligible.map(booking => <option key={booking.id} value={booking.id}>{booking.branch?.name || p.branches.find(branch => branch.id === booking.branchId)?.name || tr("Branch")}</option>)}</select>
      <div className="gt-field-row"><span className="gt-label">{tr("Rate your experience")}</span><div className="gt-rate" role="group" aria-label={tr("Rate your experience")}>{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" aria-label={tr("Rate {{rating}}", { rating: value })} aria-pressed={p.rating >= value} onClick={() => p.onRating(value)}><AccountIcon name="star" /></button>)}</div></div>
      <label className="gt-label" htmlFor="mobile-review-comment">{tr("Your review")}</label><textarea id="mobile-review-comment" className="gt-field" rows={5} maxLength={1000} value={p.comment} onChange={event => p.onComment(event.target.value.slice(0, 1000))} placeholder={tr("The atmosphere, care or what impressed you.")} /><p className="gt-character-count">{p.comment.length}/1,000</p><p className="gt-note">{tr(p.editing ? "Editing this review sends it for approval again." : "Reviews appear after the branch approves them.")}</p>
      {p.submitError && <p className="gt-error" role="alert">{p.submitError}</p>}<button type="submit" className="gt-primary gt-new-booking" disabled={p.submitting || !p.rating}>{tr(p.submitting ? "Submitting review…" : p.editing ? "Save review changes" : "Submit review")}<AccountIcon name={p.submitting ? "refresh" : "arrow"} className={p.submitting ? "animate-spin" : undefined} /></button>
    </form> : <p className="gt-empty">{tr("You can review a branch after a completed appointment.")}</p>}
  </> : <>
    <MobileHeading title="My Review" subtitle="The experiences you share with us." />
    <aside className="gt-review-prompt"><h2>{tr("How was your latest visit?")}</h2><p>{latest ? <>{tr("Share your experience at {{branch}}", { branch: latestBranch || tr("Branch") })}<br />{tr("After your visit on {{date}}", { date: date(latest.date) })}</> : tr(p.reviews.length ? "You have reviewed each branch from your completed visits." : "You can review a branch after a completed appointment.")}</p>{latest && <button type="button" className="gt-secondary" onClick={p.onWrite}><AccountIcon name="edit" />{tr("Write a review")}</button>}</aside>
    <div className="gt-account-tabs" role="group" aria-label={tr("Review status")}><button type="button" aria-pressed={p.tab === "approved"} onClick={() => p.onTab("approved")}>{tr("Published")}<span className="gt-count">{approved.length}</span></button><button type="button" aria-pressed={p.tab === "pending"} onClick={() => p.onTab("pending")}>{tr("Awaiting approval")}<span className="gt-count">{pending.length}</span></button></div>
    {list.map(review => <article key={review.id} className="gt-review-card"><div className="gt-review-heading"><div><h3>{branchName(review)}</h3><small>{date(review.createdAt)}</small></div><span className={`gt-status ${review.isApproved ? "gt-confirmed" : ""}`}><AccountIcon name={review.isApproved ? "selected" : "clock"} />{tr(review.isApproved ? "Published" : "Awaiting approval")}</span></div>{stars(review.rating)}<p className="whitespace-pre-wrap">{review.comment}</p><button type="button" className="gt-link" onClick={() => p.onEdit(review)}><AccountIcon name="edit" />{tr("Edit review")}</button></article>)}
    {!list.length && <p className="gt-empty">{tr("No reviews in this section yet.")}</p>}
  </>;
  return <AccountMobileShell active="reviews" onBack={p.mode !== "list" ? () => p.onMode("list") : undefined}><div className="gt-body">{body}</div></AccountMobileShell>;
}
