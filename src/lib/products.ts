import "server-only";
import type { Product } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductSnapshot } from "@/stores/shop";

export async function getAllProducts() {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { price: "desc" },
    take: limit,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

export async function getSimilarProducts(product: Product, limit = 4) {
  const similar = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: limit,
  });
  if (similar.length < limit) {
    const fill = await prisma.product.findMany({
      where: {
        id: { notIn: [product.id, ...similar.map((p) => p.id)] },
        featured: true,
      },
      take: limit - similar.length,
    });
    similar.push(...fill);
  }
  return similar;
}

export function toSnapshot(p: Product): ProductSnapshot {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice,
    render: p.render,
    accent: p.accent,
    category: p.category,
    btu: p.btu,
    energyCool: p.energyCool,
    energyHeat: p.energyHeat,
  };
}
