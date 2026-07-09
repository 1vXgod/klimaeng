"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bell,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/ui/Logo";
import { cn, timeAgo } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Paneli", icon: LayoutDashboard, exact: true },
  { href: "/admin/porosite", label: "Porositë", icon: ShoppingCart },
  { href: "/admin/produktet", label: "Produktet", icon: Package },
  { href: "/admin/klientet", label: "Klientët", icon: Users },
  { href: "/admin/mesazhet", label: "Mesazhet", icon: Inbox },
  { href: "/admin/aktiviteti", label: "Aktiviteti", icon: Activity },
  { href: "/admin/cilesimet", label: "Cilësimet", icon: Settings },
];

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  detail: string | null;
  createdAt: string;
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Navigimi i administratës">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors focus-ring",
              active
                ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_6px_16px_-4px_rgba(36,86,224,0.5)]"
                : "text-slate-400 hover:bg-white/6 hover:text-white"
            )}
          >
            <Icon size={17} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-white/8 px-3 py-4">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/6 hover:text-white focus-ring"
      >
        <ExternalLink size={16} />
        Shiko faqen
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 focus-ring"
      >
        <LogOut size={16} />
        Dilni
      </button>
    </div>
  );
}

export function AdminShell({
  children,
  userName,
  activities,
}: {
  children: ReactNode;
  userName: string;
  activities: ActivityItem[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close the mobile drawer on navigation (derived-state pattern, no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const current = NAV.find((n) =>
    n.exact ? pathname === n.href : pathname.startsWith(n.href)
  );

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-dvh bg-bg">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col bg-night-950 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-6 py-5 focus-ring">
          <LogoMark size={30} />
          <span className="font-display text-[15px] font-bold text-white">
            <span className="text-[#5cc0de]">Klima</span>ENG
            <span className="ml-2 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-slate-300">
              ADMIN
            </span>
          </span>
        </Link>
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-night-950/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-70 flex w-68 flex-col bg-night-950 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between px-5 py-5">
                <span className="flex items-center gap-2.5">
                  <LogoMark size={30} />
                  <span className="font-display text-[15px] font-bold text-white">
                    <span className="text-[#5cc0de]">Klima</span>ENG
                  </span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Mbyll menynë"
                  className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white focus-ring"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
              <SidebarFooter />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* topbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line glass px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Hap menynë"
            className="rounded-full p-2 text-ink hover:bg-surface-2 focus-ring lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="min-w-0 truncate font-display text-lg font-bold text-ink">
            {current?.label ?? "Admin"}
          </h1>

          <div className="ml-auto flex items-center gap-1.5">
            {/* activity bell */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen((v) => !v)}
                aria-label="Aktiviteti i fundit"
                aria-expanded={bellOpen}
                className="relative rounded-full p-2.5 text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink focus-ring"
              >
                <Bell size={18} />
                {activities.length > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-brand-500" />
                )}
              </button>
              <AnimatePresence>
                {bellOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-surface card-shadow-lg"
                  >
                    <p className="border-b border-line px-4 py-3 text-sm font-bold text-ink">
                      Aktiviteti i fundit
                    </p>
                    <ul className="max-h-80 overflow-y-auto">
                      {activities.slice(0, 8).map((a) => (
                        <li key={a.id} className="border-b border-line px-4 py-3 last:border-0">
                          <p className="text-[13px] font-semibold text-ink">
                            {a.actor} · <span className="font-medium text-ink-2">{a.action}</span>
                          </p>
                          {a.detail && (
                            <p className="mt-0.5 truncate text-xs text-muted">{a.detail}</p>
                          )}
                          <p className="mt-1 text-[11px] text-muted">{timeAgo(a.createdAt)}</p>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/admin/aktiviteti"
                      onClick={() => setBellOpen(false)}
                      className="block px-4 py-2.5 text-center text-xs font-bold text-brand-600 hover:bg-surface-2 dark:text-brand-300"
                    >
                      Shiko të gjithë aktivitetin
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="ml-1 hidden items-center gap-2.5 sm:flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-frost-500 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="text-sm font-semibold text-ink">{userName}</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
