"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard, type ProductCardData } from "@/components/products/ProductCard";
import { CATEGORY_LABELS, cn } from "@/lib/utils";

const SORTS = [
  { id: "newest", label: "Më të rejat" },
  { id: "price-asc", label: "Çmimi: i ulët → i lartë" },
  { id: "price-desc", label: "Çmimi: i lartë → i ulët" },
  { id: "discount", label: "Zbritja më e madhe" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

export type ExplorerProduct = ProductCardData & {
  inverter?: boolean;
  createdAt: string;
};

export function ProductExplorer({
  products,
  initialCategory,
}: {
  products: ExplorerProduct[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(
    initialCategory && CATEGORY_LABELS[initialCategory] ? initialCategory : "ALL"
  );
  const [sort, setSort] = useState<SortId>("newest");
  const [onlyWifi, setOnlyWifi] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = ["ALL", ...Object.keys(CATEGORY_LABELS)];

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "ALL") list = list.filter((p) => p.category === category);
    if (onlyWifi) list = list.filter((p) => p.wifi);
    if (onlyDiscount) list = list.filter((p) => p.discount.active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "discount": {
        const ratio = (p: ExplorerProduct) =>
          p.discount.active ? ((p.oldPrice ?? p.price) - p.price) / (p.oldPrice ?? p.price) : 0;
        list.sort((a, b) => ratio(b) - ratio(a));
        break;
      }
      default:
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [products, category, query, sort, onlyWifi, onlyDiscount]);

  const activeFilterCount = (onlyWifi ? 1 : 0) + (onlyDiscount ? 1 : 0);

  return (
    <div>
      {/* toolbar */}
      <div className="sticky top-16 z-40 -mx-5 border-b border-line bg-bg/85 px-5 py-3 backdrop-blur-lg md:top-[4.5rem] sm:-mx-7 sm:px-7 lg:-mx-8 lg:px-8">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* search */}
          <div className="relative min-w-0 flex-1 basis-56">
            <Search size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kërko produkt, markë…"
              aria-label="Kërko produkte"
              className="h-11 w-full rounded-full border border-line-2 bg-surface pr-9 pl-10 text-sm text-ink placeholder:text-muted transition-colors focus:border-brand-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Pastro kërkimin"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted hover:text-ink"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            aria-label="Rendit produktet"
            className="h-11 cursor-pointer rounded-full border border-line-2 bg-surface px-4 text-sm font-medium text-ink focus:border-brand-400 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          {/* filter toggle */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-ring",
              filtersOpen || activeFilterCount > 0
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
                : "border-line-2 bg-surface text-ink-2 hover:text-ink"
            )}
          >
            <SlidersHorizontal size={15} />
            Filtra
            {activeFilterCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* categories */}
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-all focus-ring",
                category === cat
                  ? "border-brand-600 bg-brand-600 text-white shadow-[0_4px_12px_-2px_rgba(36,86,224,0.4)]"
                  : "border-line-2 bg-surface text-ink-2 hover:border-brand-300 hover:text-brand-700 dark:hover:text-brand-300"
              )}
            >
              {cat === "ALL" ? "Të gjitha" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* expandable extra filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-3">
                <FilterChip active={onlyDiscount} onClick={() => setOnlyDiscount((v) => !v)}>
                  Në zbritje
                </FilterChip>
                <FilterChip active={onlyWifi} onClick={() => setOnlyWifi((v) => !v)}>
                  Me Wi-Fi
                </FilterChip>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* results */}
      <div className="mt-7">
        <p className="mb-5 text-sm text-muted" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "produkt i gjetur" : "produkte të gjetura"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-20 text-center">
            <p className="font-display text-lg font-bold text-ink">Asnjë produkt nuk përputhet</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Provoni të hiqni disa filtra ose të ndryshoni termin e kërkimit.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("ALL");
                setOnlyWifi(false);
                setOnlyDiscount(false);
              }}
              className="mt-5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-ring"
            >
              Pastro të gjithë filtrat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i % 8} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all focus-ring",
        active
          ? "border-frost-500 bg-frost-500/10 text-frost-600 dark:text-frost-300"
          : "border-line-2 bg-surface text-ink-2 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
