"use client";

import { CheckCircle2, Loader2, LockKeyhole } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { resetPassword } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">
          Fjalëkalimi u ndryshua!
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-2">
          Tani mund të kyçeni me fjalëkalimin tuaj të ri.
        </p>
        <Button href="/kycu" className="mt-7">
          Kyçu tani
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Fjalëkalim i ri
      </h1>
      <p className="mt-2 text-sm text-ink-2">
        Zgjidhni një fjalëkalim të ri për llogarinë tuaj.
      </p>

      <form
        action={(formData) => {
          setError(null);
          const password = String(formData.get("password") ?? "");
          const confirm = String(formData.get("confirm") ?? "");
          if (password !== confirm) {
            setError("Fjalëkalimet nuk përputhen.");
            return;
          }
          startTransition(async () => {
            const result = await resetPassword({ token, password });
            if (result.ok) setDone(true);
            else setError(result.error);
          });
        }}
        className="mt-8 space-y-4"
      >
        <Field label="Fjalëkalimi i ri" hint="Të paktën 8 karaktere">
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
        </Field>
        <Field label="Përsërite fjalëkalimin">
          <Input name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
        </Field>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Duke ruajtur…
            </>
          ) : (
            <>
              <LockKeyhole size={17} /> Ruaj fjalëkalimin
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
