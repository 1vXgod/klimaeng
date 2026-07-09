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

/* ------------------------------------------------------------------ */
/* BTU price variants                                                  */
/* ------------------------------------------------------------------ */

/**
 * Optional higher-capacity variants a product can enable. The base
 * price/oldPrice pair is always the first (12.000 BTU) variant. To add a
 * capacity later (e.g. 36k): add the column trio to the Product model and
 * one entry here — the admin form, validation and pricing cards all
 * iterate over this list.
 */
export const BTU_VARIANTS = [
  { btu: 18000, enabledField: "btu18Enabled", priceField: "btu18Price", saleField: "btu18SalePrice" },
  { btu: 24000, enabledField: "btu24Enabled", priceField: "btu24Price", saleField: "btu24SalePrice" },
] as const;

export type BtuVariantFields = {
  btu18Enabled: boolean;
  btu18Price?: number | null;
  btu18SalePrice?: number | null;
  btu24Enabled: boolean;
  btu24Price?: number | null;
  btu24SalePrice?: number | null;
};

export type BtuVariantSource = DiscountInput & Partial<BtuVariantFields> & {
  btu?: number | null;
};

export type BtuVariant = {
  /** Capacity label; null for products without a BTU rating (boilers etc.). */
  btu: number | null;
  /** Current selling price (the sale price when one exists). */
  price: number;
  /** Regular price, only set when a sale price undercuts it. */
  oldPrice: number | null;
  discount: DiscountInfo;
};

export function formatBtu(btu: number) {
  return `${btu.toLocaleString("de-DE")} BTU`;
}

/**
 * The purchasable capacity variants of a product, base first. Old products
 * (no variants enabled) resolve to a single base entry, so every consumer
 * keeps working with pre-variant data. Each entry carries its own
 * DiscountInfo: the timer window is product-level, but whether a
 * strike-through price exists differs per variant.
 */
export function getBtuVariants(p: BtuVariantSource, now: number = Date.now()): BtuVariant[] {
  const variants: BtuVariant[] = [];
  for (const def of BTU_VARIANTS) {
    if (!p[def.enabledField]) continue;
    const regular = p[def.priceField];
    if (!regular || regular <= 0) continue;
    const sale = p[def.saleField];
    const hasSale = sale != null && sale > 0 && sale < regular;
    const price = hasSale ? sale : regular;
    const oldPrice = hasSale ? regular : null;
    variants.push({
      btu: def.btu,
      price,
      oldPrice,
      discount: getDiscountInfo({ ...p, price, oldPrice }, now),
    });
  }
  variants.unshift({
    // Label the base card with the product's own capacity; only assume
    // 12.000 BTU when higher variants exist to compare against.
    btu: p.btu ?? (variants.length > 0 ? 12000 : null),
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    discount: getDiscountInfo(p, now),
  });
  return variants;
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
