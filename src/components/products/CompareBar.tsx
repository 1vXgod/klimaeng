"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductVisual } from "@/components/renders/ProductRender";
import { useMounted } from "@/lib/hooks";
import { useCompare, MAX_COMPARE } from "@/stores/shop";

/** Sticky bottom bar that appears when products are queued for comparison. */
export function CompareBar() {
  const mounted = useMounted();
  const pathname = usePathname();
  const { items, remove, clear } = useCompare();

  const visible = mounted && items.length > 0 && pathname !== "/krahaso";

  return (
    <AnimatePresence>
      {visible && (
        /* right offset + width cap keep the chat launcher reachable at every width */
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="fixed bottom-3 left-3 right-[4.75rem] z-80 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[min(36rem,calc(100vw-11rem))] sm:-translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-3xl border border-line bg-surface/95 p-3 backdrop-blur-lg card-shadow-lg">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto no-scrollbar">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative h-13 w-16 shrink-0 rounded-xl border border-line bg-surface-2"
                  title={item.name}
                >
                  <ProductVisual render={item.render} accent={item.accent} className="h-full w-full p-1" glow={false} />
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`Hiq ${item.name} nga krahasimi`}
                    className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-night-900 text-white transition-transform hover:scale-110"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {Array.from({ length: MAX_COMPARE - items.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="grid h-13 w-16 shrink-0 place-items-center rounded-xl border border-dashed border-line-2 text-[10px] font-medium text-muted"
                >
                  + Shto
                </div>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={clear}
                className="hidden rounded-full px-3 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink sm:block"
              >
                Pastro
              </button>
              <Link
                href="/krahaso"
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(36,86,224,0.5)] transition-all hover:shadow-[0_10px_24px_-6px_rgba(36,86,224,0.6)] active:scale-95 focus-ring"
              >
                Krahaso ({items.length})
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
