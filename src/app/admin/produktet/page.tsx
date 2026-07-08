import { ProductsTable } from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Produktet" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <ProductsTable
      products={products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        oldPrice: p.oldPrice,
        stock: p.stock,
        featured: p.featured,
        render: p.render,
        accent: p.accent,
      }))}
    />
  );
}
