"use client";

import { Loader2, MailCheck, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Reusable 6-digit code entry block for email verification / password reset.
 * `demoCode` (present only when no email provider is configured) is shown as
 * a development hint so the flow stays fully usable without SMTP/Resend.
 */
export function CodeStep({
  email,
  title = "Shkruani kodin e verifikimit",
  description,
  submitLabel = "Verifiko",
  busy,
  error,
  demoCode,
  onSubmit,
  onResend,
  children,
}: {
  email: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  busy?: boolean;
  error?: string | null;
  demoCode?: string | null;
  onSubmit: (code: string) => void;
  onResend: () => Promise<void> | void;
  children?: React.ReactNode;
}) {
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resend = async () => {
    if (cooldown > 0) return;
    setCooldown(60);
    await onResend();
  };

  return (
    <div>
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        <MailCheck size={24} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        {description ?? (
          <>
            Dërguam një kod 6-shifror në{" "}
            <strong className="font-semibold text-ink">{email}</strong>. Kodi vlen
            15 minuta.
          </>
        )}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) onSubmit(code);
        }}
        className="mt-7 space-y-4"
      >
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          aria-label="Kodi 6-shifror"
          className="h-16 w-full rounded-2xl border border-line-2 bg-surface text-center font-display text-2xl font-bold tracking-[0.4em] text-ink placeholder:text-line-2 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 sm:text-3xl sm:tracking-[0.6em]"
        />

        {children}

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        {demoCode && (
          <p className="rounded-xl border border-dashed border-line-2 bg-surface px-4 py-2.5 text-xs text-muted">
            <strong className="text-ink-2">Modalitet demo</strong> (asnjë provajder
            email-i i konfiguruar) — kodi juaj:{" "}
            <strong className="font-mono text-brand-600 dark:text-brand-300">{demoCode}</strong>
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy || code.length !== 6}>
          {busy ? <Loader2 size={17} className="animate-spin" /> : null}
          {submitLabel}
        </Button>
      </form>

      <button
        onClick={resend}
        disabled={cooldown > 0}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 underline-offset-2 hover:underline disabled:cursor-default disabled:text-muted disabled:no-underline dark:text-brand-300"
      >
        <RotateCcw size={13} />
        {cooldown > 0 ? `Ridërgo kodin (${cooldown}s)` : "Ridërgo kodin"}
      </button>
    </div>
  );
}
