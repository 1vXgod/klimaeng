"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { receiptEmail } from "@/lib/email-templates";
import { sendMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { formatBtu, getBtuVariants } from "@/lib/utils";

export type OrderInput = {
  customerName: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  note?: string;
  withInstallation: boolean;
  /** variantBtu picks a higher-capacity price variant; null = base price. */
  items: { productId: string; qty: number; variantBtu?: number | null }[];
};

export type OrderResult =
  | { ok: true; orderNo: string }
  | { ok: false; error: string };

/**
 * Highest numeric order number issued so far. Order numbers must come from
 * the maximum, not from the most recently created row — createdAt order and
 * numbering order are not the same thing.
 */
async function nextOrderNo(tx: Prisma.TransactionClient): Promise<string> {
  const [row] = await tx.$queryRaw<{ max: number | null }[]>`
    SELECT MAX(CAST(SUBSTRING("orderNo" FROM 4) AS INTEGER)) AS max
    FROM "Order"
    WHERE "orderNo" ~ '^KE-[0-9]+$'
  `;
  return `KE-${(row?.max ?? 1000) + 1}`;
}

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  try {
    return await createOrderInner(input);
  } catch (e) {
    console.error("[order] createOrder failed:", e);
    return {
      ok: false,
      error:
        "Porosia nuk u regjistrua nga një gabim i brendshëm. Provoni përsëri — nëse problemi vazhdon, na telefononi në +383 44 000 000.",
    };
  }
}

async function createOrderInner(input: OrderInput): Promise<OrderResult> {
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
    // Re-resolve the BTU variant server-side; a capacity disabled between
    // add-to-cart and checkout is dropped like a deleted product, never
    // silently re-priced.
    const variants = getBtuVariants(product);
    const variant = item.variantBtu
      ? variants.find((v) => v.btu === item.variantBtu)
      : variants[0];
    if (!variant) return [];
    const suffix =
      variant !== variants[0] && variant.btu !== null ? ` — ${formatBtu(variant.btu)}` : "";
    return [{ product, qty, price: variant.price, lineName: product.name + suffix }];
  });
  // Every line may have been dropped (deleted products / disabled variants) —
  // never register an empty zero-total order.
  if (items.length === 0)
    return { ok: false, error: "Produktet në shportë nuk janë më të disponueshme." };

  // Stock is product-level; two capacity lines of the same product draw from
  // the same pool, so check the summed quantity per product.
  const qtyByProduct = new Map<string, number>();
  for (const { product, qty } of items)
    qtyByProduct.set(product.id, (qtyByProduct.get(product.id) ?? 0) + qty);
  const outOfStock = items.find(
    ({ product }) => product.stock < (qtyByProduct.get(product.id) ?? 0)
  );
  if (outOfStock) {
    return {
      ok: false,
      error: `“${outOfStock.product.name}” nuk ka stok të mjaftueshëm.`,
    };
  }

  const total = items.reduce((sum, { price, qty }) => sum + price * qty, 0);

  // A broken/misconfigured session must never block a guest order.
  const session = await auth().catch(() => null);
  // Sessions outlive database rows (JWT lasts 30 days) — attach the user
  // only if the id still exists, otherwise record the order as a guest's.
  const sessionUserId = session?.user?.id ?? null;
  const user = sessionUserId
    ? await prisma.user.findUnique({ where: { id: sessionUserId }, select: { id: true } })
    : null;

  const runTransaction = () =>
    prisma.$transaction(
      async (tx) => {
        const orderNo = await nextOrderNo(tx);
        const created = await tx.order.create({
          data: {
            orderNo,
            userId: user?.id ?? null,
            customerName: name,
            email,
            phone,
            city,
            street,
            note: input.note?.trim() || null,
            withInstallation: input.withInstallation,
            total,
            items: {
              create: items.map(({ product, lineName, price, qty }) => ({
                productId: product.id,
                name: lineName,
                price,
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
        if (user?.id) {
          await tx.notification.create({
            data: {
              userId: user.id,
              title: "Porosia u pranua",
              body: `Porosia ${created.orderNo} u regjistrua me sukses. Do t'ju kontaktojmë brenda 24 orëve për konfirmim.`,
              type: "order",
            },
          });
        }
        return created;
      },
      // Generous limits so a cold database (serverless resume) can't abort
      // an otherwise healthy checkout.
      { maxWait: 10_000, timeout: 20_000 }
    );

  let order: Awaited<ReturnType<typeof runTransaction>>;
  try {
    order = await runTransaction();
  } catch (e) {
    // Two checkouts read the same MAX concurrently — one hits the unique
    // constraint on orderNo. Retry once with a fresh number.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      order = await runTransaction();
    } else {
      throw e;
    }
  }

  // Receipt email — best-effort: a mail failure must never fail the order.
  try {
    const template = receiptEmail({
      customerName: name,
      orderNo: order.orderNo,
      date: order.createdAt,
      items: items.map(({ product, lineName, qty, price }) => ({
        name: lineName,
        code: product.slug,
        qty,
        price,
      })),
      total,
      city,
      street,
      withInstallation: input.withInstallation,
    });
    const sent = await sendMail({ to: email, ...template });
    if (!sent.delivered) {
      console.error(`[order] receipt for ${order.orderNo} not delivered: ${sent.error ?? "unknown"}`);
    }
  } catch (e) {
    console.error("[order] receipt email failed:", e);
  }

  revalidatePath("/admin");
  revalidatePath("/llogaria/porosite");
  return { ok: true, orderNo: order.orderNo };
}
