"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Phone,
  Scale,
  Settings,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useMounted, useScrolled } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useCart, useCompare, useWishlist } from "@/stores/shop";

const LINKS = [
  { href: "/", label: "Ballina" },
  { href: "/produktet", label: "Produktet" },
  { href: "/sherbimet", label: "Shërbimet" },
  { href: "/rreth-nesh", label: "Rreth Nesh" },
  { href: "/kontakti", label: "Kontakti" },
];

function CountBubble({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="absolute -top-1 -right-1 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function AccountMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (status === "loading") {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-surface-3" />;
  }

  if (!session?.user) {
    return (
      <Button href="/kycu" variant="secondary" size="sm" className="hidden rounded-full sm:inline-flex">
        <User size={15} />
        Kyçu
      </Button>
    );
  }

  const initials = (session.user.name ?? "K")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menyja e llogarisë"
        className="flex items-center gap-1.5 rounded-full p-1 transition-colors hover:bg-surface-2 focus-ring"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-frost-500 text-xs font-bold text-white">
          {initials}
        </span>
        <ChevronDown
          size={14}
          className={cn("mr-1 hidden text-muted transition-transform sm:block", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 card-shadow-lg"
          >
            <div className="border-b border-line px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-ink">{session.user.name}</p>
              <p className="truncate text-xs text-muted">{session.user.email}</p>
            </div>
            <nav className="mt-1.5 space-y-0.5" onClick={() => setOpen(false)}>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                >
                  <LayoutDashboard size={16} /> Paneli Admin
                </Link>
              )}
              <Link
                href="/llogaria"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <User size={16} /> Llogaria ime
              </Link>
              <Link
                href="/llogaria/porosite"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Package size={16} /> Porositë e mia
              </Link>
              <Link
                href="/llogaria/cilesimet"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <Settings size={16} /> Cilësimet
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} /> Dilni
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const mounted = useMounted();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const wishlistCount = useWishlist((s) => s.items.length);
  const compareCount = useCompare((s) => s.items.length);
  const cartCount = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const openCart = useCart((s) => s.open);

  // Wishlist & cart are member features — shown only after login.
  const loggedIn = !!session?.user;

  // Close the mobile menu on navigation (derived-state pattern, no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Over the homepage's dark cinematic hero the bar renders light-on-dark.
  const onHero = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-all duration-300",
          scrolled ? "glass border-b border-line card-shadow" : "bg-transparent"
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-3 md:h-[4.5rem]">
          <Link href="/" aria-label="KlimaENG — Ballina" className="focus-ring rounded-lg">
            <Logo onDark={onHero} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigimi kryesor">
            {LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-ring",
                    active
                      ? onHero
                        ? "text-white"
                        : "text-brand-700 dark:text-brand-300"
                      : onHero
                        ? "text-slate-300 hover:text-white"
                        : "text-ink-2 hover:text-ink"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-full",
                        onHero ? "bg-white/12" : "bg-brand-50 dark:bg-brand-500/10"
                      )}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {mounted && compareCount > 0 && (
              <Link
                href="/krahaso"
                aria-label={`Krahaso (${compareCount})`}
                className={cn(
                  "relative hidden rounded-full p-2.5 transition-colors focus-ring sm:block",
                  onHero
                    ? "text-slate-300 hover:bg-white/10 hover:text-white"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                <Scale size={19} />
                <CountBubble count={compareCount} />
              </Link>
            )}
            {loggedIn && (
              <>
                <Link
                  href="/lista-e-deshirave"
                  aria-label="Lista e dëshirave"
                  className={cn(
                    "relative rounded-full p-2 transition-colors focus-ring sm:p-2.5",
                    onHero
                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <Heart size={19} />
                  {mounted && <CountBubble count={wishlistCount} />}
                </Link>
                <button
                  onClick={openCart}
                  aria-label="Shporta"
                  className={cn(
                    "relative rounded-full p-2 transition-colors focus-ring sm:p-2.5",
                    onHero
                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  )}
                >
                  <ShoppingBag size={19} />
                  {mounted && <CountBubble count={cartCount} />}
                </button>
              </>
            )}

            <AccountMenu />

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Hap menynë"
              className={cn(
                "rounded-full p-2 transition-colors focus-ring sm:p-2.5 lg:hidden",
                onHero ? "text-white hover:bg-white/10" : "text-ink hover:bg-surface-2"
              )}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-95 flex flex-col bg-bg lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="container-site flex h-16 items-center justify-between">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Mbyll menynë"
                className="rounded-full p-2.5 text-ink transition-colors hover:bg-surface-2 focus-ring"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="container-site mt-6 flex flex-col gap-1" aria-label="Navigimi mobil">
              {LINKS.map((link, i) => {
                const active =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.055, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-2xl px-4 py-3.5 font-display text-2xl font-bold tracking-tight transition-colors",
                        active ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300" : "text-ink hover:bg-surface-2"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34 }}
              className="container-site mt-auto mb-8 space-y-3"
            >
              {!loggedIn && (
                <Button href="/kycu" size="lg" className="w-full">
                  <User size={16} /> Kyçu në llogari
                </Button>
              )}
              <a
                href="tel:+38344111051"
                className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-ink-2"
              >
                <Phone size={15} className="text-brand-500" /> 044-111-051 / 049-111-051
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
