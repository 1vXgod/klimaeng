import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone =
  | "brand"
  | "frost"
  | "flame"
  | "green"
  | "amber"
  | "red"
  | "violet"
  | "blue"
  | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/25",
  frost: "bg-frost-50 text-frost-600 border-frost-200 dark:bg-frost-500/10 dark:text-frost-300 dark:border-frost-500/25",
  flame: "bg-flame-50 text-flame-600 border-flame-200 dark:bg-flame-500/10 dark:text-flame-300 dark:border-flame-500/25",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25",
  amber: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/25",
  red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/25",
  violet: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/25",
  blue: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/25",
  neutral: "bg-surface-2 text-ink-2 border-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
