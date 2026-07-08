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

export function discountPercent(price: number, oldPrice?: number | null) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** Rough BTU sizing used by the AI assistant and capacity calculator. */
export function recommendBtu(areaM2: number, opts?: { sunny?: boolean; highCeiling?: boolean }) {
  let btu = areaM2 * 340;
  if (opts?.sunny) btu *= 1.1;
  if (opts?.highCeiling) btu *= 1.15;
  const sizes = [9000, 12000, 18000, 24000, 48000];
  return sizes.find((s) => s >= btu) ?? 48000;
}
