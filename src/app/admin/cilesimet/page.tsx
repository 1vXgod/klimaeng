"use client";

import {
  Building2,
  MessageSquareText,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { useIsDark, useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Prefs = {
  emailOnOrder: boolean;
  emailOnMessage: boolean;
  lowStockAlerts: boolean;
};

const DEFAULT_PREFS: Prefs = {
  emailOnOrder: true,
  emailOnMessage: true,
  lowStockAlerts: true,
};

function readStoredPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const stored = localStorage.getItem("klimaeng-admin-prefs");
    return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function AdminSettingsPage() {
  const mounted = useMounted();
  const [prefs, setPrefs] = useState<Prefs>(readStoredPrefs);
  const theme = useIsDark() ? "dark" : "light";

  const applyTheme = (next: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("klimaeng-theme", next);
    } catch {}
  };

  const setPref = (key: keyof Prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      localStorage.setItem("klimaeng-admin-prefs", JSON.stringify(next));
    } catch {}
    toast("Preferenca u ruajt");
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* company */}
      <section className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <Building2 size={19} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Të dhënat e biznesit</h2>
            <p className="text-sm text-muted">Shfaqen në faqe, fatura dhe email-e.</p>
          </div>
        </div>
        <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {(
            [
              ["Emri", "KlimaENG SH.P.K."],
              ["NUI", "81XXXXXXX"],
              ["Adresa", "Rr. Nëna Terezë, Prishtinë"],
              ["Telefoni", "+383 44 000 000"],
              ["Email", "info@klimaeng.com"],
              ["Orari", "Hën–Sht 08:00–18:00"],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="rounded-xl bg-surface-2/60 px-4 py-2.5">
              <dt className="text-[11px] font-semibold tracking-wider text-muted uppercase">{label}</dt>
              <dd className="mt-0.5 font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* appearance */}
      <section className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-7">
        <h2 className="font-display text-lg font-bold text-ink">Pamja e panelit</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
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
      </section>

      {/* notifications */}
      <section className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-7">
        <h2 className="font-display text-lg font-bold text-ink">Njoftimet</h2>
        <p className="mt-1 text-sm text-muted">
          Preferencat ruhen në këtë pajisje. Dërgimi me email aktivizohet kur të
          konfigurohet SMTP në prodhim.
        </p>
        <div className="mt-4 space-y-3">
          {(
            [
              ["emailOnOrder", "Njofto për çdo porosi të re"],
              ["emailOnMessage", "Njofto për mesazhe të reja kontakti"],
              ["lowStockAlerts", "Paralajmëro kur stoku bie nën 5 copë"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg px-4 py-3"
            >
              <span className="text-sm font-semibold text-ink">{label}</span>
              <Switch
                checked={mounted ? prefs[key] : true}
                onChange={(v) => setPref(key, v)}
                label={label}
              />
            </label>
          ))}
        </div>
      </section>

      {/* integrations */}
      <section className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-7">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-frost-50 text-frost-600 dark:bg-frost-500/10 dark:text-frost-300">
            <MessageSquareText size={19} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Live Chat (3CX)</h2>
            <p className="text-sm text-muted">Sistemi i chat-it është modular.</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-surface-2/70 p-4 text-[13px] leading-relaxed text-ink-2">
          <p>
            Aktualisht është aktiv <strong className="text-ink">Asistenti KlimaENG</strong>{" "}
            (i integruar, pa kosto). Për të kaluar në <strong className="text-ink">3CX Live Chat</strong>,
            vendosni në <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">.env</code>:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-night-950 p-3 font-mono text-xs text-frost-300">
{`NEXT_PUBLIC_CHAT_PROVIDER="3cx"
NEXT_PUBLIC_3CX_CHAT_URL="https://juaj.3cx.eu"`}
          </pre>
          <p className="mt-2">Rikthimi te asistenti: <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_CHAT_PROVIDER=&quot;klima&quot;</code></p>
        </div>
      </section>

    </div>
  );
}
