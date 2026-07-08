import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-2xl md:mb-16",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-widest uppercase",
            dark
              ? "border-white/15 bg-white/5 text-frost-300"
              : "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-brand-300"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-[2.75rem] md:leading-[1.1]",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            dark ? "text-slate-300" : "text-ink-2"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
