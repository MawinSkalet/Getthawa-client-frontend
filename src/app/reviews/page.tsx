"use client";

import AccountIcon from "@/components/account/AccountIcon";
import AccountNavigation from "@/components/account/AccountNavigation";
import MobileMyReviews from "@/components/account/MobileMyReviews";
import SiteImage from "@/components/SiteImage";
import SiteText from "@/components/SiteText";
import { getBranches, type Branch } from "@/hooks/useBranch";
import { getPackage, type Package } from "@/hooks/usePackage";
import { createReview, getMyReviews, updateReview, type BranchReview } from "@/hooks/useReview";
import { useSiteTranslation } from "@/hooks/useSiteTranslation";
import { getCustomerBookings, type CustomerBooking } from "@/lib/customerBookings";
import type { RootState } from "@/stores/store";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useSelector } from "react-redux";

type ReviewTab = "approved" | "pending";
const combine = (...classes: Array<string | false>) => classes.filter(Boolean).join(" ");

async function fetchReviewData(authenticated: boolean) {
  return Promise.all([
    authenticated ? getMyReviews() : Promise.resolve<BranchReview[]>([]),
    authenticated ? getCustomerBookings() : Promise.resolve<CustomerBooking[]>([]),
    authenticated ? getBranches() : Promise.resolve<Branch[]>([]),
    authenticated ? getPackage() : Promise.resolve<Package[]>([]),
  ]);
}

function formatDate(value: string, locale: string) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value || "—";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" }).format(date);
}

function isCompleted(status?: string) {
  const value = (status || "").toLowerCase();
  return value.includes("complete") || value === "done";
}

function normalizeName(value?: string) {
  return (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function branchFor(booking: CustomerBooking, branches: Branch[]) {
  return branches.find((branch) => branch.id === booking.branchId) ||
    branches.find((branch) => normalizeName(branch.name) === normalizeName(booking.branch?.name)) || null;
}

function branchImage(booking: CustomerBooking | undefined, branches: Branch[], branchId?: string, branchName?: string) {
  const branch = booking
    ? branchFor(booking, branches)
    : branches.find((item) => item.id === branchId || normalizeName(item.name) === normalizeName(branchName));
  if (branch?.pictureUrl) return branch.pictureUrl;
  const name = normalizeName(branch?.name || branchName || booking?.branch?.name);
  if (name.includes("rimping2")) return "/branch-4.jpg";
  if (name.includes("chiangkang")) return "/branch-3.jpg";
  if (name.includes("phrasingh")) return "/branch-5.jpg";
  if (name.includes("charoenmuang")) return "/figma-assets/d1d08844-1250-482d-93a5-584e57a90e051762676750450.webp";
  return "/branch-1.jpg";
}

function RatingStars({ rating, interactive = false, onChange, label }: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  label?: (rating: number) => string;
}) {
  return (
    <div className="flex items-center gap-1" role={interactive ? "group" : "img"} aria-label={interactive ? undefined : label?.(rating)}>
      {[1, 2, 3, 4, 5].map((value) => {
        const icon = <AccountIcon name="star" className={combine("h-5 w-5", value <= rating ? "fill-current text-[#ab7d27]" : "text-[#d7c5a7]")} />;
        return interactive ? (
          <button key={value} type="button" onClick={() => onChange?.(value)} aria-label={label?.(value)} aria-pressed={value <= rating} className="grid h-9 w-9 place-items-center rounded-md hover:bg-[#f3eee4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b7892f]">{icon}</button>
        ) : <span key={value} aria-hidden="true">{icon}</span>;
      })}
    </div>
  );
}

function ReviewCard({ review, branches, bookings, packages, locale, onEdit }: {
  review: BranchReview;
  branches: Branch[];
  bookings: CustomerBooking[];
  packages: Package[];
  locale: string;
  onEdit: (review: BranchReview) => void;
}) {
  const { tr } = useSiteTranslation();
  const relatedBooking = bookings.find((booking) => booking.branchId === review.branchId && isCompleted(booking.status));
  const relatedPackage = relatedBooking
    ? packages.find((item) => item.id === relatedBooking.packageId) || relatedBooking.package
    : null;
  const name = review.branch?.name || branches.find((branch) => branch.id === review.branchId)?.name || tr("Branch");
  return (
    <article className="border-b border-[#e5d9c7] py-5 first:pt-2 last:border-0">
      <div className="flex items-center gap-3">
        <SiteImage src={branchImage(relatedBooking, branches, review.branchId, name)} alt={name} width={48} height={48} className="h-12 w-12 shrink-0 rounded-md border border-[#e5d9c7] object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[#38281f]">{name}</h3>
          <p className="mt-0.5 text-xs text-[#766557]"><SiteText text="Reviewed on" /> {formatDate(review.createdAt, locale)}</p>
        </div>
        <span className={combine("inline-flex min-h-7 shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium", review.isApproved ? "bg-[#edf3e9] text-[#3c6047]" : "bg-[#f6ead0] text-[#765716]")}>
          <AccountIcon name={review.isApproved ? "check" : "clock"} className="h-3.5 w-3.5" />
          <SiteText text={review.isApproved ? "Published" : "Awaiting approval"} />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <RatingStars rating={review.rating} label={(value) => tr("Rating {{rating}} out of 5", { rating: value })} />
        <span className="text-xs text-[#766557]">{review.rating}/5</span>
      </div>
      {review.comment ? <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#493024]">{review.comment}</p> : null}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#766557]">{relatedPackage?.title && <span>{tr(relatedPackage.title)}</span>}{relatedPackage?.duration ? <span>· {relatedPackage.duration} <SiteText text="min" /></span> : null}</div>
        <button type="button" onClick={() => onEdit(review)} className="inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-[#805a1e] underline underline-offset-2 hover:text-[#493024]">
          <AccountIcon name="edit" className="h-3.5 w-3.5" />
          <SiteText text="Edit review" />
        </button>
      </div>
    </article>
  );
}

export default function ReviewsPage() {
  const { tr, locale } = useSiteTranslation();
  const user = useSelector((state: RootState) => state.user);
  const authenticated = Boolean(user.id);
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReviewTab>("approved");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [mobileMode, setMobileMode] = useState<"list" | "form" | "success">("list");
  const openedBranchLink = useRef(false);

  const receiveData = useCallback(([reviewData, bookingData, branchData, packageData]: Awaited<ReturnType<typeof fetchReviewData>>) => {
    setError(null);
    setReviews(reviewData);
    setBookings(bookingData);
    setBranches(branchData);
    setPackages(packageData);
    if (!openedBranchLink.current) {
      const branchId = new URLSearchParams(window.location.search).get("branchId");
      if (branchId) {
        const existingReview = reviewData.find(review => review.branchId === branchId);
        if (existingReview) {
          openedBranchLink.current = true;
          setEditingReviewId(existingReview.id);
          setRating(existingReview.rating);
          setComment(existingReview.comment || "");
          setMobileMode("form");
        } else {
          const visit = bookingData.find(booking => booking.branchId === branchId && isCompleted(booking.status));
          if (visit) { openedBranchLink.current = true; setSelectedBookingId(visit.id); setMobileMode("form"); }
        }
      }
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      receiveData(await fetchReviewData(authenticated));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load reviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authenticated, receiveData]);

  useEffect(() => {
    let active = true;
    void fetchReviewData(authenticated)
      .then(data => { if (active) receiveData(data); })
      .catch(cause => { if (active) setError(cause instanceof Error ? cause.message : "Failed to load reviews"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authenticated, receiveData]);

  const eligibleBookings = useMemo(() => {
    const reviewedBranches = new Set(reviews.map((review) => review.branchId));
    const seenBranches = new Set<string>();
    return [...bookings]
      .filter((booking) => isCompleted(booking.status) && Boolean(booking.branchId) && !reviewedBranches.has(booking.branchId!))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((booking) => {
        const branchId = booking.branchId!;
        if (seenBranches.has(branchId)) return false;
        seenBranches.add(branchId);
        return true;
      });
  }, [bookings, reviews]);

  const selectedBooking = eligibleBookings.find((booking) => booking.id === selectedBookingId) || eligibleBookings[0];
  const approvedReviews = useMemo(() => reviews.filter((review) => review.isApproved), [reviews]);
  const pendingReviews = useMemo(() => reviews.filter((review) => !review.isApproved), [reviews]);
  const visibleReviews = activeTab === "approved" ? approvedReviews : pendingReviews;
  const hasCompletedVisit = bookings.some((booking) => isCompleted(booking.status) && Boolean(booking.branchId));
  const selectedBranch = selectedBooking ? branchFor(selectedBooking, branches) : null;
  const editingReview = reviews.find((review) => review.id === editingReviewId) || null;
  const editingBooking = editingReview
    ? bookings.find((booking) => booking.branchId === editingReview.branchId && isCompleted(booking.status)) || null
    : null;
  const formBooking = editingReview ? editingBooking : selectedBooking;
  const formBranchName = editingReview?.branch?.name ||
    branches.find((branch) => branch.id === editingReview?.branchId)?.name ||
    formBooking?.branch?.name || selectedBranch?.name || tr("Branch");
  const formPackage = formBooking ? packages.find((item) => item.id === formBooking.packageId) : null;
  const formDate = formBooking ? formatDate(formBooking.date, locale) : editingReview ? formatDate(editingReview.createdAt, locale) : "";
  const formServiceTitle = formPackage?.title || formBooking?.package?.title || tr("Completed visit");
  const formImage = formPackage?.pictureUrl || formBooking?.package?.pictureUrl || branchImage(formBooking || undefined, branches, editingReview?.branchId, formBranchName);

  const refresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!editingReviewId && !selectedBooking?.branchId) || rating < 1 || rating > 5) {
      setSubmitError(tr("Choose a visit and select a star rating before submitting."));
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, { rating, comment: comment.trim() || undefined });
      } else if (selectedBooking?.branchId) {
        await createReview({ branchId: selectedBooking.branchId, rating, comment: comment.trim() || undefined });
      }
      setComment("");
      setRating(0);
      setSuccessMessage(tr(editingReviewId ? "Your review has been updated and is waiting for approval." : "Thank you! Your review is waiting for approval."));
      setEditingReviewId(null);
      setActiveTab("pending");
      setMobileMode("success");
      await loadData();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? tr(cause.message) : tr("Failed to submit your review."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <MobileMyReviews mode={mobileMode} onMode={setMobileMode} reviews={reviews} branches={branches} eligible={eligibleBookings} selectedBookingId={selectedBooking?.id || ""} branchName={formBranchName} editing={editingReview} rating={rating} comment={comment} tab={activeTab} loading={loading} authenticated={authenticated} error={error} submitError={submitError} submitting={submitting}
      onTab={setActiveTab} onSelectBooking={setSelectedBookingId} onRating={setRating} onComment={setComment} onRetry={() => void refresh()} onSubmit={submit}
      onWrite={() => { setEditingReviewId(null); setRating(0); setComment(""); setSubmitError(null); setMobileMode("form"); window.scrollTo({ top: 0 }); }}
      onEdit={review => { setEditingReviewId(review.id); setRating(review.rating); setComment(review.comment || ""); setSubmitError(null); setMobileMode("form"); window.scrollTo({ top: 0 }); }} />
    <main className="hidden lg:block min-h-[calc(100vh-76px)] bg-[#faf6ee] text-[#38281f] md:min-h-[calc(100vh-104px)]">
      <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[205px_minmax(0,1fr)] lg:gap-9 lg:px-8">
        <AccountNavigation active="review" />
        <section className="min-w-0">
          <header className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><h1 className="font-serif text-3xl tracking-tight text-[#38281f] sm:text-[38px]"><SiteText text="My Review" /></h1><p className="mt-2 text-sm text-[#766557]"><SiteText text="Share your experience with our branches." /></p></div>
            {authenticated && <button type="button" onClick={() => void refresh()} disabled={refreshing} className="inline-flex min-h-10 w-fit items-center gap-2 rounded-md border border-[#cdbb9f] bg-[#fffdf8] px-3 text-sm text-[#493024] hover:bg-[#f3eee4] disabled:opacity-50"><AccountIcon name="refresh" className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} /><SiteText text="Refresh reviews" /></button>}
          </header>

          {!authenticated ? (
            <div className="rounded-xl border border-[#e5d9c7] bg-[#fffdf8] px-5 py-12 text-center">
              <AccountIcon name="review" className="mx-auto h-9 w-9 text-[#a78343]" />
              <h2 className="mt-4 font-serif text-2xl text-[#38281f]"><SiteText text="Sign in to see and manage your reviews." /></h2>
              <Link href="/login?next=%2Freviews" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#e5b653] px-5 text-sm font-semibold text-[#342418] hover:bg-[#edc86f]"><SiteText text="Sign in" /><AccountIcon name="arrow" /></Link>
            </div>
          ) : loading ? (
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_350px]"><div className="h-72 animate-pulse rounded-xl bg-[#efe7d9]" /><div className="h-[430px] animate-pulse rounded-xl bg-[#efe7d9]" /></div>
          ) : error ? (
            <div className="rounded-xl border border-[#e5d9c7] bg-[#fffdf8] p-8 text-center">
              <p className="text-sm text-[#934d3e]">{error}</p>
              <button type="button" onClick={() => void refresh()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-md border border-[#cdbb9f] px-4 text-sm hover:bg-[#f3eee4]"><AccountIcon name="refresh" /><SiteText text="Try again" /></button>
            </div>
          ) : (
            <>
            {successMessage && <p role="status" className="mb-5 rounded-lg border border-[#c8d7c2] bg-[#edf3e9] px-4 py-3 text-sm text-[#3c6047]">{successMessage}</p>}
            <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px]">
              <section aria-label={tr("Your reviews")} className="order-2 min-w-0 lg:order-1">
                <div className="flex gap-6 border-b border-[#e5d9c7]" role="group" aria-label={tr("Review status")}>
                  <button type="button" onClick={() => setActiveTab("approved")} aria-pressed={activeTab === "approved"} className={combine("inline-flex min-h-11 items-center gap-2 border-b-2 px-0.5 text-sm", activeTab === "approved" ? "border-[#493024] font-semibold text-[#38281f]" : "border-transparent text-[#766557] hover:text-[#38281f]")}><SiteText text="Published" /><span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#eee6d8] px-1 text-[10px]">{approvedReviews.length}</span></button>
                  <button type="button" onClick={() => setActiveTab("pending")} aria-pressed={activeTab === "pending"} className={combine("inline-flex min-h-11 items-center gap-2 border-b-2 px-0.5 text-sm", activeTab === "pending" ? "border-[#493024] font-semibold text-[#38281f]" : "border-transparent text-[#766557] hover:text-[#38281f]")}><SiteText text="Awaiting approval" /><span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#eee6d8] px-1 text-[10px]">{pendingReviews.length}</span></button>
                </div>
                <div className="rounded-b-lg bg-[#fffdf8] px-4 sm:px-5">
                  <div className="flex items-center justify-between gap-2 py-4"><h2 className="font-serif text-lg text-[#38281f]"><SiteText text="Review history" /></h2><p className="hidden text-xs text-[#766557] sm:block"><SiteText text="Reviews approved by the branch appear publicly." /></p></div>
                  {visibleReviews.length ? visibleReviews.map((review) => <ReviewCard key={review.id} review={review} branches={branches} bookings={bookings} packages={packages} locale={locale} onEdit={(selectedReview) => { setEditingReviewId(selectedReview.id); setRating(selectedReview.rating); setComment(selectedReview.comment || ""); setSubmitError(null); setSuccessMessage(null); window.requestAnimationFrame(() => document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth", block: "start" })); }} />) : (
                    <div className="border-t border-[#eee6d9] py-10 text-center"><AccountIcon name="review" className="mx-auto h-8 w-8 text-[#a78343]" /><p className="mt-3 text-sm text-[#766557]"><SiteText text="No reviews in this section yet." /></p></div>
                  )}
                </div>
              </section>

              <section id="review-form" aria-labelledby="write-review-title" className="order-1 scroll-mt-24 rounded-xl border border-[#e5d9c7] bg-[#fffdf8] p-4 sm:p-6 lg:order-2">
                <h2 id="write-review-title" className="font-serif text-2xl text-[#38281f]"><SiteText text={editingReview ? "Edit review" : "Write a review"} /></h2>
                <p className="mt-1 text-sm text-[#766557]"><SiteText text={editingReview ? "Update your review. It will need approval again." : "How was your visit?"} /></p>
                {(editingReview || (eligibleBookings.length > 0 && selectedBooking)) ? (
                  <>
                    {!editingReview && eligibleBookings.length > 1 && <label className="mt-5 block"><span className="mb-2 block text-xs font-semibold text-[#493024]"><SiteText text="Choose a completed visit" /></span><select value={selectedBooking?.id || ""} onChange={(event) => setSelectedBookingId(event.target.value)} className="h-11 w-full rounded-md border border-[#d8c9b4] bg-[#fffdf8] px-3 text-sm text-[#493024] outline-none focus:border-[#b7892f]">{eligibleBookings.map((booking) => { const branchName = booking.branch?.name || branchFor(booking, branches)?.name || tr("Branch"); return <option key={booking.id} value={booking.id}>{branchName} · {formatDate(booking.date, locale)}</option>; })}</select></label>}
                    <div className="mt-4 flex items-center gap-3 border-y border-[#e5d9c7] py-4">
                      <SiteImage src={formImage} alt={formServiceTitle} width={62} height={62} className="h-[62px] w-[62px] shrink-0 rounded-md object-cover" />
                      <div className="min-w-0"><strong className="block truncate text-sm font-semibold text-[#38281f]">{tr(formServiceTitle)}</strong><p className="mt-1 truncate text-xs text-[#766557]">{formBranchName} · {formDate}</p></div>
                    </div>
                    <form onSubmit={submit} className="mt-4">
                      <p className="text-sm font-semibold text-[#493024]"><SiteText text="Rate your experience" /></p>
                      <RatingStars rating={rating} interactive onChange={setRating} label={(value) => tr("Rate {{rating}}", { rating: value })} />
                      <label htmlFor="review-comment" className="mt-4 block text-sm font-semibold text-[#493024]"><SiteText text="Your review" /></label>
                      <textarea id="review-comment" value={comment} onChange={(event) => setComment(event.target.value.slice(0, 1000))} maxLength={1000} rows={5} placeholder={tr("Tell us what you liked about your visit (optional).")} className="mt-2 w-full resize-y rounded-md border border-[#d8c9b4] bg-[#fffdf8] p-3 text-sm leading-6 text-[#38281f] outline-none placeholder:text-[#938170] focus:border-[#b7892f]" />
                      <p className="mt-1 text-right text-xs text-[#766557]">{comment.length}/1000</p>
                      <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#766557]"><AccountIcon name="clock" className="mt-0.5 h-4 w-4 shrink-0" /><SiteText text={editingReview ? "Editing this review sends it for approval again." : "Reviews appear after the branch approves them."} /></p>
                      {submitError && <p role="alert" className="mt-3 rounded-md bg-[#faeee9] px-3 py-2 text-sm text-[#934d3e]">{submitError}</p>}
                      <button type="submit" disabled={submitting || rating < 1} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-[#d7aa4b] bg-[#e5b653] px-4 text-sm font-semibold text-[#342418] transition hover:bg-[#edc86f] disabled:cursor-not-allowed disabled:opacity-55">{submitting ? <AccountIcon name="refresh" className="h-4 w-4 animate-spin" /> : <AccountIcon name={editingReview ? "check" : "arrow"} />}<SiteText text={submitting ? "Submitting review…" : editingReview ? "Save review changes" : "Submit review"} /></button>
                      {editingReview && <button type="button" onClick={() => { setEditingReviewId(null); setRating(0); setComment(""); setSubmitError(null); }} className="mt-2 min-h-10 w-full rounded-md text-sm text-[#766557] hover:bg-[#f3eee4]"><SiteText text="Cancel editing" /></button>}
                    </form>
                  </>
                ) : (
                  <div className="mt-5 rounded-lg border border-dashed border-[#d7c5a7] bg-[#faf6ee] px-4 py-7 text-center">
                    <AccountIcon name="review" className="mx-auto h-8 w-8 text-[#a78343]" />
                    <p className="mt-3 text-sm font-medium text-[#493024]"><SiteText text={hasCompletedVisit ? "You have reviewed each branch from your completed visits." : "No completed visits are ready for a review yet."} /></p>
                    <p className="mt-2 text-xs leading-5 text-[#766557]"><SiteText text="You can review a branch after a completed appointment." /></p>
                  </div>
                )}
              </section>
            </div>
            </>
          )}
        </section>
      </div>
    </main>
    </>
  );
}
