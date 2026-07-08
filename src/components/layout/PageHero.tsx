import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Standard header band for inner pages — sits under the fixed navbar. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line bg-surface",
        compact ? "pt-24 pb-8 md:pt-32 md:pb-12" : "pt-28 pb-12 md:pt-36 md:pb-16"
      )}
    >
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-50" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 18rem at 15% 0%, rgba(36,86,224,0.08), transparent 60%), radial-gradient(34rem 16rem at 90% 10%, rgba(14,170,205,0.07), transparent 60%)",
        }}
      />
      <div className="container-site relative">
        <Reveal>
          {eyebrow && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold tracking-widest text-brand-700 uppercase dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {eyebrow}
            </span>
          )}
          <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight text-balance text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2 md:text-lg">
              {description}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
