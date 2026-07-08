import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-night-950 px-6 text-center text-white">
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-50" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 26rem at 50% 0%, rgba(36,86,224,0.3), transparent 60%), radial-gradient(30rem 22rem at 50% 110%, rgba(14,170,205,0.18), transparent 60%)",
        }}
      />
      <Link href="/" className="relative mb-10 focus-ring rounded-lg">
        <Logo onDark />
      </Link>
      <p className="relative font-display text-[6rem] leading-none font-extrabold tracking-tight sm:text-[8rem]">
        4<span className="gradient-text">0</span>4
      </p>
      <h1 className="relative mt-4 font-display text-2xl font-bold">
        Kjo faqe ka humbur në ajër
      </h1>
      <p className="relative mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        Faqja që kërkoni nuk ekziston ose është zhvendosur. Por temperatura e
        duhur ju pret në ballinë.
      </p>
      <div className="relative mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-7 text-sm font-semibold text-white shadow-[0_10px_24px_-6px_rgba(36,86,224,0.55)] transition-all hover:shadow-lg active:scale-[0.98] focus-ring"
        >
          <ArrowLeft size={16} /> Kthehu në ballinë
        </Link>
        <Link
          href="/produktet"
          className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20 focus-ring"
        >
          <Compass size={16} /> Shfleto produktet
        </Link>
      </div>
    </div>
  );
}
