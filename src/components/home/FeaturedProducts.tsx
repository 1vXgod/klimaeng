import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/products/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedProducts({ products }: { products: ProductCardData[] }) {
  return (
    <section className="py-20 md:py-28" aria-label="Produktet e zgjedhura">
      <div className="container-site">
        <SectionHeading
          eyebrow="Ofertat e muajit"
          title="Produkte të zgjedhura, çmime transparente"
          description="Modelet më të kërkuara të sezonit — me zbritje aktive, garanci zyrtare dhe montim profesional brenda 48 orëve."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Link
            href="/produktet"
            className="group inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-6 py-3 text-sm font-semibold text-ink transition-all hover:border-brand-300 hover:text-brand-700 card-shadow focus-ring dark:hover:text-brand-300"
          >
            Shiko katalogun e plotë
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
