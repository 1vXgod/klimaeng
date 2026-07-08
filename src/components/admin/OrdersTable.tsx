"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions/admin";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "@/components/ui/Toast";
import { cn, formatDateTime, formatEur, ORDER_STATUS } from "@/lib/utils";

export type AdminOrder = {
  id: string;
  orderNo: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  note: string | null;
  withInstallation: boolean;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; price: number; qty: number }[];
};

const STATUS_FILTERS = ["ALL", ...Object.keys(ORDER_STATUS)];

export function OrdersTable({
  orders,
  initialStatus,
}: {
  orders: AdminOrder[];
  initialStatus?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    initialStatus && ORDER_STATUS[initialStatus] ? initialStatus : "ALL"
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "ALL") list = list.filter((o) => o.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNo.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, query, statusFilter]);

  const setStatus = (id: string, status: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(id, status);
      if (result.ok) {
        toast("Statusi u përditësua");
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-0 flex-1 basis-64">
          <Search size={15} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko sipas numrit, klientit, telefonit…"
            aria-label="Kërko porosi"
            className="h-10 w-full rounded-full border border-line-2 bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted focus:border-brand-400 focus:outline-none"
          />
        </div>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors focus-ring",
                statusFilter === status
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-line-2 bg-surface text-ink-2 hover:text-ink"
              )}
            >
              {status === "ALL" ? "Të gjitha" : ORDER_STATUS[status].label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted" aria-live="polite">
        {filtered.length} porosi
      </p>

      {/* table */}
      <div className="overflow-hidden rounded-3xl border border-line bg-surface card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-muted uppercase">
                <th className="px-5 py-3.5">Porosia</th>
                <th className="px-4 py-3.5">Klienti</th>
                <th className="px-4 py-3.5">Qyteti</th>
                <th className="px-4 py-3.5">Statusi</th>
                <th className="px-4 py-3.5 text-right">Totali</th>
                <th className="px-5 py-3.5 sr-only">Detaje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  expanded={expanded === order.id}
                  onToggle={() => setExpanded(expanded === order.id ? null : order.id)}
                  onStatus={(s) => setStatus(order.id, s)}
                  disabled={isPending}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-muted">
                    Asnjë porosi nuk përputhet me filtrat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  expanded,
  onToggle,
  onStatus,
  disabled,
}: {
  order: AdminOrder;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (s: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <tr
        className={cn(
          "cursor-pointer transition-colors hover:bg-surface-2/50",
          expanded && "bg-surface-2/50"
        )}
        onClick={onToggle}
      >
        <td className="px-5 py-3.5">
          <p className="font-display font-bold text-ink">{order.orderNo}</p>
          <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
        </td>
        <td className="px-4 py-3.5">
          <p className="font-medium text-ink">{order.customerName}</p>
          <p className="text-xs text-muted">{order.phone}</p>
        </td>
        <td className="px-4 py-3.5 text-ink-2">{order.city}</td>
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-fit">
            <select
              value={order.status}
              onChange={(e) => onStatus(e.target.value)}
              disabled={disabled}
              aria-label={`Statusi i porosisë ${order.orderNo}`}
              className="absolute inset-0 cursor-pointer opacity-0"
            >
              {Object.entries(ORDER_STATUS).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none inline-flex items-center gap-1">
              <StatusBadge status={order.status} />
              <ChevronDown size={13} className="text-muted" />
            </span>
          </div>
        </td>
        <td className="px-4 py-3.5 text-right font-display font-bold text-ink [font-variant-numeric:tabular-nums]">
          {formatEur(order.total)}
        </td>
        <td className="px-5 py-3.5 text-right">
          <ChevronDown
            size={16}
            className={cn("inline text-muted transition-transform", expanded && "rotate-180")}
          />
        </td>
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={6} className="bg-surface-2/40 px-5 pb-1 pt-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="grid gap-6 py-4 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">
                      Artikujt
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-4 text-[13px]">
                          <span className="text-ink">
                            {item.qty} × {item.name}
                          </span>
                          <span className="font-semibold text-ink [font-variant-numeric:tabular-nums]">
                            {formatEur(item.price * item.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <p className="text-[11px] font-semibold tracking-wider text-muted uppercase">
                      Dërgesa & kontakti
                    </p>
                    <p className="text-ink">
                      {order.street}, {order.city}
                    </p>
                    <p className="text-ink-2">
                      {order.email} · {order.phone}
                    </p>
                    <p className="text-ink-2">
                      {order.withInstallation ? "✓ Me montim profesional" : "Pa montim"}
                    </p>
                    {order.note && (
                      <p className="rounded-xl bg-surface px-3 py-2 text-ink-2">
                        “{order.note}”
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
