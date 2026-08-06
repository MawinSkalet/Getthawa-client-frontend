"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LocaleFont from "@/components/LocaleFont";
import I18nText from "@/components/I18nText";
import type { Branch } from "@/hooks/useBranch";
import {
  createReview,
  getBranchReviews,
  type BranchReview,
} from "@/hooks/useReview";
import type { RootState } from "@/stores/store";

type Props = {
  branch?: Branch | null;
};

const starSlots = [1, 2, 3, 4, 5];

function RatingStars({
  value,
  onChange,
  readOnly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className="flex items-center gap-1">
      {starSlots.map((slot) => {
        const filled = slot <= displayValue;
        const sharedProps = readOnly
          ? {}
          : {
              onMouseEnter: () => setHovered(slot),
              onMouseLeave: () => setHovered(null),
              onFocus: () => setHovered(slot),
              onBlur: () => setHovered(null),
              onClick: () => onChange?.(slot),
            };
        return (
          <button
            key={slot}
            type="button"
            aria-label={`Rate ${slot}`}
            className={`transition-transform duration-150 ${
              readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            {...sharedProps}
            disabled={readOnly}
          >
            <svg
              className={`h-5 w-5 ${
                filled ? "text-[#DCA900]" : "text-white/25"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

function ReviewerAvatar({
  displayName,
  pictureUrl,
}: {
  displayName: string;
  pictureUrl?: string | null;
}) {
  if (pictureUrl) {
    return (
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#DCA900]/40">
        <Image
          src={pictureUrl}
          alt={displayName}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  const initial = displayName?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DCA900]/40 bg-[#DCA900]/20 text-sm font-semibold text-[#DCA900]">
      {initial}
    </div>
  );
}

export default function BranchReviewPanel({ branch }: Props) {
  const branchId = branch?.id ?? "";
  const [reviews, setReviews] = useState<BranchReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    setRating(0);
    setComment("");
    setSubmitMessage(null);
    setSubmitError(null);
  }, [branchId]);

  useEffect(() => {
    if (!branchId) {
      setReviews([]);
      setError(null);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getBranchReviews(branchId);
        if (!isActive) return;
        setReviews(data);
      } catch (err) {
        if (!isActive) return;
        const message =
          err instanceof Error ? err.message : "Failed to load reviews";
        setError(message);
        setReviews([]);
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [branchId]);

  const refreshReviews = async () => {
    if (!branchId) return;
    setIsRefreshing(true);
    try {
      const data = await getBranchReviews(branchId);
      setReviews(data);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load reviews";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }, [reviews]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!branchId || !userId) return;
    if (rating < 1 || rating > 5) {
      setSubmitError("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const result = await createReview({
        branchId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (result.message) {
        setSubmitMessage(result.message);
      } else {
        setSubmitMessage("Review submitted successfully.");
      }

      // Only append immediately if the review is already approved
      const approvedReview = result.review;
      if (approvedReview?.isApproved) {
        setReviews((prev) => [approvedReview, ...prev]);
      } else {
        await refreshReviews();
      }

      setRating(0);
      setComment("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to submit review";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) return;
    window.location.href = `${baseUrl}/line/authentication`;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl bg-gradient-to-br from-[#402e28]/85 via-[#50352d]/80 to-[#573a30]/85 border border-white/10 backdrop-blur-md shadow-[0_8px_30px_-6px_rgba(0,0,0,0.55)] p-5 text-white">
      <header className="mb-4 flex flex-col gap-2">
        <LocaleFont as="h3" className="text-xl font-semibold text-[#DCA900]">
          {branch ? branch.name : (
            <I18nText
              i18nKey="reviews.selectBranch"
              fallback="Select a branch to view reviews"
            />
          )}
        </LocaleFont>
        {branch && (
          <p className="text-sm text-white/70">
            {branch.address || (
              <I18nText
                i18nKey="reviews.addressUnavailable"
                fallback="Branch address unavailable"
              />
            )}
          </p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-white/80">
            <strong className="text-[#DCA900] uppercase tracking-wide text-xs">
              <I18nText i18nKey="reviews.title" fallback="Reviews" />
            </strong>
            {averageRating ? (
              <div className="flex items-center gap-2">
                <RatingStars value={Math.round(averageRating)} readOnly />
                <span className="text-white/70">
                  {averageRating.toFixed(1)}
                  <span className="text-xs text-white/50"> / 5</span>
                </span>
                <span className="text-xs text-white/40">
                  ({reviews.length})
                </span>
              </div>
            ) : (
              <span className="text-xs text-white/50">
                <I18nText
                  i18nKey="reviews.noReviews"
                  fallback="No reviews yet"
                />
              </span>
            )}
          </div>
          {branchId && (
            <button
              type="button"
              onClick={refreshReviews}
              disabled={isRefreshing}
              className="flex items-center gap-1 rounded-lg border border-[#DCA900]/40 px-3 py-1 text-xs text-white/80 transition-colors duration-200 hover:border-[#DCA900] hover:text-[#DCA900] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? (
                <svg
                  className="h-3.5 w-3.5 animate-spin"
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
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3.05 7.05a7 7 0 019.9-2.1l1.43-1.43A9 9 0 1020 10h-2a7 7 0 11-11.9-2.95z" />
                  <path d="M17 3l-5 5h3a5 5 0 11-4.546-2.914L12 4a7 7 0 105 9v-3l5-5z" />
                </svg>
              )}
              <span>
                <I18nText i18nKey="reviews.refresh" fallback="Refresh" />
              </span>
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <div className="h-full overflow-y-auto custom-scrollbar p-4">
          {!branchId ? (
            <p className="text-center text-sm text-white/60">
              <I18nText
                i18nKey="reviews.selectPrompt"
                fallback="Choose a branch to read customer experiences."
              />
            </p>
          ) : isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse space-y-3 rounded-xl bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 rounded bg-white/10" />
                      <div className="h-3 w-16 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="space-y-3 text-center text-sm">
              <p className="text-red-300">{error}</p>
              <button
                type="button"
                onClick={refreshReviews}
                className="rounded-lg border border-red-300/40 px-3 py-1 text-xs text-red-200 transition hover:border-red-200 hover:bg-red-200/10"
              >
                <I18nText i18nKey="reviews.retry" fallback="Try again" />
              </button>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm text-white/60">
              <I18nText
                i18nKey="reviews.empty"
                fallback="No reviews yet. Be the first to share your experience!"
              />
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <ReviewerAvatar
                      displayName={review.user?.displayName ?? "Guest"}
                      pictureUrl={review.user?.pictureUrl}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <LocaleFont as="h4" className="text-sm font-semibold">
                          {review.user?.displayName ?? "Guest"}
                        </LocaleFont>
                        <RatingStars value={review.rating} readOnly />
                      </div>
                      <p className="mt-1 text-xs text-white/50">
                        {new Intl.DateTimeFormat(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(review.createdAt))}
                      </p>
                      {review.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-white/80">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        {branchId ? (
          userId ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/60">
                  <I18nText
                    i18nKey="reviews.yourRating"
                    fallback="Your rating"
                  />
                </label>
                <div className="mt-2">
                  <RatingStars value={rating} onChange={setRating} />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/60">
                  <I18nText
                    i18nKey="reviews.comment"
                    fallback="Share your experience"
                  />
                </label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  maxLength={600}
                  rows={3}
                  placeholder="Optional message"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-[#DCA900] focus:outline-none focus:ring-2 focus:ring-[#DCA900]/40"
                />
              </div>
              {submitError && (
                <p className="text-sm text-red-300">{submitError}</p>
              )}
              {submitMessage && (
                <p className="text-sm text-[#DCA900]">{submitMessage}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="w-full rounded-xl bg-[#DCA900] py-2 text-sm font-semibold text-[#200800] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <svg
                    className="mx-auto h-5 w-5 animate-spin text-[#200800]"
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
                  <I18nText
                    i18nKey="reviews.submit"
                    fallback="Submit review"
                  />
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3 text-center text-sm text-white/70">
              <p>
                <I18nText
                  i18nKey="reviews.loginPrompt"
                  fallback="Login to share your experience with this branch."
                />
              </p>
              <button
                type="button"
                onClick={handleLoginRedirect}
                className="w-full rounded-xl border border-[#DCA900] py-2 text-sm font-semibold text-[#DCA900] transition hover:bg-[#DCA900] hover:text-[#200800]"
              >
                <I18nText i18nKey="reviews.login" fallback="Login" />
              </button>
            </div>
          )
        ) : (
          <p className="text-center text-sm text-white/60">
            <I18nText
              i18nKey="reviews.selectToReview"
              fallback="Pick a branch above to leave a review."
            />
          </p>
        )}
      </div>
    </div>
  );
}
