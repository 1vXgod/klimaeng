import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { prisma } from "@/lib/prisma";
import { formatDate, formatEur } from "@/lib/utils";

export const metadata = { title: "Klientët" };

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      orders: { where: { status: { not: "CANCELLED" } }, select: { total: true } },
    },
  });

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-muted uppercase">
              <th className="px-6 py-3.5">Klienti</th>
              <th className="px-4 py-3.5">Kontakti</th>
              <th className="px-4 py-3.5">Roli</th>
              <th className="px-4 py-3.5 text-center">Porosi</th>
              <th className="px-4 py-3.5 text-right">Vlera totale</th>
              <th className="px-6 py-3.5 text-right">Regjistruar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((user) => {
              const spent = user.orders.reduce((s, o) => s + o.total, 0);
              const initials = user.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <tr key={user.id} className="transition-colors hover:bg-surface-2/50">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-frost-500 text-xs font-bold text-white">
                        {initials}
                      </span>
                      <span className="font-semibold text-ink">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="flex items-center gap-1.5 text-ink-2">
                      <Mail size={12} className="text-muted" /> {user.email}
                    </p>
                    {user.phone && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <Phone size={11} /> {user.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {user.role === "ADMIN" ? (
                      <Badge tone="violet">Admin</Badge>
                    ) : (
                      <Badge tone="blue">Klient</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-ink [font-variant-numeric:tabular-nums]">
                    {user.orders.length}
                  </td>
                  <td className="px-4 py-3.5 text-right font-display font-bold text-ink [font-variant-numeric:tabular-nums]">
                    {formatEur(spent)}
                  </td>
                  <td className="px-6 py-3.5 text-right text-xs text-muted">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
