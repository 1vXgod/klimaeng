import { Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/products/BuyBox";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import {
  CapacityEnergyLabel,
  CapacityProvider,
  SpecsTable,
  type EnergyEntry,
  type SpecsEntry,
} from "@/components/products/ProductSpecs";
import { Reveal } from "@/components/ui/Reveal";
import { getProductBySlug, getSimilarProducts, toSnapshot } from "@/lib/products";
import {
  CATEGORY_LABELS,
  formatBtu,
  getBtuVariants,
  getDiscountInfo,
  parseFeatures,
  parseImages,
  parseSpecs,
  specDisplayRows,
  specsFromFlat,
} from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produkti nuk u gjet" };
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: { title: `${product.name} — KlimaENG`, description: product.shortDesc },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const similar = await getSimilarProducts(product, 4);
  const features = parseFeatures(product.features);
  const variants = getBtuVariants(product);

  // Per-capacity specifications, one entry per purchasable variant. A
  // capacity without its own specs (and legacy products with an empty
  // `specs` column) falls back to the base capacity's values, which in
  // turn fall back to the flat spec columns.
  const parsedSpecs = parseSpecs(product.specs);
  const baseSpec = parsedSpecs[String(product.btu ?? 12000)] ?? specsFromFlat(product);
  const specFor = (btu: number | null, i: number) =>
    i === 0 ? baseSpec : ((btu !== null && parsedSpecs[String(btu)]) || baseSpec);

  const specEntries: SpecsEntry[] = variants.map((v, i) => {
    const spec = specFor(v.btu, i);
    return {
      btu: v.btu,
      rows: [
        ["Marka", product.brand],
        ["Kategoria", CATEGORY_LABELS[product.category] ?? product.category],
        ...(v.btu !== null ? ([["Kapaciteti", formatBtu(v.btu)]] as [string, string][]) : []),
        ...specDisplayRows(spec),
        ["Teknologji inverter", product.inverter ? "Po" : "Jo"],
        ["Kontroll Wi-Fi", product.wifi ? "Po" : "Jo"],
        ["Garancia", `${product.warrantyYears} vjet`],
      ],
    };
  });

  const energyEntries: EnergyEntry[] = variants.map((v, i) => {
    const spec = specFor(v.btu, i);
    if (!spec.energyCool && !spec.energyHeat) return null;
    return {
      energyCool: spec.energyCool ?? null,
      energyHeat: spec.energyHeat ?? null,
      seer: spec.seer ?? null,
      scop: spec.scop ?? null,
      noiseDb: spec.noiseDb ?? null,
    };
  });
  const hasEnergyLabel = energyEntries.some(Boolean);

  // Buy-box variants carry their own capacity's energy classes so the
  // badges by the title, the pricing-card markers and the cart snapshot
  // all follow the selected capacity instead of the base columns.
  const buyBoxVariants = variants.map((v, i) => {
    const spec = specFor(v.btu, i);
    return {
      ...v,
      energyCool: spec.energyCool ?? null,
      energyHeat: spec.energyHeat ?? null,
    };
  });

  return (
    <div className="pt-24 pb-20 md:pt-32">
      <CapacityProvider>
      <div className="container-site">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-muted">
          <Link href="/" className="transition-colors hover:text-ink">Ballina</Link>
          <ChevronRight size={13} />
          <Link href="/produktet" className="transition-colors hover:text-ink">Produktet</Link>
          <ChevronRight size={13} />
          <Link
            href={`/produktet?kategoria=${product.category}`}
            className="transition-colors hover:text-ink"
          >
            {CATEGORY_LABELS[product.category] ?? product.category}
          </Link>
          <ChevronRight size={13} />
          <span className="truncate font-medium text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <Reveal>
            <ProductGallery
              render={product.render}
              accent={product.accent}
              name={product.name}
              images={parseImages(product.images, product.imageUrl)}
            />
          </Reveal>
          <Reveal delay={0.08}>
            <BuyBox
              product={{
                ...toSnapshot(product),
                shortDesc: product.shortDesc,
                stock: product.stock,
                warrantyYears: product.warrantyYears,
                badge: product.badge,
                discount: getDiscountInfo(product),
                variants: buyBoxVariants,
              }}
            />
          </Reveal>
        </div>

        {/* description + specs */}
        <div className="mt-12 grid gap-10 sm:mt-16 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-ink">Përshkrimi</h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">
                {product.description}
              </p>
            </Reveal>

            {features.length > 0 && (
              <Reveal delay={0.06}>
                <h3 className="mt-9 font-display text-lg font-bold text-ink">
                  Karakteristikat kryesore
                </h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-2">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <h3 className="mt-10 font-display text-lg font-bold text-ink">Specifikat teknike</h3>
              <SpecsTable entries={specEntries} />
            </Reveal>
          </div>

          {hasEnergyLabel && (
            <Reveal delay={0.12}>
              <div className="lg:sticky lg:top-28">
                <CapacityEnergyLabel
                  brand={product.brand}
                  model={product.name}
                  entries={energyEntries}
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* similar */}
        {similar.length > 0 && (
          <div className="mt-14 sm:mt-20 lg:mt-28">
            <Reveal>
              <h2 className="font-display text-2xl font-bold text-ink">Produkte të ngjashme</h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((p, i) => (
                <ProductCard
                  key={p.id}
                  index={i}
                  product={{
                    ...toSnapshot(p),
                    shortDesc: p.shortDesc,
                    coverageM2: p.coverageM2,
                    noiseDb: p.noiseDb,
                    wifi: p.wifi,
                    badge: p.badge,
                    stock: p.stock,
                    discount: getDiscountInfo(p),
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      </CapacityProvider>
    </div>
  );
}
