"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Inbox, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteMessage, setMessageRead } from "@/app/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";
import { cn, timeAgo } from "@/lib/utils";

export type AdminMessage = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesList({ messages }: { messages: AdminMessage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const unread = messages.filter((m) => !m.read).length;

  if (messages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
          <Inbox size={24} />
        </span>
        <p className="mt-4 font-display font-bold text-ink">Asnjë mesazh</p>
        <p className="mt-1 text-sm text-muted">
          Mesazhet nga forma e kontaktit do të shfaqen këtu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {messages.length} mesazhe gjithsej
        {unread > 0 && (
          <span className="ml-2 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white">
            {unread} të palexuara
          </span>
        )}
      </p>

      <ul className="space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.li
              key={message.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className={cn(
                "rounded-3xl border p-5 transition-colors md:p-6",
                message.read
                  ? "border-line bg-surface"
                  : "border-brand-200 bg-brand-50/40 dark:border-brand-500/25 dark:bg-brand-500/5"
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display font-bold text-ink">
                    {message.name}
                    {!message.read && (
                      <Badge tone="brand" className="ml-2 align-middle">
                        I ri
                      </Badge>
                    )}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <a
                      href={`mailto:${message.email}`}
                      className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-300"
                    >
                      <Mail size={11} /> {message.email}
                    </a>
                    {message.phone && (
                      <a
                        href={`tel:${message.phone}`}
                        className="inline-flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-300"
                      >
                        <Phone size={11} /> {message.phone}
                      </a>
                    )}
                    <span>{timeAgo(message.createdAt)}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await setMessageRead(message.id, !message.read);
                        router.refresh();
                      })
                    }
                    disabled={isPending}
                    aria-label={message.read ? "Shëno si të palexuar" : "Shëno si të lexuar"}
                    title={message.read ? "Shëno si të palexuar" : "Shëno si të lexuar"}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line-2 text-muted transition-colors hover:border-brand-300 hover:text-brand-600 focus-ring disabled:opacity-50 dark:hover:text-brand-300"
                  >
                    {message.read ? <Mail size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={() =>
                      startTransition(async () => {
                        await deleteMessage(message.id);
                        toast("Mesazhi u fshi", "info");
                        router.refresh();
                      })
                    }
                    disabled={isPending}
                    aria-label="Fshi mesazhin"
                    className="grid h-9 w-9 place-items-center rounded-full border border-line-2 text-muted transition-colors hover:border-red-200 hover:text-red-500 focus-ring disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <p className="mt-4 rounded-2xl bg-surface-2/70 px-4 py-3 text-sm leading-relaxed text-ink-2">
                {message.message}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
