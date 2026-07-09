import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Official KlimaENG brand assets (client-provided files in /public/brand):
 *  - mark.png  — teal circle with three white waves (works on any background)
 *  - logo.png  — full wordmark incl. ® (designed for light backgrounds)
 * On dark surfaces (and in dark theme) the wordmark is composed from the
 * mark + light text, since the file's navy "ENG" would be illegible there.
 */
export function LogoMark({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn("shrink-0 select-none", className)}
      priority
    />
  );
}

function DarkWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("items-center gap-2.5", className)}>
      <LogoMark />
      <span className="inline-flex items-start">
        <span className="font-display text-[19px] leading-none font-bold tracking-tight">
          <span className="text-[#5cc0de]">Klima</span>
          <span className="text-white">ENG</span>
        </span>
        <span className="ml-0.5 text-[9px] leading-none font-semibold text-white/70" aria-hidden>
          ®
        </span>
      </span>
    </span>
  );
}

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  if (onDark) {
    return <DarkWordmark className={cn("inline-flex", className)} />;
  }

  // Light contexts: the official file; in dark theme swap to the composed variant.
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/logo.png"
        alt="KlimaENG"
        width={140}
        height={34}
        className="h-[34px] w-auto select-none dark:hidden"
        priority
      />
      <DarkWordmark className="hidden dark:inline-flex" />
    </span>
  );
}
