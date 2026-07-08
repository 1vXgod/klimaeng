"use client";

import {
  Bell,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/llogaria", label: "Përmbledhja", icon: LayoutDashboard, exact: true },
  { href: "/llogaria/porosite", label: "Porositë", icon: Package },
  { href: "/llogaria/deshirat", label: "Dëshirat", icon: Heart },
  { href: "/llogaria/adresat", label: "Adresat", icon: MapPin },
  { href: "/llogaria/njoftimet", label: "Njoftimet", icon: Bell },
  { href: "/llogaria/siguria", label: "Siguria", icon: ShieldCheck },
  { href: "/llogaria/cilesimet", label: "Cilësimet", icon: Settings },
];

export function AccountSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Menyja e llogarisë"
      className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl border border-line bg-surface p-2 card-shadow lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:p-3"
    >
      {LINKS.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors focus-ring",
              active
                ? "bg-brand-600 text-white shadow-[0_6px_16px_-4px_rgba(36,86,224,0.45)]"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            )}
          >
            <Icon size={17} />
            {link.label}
            {link.href === "/llogaria/njoftimet" && unreadCount > 0 && (
              <span
                className={cn(
                  "ml-auto grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold",
                  active ? "bg-white/25 text-white" : "bg-brand-600 text-white"
                )}
              >
                {unreadCount}
              </span>
            )}
          </Link>
        );
      })}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap text-red-500 transition-colors hover:bg-red-50 focus-ring dark:hover:bg-red-500/10 lg:mt-2 lg:border-t lg:border-line lg:pt-4"
      >
        <LogOut size={17} />
        Dilni
      </button>
    </nav>
  );
}
