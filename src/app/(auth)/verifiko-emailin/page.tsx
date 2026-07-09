"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { resendVerificationCode, verifyEmail } from "@/app/actions/auth";
import { CodeStep } from "@/components/auth/CodeStep";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const autoSend = searchParams.get("send") === "1";

  const [email, setEmail] = useState(emailFromQuery);
  const [sent, setSent] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const requested = useRef(false);

  // Coming from the login page ("account not verified") we auto-send once.
  useEffect(() => {
    if (autoSend && emailFromQuery && !requested.current) {
      requested.current = true;
      void resendVerificationCode(emailFromQuery).then((r) => {
        if (r.ok) {
          setDemoCode(r.demoCode ?? null);
          setSent(true);
        }
      });
    }
  }, [autoSend, emailFromQuery]);

  const requestCode = (formData: FormData) => {
    const value = String(formData.get("email") ?? "").trim().toLowerCase();
    setError(null);
    startTransition(async () => {
      const result = await resendVerificationCode(value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEmail(value);
      setDemoCode(result.demoCode ?? null);
      setSent(true);
    });
  };

  const submitCode = (code: string) => {
    setError(null);
    startTransition(async () => {
      const result = await verifyEmail({ email, code });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/kycu?verifikuar=1");
    });
  };

  if (!sent) {
    return (
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Verifikoni email-in
        </h1>
        <p className="mt-2 text-sm text-ink-2">
          Shkruani adresën me të cilën u regjistruat dhe ju dërgojmë një kod të ri verifikimi.
        </p>
        <form action={requestCode} className="mt-8 space-y-4">
          <Field label="Email">
            <Input
              name="email"
              type="email"
              required
              defaultValue={emailFromQuery}
              placeholder="ju@email.com"
              autoComplete="email"
            />
          </Field>
          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            Dërgo kodin
          </Button>
        </form>
      </div>
    );
  }

  return (
    <CodeStep
      email={email}
      title="Verifikoni email-in tuaj"
      submitLabel="Verifiko llogarinë"
      busy={isPending}
      error={error}
      demoCode={demoCode}
      onSubmit={submitCode}
      onResend={async () => {
        const result = await resendVerificationCode(email);
        if (result.ok && result.demoCode) setDemoCode(result.demoCode);
      }}
    />
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailInner />
    </Suspense>
  );
}
