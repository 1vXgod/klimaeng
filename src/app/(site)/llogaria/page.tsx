import { ArrowRight, Bell, MapPin, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatEur } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [orders, addressCount, unread, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.address.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { items: true },
    }),
  ]);

  const stats = [
    { label: "Porosi gjithsej", value: orders, icon: Package, href: "/llogaria/porosite" },
    { label: "Njoftime të palexuara", value: unread, icon: Bell, href: "/llogaria/njoftimet" },
    { label: "Adresa të ruajtura", value: addressCount, icon: MapPin, href: "/llogaria/adresat" },
  ];

  return (
    <div className="space-y-8">
      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-3xl border border-line bg-surface p-5 card-shadow transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:card-shadow-lg focus-ring dark:hover:border-brand-500/30"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-300">
                <Icon size={18} />
              </span>
              <p className="mt-3 font-display text-3xl font-extrabold text-ink">{stat.value}</p>
              <p className="mt-0.5 text-[13px] font-medium text-muted">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* recent orders */}
      <section className="rounded-3xl border border-line bg-surface card-shadow">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-bold text-ink">Porositë e fundit</h2>
          <Link
            href="/llogaria/porosite"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            Të gjitha <ArrowRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
              <ShoppingBag size={22} />
            </span>
            <p className="mt-4 font-semibold text-ink">Ende s’keni asnjë porosi</p>
            <p className="mt-1 text-sm text-muted">
              Kur të bëni porosinë e parë, do ta shihni statusin këtu.
            </p>
            <Link
              href="/produktet"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 focus-ring"
            >
              Shfleto Produktet <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-ink">
                    {order.orderNo}
                    <span className="ml-2 font-sans text-xs font-medium text-muted">
                      {formatDate(order.createdAt)}
                    </span>
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-ink-2">
                    {order.items.map((i) => i.name).join(", ")}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <span className="font-display text-sm font-bold text-ink">
                  {formatEur(order.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* helper card */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-night-950 p-7 text-white sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-lg font-bold">Nevojë për servisim?</h3>
          <p className="mt-1 text-sm text-slate-300">
            Rezervoni terminin tuaj vjetor me 15% zbritje si klient i regjistruar.
          </p>
        </div>
        <Link
          href="/kontakti"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-night-900 transition-transform hover:scale-[1.03] focus-ring"
        >
          Rezervo tani <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
