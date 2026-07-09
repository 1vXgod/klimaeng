"use client";

import { RefreshCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10">
        <TriangleAlert size={28} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-extrabold text-ink">
        Diçka shkoi keq
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-2">
        Ndodhi një gabim i papritur. Provoni ta rifreskoni faqen — nëse problemi
        vazhdon, na njoftoni në avnibunjaku@hotmail.com.
      </p>
      <div className="mt-7 flex gap-3">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-b from-brand-500 to-brand-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(36,86,224,0.5)] transition-all hover:shadow-lg active:scale-[0.98] focus-ring"
        >
          <RefreshCcw size={15} /> Provo përsëri
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border border-line-2 bg-surface px-6 text-sm font-semibold text-ink transition-colors hover:border-brand-300 focus-ring"
        >
          Ballina
        </Link>
      </div>
    </div>
  );
}
