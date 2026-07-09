import { Check, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/products/BuyBox";
import { EnergyLabel } from "@/components/products/EnergyLabel";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Reveal } from "@/components/ui/Reveal";
import { getProductBySlug, getSimilarProducts, toSnapshot } from "@/lib/products";
import {
  CATEGORY_LABELS,
  formatBtu,
  getBtuVariants,
  getDiscountInfo,
  parseFeatures,
  parseImages,
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
  const capacities = variants.flatMap((v) => (v.btu !== null ? [formatBtu(v.btu)] : []));

  const specs: [string, string][] = [
    ["Marka", product.brand],
    ["Kategoria", CATEGORY_LABELS[product.category] ?? product.category],
    ...(capacities.length ? ([["Kapaciteti", capacities.join(" / ")]] as [string, string][]) : []),
    ...(product.coverageM2 ? ([["Mbulimi", `deri në ${product.coverageM2} m²`]] as [string, string][]) : []),
    ...(product.energyCool ? ([["Klasa energjetike (ftohje)", product.energyCool]] as [string, string][]) : []),
    ...(product.energyHeat ? ([["Klasa energjetike (ngrohje)", product.energyHeat]] as [string, string][]) : []),
    ...(product.seer ? ([["SEER", String(product.seer)]] as [string, string][]) : []),
    ...(product.scop ? ([["SCOP", String(product.scop)]] as [string, string][]) : []),
    ...(product.refrigerant ? ([["Gazi ftohës", product.refrigerant]] as [string, string][]) : []),
    ...(product.noiseDb ? ([["Niveli i zhurmës", `${product.noiseDb} dB`]] as [string, string][]) : []),
    ["Teknologji inverter", product.inverter ? "Po" : "Jo"],
    ["Kontroll Wi-Fi", product.wifi ? "Po" : "Jo"],
    ["Garancia", `${product.warrantyYears} vjet`],
  ];

  return (
    <div className="pt-24 pb-20 md:pt-32">
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

        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
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
                variants,
              }}
            />
          </Reveal>
        </div>

        {/* description + specs */}
        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
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
              <div className="mt-4 overflow-hidden rounded-2xl border border-line">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-line">
                    {specs.map(([key, value], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2/50"}>
                        <th scope="row" className="w-1/2 px-5 py-3 text-left font-medium text-muted">
                          {key}
                        </th>
                        <td className="px-5 py-3 font-semibold text-ink">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>

          {(product.energyCool || product.energyHeat) && (
            <Reveal delay={0.12}>
              <div className="lg:sticky lg:top-28">
                <h3 className="mb-4 font-display text-lg font-bold text-ink">
                  Etiketa energjetike
                </h3>
                <EnergyLabel
                  brand={product.brand}
                  model={product.name}
                  energyCool={product.energyCool}
                  energyHeat={product.energyHeat}
                  seer={product.seer}
                  scop={product.scop}
                  noiseDb={product.noiseDb}
                />
              </div>
            </Reveal>
          )}
        </div>

        {/* similar */}
        {similar.length > 0 && (
          <div className="mt-20 lg:mt-28">
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
    </div>
  );
}
