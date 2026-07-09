export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatEur(value: number) {
  return `${value.toLocaleString("de-DE")} €`;
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleDateString("sq-AL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(date: Date | string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "tani";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min më parë`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} orë më parë`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ditë më parë`;
  const months = Math.floor(days / 30);
  return `${months} muaj më parë`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  SPLIT: "Split AC",
  MULTI: "Multi-Split",
  STANDING: "AC Qëndrues",
  HEATPUMP: "Pompa Termike",
  BOILER: "Boilerë",
  ACCESSORY: "Aksesorë",
};

export const ORDER_STATUS: Record<
  string,
  { label: string; tone: "amber" | "blue" | "violet" | "green" | "red" }
> = {
  PENDING: { label: "Në pritje", tone: "amber" },
  CONFIRMED: { label: "E konfirmuar", tone: "blue" },
  INSTALLING: { label: "Në montim", tone: "violet" },
  COMPLETED: { label: "E përfunduar", tone: "green" },
  CANCELLED: { label: "E anuluar", tone: "red" },
};

export function parseFeatures(features: string): string[] {
  try {
    const parsed = JSON.parse(features);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Uploaded gallery images for a product. Falls back to the legacy single
 * `imageUrl` for products saved before the `images` column existed, so an
 * already-uploaded photo keeps replacing the renders.
 */
export function parseImages(images: string, imageUrl?: string | null): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(images);
  } catch {
    parsed = [];
  }
  const list = Array.isArray(parsed)
    ? parsed.filter((u): u is string => typeof u === "string" && u.length > 0)
    : [];
  if (list.length === 0 && imageUrl) return [imageUrl];
  return list;
}

export function discountPercent(price: number, oldPrice?: number | null) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export type DiscountInput = {
  price: number;
  oldPrice?: number | null;
  discountEnabled?: boolean;
  discountStart?: Date | string | null;
  discountEnd?: Date | string | null;
};

export type DiscountInfo = {
  active: boolean;
  /** ISO end date, only set when a timer is actually driving the discount. */
  endsAt: string | null;
  remainingMs: number | null;
};

/**
 * Whether a product's discount (old-price strike-through + badge) should be
 * shown right now. Without the timer enabled, any oldPrice > price counts as
 * an active discount (legacy behavior, no expiry). With the timer enabled,
 * the discount is only active inside [discountStart, discountEnd] — outside
 * that window it silently reverts to the normal price.
 */
export function getDiscountInfo(p: DiscountInput, now: number = Date.now()): DiscountInfo {
  const inactive: DiscountInfo = { active: false, endsAt: null, remainingMs: null };
  if (!p.oldPrice || p.oldPrice <= p.price) return inactive;
  if (!p.discountEnabled) return { active: true, endsAt: null, remainingMs: null };
  if (!p.discountStart || !p.discountEnd) return inactive;

  const start = new Date(p.discountStart).getTime();
  const end = new Date(p.discountEnd).getTime();
  if (now < start || now > end) return inactive;
  return { active: true, endsAt: new Date(end).toISOString(), remainingMs: end - now };
}

/** "12 ditë, 5 orë" style remaining-time label for a discount timer. */
export function formatRemaining(ms: number): string {
  const totalMinutes = Math.max(1, Math.round(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days} ditë, ${hours} orë`;
  if (hours > 0) return `${hours} orë, ${minutes} min`;
  return `${minutes} min`;
}

/** Rough BTU sizing used by the AI assistant and capacity calculator. */
export function recommendBtu(areaM2: number, opts?: { sunny?: boolean; highCeiling?: boolean }) {
  let btu = areaM2 * 340;
  if (opts?.sunny) btu *= 1.1;
  if (opts?.highCeiling) btu *= 1.15;
  const sizes = [9000, 12000, 18000, 24000, 48000];
  return sizes.find((s) => s >= btu) ?? 48000;
}
