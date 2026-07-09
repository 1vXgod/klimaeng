"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { receiptEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export type OrderInput = {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  note?: string;
  withInstallation: boolean;
  items: { productId: string; qty: number }[];
};

export type OrderResult =
  | { ok: true; orderNo: string }
  | { ok: false; error: string };

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const name = input.customerName?.trim();
  const email = input.email?.trim().toLowerCase();
  const phone = input.phone?.trim();
  const city = input.city?.trim();
  const street = input.street?.trim();

  if (!name || name.length < 3) return { ok: false, error: "Shkruani emrin e plotë." };
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    return { ok: false, error: "Email-i nuk është i vlefshëm." };
  if (!phone || phone.replace(/\D/g, "").length < 8)
    return { ok: false, error: "Numri i telefonit nuk është i vlefshëm." };
  if (!city || !street) return { ok: false, error: "Plotësoni adresën e montimit." };
  if (!input.items?.length) return { ok: false, error: "Shporta është bosh." };

  // Re-price server-side; never trust client totals.
  const products = await prisma.product.findMany({
    where: { id: { in: input.items.map((i) => i.productId) } },
  });
  if (products.length === 0) return { ok: false, error: "Produktet nuk u gjetën." };

  const items = input.items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return [];
    const qty = Math.min(Math.max(1, Math.floor(item.qty)), 9);
    return [{ product, qty }];
  });

  const outOfStock = items.find(({ product, qty }) => product.stock < qty);
  if (outOfStock) {
    return {
      ok: false,
      error: `“${outOfStock.product.name}” nuk ka stok të mjaftueshëm.`,
    };
  }

  const total = items.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const session = await auth();

  const last = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { orderNo: true },
  });
  const lastNo = last ? parseInt(last.orderNo.replace("KE-", ""), 10) : 1000;
  const orderNo = `KE-${(Number.isNaN(lastNo) ? 1000 : lastNo) + 1}`;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNo,
        userId: session?.user?.id ?? null,
        customerName: name,
        email,
        phone,
        city,
        street,
        note: input.note?.trim() || null,
        withInstallation: input.withInstallation,
        total,
        items: {
          create: items.map(({ product, qty }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            qty,
          })),
        },
      },
    });
    for (const { product, qty } of items) {
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: qty } },
      });
    }
    await tx.activityLog.create({
      data: {
        actor: name,
        action: "Porosi e re",
        detail: `${created.orderNo} — ${items.length} artikuj, ${total}€`,
      },
    });
    if (session?.user?.id) {
      await tx.notification.create({
        data: {
          userId: session.user.id,
          title: "Porosia u pranua",
          body: `Porosia ${created.orderNo} u regjistrua me sukses. Do t'ju kontaktojmë brenda 24 orëve për konfirmim.`,
          type: "order",
        },
      });
    }
    return created;
  });

  // Receipt email — best-effort: a mail failure must never fail the order.
  try {
    const template = receiptEmail({
      customerName: name,
      orderNo: order.orderNo,
      date: order.createdAt,
      items: items.map(({ product, qty }) => ({
        name: product.name,
        code: product.slug,
        qty,
        price: product.price,
      })),
      total,
      city,
      street,
      withInstallation: input.withInstallation,
    });
    await sendMail({ to: email, ...template });
  } catch (e) {
    console.error("[order] receipt email failed:", e);
  }

  revalidatePath("/admin");
  revalidatePath("/llogaria/porosite");
  return { ok: true, orderNo: order.orderNo };
}
