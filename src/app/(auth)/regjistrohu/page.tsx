"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (formData: FormData) => {
    setError(null);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await registerUser({
        name: String(formData.get("name") ?? ""),
        email,
        phone: String(formData.get("phone") ?? ""),
        password,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      await signIn("credentials", { email, password, redirect: false });
      router.push("/llogaria");
      router.refresh();
    });
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Krijoni llogarinë tuaj
      </h1>
      <p className="mt-2 text-sm text-ink-2">
        Ndiqni porositë, ruani produktet e preferuara dhe merrni oferta ekskluzive.
      </p>

      <form action={submit} className="mt-8 space-y-4">
        <Field label="Emri i plotë">
          <Input name="name" required minLength={3} placeholder="p.sh. Arta Krasniqi" autoComplete="name" />
        </Field>
        <Field label="Email">
          <Input name="email" type="email" required placeholder="ju@email.com" autoComplete="email" />
        </Field>
        <Field label="Telefoni (opsionale)">
          <Input name="phone" type="tel" placeholder="+383 4x xxx xxx" autoComplete="tel" />
        </Field>
        <Field label="Fjalëkalimi" hint="Të paktën 8 karaktere">
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Fshih fjalëkalimin" : "Shfaq fjalëkalimin"}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted transition-colors hover:text-ink"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </Field>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Duke krijuar…
            </>
          ) : (
            <>
              <UserPlus size={17} /> Regjistrohu
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-2">
        Keni llogari?{" "}
        <Link
          href="/kycu"
          className="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
        >
          Kyçuni këtu
        </Link>
      </p>
    </div>
  );
}
