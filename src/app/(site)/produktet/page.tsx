import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProductExplorer } from "@/components/products/ProductExplorer";
import { getAllProducts, toSnapshot } from "@/lib/products";
import { getDiscountInfo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Katalogu i Produkteve",
  description:
    "Split, qëndrues, multi-split, pompa termike, boilerë dhe aksesorë — të gjitha me çmime transparente, etiketa energjetike dhe zbritje aktive.",
};

export const revalidate = 120;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string }>;
}) {
  const { kategoria } = await searchParams;
  const products = await getAllProducts();

  return (
    <>
      <PageHero
        compact
        eyebrow="Katalogu"
        title="Produktet tona"
        description="Split, qëndrues, pompa termike, boilerë dhe aksesorë — me çmime transparente, etiketa energjetike dhe garanci zyrtare."
      />
      <div className="container-site pt-2 pb-20">
        <ProductExplorer
          initialCategory={kategoria}
          products={products.map((p) => ({
            ...toSnapshot(p),
            shortDesc: p.shortDesc,
            coverageM2: p.coverageM2,
            noiseDb: p.noiseDb,
            wifi: p.wifi,
            inverter: p.inverter,
            badge: p.badge,
            stock: p.stock,
            createdAt: p.createdAt.toISOString(),
            discount: getDiscountInfo(p),
          }))}
        />
      </div>
    </>
  );
}
