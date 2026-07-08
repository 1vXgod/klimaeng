"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      setError("Email-i ose fjalëkalimi është i pasaktë.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    router.push(
      callbackUrl ?? (session?.user?.role === "ADMIN" ? "/admin" : "/llogaria")
    );
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
        Mirë se u kthyet
      </h1>
      <p className="mt-2 text-sm text-ink-2">
        Kyçuni për të ndjekur porositë, dëshirat dhe cilësimet tuaja.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Email">
          <Input
            name="email"
            type="email"
            required
            placeholder="ju@email.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Fjalëkalimi">
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-ink-2">
            <input
              type="checkbox"
              name="remember"
              defaultChecked
              className="h-4 w-4 rounded border-line-2 accent-brand-600"
            />
            Më mbaj të kyçur
          </label>
          <Link
            href="/harrova-fjalekalimin"
            className="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
          >
            Harruat fjalëkalimin?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Duke u kyçur…
            </>
          ) : (
            <>
              <LogIn size={17} /> Kyçu
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-line-2 bg-surface p-4 text-xs leading-relaxed text-muted">
        <p className="font-semibold text-ink-2">Llogari demo për testim:</p>
        <p className="mt-1">Admin — admin@klimaeng.com / Admin123!</p>
        <p>Klient — demo@klimaeng.com / Demo123!</p>
      </div>

      <p className="mt-6 text-center text-sm text-ink-2">
        S’keni llogari?{" "}
        <Link
          href="/regjistrohu"
          className="font-semibold text-brand-600 underline-offset-2 hover:underline dark:text-brand-300"
        >
          Regjistrohuni falas
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
