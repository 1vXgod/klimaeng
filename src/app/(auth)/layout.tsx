import { ShieldCheck, Star, Wrench } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* brand panel */}
      <aside className="relative hidden overflow-hidden bg-night-950 p-12 text-white lg:flex lg:flex-col">
        <div aria-hidden className="absolute inset-0 blueprint-grid opacity-50" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(42rem 30rem at 0% 0%, rgba(36,86,224,0.35), transparent 60%), radial-gradient(36rem 26rem at 100% 100%, rgba(14,170,205,0.2), transparent 60%)",
          }}
        />
        <Link href="/" className="relative w-fit focus-ring rounded-lg">
          <Logo onDark />
        </Link>

        <div className="relative mt-auto max-w-md">
          <blockquote className="font-display text-3xl leading-snug font-bold tracking-tight text-balance">
            “Montimi u krye brenda ditës. Profesionistë të vërtetë —
            rekomandim maksimal!”
          </blockquote>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#f5a623" stroke="#f5a623" />
              ))}
            </span>
            Arben K. — Prishtinë
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 text-sm">
            <p className="flex items-center gap-2.5 text-slate-300">
              <ShieldCheck size={17} className="text-frost-400" />
              Garanci deri në 5 vjet
            </p>
            <p className="flex items-center gap-2.5 text-slate-300">
              <Wrench size={16} className="text-frost-400" />
              1.200+ montime
            </p>
          </div>
        </div>
      </aside>

      {/* form panel */}
      <main className="relative flex flex-col bg-bg px-5 py-8 sm:px-10">
        <Link href="/" className="w-fit focus-ring rounded-lg lg:hidden">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-105">{children}</div>
        </div>
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} KlimaENG ·{" "}
          <Link href="/" className="underline-offset-2 hover:text-ink hover:underline">
            Kthehu në faqen kryesore
          </Link>
        </p>
      </main>
    </div>
  );
}
