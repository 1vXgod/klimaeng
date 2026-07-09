"use client";

import { ArrowRight, Check, Minus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { EnergyBadge } from "@/components/ui/EnergyBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "@/components/ui/Toast";
import { useMounted } from "@/lib/hooks";
import { CATEGORY_LABELS, formatEur } from "@/lib/utils";
import { useCart, useCompare } from "@/stores/shop";

type FullProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  render: string;
  accent: string;
  category: string;
  btu: number | null;
  energyCool: string | null;
  energyHeat: string | null;
  coverageM2: number | null;
  seer: number | null;
  scop: number | null;
  noiseDb: number | null;
  wifi: boolean;
  inverter: boolean;
  warrantyYears: number;
  refrigerant: string | null;
  stock: number;
};

export default function ComparePage() {
  const mounted = useMounted();
  const { items, remove, clear } = useCompare();
  const cart = useCart();
  const [catalog, setCatalog] = useState<FullProduct[] | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, []);

  const selected = mounted && catalog
    ? (items
        .map((i) => catalog.find((c) => c.id === i.id))
        .filter(Boolean) as FullProduct[])
    : [];

  const loading = !mounted || catalog === null;

  const rows: { label: string; render: (p: FullProduct) => React.ReactNode }[] = [
    { label: "Çmimi", render: (p) => (
      <div>
        <span className="font-display text-lg font-bold text-ink">{formatEur(p.price)}</span>
        {p.oldPrice && (
          <span className="ml-2 text-xs text-muted line-through">{formatEur(p.oldPrice)}</span>
        )}
      </div>
    )},
    { label: "Kategoria", render: (p) => CATEGORY_LABELS[p.category] ?? p.category },
    { label: "Kapaciteti", render: (p) => (p.btu ? `${p.btu.toLocaleString("de-DE")} BTU` : "—") },
    { label: "Mbulimi", render: (p) => (p.coverageM2 ? `deri ${p.coverageM2} m²` : "—") },
    { label: "Klasa (ftohje)", render: (p) => p.energyCool ? <EnergyBadge value={p.energyCool} mode="cool" size="sm" /> : "—" },
    { label: "Klasa (ngrohje)", render: (p) => p.energyHeat ? <EnergyBadge value={p.energyHeat} mode="heat" size="sm" /> : "—" },
    { label: "SEER / SCOP", render: (p) => `${p.seer ?? "—"} / ${p.scop ?? "—"}` },
    { label: "Zhurma", render: (p) => (p.noiseDb ? `${p.noiseDb} dB` : "—") },
    { label: "Gazi ftohës", render: (p) => p.refrigerant ?? "—" },
    { label: "Inverter", render: (p) => <BoolCell value={p.inverter} /> },
    { label: "Wi-Fi", render: (p) => <BoolCell value={p.wifi} /> },
    { label: "Garancia", render: (p) => `${p.warrantyYears} vjet` },
    { label: "Disponueshmëria", render: (p) =>
      p.stock > 0 ? (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Në stok</span>
      ) : (
        <span className="font-semibold text-red-500">E shitur</span>
      ),
    },
  ];

  return (
    <div className="container-site pt-28 pb-20 md:pt-36">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Krahaso produktet
          </h1>
          <p className="mt-2 text-ink-2">
            Specifikat kryesore, krah për krah — zgjidhni me siguri.
          </p>
        </div>
        {selected.length > 0 && (
          <button
            onClick={() => {
              clear();
              toast("Krahasimi u pastrua", "info");
            }}
            className="rounded-full border border-line-2 px-4 py-2 text-sm font-semibold text-ink-2 transition-colors hover:text-red-500 focus-ring"
          >
            Pastro të gjitha
          </button>
        )}
      </div>

      {loading ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-72 rounded-3xl" />
          ))}
        </div>
      ) : selected.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-24 text-center">
          <p className="font-display text-xl font-bold text-ink">
            S’keni zgjedhur asnjë produkt për krahasim
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Shtypni ikonën e peshores në kartat e produkteve për të shtuar deri
            në 3 produkte, pastaj kthehuni këtu.
          </p>
          <Button href="/produktet" className="mt-6">
            Shfleto Produktet <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-3xl border border-line bg-surface card-shadow">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-40 min-w-32 border-b border-line p-4 text-left align-bottom text-xs font-semibold tracking-wider text-muted uppercase">
                  Specifikat
                </th>
                {selected.map((p) => (
                  <th key={p.id} className="border-b border-line p-4 text-left align-top">
                    <div className="relative">
                      <button
                        onClick={() => remove(p.id)}
                        aria-label={`Hiq ${p.name}`}
                        className="absolute -top-1 -right-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-surface-2 text-muted transition-colors hover:bg-red-50 hover:text-red-500 focus-ring"
                      >
                        <X size={13} />
                      </button>
                      <Link href={`/produktet/${p.slug}`} className="block focus-ring rounded-xl">
                        <div className="h-28 rounded-2xl bg-surface-2">
                          <ProductVisual render={p.render} accent={p.accent} className="h-full w-full p-2" />
                        </div>
                        <p className="mt-2.5 text-[11px] font-bold tracking-widest text-muted uppercase">
                          {p.brand}
                        </p>
                        <p className="font-display text-[15px] leading-snug font-bold text-ink">
                          {p.name}
                        </p>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.label} className={ri % 2 === 0 ? "bg-surface-2/40" : ""}>
                  <th scope="row" className="p-4 text-left align-middle font-medium text-muted">
                    {row.label}
                  </th>
                  {selected.map((p) => (
                    <td key={p.id} className="p-4 align-middle text-ink-2">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4" />
                {selected.map((p) => (
                  <td key={p.id} className="p-4">
                    <button
                      onClick={() => {
                        cart.add({
                          id: p.id, slug: p.slug, name: p.name, brand: p.brand,
                          price: p.price, oldPrice: p.oldPrice, render: p.render,
                          accent: p.accent, category: p.category, btu: p.btu,
                          energyCool: p.energyCool, energyHeat: p.energyHeat,
                        });
                        toast("U shtua në shportë");
                      }}
                      disabled={p.stock <= 0}
                      className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-4 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(36,86,224,0.45)] transition-all hover:shadow-lg active:scale-95 disabled:opacity-40 focus-ring"
                    >
                      <ShoppingBag size={14} /> Shto në shportë
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
      <Check size={15} /> Po
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted">
      <Minus size={15} /> Jo
    </span>
  );
}
