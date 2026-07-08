"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { useMounted } from "@/lib/hooks";
import { formatEur } from "@/lib/utils";
import { useCart, useWishlist } from "@/stores/shop";

export function WishlistGrid({ columns = 3 }: { columns?: 2 | 3 }) {
  const mounted = useMounted();
  const { items, remove } = useWishlist();
  const cart = useCart();

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-20 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
          <Heart size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-bold text-ink">Lista juaj është bosh</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Shtypni zemrën ♡ në çdo produkt për ta ruajtur këtu.
        </p>
        <Button href="/produktet" className="mt-6">
          Shfleto Produktet <ArrowRight size={16} />
        </Button>
      </div>
    );
  }

  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.li
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="flex gap-4 rounded-3xl border border-line bg-surface p-4 card-shadow"
          >
            <Link
              href={`/produktet/${item.slug}`}
              className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface-2 focus-ring"
            >
              <ProductVisual render={item.render} accent={item.accent} className="h-full w-full p-1.5" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="text-[11px] font-bold tracking-widest text-muted uppercase">
                {item.brand}
              </p>
              <Link href={`/produktet/${item.slug}`} className="focus-ring rounded-md">
                <h2 className="truncate font-display text-[15px] font-bold text-ink hover:text-brand-700 dark:hover:text-brand-300">
                  {item.name}
                </h2>
              </Link>
              <p className="mt-0.5 font-display text-lg font-bold text-ink">
                {formatEur(item.price)}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    cart.add(item);
                    toast("U shtua në shportë");
                  }}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-3.5 text-xs font-semibold text-white transition-all hover:shadow-md active:scale-95 focus-ring"
                >
                  <ShoppingBag size={13} /> Në shportë
                </button>
                <button
                  onClick={() => {
                    remove(item.id);
                    toast("U hoq nga lista", "info");
                  }}
                  aria-label={`Hiq ${item.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-line-2 text-muted transition-colors hover:border-red-200 hover:text-red-500 focus-ring"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
