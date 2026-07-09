import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://klimaeng.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/produktet`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/sherbimet`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/rreth-nesh`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kontakti`, changeFrequency: "monthly", priority: 0.7 },
  ];

  return [
    ...staticPages,
    ...products.map((p) => ({
      url: `${BASE}/produktet/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
