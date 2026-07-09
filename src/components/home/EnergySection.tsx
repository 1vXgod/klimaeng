"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EnergyBadge } from "@/components/ui/EnergyBadge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { formatEur, recommendBtu } from "@/lib/utils";
import type { ProductSnapshot } from "@/stores/shop";

const CLASSES = [
  { label: "A+++", width: 34, color: "#00934c" },
  { label: "A++", width: 44, color: "#4bb748" },
  { label: "A+", width: 54, color: "#bfd630" },
  { label: "A", width: 64, color: "#fef200" },
  { label: "B", width: 74, color: "#fdb813" },
  { label: "C", width: 84, color: "#f37021" },
  { label: "D", width: 94, color: "#ed1c24" },
];

export function EnergySection({ products }: { products: ProductSnapshot[] }) {
  const [area, setArea] = useState(30);

  const btu = recommendBtu(area);
  const match = useMemo(() => {
    const candidates = products
      .filter((p) => p.btu && p.btu >= btu * 0.95)
      .sort((a, b) => (a.btu ?? 0) - (b.btu ?? 0) || a.price - b.price);
    return candidates[0] ?? null;
  }, [products, btu]);

  // Rough seasonal estimate: inverter A++ vs old class C unit for this size.
  const oldCost = Math.round((btu / 1000) * 22);
  const newCost = Math.round(oldCost * 0.6);

  return (
    <section className="relative overflow-hidden bg-night-950 py-20 text-white md:py-28" aria-label="Efiçienca energjetike">
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-40" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 26rem at 85% 0%, rgba(14,170,205,0.16), transparent 60%), radial-gradient(36rem 26rem at 0% 100%, rgba(36,86,224,0.22), transparent 60%)",
        }}
      />

      <div className="container-site relative">
        <SectionHeading
          dark
          eyebrow="Efiçienca energjetike"
          title="Sa kushton vërtet komforti juaj?"
          description="Zvarritni rrëshqitësin dhe shihni kapacitetin e rekomanduar për hapësirën tuaj — plus sa kurseni me një inverter modern."
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* calculator */}
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur md:p-9">
              <div className="flex items-center justify-between">
                <label htmlFor="area-slider" className="flex items-center gap-2.5 font-display font-bold">
                  <Home size={18} className="text-frost-300" />
                  Sipërfaqja e hapësirës
                </label>
                <span className="rounded-full bg-frost-500/15 px-4 py-1 font-display text-lg font-bold text-frost-300">
                  {area} m²
                </span>
              </div>

              <input
                id="area-slider"
                type="range"
                min={10}
                max={140}
                step={5}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-frost-400"
                aria-valuetext={`${area} metra katrorë`}
              />
              <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                <span>10 m²</span>
                <span>70 m²</span>
                <span>140 m²</span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-night-900/70 p-5">
                  <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Kapaciteti i rekomanduar
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-bold text-white">
                    <motion.span
                      key={btu}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block"
                    >
                      {btu.toLocaleString("de-DE")}
                    </motion.span>{" "}
                    <span className="text-sm font-semibold text-slate-400">BTU</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-night-900/70 p-5">
                  <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Kursimi sezonal*
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-bold text-emerald-400">
                    <motion.span
                      key={oldCost - newCost}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block"
                    >
                      ~{formatEur(oldCost - newCost)}
                    </motion.span>
                  </p>
                </div>
              </div>

              {match && (
                <Link
                  href={`/produktet/${match.slug}`}
                  className="group mt-5 flex items-center justify-between gap-3 rounded-2xl border border-frost-400/25 bg-frost-500/10 px-5 py-4 transition-colors hover:bg-frost-500/15 focus-ring"
                >
                  <div>
                    <p className="text-xs font-medium text-frost-300">Rekomandimi ynë për {area} m²</p>
                    <p className="mt-0.5 font-display text-[15px] font-bold text-white">
                      {match.name} — {formatEur(match.price)}
                    </p>
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-frost-300 transition-transform group-hover:translate-x-1" />
                </Link>
              )}

              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <Lightbulb size={14} className="mt-0.5 shrink-0" />
                *Vlerësim orientues për sezon 5-mujor ftohjeje krahasuar me pajisje të vjetër klase C. Për llogaritje të saktë, kërkoni konsultën falas.
              </p>
            </div>
          </Reveal>

          {/* energy label */}
          <Reveal delay={0.12}>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur md:p-9">
              <h3 className="font-display text-lg font-bold">Shkalla evropiane e efiçiencës</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Çdo produkt në katalogun tonë mban etiketën zyrtare të BE-së. Sa më lart në shkallë, aq më pak paguani çdo muaj.
              </p>
              <div className="mt-6 flex-1 space-y-2">
                {CLASSES.map((cls, i) => (
                  <motion.div
                    key={cls.label}
                    initial={{ opacity: 0, x: -22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="flex h-8 items-center pr-3 pl-3 text-[13px] font-bold text-white"
                      style={{
                        width: `${cls.width}%`,
                        background: cls.color,
                        clipPath:
                          "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                        textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                      }}
                    >
                      {cls.label}
                    </span>
                    {cls.label === "A+++" && (
                      <span className="text-[11px] font-semibold whitespace-nowrap text-emerald-400">
                        ← Gama jonë premium
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-slate-300">
                Kërkoni etiketat
                <EnergyBadge value="A++" size="sm" />
                dhe
                <EnergyBadge value="A+++" size="sm" />
                në çdo kartë produkti.
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
