import { getBaseUrl } from "@/lib/api";

export type CustomerBooking = {
  id: string;
  userId?: string;
  branchId?: string;
  packageId?: string;
  voucherId?: string | null;
  date: string;
  totalPrice: string | number;
  status?: string;
  user?: { id: string; displayName: string; pictureUrl?: string } | null;
  branch?: {
    id: string;
    name: string;
    pictureUrl?: string;
    address?: string;
    googleMapUrl?: string;
  } | null;
  package?: {
    id: string;
    title: string;
    duration?: number;
    pictureUrl?: string;
    type?: string;
  } | null;
  voucher?: { id: string; code: string; discount?: string } | null;
};

type Relation = Record<string, unknown> | null | undefined;
type RawBooking = Record<string, unknown> & {
  user?: Relation;
  branch?: Relation;
  package?: Relation;
  voucher?: Relation;
};

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};
const asString = (value: unknown, fallback = "") =>
  value === undefined || value === null ? fallback : String(value);
const asOptionalString = (value: unknown) =>
  value === undefined || value === null || value === ""
    ? undefined
    : String(value);

export function normalizeCustomerBooking(raw: RawBooking): CustomerBooking {
  const user = asRecord(raw.user);
  const branch = asRecord(raw.branch);
  const service = asRecord(raw.package);
  const voucher = asRecord(raw.voucher);
  const id = raw.id ?? raw.bookingId;
  const date = raw.date ?? raw.bookingDate ?? raw.createdAt;
  const totalPrice = raw.totalPrice ?? raw.total_price ?? raw.amount ?? 0;
  const status = raw.status ?? raw.bookingStatus;

  return {
    id: asString(id),
    userId: asOptionalString(raw.userId ?? raw.user_id ?? user.id),
    branchId: asOptionalString(raw.branchId ?? raw.branch_id ?? branch.id),
    packageId: asOptionalString(raw.packageId ?? raw.package_id ?? service.id),
    voucherId: asOptionalString(raw.voucherId ?? raw.voucher_id ?? voucher.id) ?? null,
    date: asString(date),
    totalPrice: typeof totalPrice === "number" ? totalPrice : asString(totalPrice, "0"),
    status: asOptionalString(status),
    user: raw.user
      ? {
          id: asString(user.id ?? user.userId ?? raw.userId),
          displayName: asString(user.displayName ?? user.name),
          pictureUrl: asOptionalString(user.pictureUrl ?? user.avatar),
        }
      : null,
    branch: raw.branch
      ? {
          id: asString(branch.id ?? branch.branchId ?? raw.branchId),
          name: asString(branch.name),
          pictureUrl: asOptionalString(branch.pictureUrl),
          address: asOptionalString(branch.address),
          googleMapUrl: asOptionalString(branch.googleMapUrl),
        }
      : null,
    package: raw.package
      ? {
          id: asString(service.id ?? service.packageId ?? raw.packageId),
          title: asString(service.title ?? service.name),
          duration: Number.isFinite(Number(service.duration))
            ? Number(service.duration)
            : undefined,
          pictureUrl: asOptionalString(service.pictureUrl),
          type: asOptionalString(service.type),
        }
      : null,
    voucher: raw.voucher
      ? {
          id: asString(voucher.id ?? voucher.voucherId ?? raw.voucherId),
          code: asString(voucher.code),
          discount: asOptionalString(voucher.discount ?? voucher.percent),
        }
      : null,
  };
}

export async function getCustomerBookings(): Promise<CustomerBooking[]> {
  const bookings: CustomerBooking[] = [];
  const pageSize = 10;

  for (let page = 1; page <= 100; page += 1) {
    const response = await fetch(`${getBaseUrl()}/booking?page=${page}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });

    if (response.status === 401) return [];
    if (!response.ok) {
      let message = `Failed to load bookings (${response.status})`;
      try {
        const data = await response.json();
        if (data?.message) message = data.message;
      } catch {}
      throw new Error(message);
    }

    const data: unknown = await response.json();
    const rows = Array.isArray(data)
      ? data
      : Array.isArray(asRecord(data).bookings)
        ? (asRecord(data).bookings as unknown[])
        : [];
    bookings.push(...rows.map((item) => normalizeCustomerBooking(asRecord(item) as RawBooking)));
    if (rows.length < pageSize) break;
  }

  return bookings;
}
