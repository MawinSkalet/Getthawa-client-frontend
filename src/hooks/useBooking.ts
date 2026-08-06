export type CreateBookingPayload = {
  branchId: string;
  packageId: string; // either service or promotion package id
  date: string; // ISO or server-parseable date-time string
  voucherId?: string;
};

export type CreateBookingResponse = {
  id: string;
  status: string;
  message?: string;
};

export async function createBooking(
  payload: CreateBookingPayload
): Promise<CreateBookingResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const res = await fetch(`${baseUrl}/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = `Failed to create booking: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) errorMessage = data.message;
    } catch {}
    throw new Error(errorMessage);
  }

  // Normalize backend response to a simple shape
  try {
    const data = await res.json();
    const bookingId = data?.booking?.id ?? "";
    return {
      id: bookingId,
      status: String(data?.status ?? "success"),
      message: data?.message,
    };
  } catch {
    return { id: "", status: "success" };
  }
}

export type VerifyVoucherResult = { isValid: boolean; id?: string };

export async function verifyVoucher(
  code: string
): Promise<VerifyVoucherResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  if (!code) return { isValid: false };

  const res = await fetch(`${baseUrl}/voucher/${encodeURIComponent(code)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) return { isValid: false };
  try {
    const data = await res.json();
    if (data && data.id) {
      return { isValid: true, id: String(data.id) };
    }
  } catch {}
  return { isValid: true };
}

export type CancelBookingResponse = {
  success: boolean;
  message?: string;
};

export async function cancelBooking(
  bookingId: string
): Promise<CancelBookingResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const res = await fetch(
    `${baseUrl}/booking/${encodeURIComponent(bookingId)}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    let errorMessage = `Failed to cancel booking: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) errorMessage = data.message;
    } catch {}
    throw new Error(errorMessage);
  }

  try {
    const data = await res.json();
    return {
      success: true,
      message: data?.message || "Booking canceled successfully",
    };
  } catch {
    return { success: true, message: "Booking canceled successfully" };
  }
}
