"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Result = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

export type ProductInput = {
  id?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  shortDesc: string;
  description: string;
  btu?: number | null;
  coverageM2?: number | null;
  energyCool?: string | null;
  energyHeat?: string | null;
  seer?: number | null;
  scop?: number | null;
  refrigerant?: string | null;
  noiseDb?: number | null;
  wifi: boolean;
  inverter: boolean;
  warrantyYears: number;
  stock: number;
  featured: boolean;
  badge?: string | null;
  render: string;
  accent: string;
  features: string[];
  imageUrl?: string | null;
  discountEnabled: boolean;
  discountStart?: string | null;
  discountEnd?: string | null;
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replaceAll("ë", "e")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProduct(input: ProductInput): Promise<Result & { id?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };

  if (!input.name?.trim() || input.name.trim().length < 3)
    return { ok: false, error: "Emri i produktit është shumë i shkurtër." };
  if (!input.price || input.price <= 0)
    return { ok: false, error: "Çmimi duhet të jetë më i madh se 0." };
  if (input.oldPrice && input.oldPrice <= input.price)
    return { ok: false, error: "Çmimi i vjetër duhet të jetë më i lartë se çmimi aktual." };

  let discountStart: Date | null = null;
  let discountEnd: Date | null = null;
  if (input.discountEnabled) {
    if (!input.oldPrice)
      return { ok: false, error: "Vendosni çmimin e vjetër për të aktivizuar kohëmatësin e zbritjes." };
    if (!input.discountStart || !input.discountEnd)
      return { ok: false, error: "Zgjidhni datën e fillimit dhe të mbarimit të zbritjes." };
    discountStart = new Date(input.discountStart);
    discountEnd = new Date(input.discountEnd);
    if (Number.isNaN(discountStart.getTime()) || Number.isNaN(discountEnd.getTime()))
      return { ok: false, error: "Data e zbritjes është e pavlefshme." };
    if (discountEnd <= discountStart)
      return { ok: false, error: "Data e mbarimit duhet të jetë pas datës së fillimit." };
  }

  const data = {
    name: input.name.trim(),
    brand: input.brand?.trim() || "KlimaENG",
    category: input.category,
    price: Math.round(input.price),
    oldPrice: input.oldPrice ? Math.round(input.oldPrice) : null,
    shortDesc: input.shortDesc?.trim() ?? "",
    description: input.description?.trim() ?? "",
    btu: input.btu || null,
    coverageM2: input.coverageM2 || null,
    energyCool: input.energyCool || null,
    energyHeat: input.energyHeat || null,
    seer: input.seer || null,
    scop: input.scop || null,
    refrigerant: input.refrigerant?.trim() || null,
    noiseDb: input.noiseDb || null,
    wifi: !!input.wifi,
    inverter: !!input.inverter,
    warrantyYears: input.warrantyYears || 2,
    stock: Math.max(0, Math.round(input.stock)),
    featured: !!input.featured,
    badge: input.badge?.trim() || null,
    render: input.render,
    accent: input.accent,
    features: JSON.stringify(input.features.filter((f) => f.trim().length > 0)),
    imageUrl: input.imageUrl || null,
    discountEnabled: !!input.discountEnabled,
    discountStart,
    discountEnd,
  };

  let id = input.id;
  if (id) {
    await prisma.product.update({ where: { id }, data });
    await prisma.activityLog.create({
      data: { userId: admin.id, actor: admin.name ?? "Admin", action: "Përditësoi produktin", detail: data.name },
    });
  } else {
    let slug = slugify(data.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    const created = await prisma.product.create({ data: { ...data, slug } });
    id = created.id;
    await prisma.activityLog.create({
      data: { userId: admin.id, actor: admin.name ?? "Admin", action: "Shtoi produkt të ri", detail: data.name },
    });
  }

  revalidatePath("/admin/produktet");
  revalidatePath("/produktet");
  revalidatePath("/produktet/[slug]", "page");
  revalidatePath("/");
  return { ok: true, id };
}

export async function deleteProducts(ids: string[]): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  if (!ids.length) return { ok: false, error: "Asgjë e zgjedhur." };

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { name: true },
  });
  await prisma.product.deleteMany({ where: { id: { in: ids } } });
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      actor: admin.name ?? "Admin",
      action: ids.length === 1 ? "Fshiu produktin" : `Fshiu ${ids.length} produkte`,
      detail: products.map((p) => p.name).join(", ").slice(0, 180),
    },
  });

  revalidatePath("/admin/produktet");
  revalidatePath("/produktet");
  return { ok: true };
}

export async function setProductsFeatured(ids: string[], featured: boolean): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  await prisma.product.updateMany({ where: { id: { in: ids } }, data: { featured } });
  revalidatePath("/admin/produktet");
  revalidatePath("/");
  return { ok: true };
}

const VALID_STATUSES = ["PENDING", "CONFIRMED", "INSTALLING", "COMPLETED", "CANCELLED"];

export async function updateOrderStatus(id: string, status: string): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  if (!VALID_STATUSES.includes(status)) return { ok: false, error: "Status i pavlefshëm." };

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      actor: admin.name ?? "Admin",
      action: "Ndryshoi statusin e porosisë",
      detail: `${order.orderNo} → ${status}`,
    },
  });
  if (order.userId) {
    const statusLabels: Record<string, string> = {
      CONFIRMED: "u konfirmua — do t'ju kontaktojmë për terminin e montimit",
      INSTALLING: "është në montim",
      COMPLETED: "u përfundua me sukses — faleminderit për besimin",
      CANCELLED: "u anulua",
      PENDING: "është në pritje të konfirmimit",
    };
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: `Porosia ${order.orderNo}`,
        body: `Porosia juaj ${statusLabels[status] ?? status}.`,
        type: "order",
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/porosite");
  revalidatePath("/llogaria/porosite");
  return { ok: true };
}

export async function setMessageRead(id: string, read: boolean): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/mesazhet");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mesazhet");
  return { ok: true };
}

export async function approveReview(id: string, approved: boolean): Promise<Result> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Nuk keni qasje." };
  await prisma.review.update({ where: { id }, data: { approved } });
  revalidatePath("/");
  return { ok: true };
}
