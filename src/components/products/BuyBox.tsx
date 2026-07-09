"use client";

import { Check, Heart, Minus, Plus, Scale, ShieldCheck, ShoppingBag, Timer, Truck, Wrench } from "lucide-react";
import { useState } from "react";
import { BtuPricingCards } from "@/components/products/BtuPricingCards";
import { Badge } from "@/components/ui/Badge";
import { EnergyBadge } from "@/components/ui/EnergyBadge";
import { toast } from "@/components/ui/Toast";
import { useLiveDiscount, useMounted } from "@/lib/hooks";
import { cn, discountPercent, formatRemaining, type BtuVariant, type DiscountInfo } from "@/lib/utils";
import { MAX_COMPARE, useCart, useCompare, useWishlist, type ProductSnapshot } from "@/stores/shop";

export type BuyBoxProduct = ProductSnapshot & {
  shortDesc: string;
  stock: number;
  warrantyYears: number;
  badge?: string | null;
  discount: DiscountInfo;
  /** Enabled BTU price variants, base capacity first (see getBtuVariants). */
  variants: BtuVariant[];
};

export function BuyBox({ product }: { product: BuyBoxProduct }) {
  const mounted = useMounted();
  const [qty, setQty] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const cart = useCart();
  const wishlist = useWishlist();
  const compare = useCompare();

  const selected = product.variants[selectedIdx] ?? product.variants[0];
  const isBaseSelected = selected === product.variants[0];

  // Tick the shared product-level window even when only a variant (not the
  // base pair) carries the sale, so the countdown chip still shows.
  const timerDiscount =
    product.variants.find((v) => v.discount.endsAt)?.discount ?? product.discount;
  const liveDiscount = useLiveDiscount(timerDiscount);
  const saleActive =
    selected.discount.active && (!selected.discount.endsAt || liveDiscount.active);
  const discount = saleActive ? discountPercent(selected.price, selected.oldPrice) : null;
  const inWishlist = mounted && wishlist.has(product.id);
  const inCompare = mounted && compare.has(product.id);
  const lowStock = product.stock > 0 && product.stock <= 5;
  const soldOut = product.stock <= 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold tracking-[0.2em] text-muted uppercase">
          {product.brand}
        </span>
        {product.badge && <Badge tone="brand">{product.badge}</Badge>}
        {discount && <Badge tone="flame">−{discount}% zbritje</Badge>}
      </div>

      <h1 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
        {product.name}
      </h1>

      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{product.shortDesc}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {product.energyCool && <EnergyBadge value={product.energyCool} mode="cool" />}
        {product.energyHeat && <EnergyBadge value={product.energyHeat} mode="heat" />}
        {(selected.btu ?? product.btu) && (
          <span className="rounded-lg bg-surface-2 px-2.5 py-1 text-xs font-bold text-ink-2">
            {(selected.btu ?? product.btu)!.toLocaleString("de-DE")} BTU
          </span>
        )}
      </div>

      {/* price — one selectable card per enabled BTU variant */}
      <div className="mt-6">
        <BtuPricingCards
          variants={product.variants}
          selected={selectedIdx}
          onSelect={setSelectedIdx}
          energyCool={product.energyCool}
          energyHeat={product.energyHeat}
        />
      </div>
      <p className="mt-2 text-xs text-muted">Përfshirë TVSH-në · Pa kosto të fshehura</p>
      {liveDiscount.active && liveDiscount.remainingMs !== null && (
        <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-flame-200 bg-flame-50 px-3 py-1 text-xs font-semibold text-flame-600 dark:border-flame-500/25 dark:bg-flame-500/10 dark:text-flame-300">
          <Timer size={13} className="shrink-0" />
          Zbritja mbaron pas {formatRemaining(liveDiscount.remainingMs)}
        </p>
      )}

      {/* availability */}
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold" aria-live="polite">
        {soldOut ? (
          <><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-red-500">E shitur — na kontaktoni për porosi paraprake</span></>
        ) : lowStock ? (
          <><span className="h-2 w-2 animate-pulse-soft rounded-full bg-amber-500" /><span className="text-amber-600 dark:text-amber-400">Vetëm {product.stock} copë në stok</span></>
        ) : (
          <><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-emerald-600 dark:text-emerald-400">Në stok — gati për montim në 48 orë</span></>
        )}
      </div>

      {/* qty + actions */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex h-13 items-center rounded-full border border-line-2 bg-surface">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Zvogëlo sasinë"
            className="px-4 text-muted transition-colors hover:text-ink focus-ring rounded-l-full"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-display text-lg font-bold text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(9, q + 1))}
            aria-label="Rrit sasinë"
            className="px-4 text-muted transition-colors hover:text-ink focus-ring rounded-r-full"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => {
            // A clean snapshot at the selected variant's price — spreading
            // `product` would persist variants/stock/etc. into localStorage.
            cart.add(
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: selected.price,
                oldPrice: selected.oldPrice,
                render: product.render,
                accent: product.accent,
                imageUrl: product.imageUrl,
                category: product.category,
                btu: selected.btu ?? product.btu,
                energyCool: product.energyCool,
                energyHeat: product.energyHeat,
                variantBtu: isBaseSelected ? null : selected.btu,
              },
              qty
            );
            toast("U shtua në shportë");
          }}
          disabled={soldOut}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-6px_rgba(36,86,224,0.55)] transition-all hover:shadow-[0_14px_30px_-6px_rgba(36,86,224,0.6)] active:scale-[0.98] disabled:opacity-40 focus-ring min-w-44"
        >
          <ShoppingBag size={18} />
          Shto në Shportë
        </button>

        <button
          onClick={() => {
            wishlist.toggle(product);
            toast(inWishlist ? "U hoq nga dëshirat" : "U shtua në dëshira", "info");
          }}
          aria-label="Shto në listën e dëshirave"
          aria-pressed={inWishlist}
          className={cn(
            "grid h-13 w-13 place-items-center rounded-full border transition-all focus-ring",
            inWishlist
              ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
              : "border-line-2 bg-surface text-muted hover:text-red-500"
          )}
        >
          <Heart size={19} fill={inWishlist ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => {
            if (!inCompare && compare.items.length >= MAX_COMPARE) {
              toast(`Maksimumi ${MAX_COMPARE} produkte në krahasim`, "error");
              return;
            }
            compare.toggle(product);
            toast(inCompare ? "U hoq nga krahasimi" : "U shtua për krahasim", "info");
          }}
          aria-label="Shto për krahasim"
          aria-pressed={inCompare}
          className={cn(
            "grid h-13 w-13 place-items-center rounded-full border transition-all focus-ring",
            inCompare
              ? "border-brand-300 bg-brand-50 text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
              : "border-line-2 bg-surface text-muted hover:text-brand-600"
          )}
        >
          <Scale size={19} />
        </button>
      </div>

      {/* assurance strip */}
      <ul className="mt-7 grid gap-3 rounded-2xl border border-line bg-surface-2/60 p-5 sm:grid-cols-2">
        <li className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
          <Wrench size={16} className="shrink-0 text-brand-500" />
          Montim profesional në 48 orë
        </li>
        <li className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
          <ShieldCheck size={16} className="shrink-0 text-brand-500" />
          Garanci {product.warrantyYears} vjet
        </li>
        <li className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
          <Truck size={16} className="shrink-0 text-brand-500" />
          Transport falas në Prishtinë
        </li>
        <li className="flex items-center gap-2.5 text-[13px] font-medium text-ink-2">
          <Check size={16} className="shrink-0 text-brand-500" />
          Pagesë me këste 6–24 muaj
        </li>
      </ul>
    </div>
  );
}
