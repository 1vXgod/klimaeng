"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-full flex-col items-center justify-center rounded-3xl border border-line bg-surface p-10 text-center card-shadow"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 18 }}
          className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10"
        >
          <CheckCircle2 size={30} />
        </motion.span>
        <h3 className="mt-5 font-display text-2xl font-bold text-ink">Mesazhi u dërgua!</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">
          Faleminderit që na kontaktuat. Do t’ju përgjigjemi brenda 24 orëve —
          zakonisht shumë më shpejt.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
          Dërgo një mesazh tjetër
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await sendContactMessage({
            name: String(formData.get("name") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            email: String(formData.get("email") ?? ""),
            message: String(formData.get("message") ?? ""),
          });
          if (result.ok) setSent(true);
          else setError(result.error);
        });
      }}
      className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8"
    >
      <h2 className="font-display text-xl font-bold text-ink">Na shkruani</h2>
      <p className="mt-1 text-sm text-muted">Ju përgjigjemi brenda 24 orëve.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Emri *">
          <Input name="name" required minLength={3} placeholder="Emri juaj" autoComplete="name" />
        </Field>
        <Field label="Telefoni">
          <Input name="phone" type="tel" placeholder="+383 4x xxx xxx" autoComplete="tel" />
        </Field>
        <Field label="Email *" className="sm:col-span-2">
          <Input name="email" type="email" required placeholder="ju@email.com" autoComplete="email" />
        </Field>
        <Field label="Mesazhi *" className="sm:col-span-2">
          <Textarea
            name="message"
            required
            minLength={10}
            rows={5}
            placeholder="Përshkruani hapësirën tuaj ose pyetjen — sa m², cili kat, çfarë kërkoni…"
          />
        </Field>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Duke dërguar…
          </>
        ) : (
          <>
            <Send size={16} /> Dërgo Mesazhin
          </>
        )}
      </Button>
    </form>
  );
}
