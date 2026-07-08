"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Search, Star, StarOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { deleteProducts, setProductsFeatured } from "@/app/actions/admin";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { CATEGORY_LABELS, cn, formatEur } from "@/lib/utils";

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  featured: boolean;
  render: string;
  accent: string;
};

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "ALL") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, query, category]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(filtered.map((p) => p.id)));
  };
  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkFeature = (featured: boolean) => {
    startTransition(async () => {
      const result = await setProductsFeatured([...selected], featured);
      if (result.ok) {
        toast(featured ? "U shënuan si të zgjedhura" : "U hoqën nga të zgjedhurat");
        setSelected(new Set());
        router.refresh();
      }
    });
  };

  const bulkDelete = () => {
    startTransition(async () => {
      const result = await deleteProducts([...selected]);
      if (result.ok) {
        toast(`${selected.size} produkte u fshinë`, "info");
        setSelected(new Set());
        setConfirmDelete(false);
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-0 flex-1 basis-56">
          <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko produkt…"
            aria-label="Kërko produkte"
            className="h-10 w-full rounded-full border border-line-2 bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand-400 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filtro sipas kategorisë"
          className="h-10 cursor-pointer rounded-full border border-line-2 bg-surface px-4 text-sm font-medium text-ink focus:border-brand-400 focus:outline-none"
        >
          <option value="ALL">Të gjitha kategoritë</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <Button href="/admin/produktet/i-ri" size="sm" className="ml-auto rounded-full">
          <Plus size={15} /> Produkt i ri
        </Button>
      </div>

      {/* bulk bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50/70 px-4 py-2.5 dark:border-brand-500/25 dark:bg-brand-500/10"
          >
            <span className="text-sm font-bold text-brand-700 dark:text-brand-300">
              {selected.size} të zgjedhura
            </span>
            <span className="mx-1 h-4 w-px bg-brand-200 dark:bg-brand-500/30" />
            <button
              onClick={() => bulkFeature(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-white hover:text-ink focus-ring disabled:opacity-50 dark:hover:bg-white/10"
            >
              <Star size={13} /> Shëno si të zgjedhur
            </button>
            <button
              onClick={() => bulkFeature(false)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:bg-white hover:text-ink focus-ring disabled:opacity-50 dark:hover:bg-white/10"
            >
              <StarOff size={13} /> Hiq nga të zgjedhurit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 focus-ring disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 size={13} /> Fshi
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* table */}
      <div className="overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-muted uppercase">
                <th className="w-12 px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Zgjidh të gjitha"
                    className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                  />
                </th>
                <th className="px-3 py-3.5">Produkti</th>
                <th className="px-4 py-3.5">Kategoria</th>
                <th className="px-4 py-3.5 text-right">Çmimi</th>
                <th className="px-4 py-3.5 text-center">Stoku</th>
                <th className="px-4 py-3.5 text-center">Statusi</th>
                <th className="px-5 py-3.5 sr-only">Veprime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className={cn(
                    "transition-colors hover:bg-surface-2/50",
                    selected.has(product.id) && "bg-brand-50/40 dark:bg-brand-500/5"
                  )}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product.id)}
                      onChange={() => toggle(product.id)}
                      aria-label={`Zgjidh ${product.name}`}
                      className="h-4 w-4 cursor-pointer rounded accent-brand-600"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                        <ProductVisual
                          render={product.render}
                          accent={product.accent}
                          className="h-full w-full p-0.5"
                          glow={false}
                        />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/produktet/${product.id}`}
                          className="block truncate font-semibold text-ink hover:text-brand-700 focus-ring rounded-md dark:hover:text-brand-300"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-2">
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="font-display font-bold text-ink [font-variant-numeric:tabular-nums]">
                      {formatEur(product.price)}
                    </p>
                    {product.oldPrice && (
                      <p className="text-xs text-muted line-through [font-variant-numeric:tabular-nums]">
                        {formatEur(product.oldPrice)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-bold",
                        product.stock === 0
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : product.stock <= 5
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      )}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.featured ? <Badge tone="brand">E zgjedhur</Badge> : <Badge>—</Badge>}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/produktet/${product.id}`}
                      aria-label={`Ndrysho ${product.name}`}
                      className="inline-grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-ring"
                    >
                      <Pencil size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-sm text-muted">
                    Asnjë produkt nuk përputhet me filtrat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* confirm delete */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title={`Fshi ${selected.size} produkte?`}
      >
        <p className="text-sm leading-relaxed text-ink-2">
          Ky veprim është i pakthyeshëm. Produktet do të hiqen nga katalogu —
          porositë ekzistuese i ruajnë të dhënat e tyre.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
            Anulo
          </Button>
          <Button variant="danger" onClick={bulkDelete} disabled={isPending}>
            <Trash2 size={15} /> Fshi përfundimisht
          </Button>
        </div>
      </Modal>
    </div>
  );
}
