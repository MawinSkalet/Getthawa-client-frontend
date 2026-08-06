"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LocaleFont from "@/components/LocaleFont";
import I18nText from "@/components/I18nText";
import { getMyReviews, type BranchReview } from "@/hooks/useReview";
import type { RootState } from "@/stores/store";
import "@/locales/i18n";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "";
const loginUrl = apiBase
  ? `${apiBase.replace(/\/$/, "")}/line/authentication`
  : "/line/authentication";

function RatingDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <svg
            key={index}
            className={`h-4 w-4 ${filled ? "text-[#DCA900]" : "text-white/20"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
    </div>
  );
}

export default function ReviewsPage() {
  const { t, i18n } = useTranslation();
  const userId = useSelector((state: RootState) => state.user.id);
  const displayName = useSelector((state: RootState) => state.user.displayName);
  const isAuthenticated = Boolean(userId);

  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const readyText = (key: string, fallback: string) =>
    i18n.isInitialized ? t(key) : fallback;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isAuthenticated) {
        setLoading(false);
        setReviews([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await getMyReviews();
        if (!cancelled) {
          setReviews(data);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load reviews";
          setError(message);
          setReviews([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    if (!isAuthenticated) return;
    setRefreshing(true);
    setError(null);
    try {
      const data = await getMyReviews();
      setReviews(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load reviews";
      setError(message);
    } finally {
      setRefreshing(false);
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const pendingCount = useMemo(
    () => reviews.filter((review) => !review.isApproved).length,
    [reviews]
  );

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#261611] text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/aromapics.png"
          alt="Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#382924]/70 via-[#4A332B]/80 to-[#200C08]/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
          <LocaleFont
            as="h1"
            className="text-3xl font-bold text-[#DCA900] sm:text-4xl"
          >
            {readyText("reviews.pageTitle", "My Reviews")}
          </LocaleFont>
          <p className="mt-3 max-w-2xl text-sm text-white/75 sm:text-base">
            {readyText(
              "reviews.pageSubtitle",
              "Track every review you've shared across our branches."
            )}
          </p>

          {isAuthenticated && (
            <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:grid-cols-3">
              <div className="rounded-xl border border-[#DCA900]/20 bg-[#DCA900]/10 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-[#DCA900]/70">
                  {readyText("reviews.total", "Total reviews")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#DCA900]">
                  {reviews.length}
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {readyText("reviews.average", "Average rating")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {averageRating ? (
                    <>
                      {averageRating.toFixed(1)}
                      <span className="ml-1 text-sm text-white/60">/5</span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {readyText("reviews.pending", "Pending approval")}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {pendingCount}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
          {!isAuthenticated ? (
            <div className="py-16 text-center">
              <LocaleFont as="h2" className="text-2xl font-semibold text-[#DCA900]">
                {readyText("reviews.loginHeading", "Login required")}
              </LocaleFont>
              <p className="mt-3 text-sm text-white/70">
                {readyText(
                  "reviews.loginMessage",
                  "Sign in to see and manage the reviews you have shared."
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!process.env.NEXT_PUBLIC_API_URL) return;
                  window.location.href = loginUrl;
                }}
                className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#DCA900] px-6 py-2 text-sm font-semibold text-[#DCA900] transition hover:bg-[#DCA900] hover:text-[#200800]"
              >
                {readyText("reviews.login", "Login")}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <LocaleFont as="h2" className="text-xl font-semibold text-[#DCA900]">
                    {displayName
                      ? readyText("reviews.listTitle", "Your latest reviews")
                      : readyText("reviews.title", "Reviews")}
                  </LocaleFont>
                  <p className="mt-1 text-xs text-white/60">
                    {readyText(
                      "reviews.listHelper",
                      "Only approved reviews are visible on branch pages."
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DCA900]/40 px-4 py-2 text-sm text-white/90 transition hover:border-[#DCA900] hover:text-[#DCA900] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.05 7.05a7 7 0 019.9-2.1l1.43-1.43A9 9 0 1020 10h-2a7 7 0 11-11.9-2.95z" />
                      <path d="M17 3l-5 5h3a5 5 0 11-4.546-2.914L12 4a7 7 0 105 9v-3l5-5z" />
                    </svg>
                  )}
                  <span>{readyText("reviews.refresh", "Refresh")}</span>
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/10" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-32 rounded bg-white/10" />
                          <div className="h-3 w-20 rounded bg-white/10" />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="h-3 w-full rounded bg-white/10" />
                        <div className="h-3 w-3/4 rounded bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-red-400/40 bg-red-400/10 p-6 text-center text-sm text-red-200">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs text-red-100 transition hover:bg-red-200/10"
                  >
                    {readyText("reviews.retry", "Try again")}
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/70">
                  <I18nText
                    i18nKey="reviews.empty"
                    fallback="No reviews yet. Be the first to share your experience!"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const branchName =
                      review.branch?.name ?? readyText("reviews.unknownBranch", "Unknown branch");
                    const createdAt = new Date(review.createdAt);
                    const formattedDate = new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(createdAt);

                    return (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] transition hover:border-[#DCA900]/40 hover:shadow-[0_18px_45px_-20px_rgba(220,169,0,0.35)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <LocaleFont as="h3" className="text-lg font-semibold text-[#DCA900]">
                              {branchName}
                            </LocaleFont>
                            <p className="mt-1 text-xs text-white/50">{formattedDate}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <RatingDisplay rating={review.rating} />
                            <span className="text-sm text-white/70">
                              {review.rating}
                              <span className="ml-1 text-xs text-white/40">/5</span>
                            </span>
                          </div>
                        </div>

                        {review.comment && (
                          <p className="mt-4 text-sm leading-relaxed text-white/85">
                            {review.comment}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide">
                          <span
                            className={`rounded-full px-3 py-1 font-semibold ${
                              review.isApproved
                                ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
                                : "bg-amber-400/15 text-amber-200 border border-amber-400/30"
                            }`}
                          >
                            {review.isApproved
                              ? readyText("reviews.approved", "Approved")
                              : readyText("reviews.pendingStatus", "Pending approval")}
                          </span>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/60">
                            {readyText("reviews.reviewId", "Review ID")}: {review.id}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
