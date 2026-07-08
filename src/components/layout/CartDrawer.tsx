"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ProductVisual } from "@/components/renders/ProductRender";
import { formatEur } from "@/lib/utils";
import { useCart } from "@/stores/shop";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100">
          <motion.div
            className="absolute inset-0 bg-night-950/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-label="Shporta juaj"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-surface shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-lg font-bold text-ink">
                Shporta{" "}
                {items.length > 0 && (
                  <span className="text-sm font-semibold text-muted">
                    ({items.reduce((a, i) => a + i.qty, 0)} artikuj)
                  </span>
                )}
              </h2>
              <button
                onClick={close}
                aria-label="Mbyll shportën"
                className="rounded-full p-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-ring"
              >
                <X size={19} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
                  <ShoppingBag size={26} />
                </span>
                <div>
                  <p className="font-display font-bold text-ink">Shporta është bosh</p>
                  <p className="mt-1 text-sm text-muted">
                    Shfletoni katalogun dhe gjeni klimën perfekte për hapësirën tuaj.
                  </p>
                </div>
                <Button href="/produktet" onClick={close}>
                  Shiko Produktet
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className="flex gap-4 py-4"
                    >
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                        <ProductVisual render={item.render} accent={item.accent} className="h-full w-full p-1.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                        <p className="mt-0.5 text-xs text-muted">{item.brand}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-line-2">
                            <button
                              onClick={() => setQty(item.id, item.qty - 1)}
                              aria-label="Zvogëlo sasinë"
                              className="p-1.5 text-muted transition-colors hover:text-ink focus-ring rounded-l-full"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-ink">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => setQty(item.id, item.qty + 1)}
                              aria-label="Rrit sasinë"
                              className="p-1.5 text-muted transition-colors hover:text-ink focus-ring rounded-r-full"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className="text-sm font-bold text-ink">
                              {formatEur(item.price * item.qty)}
                            </span>
                            <button
                              onClick={() => remove(item.id)}
                              aria-label={`Hiq ${item.name}`}
                              className="rounded-full p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-500 focus-ring dark:hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                <div className="space-y-3 border-t border-line p-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Nëntotali</span>
                    <span className="font-display text-lg font-bold text-ink">
                      {formatEur(total)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted">
                    Montimi profesional dhe transporti llogariten pas konfirmimit të
                    porosisë — pa pagesë paraprake online.
                  </p>
                  <Button href="/porosia" size="lg" className="w-full" onClick={close}>
                    Vazhdo me Porosinë
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
