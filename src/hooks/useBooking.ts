import { getBaseUrl } from "@/lib/api";

export type CreateBookingPayload = {
  branchId: string;
  packageId: string; // either service or promotion package id
  date: string; // ISO or server-parseable date-time string
  customerEmail: string;
  customerName?: string;
  numberOfGuests?: number;
  source?: "website" | "facebook" | "line" | "admin";
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
  const baseUrl = getBaseUrl();

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

  const data = await res.json();
  if (data?.status !== "success" || typeof data?.booking?.id !== "string" || !data.booking.id) throw new Error("Booking confirmation was not received. Check My Bookings before retrying.");
  return {id:data.booking.id,status:data.status,message:data.message};
}

export type VerifyVoucherResult = { isValid: boolean; id?: string; discount?: number };

export async function verifyVoucher(
  code: string
): Promise<VerifyVoucherResult> {
  const baseUrl = getBaseUrl();
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
    if (data && data.id && data.isExpired === false && Number.isFinite(Number(data.discount)) && Number(data.discount)>=0) {
      return { isValid: true, id: String(data.id), discount: Number(data.discount) };
    }
  } catch {}
  return { isValid: false };
}

export type CancelBookingResponse = {
  success: boolean;
  message?: string;
};

export async function cancelBooking(
  bookingId: string
): Promise<CancelBookingResponse> {
  const baseUrl = getBaseUrl();

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
