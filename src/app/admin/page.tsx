import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Euro,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { CategoryRevenueChart, RevenueTrendChart } from "@/components/admin/Charts";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, cn, formatDate, formatEur, timeAgo } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 8, 1);

  const [orders, customers, customersThisMonth, lowStock, recentOrders, activities] =
    await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: nineMonthsAgo } },
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: monthStart } } }),
      prisma.product.findMany({
        where: { stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { items: true },
      }),
      prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

  const active = orders.filter((o) => o.status !== "CANCELLED");
  const thisMonth = active.filter((o) => o.createdAt >= monthStart);
  const prevMonth = active.filter(
    (o) => o.createdAt >= prevMonthStart && o.createdAt < monthStart
  );

  const revenueThisMonth = thisMonth.reduce((s, o) => s + o.total, 0);
  const revenuePrevMonth = prevMonth.reduce((s, o) => s + o.total, 0);
  const revenueDelta = revenuePrevMonth
    ? Math.round(((revenueThisMonth - revenuePrevMonth) / revenuePrevMonth) * 100)
    : null;
  const ordersDelta = prevMonth.length
    ? Math.round(((thisMonth.length - prevMonth.length) / prevMonth.length) * 100)
    : null;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  // Revenue by month, last 9 months
  const monthKeys: { key: string; label: string }[] = [];
  for (let m = 8; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    monthKeys.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("sq-AL", { month: "short" }),
    });
  }
  const trend = monthKeys.map(({ key, label }) => ({
    month: label,
    revenue: active
      .filter((o) => `${o.createdAt.getFullYear()}-${o.createdAt.getMonth()}` === key)
      .reduce((s, o) => s + o.total, 0),
  }));

  // Revenue by category
  const byCategory = new Map<string, number>();
  for (const order of active) {
    for (const item of order.items) {
      const cat = item.product?.category ?? "TJERA";
      byCategory.set(cat, (byCategory.get(cat) ?? 0) + item.price * item.qty);
    }
  }
  const categoryData = [...byCategory.entries()]
    .map(([category, revenue]) => ({
      category: CATEGORY_LABELS[category] ?? "Të tjera",
      revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  const kpis = [
    {
      label: "Të hyra këtë muaj",
      value: formatEur(revenueThisMonth),
      delta: revenueDelta,
      icon: Euro,
    },
    {
      label: "Porosi këtë muaj",
      value: String(thisMonth.length),
      delta: ordersDelta,
      icon: ShoppingCart,
    },
    {
      label: "Porosi në pritje",
      value: String(pendingCount),
      delta: null,
      icon: Clock,
      href: "/admin/porosite?status=PENDING",
    },
    {
      label: "Klientë të regjistruar",
      value: String(customers),
      delta: null,
      sub: customersThisMonth > 0 ? `+${customersThisMonth} këtë muaj` : undefined,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const body = (
            <>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <Icon size={18} />
                </span>
                {kpi.delta !== null && kpi.delta !== undefined && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold",
                      kpi.delta >= 0
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    )}
                  >
                    {kpi.delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                    {Math.abs(kpi.delta)}%
                  </span>
                )}
              </div>
              <p className="mt-4 font-display text-[1.7rem] leading-none font-extrabold text-ink [font-variant-numeric:tabular-nums]">
                {kpi.value}
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-muted">
                {kpi.label}
                {kpi.sub && (
                  <span className="ml-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    {kpi.sub}
                  </span>
                )}
              </p>
            </>
          );
          const cls =
            "rounded-3xl border border-line bg-surface p-5 card-shadow transition-all hover:-translate-y-0.5 hover:card-shadow-lg";
          return kpi.href ? (
            <Link key={kpi.label} href={kpi.href} className={cn(cls, "focus-ring")}>
              {body}
            </Link>
          ) : (
            <div key={kpi.label} className={cls}>
              {body}
            </div>
          );
        })}
      </div>

      {/* charts */}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-line bg-surface p-5 card-shadow sm:p-6">
          <header className="mb-4 flex items-baseline justify-between">
            <div>
              <h2 className="font-display text-[15px] font-bold text-ink">Të hyrat mujore</h2>
              <p className="text-xs text-muted">9 muajt e fundit · pa porositë e anuluara</p>
            </div>
          </header>
          <RevenueTrendChart data={trend} />
        </section>

        <section className="rounded-3xl border border-line bg-surface p-5 card-shadow sm:p-6">
          <header className="mb-4">
            <h2 className="font-display text-[15px] font-bold text-ink">Të hyrat sipas kategorisë</h2>
            <p className="text-xs text-muted">9 muajt e fundit</p>
          </header>
          <CategoryRevenueChart data={categoryData} />
        </section>
      </div>

      {/* tables row */}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        {/* recent orders */}
        <section className="overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
          <header className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-[15px] font-bold text-ink">Porositë e fundit</h2>
            <Link
              href="/admin/porosite"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline dark:text-brand-300"
            >
              Të gjitha <ArrowRight size={13} />
            </Link>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-120 text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-muted uppercase">
                  <th className="px-6 py-3">Porosia</th>
                  <th className="px-4 py-3">Klienti</th>
                  <th className="px-4 py-3">Statusi</th>
                  <th className="px-6 py-3 text-right">Totali</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-surface-2/50">
                    <td className="px-6 py-3.5">
                      <p className="font-display font-bold text-ink">{order.orderNo}</p>
                      <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-ink">{order.customerName}</p>
                      <p className="text-xs text-muted">{order.city}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right font-display font-bold text-ink [font-variant-numeric:tabular-nums]">
                      {formatEur(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          {/* low stock */}
          <section className="rounded-3xl border border-line bg-surface card-shadow">
            <header className="flex items-center gap-2 border-b border-line px-6 py-4">
              <AlertTriangle size={15} className="text-amber-500" />
              <h2 className="font-display text-[15px] font-bold text-ink">Stok i ulët</h2>
            </header>
            <ul className="divide-y divide-line">
              {lowStock.length === 0 && (
                <li className="px-6 py-5 text-sm text-muted">Të gjitha produktet kanë stok të mjaftueshëm.</li>
              )}
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center gap-3 px-6 py-3">
                  <Link
                    href={`/admin/produktet/${product.id}`}
                    className="min-w-0 flex-1 truncate text-sm font-semibold text-ink hover:text-brand-700 focus-ring rounded-md dark:hover:text-brand-300"
                  >
                    {product.name}
                  </Link>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      product.stock === 0
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                    )}
                  >
                    {product.stock} copë
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* activity */}
          <section className="rounded-3xl border border-line bg-surface card-shadow">
            <header className="border-b border-line px-6 py-4">
              <h2 className="font-display text-[15px] font-bold text-ink">Aktiviteti</h2>
            </header>
            <ul className="divide-y divide-line">
              {activities.map((a) => (
                <li key={a.id} className="px-6 py-3">
                  <p className="text-[13px] text-ink">
                    <span className="font-semibold">{a.actor}</span>{" "}
                    <span className="text-ink-2">{a.action}</span>
                  </p>
                  {a.detail && <p className="mt-0.5 truncate text-xs text-muted">{a.detail}</p>}
                  <p className="mt-0.5 text-[11px] text-muted">{timeAgo(a.createdAt)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
