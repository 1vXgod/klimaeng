"use client";

import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { changePassword } from "@/app/actions/account";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";

export default function SecurityPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const submit = (formData: FormData) => {
    setError(null);
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");
    if (next !== confirm) {
      setError("Fjalëkalimet e reja nuk përputhen.");
      return;
    }
    startTransition(async () => {
      const result = await changePassword({
        current: String(formData.get("current") ?? ""),
        next,
      });
      if (result.ok) {
        toast("Fjalëkalimi u ndryshua me sukses");
        formRef.current?.reset();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            <LockKeyhole size={19} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Ndrysho fjalëkalimin</h2>
            <p className="text-sm text-muted">Përdorni një fjalëkalim unik dhe të fortë.</p>
          </div>
        </div>

        <form ref={formRef} action={submit} className="mt-6 space-y-4">
          <Field label="Fjalëkalimi aktual">
            <Input name="current" type="password" required autoComplete="current-password" placeholder="••••••••" />
          </Field>
          <Field label="Fjalëkalimi i ri" hint="Të paktën 8 karaktere">
            <Input name="next" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
          </Field>
          <Field label="Përsërite fjalëkalimin e ri">
            <Input name="confirm" type="password" required minLength={8} autoComplete="new-password" placeholder="••••••••" />
          </Field>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            Ruaj fjalëkalimin
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-line bg-surface-2/60 p-6 text-sm leading-relaxed text-ink-2">
        <p className="font-semibold text-ink">Këshilla sigurie</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-[13px]">
          <li>Asnjëherë mos e ndani fjalëkalimin me askënd — as me stafin tonë.</li>
          <li>Pas çdo ndryshimi fjalëkalimi ju dërgojmë njoftim sigurie.</li>
          <li>Nëse dyshoni për qasje të paautorizuar, na telefononi menjëherë.</li>
        </ul>
      </div>
    </div>
  );
}
