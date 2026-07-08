import { ArrowRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { ProductVisual } from "@/components/renders/ProductRender";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatEur } from "@/lib/utils";

export const metadata = { title: "Porositë e mia" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-20 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-muted">
          <PackageOpen size={26} />
        </span>
        <p className="mt-5 font-display text-xl font-bold text-ink">Ende s’keni porosi</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Porositë tuaja dhe statusi i montimit do të shfaqen këtu.
        </p>
        <Link
          href="/produktet"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-ring"
        >
          Shfleto Produktet <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <article
          key={order.id}
          className="overflow-hidden rounded-3xl border border-line bg-surface card-shadow"
        >
          <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface-2/50 px-6 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[15px] font-bold text-ink">{order.orderNo}</h2>
              <p className="text-xs text-muted">
                Porositur më {formatDate(order.createdAt)} · {order.city}, {order.street}
              </p>
            </div>
            <StatusBadge status={order.status} />
            <span className="font-display text-lg font-bold text-ink">
              {formatEur(order.total)}
            </span>
          </header>

          <ul className="divide-y divide-line px-6">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-3.5">
                <span className="h-13 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  {item.product ? (
                    <ProductVisual
                      render={item.product.render}
                      accent={item.product.accent}
                      className="h-full w-full p-1"
                      glow={false}
                    />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  {item.product ? (
                    <Link
                      href={`/produktet/${item.product.slug}`}
                      className="truncate text-sm font-semibold text-ink hover:text-brand-700 focus-ring rounded-md dark:hover:text-brand-300"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  )}
                  <p className="text-xs text-muted">
                    {item.qty} × {formatEur(item.price)}
                  </p>
                </div>
                <span className="text-sm font-bold text-ink">
                  {formatEur(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-6 py-3.5 text-xs text-muted">
            <span>
              {order.withInstallation
                ? "✓ Me montim profesional — termini konfirmohet me telefon"
                : "Pa montim — vetëm dërgesa"}
            </span>
            <a
              href="tel:+38344000000"
              className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              Pyetje për porosinë? +383 44 000 000
            </a>
          </footer>
        </article>
      ))}
    </div>
  );
}
