"use client";

import { Globe, Loader2, Moon, Save, Sun, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { useIsDark } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export function SettingsForm({
  user,
}: {
  user: { name: string; email: string; phone: string | null; language: string };
}) {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [language, setLanguage] = useState(user.language);
  // The `.dark` class on <html> is the single source of truth for theme.
  const theme = useIsDark() ? "dark" : "light";

  const applyTheme = (next: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("klimaeng-theme", next);
    } catch {}
    // Persist preference silently; UI has already switched.
    void updateProfile({ name: user.name, phone: user.phone ?? "", theme: next });
  };

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const name = String(formData.get("name") ?? "");
      const result = await updateProfile({
        name,
        phone: String(formData.get("phone") ?? ""),
        language,
        theme,
      });
      if (result.ok) {
        toast("Profili u përditësua");
        await update({ name });
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    });
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* profile */}
      <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <UserRound size={19} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Profili</h2>
            <p className="text-sm text-muted">Të dhënat tuaja personale.</p>
          </div>
        </div>

        <form action={submit} className="mt-6 space-y-4">
          <Field label="Emri i plotë">
            <Input name="name" defaultValue={user.name} required minLength={3} autoComplete="name" />
          </Field>
          <Field label="Email" hint="Email-i nuk mund të ndryshohet — na kontaktoni për ndihmë.">
            <Input value={user.email} disabled readOnly />
          </Field>
          <Field label="Telefoni">
            <Input name="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="+383 4x xxx xxx" autoComplete="tel" />
          </Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Ruaj ndryshimet
          </Button>
        </form>
      </div>

      {/* appearance */}
      <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Pamja</h2>
        <p className="mt-1 text-sm text-muted">
          Tema aplikohet menjëherë në gjithë faqen, në këtë pajisje.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {(
            [
              { id: "light", label: "E çelët", icon: <Sun size={17} /> },
              { id: "dark", label: "E errët", icon: <Moon size={17} /> },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              onClick={() => applyTheme(option.id)}
              aria-pressed={theme === option.id}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-2xl border px-4 py-4 text-sm font-semibold transition-all focus-ring",
                theme === option.id
                  ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"
                  : "border-line-2 bg-bg text-ink-2 hover:border-brand-300"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* language */}
      <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <Globe size={18} className="text-brand-500" /> Gjuha
            </h2>
            <p className="mt-1 text-sm text-muted">Gjuha e preferuar e komunikimit.</p>
          </div>
          <Badge tone="frost">English — së shpejti</Badge>
        </div>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-4 max-w-52"
          aria-label="Zgjidh gjuhën"
        >
          <option value="sq">Shqip</option>
          <option value="en" disabled>
            English (së shpejti)
          </option>
        </Select>
      </div>
    </div>
  );
}
