import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Catalog snapshots consumed by the client-side assistant and compare page. */
export async function GET() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      price: true,
      oldPrice: true,
      render: true,
      accent: true,
      category: true,
      btu: true,
      energyCool: true,
      energyHeat: true,
      coverageM2: true,
      seer: true,
      scop: true,
      noiseDb: true,
      wifi: true,
      inverter: true,
      warrantyYears: true,
      refrigerant: true,
      stock: true,
      discountEnabled: true,
      discountStart: true,
      discountEnd: true,
    },
    orderBy: { price: "asc" },
  });
  return NextResponse.json(products, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" },
  });
}
