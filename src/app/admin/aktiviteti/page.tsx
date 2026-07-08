import { Activity } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Aktiviteti" };

export default async function AdminActivityPage() {
  const activities = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="max-w-3xl">
      <div className="rounded-3xl border border-line bg-surface card-shadow">
        <header className="flex items-center gap-2.5 border-b border-line px-6 py-4">
          <Activity size={17} className="text-brand-500" />
          <h2 className="font-display text-[15px] font-bold text-ink">
            Regjistri i aktivitetit
          </h2>
          <span className="ml-auto text-xs text-muted">{activities.length} veprime të fundit</span>
        </header>

        <ol className="relative px-6 py-6">
          <span
            aria-hidden
            className="absolute top-8 bottom-8 left-[35px] w-px bg-gradient-to-b from-brand-400 via-line-2 to-transparent"
          />
          {activities.map((activity) => (
            <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
              <span className="relative z-10 mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-surface bg-brand-500">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink">
                  <span className="font-bold">{activity.actor}</span>{" "}
                  <span className="text-ink-2">{activity.action}</span>
                </p>
                {activity.detail && (
                  <p className="mt-0.5 text-[13px] text-muted">{activity.detail}</p>
                )}
                <p className="mt-1 text-[11px] text-muted [font-variant-numeric:tabular-nums]">
                  {formatDateTime(activity.createdAt)}
                </p>
              </div>
            </li>
          ))}
          {activities.length === 0 && (
            <li className="py-8 text-center text-sm text-muted">Ende asnjë aktivitet.</li>
          )}
        </ol>
      </div>
    </div>
  );
}
