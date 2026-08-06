import { getBaseUrl } from "@/lib/api";

export type ReviewAuthor = {
  id: string;
  displayName: string;
  pictureUrl?: string | null;
};

export type ReviewBranch = {
  id: string;
  name: string;
};

export type BranchReview = {
  id: string;
  userId: string;
  branchId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user?: ReviewAuthor | null;
  branch?: ReviewBranch | null;
};

export type CreateReviewPayload = {
  branchId: string;
  rating: number;
  comment?: string;
};

export type CreateReviewResult = {
  status: string;
  message?: string;
  review?: BranchReview;
};



export async function getBranchReviews(
  branchId: string
): Promise<BranchReview[]> {
  if (!branchId) return [];

  const res = await fetch(
    `${getBaseUrl()}/review/branch/${encodeURIComponent(branchId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    let message = `Failed to load reviews (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const data = (await res.json()) as BranchReview[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to parse reviews response", error);
    return [];
  }
}

export async function createReview(
  payload: CreateReviewPayload
): Promise<CreateReviewResult> {
  const res = await fetch(`${getBaseUrl()}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      branchId: payload.branchId,
      rating: payload.rating,
      comment: payload.comment?.trim() || undefined,
    }),
  });

  if (!res.ok) {
    let message = `Failed to submit review (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const data = (await res.json()) as CreateReviewResult;
    return {
      status: data?.status ?? "success",
      message: data?.message,
      review: data?.review,
    };
  } catch (error) {
    console.error("Failed to parse review creation response", error);
    return { status: "success" };
  }
}

export async function getMyReviews(): Promise<BranchReview[]> {
  const res = await fetch(`${getBaseUrl()}/review/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return [];
  }

  if (!res.ok) {
    let message = `Failed to load reviews (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const data = (await res.json()) as BranchReview[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to parse user reviews response", error);
    return [];
  }
}

export async function getTestimonials(): Promise<BranchReview[]> {
  const res = await fetch(`${getBaseUrl()}/review/testimonials`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Failed to load testimonials (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  try {
    const data = (await res.json()) as BranchReview[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to parse testimonials response", error);
    return [];
  }
}
