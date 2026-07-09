"use client";

import { Check } from "lucide-react";
import { useLiveDiscount } from "@/lib/hooks";
import { cn, formatBtu, formatEur, type BtuVariant } from "@/lib/utils";

/**
 * Capacity picker on the product page: one card per enabled BTU variant,
 * acting as a radio group whose selection drives the add-to-cart price.
 * Styled with the site's surface/line/brand tokens so it reads as part of
 * the buy box, not a standalone banner. A product without variants renders
 * a single non-interactive card in the same visual language.
 */
export function BtuPricingCards({
  variants,
  selected,
  onSelect,
  energyCool,
  energyHeat,
}: {
  variants: BtuVariant[];
  selected: number;
  onSelect: (index: number) => void;
  energyCool?: string | null;
  energyHeat?: string | null;
}) {
  // The discount window is product-level, so a single live ticker covers
  // every card; variants only differ in whether they have a sale pair.
  const timer = variants.find((v) => v.discount.endsAt)?.discount;
  const live = useLiveDiscount(timer ?? variants[0].discount);
  const saleVisible = (v: BtuVariant) =>
    v.oldPrice !== null && v.discount.active && (!v.discount.endsAt || live.active);
  const anySale = variants.some(saleVisible);
  const selectable = variants.length > 1;

  return (
    <div
      role={selectable ? "radiogroup" : undefined}
      aria-label={selectable ? "Zgjidhni kapacitetin" : undefined}
      className={cn(
        // fixed 2-up grid on narrow phones so cards stay full-size and
        // readable; auto-fill takes over once there's room to size by content.
        // Used unconditionally (even for a single variant) so a lone card's
        // track width matches a card's width in the 2-/3-card layouts instead
        // of stretching to fill the row.
        "grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(8.25rem,1fr))]"
      )}
    >
      {variants.map((v, i) => {
        const active = selectable && i === selected;
        // with an odd count, let the trailing card span both mobile columns
        // instead of sitting alone with an empty slot beside it
        const isTrailingOdd =
          selectable && variants.length % 2 === 1 && i === variants.length - 1;
        const body = (
          <>
            {selectable && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-2.5 right-2.5 grid h-4.5 w-4.5 place-items-center rounded-full border transition-all duration-200",
                  active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-line-2 bg-surface text-transparent group-hover:border-brand-300"
                )}
              >
                <Check size={11} strokeWidth={3.5} />
              </span>
            )}

            {v.btu !== null && (
              <span
                className={cn(
                  "text-[11px] font-bold tracking-[0.16em] uppercase transition-colors duration-200",
                  active ? "text-brand-600 dark:text-brand-300" : "text-muted"
                )}
              >
                {formatBtu(v.btu)}
              </span>
            )}

            {anySale && (
              <span
                className={cn(
                  "mt-1.5 text-[13px] leading-none font-medium text-muted line-through",
                  !saleVisible(v) && "invisible"
                )}
              >
                {v.oldPrice !== null ? formatEur(v.oldPrice) : " "}
              </span>
            )}

            <span className="mt-1 font-display text-2xl leading-none font-extrabold tracking-tight text-ink sm:text-[26px]">
              {formatEur(v.price)}
            </span>

            {(energyCool || energyHeat) && (
              <span className="mt-3 flex items-start justify-center gap-4">
                {energyCool && <EnergyDot value={energyCool} tone="cool" />}
                {energyHeat && <EnergyDot value={energyHeat} tone="heat" />}
              </span>
            )}
          </>
        );

        const cardCls = cn(
          "group relative flex flex-col items-center rounded-2xl border px-3 pt-5 pb-4 text-center transition-all duration-200",
          isTrailingOdd && "col-span-2 sm:col-span-1",
          active
            ? "border-brand-400 bg-gradient-to-b from-brand-50/80 to-surface ring-1 ring-brand-400/30 card-shadow dark:border-brand-500/50 dark:from-brand-500/10 dark:to-surface"
            : "border-line bg-gradient-to-b from-surface to-surface-2/50"
        );

        return selectable ? (
          <button
            key={v.btu ?? "base"}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(i)}
            className={cn(
              cardCls,
              "cursor-pointer focus-ring active:scale-[0.99]",
              !active && "hover:-translate-y-0.5 hover:border-brand-300 hover:card-shadow dark:hover:border-brand-500/30"
            )}
          >
            {body}
          </button>
        ) : (
          <div key={v.btu ?? "base"} className={cardCls}>
            {body}
          </div>
        );
      })}
    </div>
  );
}

/** Circled-dot energy class marker: frost = cooling, flame = heating. */
function EnergyDot({ value, tone }: { value: string; tone: "cool" | "heat" }) {
  return (
    <span
      className={cn(
        "flex flex-col items-center gap-1",
        tone === "cool"
          ? "text-frost-600 dark:text-frost-400"
          : "text-flame-500 dark:text-flame-400"
      )}
      title={`Klasa energjetike (${tone === "cool" ? "ftohje" : "ngrohje"}): ${value}`}
    >
      <span aria-hidden className="grid h-4.5 w-4.5 place-items-center rounded-full border-2 border-current">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="text-[11px] leading-none font-bold">{value}</span>
    </span>
  );
}
