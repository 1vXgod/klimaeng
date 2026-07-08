"use client";

import { KeyRound, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { requestPasswordReset } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
          <MailCheck size={28} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
          Kontrolloni email-in
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-2">
          Nëse ekziston një llogari me këtë email, sapo ju dërguam udhëzimet për
          rivendosjen e fjalëkalimit. Linku vlen 60 minuta.
        </p>
        {resetUrl && (
          <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-dashed border-line-2 bg-surface p-4 text-left text-xs text-muted">
            <p className="font-semibold text-ink-2">
              Modalitet demo (pa SMTP të konfiguruar):
            </p>
            <Link
              href={resetUrl}
              className="mt-1 block truncate font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
            >
              Hape linkun e rivendosjes →
            </Link>
          </div>
        )}
        <Button href="/kycu" variant="secondary" className="mt-7">
          Kthehu te kyçja
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Rivendosni fjalëkalimin
      </h1>
      <p className="mt-2 text-sm text-ink-2">
        Shkruani email-in tuaj dhe ju dërgojmë një link të sigurt rivendosjeje.
      </p>

      <form
        action={(formData) => {
          startTransition(async () => {
            const result = await requestPasswordReset(String(formData.get("email") ?? ""));
            setResetUrl(result.resetUrl ?? null);
            setSent(true);
          });
        }}
        className="mt-8 space-y-4"
      >
        <Field label="Email">
          <Input name="email" type="email" required placeholder="ju@email.com" autoComplete="email" />
        </Field>
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Duke dërguar…
            </>
          ) : (
            <>
              <KeyRound size={17} /> Dërgo linkun
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        E mbani mend fjalëkalimin?{" "}
        <Link href="/kycu" className="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300">
          Kyçuni
        </Link>
      </p>
    </div>
  );
}
