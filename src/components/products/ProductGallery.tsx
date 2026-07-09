"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ProductRender, ProductVisual } from "@/components/renders/ProductRender";
import { cn } from "@/lib/utils";

type View = "studio" | "ambient" | "blueprint";

const VIEWS: { id: View; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "ambient", label: "Në ambient" },
  { id: "blueprint", label: "Teknike" },
];

export function ProductGallery({
  render,
  accent,
  name,
  images = [],
}: {
  render: string;
  accent: string;
  name: string;
  /** Uploaded photos; when non-empty they fully replace the SVG render views. */
  images?: string[];
}) {
  // Uploaded photos win outright — no mixing with the generated views.
  if (images.length > 0) {
    return <PhotoGallery images={images} name={name} />;
  }
  return <RenderGallery render={render} accent={accent} name={name} />;
}

function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <div className="relative h-full w-full bg-gradient-to-b from-surface-2 to-surface-3/50">
              <Image
                src={current}
                alt={name}
                fill
                // unoptimized matches the admin preview: uploads may be SVG,
                // which the image optimizer rejects without dangerouslyAllowSVG
                unoptimized
                className="object-contain p-6 sm:p-10"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label={`Imazhet e ${name}`}>
          {images.map((url, i) => (
            <button
              key={url}
              role="tab"
              aria-selected={active === i}
              aria-label={`Imazhi ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-2xl border transition-all focus-ring",
                active === i
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10"
                  : "border-line bg-surface hover:border-brand-200"
              )}
            >
              <Image src={url} alt="" fill unoptimized className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RenderGallery({
  render,
  accent,
  name,
}: {
  render: string;
  accent: string;
  name: string;
}) {
  const [view, setView] = useState<View>("studio");

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {view === "studio" && (
              <div className="relative h-full w-full bg-gradient-to-b from-surface-2 to-surface-3/50">
                <ProductVisual render={render} accent={accent} className="h-full w-full p-6 sm:p-10" />
              </div>
            )}

            {view === "ambient" && (
              <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#e8edf4] to-[#cfd8e4] dark:from-[#1a2436] dark:to-[#101724]">
                {/* window light */}
                <div
                  aria-hidden
                  className="absolute top-0 right-[8%] h-3/4 w-1/3 bg-gradient-to-b from-amber-100/50 to-transparent dark:from-amber-200/10"
                  style={{ clipPath: "polygon(20% 0, 100% 0, 80% 100%, 0 100%)" }}
                />
                {/* floor */}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-[#b9c4d3] to-[#a5b1c2] dark:from-[#0c1220] dark:to-[#080d18]" />
                <div aria-hidden className="absolute inset-x-0 bottom-[22%] h-px bg-[#94a1b5] dark:bg-white/10" />
                {/* plant silhouette */}
                <svg aria-hidden viewBox="0 0 100 160" className="absolute bottom-[12%] left-[6%] h-2/5 opacity-25 dark:opacity-20">
                  <path d="M50 160 L50 70 M50 100 Q20 80 18 50 M50 90 Q80 76 84 44 M50 76 Q30 60 32 30 M50 82 Q68 58 62 26" stroke="#3d5a48" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
                <div className="absolute top-[12%] left-1/2 w-3/4 max-w-md -translate-x-1/2 sm:w-2/3">
                  <ProductRender render={render} accent={accent} className="w-full drop-shadow-xl" />
                </div>
              </div>
            )}

            {view === "blueprint" && (
              <div className="relative h-full w-full bg-night-950">
                <div aria-hidden className="absolute inset-0 blueprint-grid opacity-100" />
                <div className="absolute top-1/2 left-1/2 w-3/4 max-w-md -translate-x-1/2 -translate-y-1/2">
                  <ProductRender render={render} accent={accent} className="w-full opacity-90" />
                  {/* dimension lines */}
                  <div aria-hidden className="absolute inset-x-[8%] -bottom-7 flex items-center gap-2 text-frost-300/80">
                    <span className="h-px flex-1 bg-current" />
                    <span className="font-mono text-[10px] tracking-wider">
                      {render === "standing" || render === "boiler" ? "H: 1780 mm" : "L: 1020 mm"}
                    </span>
                    <span className="h-px flex-1 bg-current" />
                  </div>
                  <div aria-hidden className="absolute top-[6%] -right-5 bottom-[12%] flex flex-col items-center gap-2 text-frost-300/80 sm:-right-8">
                    <span className="w-px flex-1 bg-current" />
                    <span className="font-mono text-[10px] tracking-wider" style={{ writingMode: "vertical-rl" }}>
                      {render === "standing" || render === "boiler" ? "Ø 480 mm" : "H: 315 mm"}
                    </span>
                    <span className="w-px flex-1 bg-current" />
                  </div>
                </div>
                <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[0.25em] text-frost-300/60 uppercase">
                  KlimaENG · Specifikim teknik
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* thumbnails */}
      <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label={`Pamjet e ${name}`}>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border py-2 transition-all focus-ring",
              view === v.id
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10"
                : "border-line bg-surface hover:border-brand-200"
            )}
          >
            <div className={cn("mx-auto h-12 w-16", v.id === "blueprint" && "rounded-lg bg-night-950 p-1")}>
              <ProductRender render={render} accent={accent} className="h-full w-full" />
            </div>
            <span
              className={cn(
                "mt-1 block text-center text-[11px] font-semibold",
                view === v.id ? "text-brand-700 dark:text-brand-300" : "text-muted"
              )}
            >
              {v.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
