import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { parseFeatures, parseImages, parseSpecs, specsFromFlat } from "@/lib/utils";

export const metadata = { title: "Ndrysho produktin" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  // Products saved before per-capacity specs keep their values in the flat
  // columns; surface those as the base capacity's specs in the form.
  const specs = parseSpecs(product.specs);
  const baseKey = String(product.btu ?? 12000);
  if (!specs[baseKey]) {
    const flat = specsFromFlat(product);
    if (Object.keys(flat).length > 0) specs[baseKey] = flat;
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-bold text-ink">
        Ndrysho: <span className="text-ink-2">{product.name}</span>
      </h2>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          shortDesc: product.shortDesc,
          description: product.description,
          btu: product.btu,
          specs,
          wifi: product.wifi,
          inverter: product.inverter,
          warrantyYears: product.warrantyYears,
          stock: product.stock,
          featured: product.featured,
          badge: product.badge,
          render: product.render,
          accent: product.accent,
          features: parseFeatures(product.features),
          images: parseImages(product.images, product.imageUrl),
          discountEnabled: product.discountEnabled,
          discountStart: product.discountStart?.toISOString() ?? null,
          discountEnd: product.discountEnd?.toISOString() ?? null,
          btu18Enabled: product.btu18Enabled,
          btu18Price: product.btu18Price,
          btu18SalePrice: product.btu18SalePrice,
          btu24Enabled: product.btu24Enabled,
          btu24Price: product.btu24Price,
          btu24SalePrice: product.btu24SalePrice,
        }}
      />
    </div>
  );
}
