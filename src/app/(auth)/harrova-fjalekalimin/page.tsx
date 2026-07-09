"use client";

import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { requestPasswordReset, resetPasswordWithCode } from "@/app/actions/auth";
import { CodeStep } from "@/components/auth/CodeStep";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"email" | "code" | "done">("email");
  const [email, setEmail] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const requestCode = (formData: FormData) => {
    const value = String(formData.get("email") ?? "").trim().toLowerCase();
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEmail(value);
      setDemoCode(result.demoCode ?? null);
      setStep("code");
    });
  };

  const submitCode = (code: string) => {
    setError(null);
    if (password.length < 8) {
      setError("Fjalëkalimi i ri duhet të ketë të paktën 8 karaktere.");
      return;
    }
    if (password !== confirm) {
      setError("Fjalëkalimet nuk përputhen.");
      return;
    }
    startTransition(async () => {
      const result = await resetPasswordWithCode({ email, code, password });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStep("done");
    });
  };

  if (step === "done") {
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

  if (step === "code") {
    return (
      <CodeStep
        email={email}
        title="Rivendosni fjalëkalimin"
        description={`Dërguam një kod 6-shifror në ${email}. Shkruani kodin dhe zgjidhni fjalëkalimin e ri.`}
        submitLabel="Ruaj fjalëkalimin e ri"
        busy={isPending}
        error={error}
        demoCode={demoCode}
        onSubmit={submitCode}
        onResend={async () => {
          const result = await requestPasswordReset(email);
          if (result.ok && result.demoCode) setDemoCode(result.demoCode);
        }}
      >
        <Field label="Fjalëkalimi i ri" hint="Të paktën 8 karaktere">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>
        <Field label="Përsërite fjalëkalimin">
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="••••••••"
          />
        </Field>
      </CodeStep>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Rivendosni fjalëkalimin
      </h1>
      <p className="mt-2 text-sm text-ink-2">
        Shkruani email-in tuaj dhe ju dërgojmë një kod 6-shifror për rivendosje.
      </p>

      <form action={requestCode} className="mt-8 space-y-4">
        <Field label="Email">
          <Input name="email" type="email" required placeholder="ju@email.com" autoComplete="email" />
        </Field>
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Duke dërguar…
            </>
          ) : (
            <>
              <KeyRound size={17} /> Dërgo kodin
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
