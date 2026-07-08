"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CheckCheck, Package, ShieldAlert, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteNotification, markNotificationsRead } from "@/app/actions/account";
import { toast } from "@/components/ui/Toast";
import { cn, timeAgo } from "@/lib/utils";

export type NotificationData = {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
};

const ICONS: Record<string, React.ReactNode> = {
  order: <Package size={17} />,
  promo: <Tag size={17} />,
  security: <ShieldAlert size={17} />,
  info: <Bell size={17} />,
};

const TONES: Record<string, string> = {
  order: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
  promo: "bg-flame-50 text-flame-600 dark:bg-flame-500/10 dark:text-flame-300",
  security: "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400",
  info: "bg-frost-50 text-frost-600 dark:bg-frost-500/10 dark:text-frost-300",
};

export function NotificationList({ notifications }: { notifications: NotificationData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">
          Njoftimet{" "}
          {unread > 0 && (
            <span className="ml-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {unread} të reja
            </span>
          )}
        </h2>
        {unread > 0 && (
          <button
            onClick={() =>
              startTransition(async () => {
                await markNotificationsRead();
                toast("Të gjitha u shënuan si të lexuara", "info");
                router.refresh();
              })
            }
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-4 py-2 text-xs font-semibold text-ink-2 transition-colors hover:border-brand-300 hover:text-brand-700 focus-ring disabled:opacity-50 dark:hover:text-brand-300"
          >
            <CheckCheck size={14} /> Shëno të gjitha si të lexuara
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
            <BellOff size={24} />
          </span>
          <p className="mt-4 font-display font-bold text-ink">Asnjë njoftim</p>
          <p className="mt-1 text-sm text-muted">
            Këtu do të merrni përditësime për porositë, servisimet dhe ofertat.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.li
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 30 }}
                className={cn(
                  "group flex gap-4 rounded-3xl border p-5 transition-colors",
                  notification.read
                    ? "border-line bg-surface"
                    : "border-brand-200 bg-brand-50/40 dark:border-brand-500/25 dark:bg-brand-500/5"
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    TONES[notification.type] ?? TONES.info
                  )}
                >
                  {ICONS[notification.type] ?? ICONS.info}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-sm font-bold text-ink">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-500" />
                      )}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted">
                      {timeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                    {notification.body}
                  </p>
                </div>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteNotification(notification.id);
                      router.refresh();
                    })
                  }
                  aria-label="Fshi njoftimin"
                  className="grid h-8 w-8 shrink-0 place-items-center self-center rounded-full text-muted opacity-100 transition-all hover:bg-red-50 hover:text-red-500 focus-ring lg:opacity-0 lg:group-hover:opacity-100 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={15} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
