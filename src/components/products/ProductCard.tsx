"use client";

import { motion } from "framer-motion";
import { Heart, Scale, ShoppingBag, Timer, Wifi } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Badge } from "@/components/ui/Badge";
import { EnergyBadge } from "@/components/ui/EnergyBadge";
import { toast } from "@/components/ui/Toast";
import { useLiveDiscount, useMounted } from "@/lib/hooks";
import { cn, discountPercent, formatEur, formatRemaining, type DiscountInfo } from "@/lib/utils";
import { MAX_COMPARE, useCart, useCompare, useWishlist, type ProductSnapshot } from "@/stores/shop";

export type ProductCardData = ProductSnapshot & {
  shortDesc: string;
  coverageM2?: number | null;
  noiseDb?: number | null;
  wifi?: boolean;
  badge?: string | null;
  stock?: number;
  discount: DiscountInfo;
};

export function ProductCard({
  product,
  index = 0,
}: {
  product: ProductCardData;
  index?: number;
}) {
  const mounted = useMounted();
  const cart = useCart();
  const wishlist = useWishlist();
  const compare = useCompare();

  const liveDiscount = useLiveDiscount(product.discount);
  const discount = liveDiscount.active ? discountPercent(product.price, product.oldPrice) : null;
  const inWishlist = mounted && wishlist.has(product.id);
  const inCompare = mounted && compare.has(product.id);
  const soldOut = product.stock !== undefined && product.stock <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.3), ease: [0.21, 0.65, 0.32, 1] }}
      className="group relative flex flex-col rounded-3xl border border-line bg-surface p-4 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:card-shadow-lg dark:hover:border-brand-500/30 sm:p-5"
    >
      {/* top-left badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-1.5">
        {discount && <Badge tone="flame">−{discount}%</Badge>}
        {product.badge && !discount && <Badge tone="brand">{product.badge}</Badge>}
        {soldOut && <Badge tone="red">E shitur</Badge>}
      </div>

      {/* wishlist / compare */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
        <button
          onClick={() => {
            wishlist.toggle(product);
            toast(
              inWishlist ? "U hoq nga lista e dëshirave" : "U shtua në listën e dëshirave",
              "info"
            );
          }}
          aria-label={inWishlist ? "Hiq nga dëshirat" : "Shto në dëshira"}
          aria-pressed={inWishlist}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all focus-ring",
            inWishlist
              ? "border-red-200 bg-red-50 text-red-500 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-400"
              : "border-line bg-surface/90 text-muted hover:text-red-500"
          )}
        >
          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => {
            if (!inCompare && compare.items.length >= MAX_COMPARE) {
              toast(`Mund të krahasoni deri në ${MAX_COMPARE} produkte`, "error");
              return;
            }
            compare.toggle(product);
            toast(inCompare ? "U hoq nga krahasimi" : "U shtua për krahasim", "info");
          }}
          aria-label={inCompare ? "Hiq nga krahasimi" : "Shto për krahasim"}
          aria-pressed={inCompare}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition-all focus-ring",
            inCompare
              ? "border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300"
              : "border-line bg-surface/90 text-muted hover:text-brand-600"
          )}
        >
          <Scale size={16} />
        </button>
      </div>

      {/* visual */}
      <Link
        href={`/produktet/${product.slug}`}
        className="focus-ring block rounded-2xl"
        aria-label={product.name}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-b from-surface-2 to-surface-3/60">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              // unoptimized matches the admin preview: uploads may be SVG,
              // which the image optimizer rejects without dangerouslyAllowSVG
              unoptimized
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <ProductVisual
              render={product.render}
              accent={product.accent}
              className="h-full w-full p-3 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
          )}
        </div>
      </Link>

      {/* info */}
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest text-muted uppercase">
            {product.brand}
          </span>
          {product.wifi && (
            <span title="Kontroll Wi-Fi" className="text-frost-500">
              <Wifi size={13} />
            </span>
          )}
          <span className="ml-auto flex gap-1">
            {product.energyCool && (
              <EnergyBadge value={product.energyCool} mode="cool" size="sm" />
            )}
            {product.energyHeat && (
              <EnergyBadge value={product.energyHeat} mode="heat" size="sm" />
            )}
          </span>
        </div>

        <Link href={`/produktet/${product.slug}`} className="focus-ring mt-1.5 rounded-md">
          <h3 className="font-display text-[15px] leading-snug font-bold text-ink transition-colors group-hover:text-brand-700 dark:group-hover:text-brand-300">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {product.shortDesc}
        </p>

        {(product.btu || product.coverageM2 || product.noiseDb) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.btu && (
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">
                {product.btu.toLocaleString("de-DE")} BTU
              </span>
            )}
            {product.coverageM2 && (
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">
                deri {product.coverageM2} m²
              </span>
            )}
            {product.noiseDb && (
              <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-ink-2">
                {product.noiseDb} dB
              </span>
            )}
          </div>
        )}

        {liveDiscount.active && liveDiscount.remainingMs !== null && (
          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-flame-600 dark:text-flame-300">
            <Timer size={12} className="shrink-0" />
            Zbritja mbaron pas {formatRemaining(liveDiscount.remainingMs)}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            {liveDiscount.active && product.oldPrice && (
              <span className="block text-xs text-muted line-through">
                {formatEur(product.oldPrice)}
              </span>
            )}
            <span className="font-display text-xl font-bold text-ink">
              {formatEur(product.price)}
            </span>
          </div>
          <button
            onClick={() => {
              cart.add(product);
              toast("U shtua në shportë");
            }}
            disabled={soldOut}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(36,86,224,0.45)] transition-all hover:shadow-[0_10px_22px_-4px_rgba(36,86,224,0.55)] active:scale-95 disabled:opacity-40 focus-ring"
          >
            <ShoppingBag size={15} />
            Blej
          </button>
        </div>
      </div>
    </motion.article>
  );
}
