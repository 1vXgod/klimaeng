import { cn } from "@/lib/utils";

export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="klimaeng-mark" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3d74f0" />
          <stop offset="1" stopColor="#0eaacd" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill="url(#klimaeng-mark)" />
      {/* stylized snowflake / fan hybrid */}
      <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20 9.5v21" />
        <path d="M10.9 14.75l18.2 10.5" />
        <path d="M10.9 25.25l18.2-10.5" />
      </g>
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
        <path d="M20 9.5l-2.6 3M20 9.5l2.6 3" />
        <path d="M20 30.5l-2.6-3M20 30.5l2.6-3" />
        <path d="M10.9 14.75l3.9-0.6M10.9 14.75l0.5 3.9" />
        <path d="M29.1 25.25l-3.9 0.6M29.1 25.25l-0.5-3.9" />
        <path d="M10.9 25.25l0.5-3.9M10.9 25.25l3.9 0.6" />
        <path d="M29.1 14.75l-0.5 3.9M29.1 14.75l-3.9-0.6" />
      </g>
      <circle cx="20" cy="20" r="3.4" fill="#fff" />
    </svg>
  );
}

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display text-[19px] font-bold tracking-tight",
          onDark ? "text-white" : "text-ink"
        )}
      >
        Klima
        <span className="bg-gradient-to-r from-brand-500 to-frost-500 bg-clip-text text-transparent">
          ENG
        </span>
      </span>
    </span>
  );
}
