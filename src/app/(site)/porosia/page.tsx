"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, PackageCheck, ShieldCheck, Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { createOrder } from "@/app/actions/orders";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { Field, Input, Switch, Textarea } from "@/components/ui/Field";
import { useMounted } from "@/lib/hooks";
import { formatBtu, formatEur } from "@/lib/utils";
import { cartLineKey, useCart } from "@/stores/shop";

export default function CheckoutPage() {
  const mounted = useMounted();
  const { data: session } = useSession();
  const { items, clear } = useCart();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [withInstallation, setWithInstallation] = useState(true);

  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  const submit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await createOrder({
        customerName: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        city: String(formData.get("city") ?? ""),
        street: String(formData.get("street") ?? ""),
        note: String(formData.get("note") ?? ""),
        withInstallation,
        items: items.map((i) => ({ productId: i.id, qty: i.qty, variantBtu: i.variantBtu ?? null })),
      });
      if (result.ok) {
        setDone(result.orderNo);
        clear();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(result.error);
      }
    });
  };

  if (done) {
    return (
      <div className="container-site pt-32 pb-24 md:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg rounded-4xl border border-line bg-surface p-10 text-center card-shadow-lg"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10"
          >
            <PackageCheck size={36} />
          </motion.span>
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">
            Porosia u pranua!
          </h1>
          <p className="mt-3 text-ink-2">
            Numri i porosisë suaj është{" "}
            <strong className="font-display text-brand-600 dark:text-brand-300">{done}</strong>.
            Do t’ju kontaktojmë brenda 24 orëve për konfirmim dhe terminin e montimit.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/produktet" variant="secondary">
              Vazhdo blerjet
            </Button>
            <Button href={session ? "/llogaria/porosite" : "/"}>
              {session ? "Shiko porositë e mia" : "Kthehu në ballinë"}
              <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-site pt-28 pb-20 md:pt-36">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Përfundo porosinë
      </h1>
      <p className="mt-2 max-w-xl text-ink-2">
        Pa pagesë online — paguani me para në dorë ose me këste pas montimit.
        Konfirmimi bëhet me telefon brenda 24 orëve.
      </p>

      {mounted && items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-24 text-center">
          <p className="font-display text-xl font-bold text-ink">Shporta juaj është bosh</p>
          <Button href="/produktet" className="mt-6">
            Shfleto Produktet <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* form */}
          <form action={submit} className="space-y-5">
            <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
              <h2 className="font-display text-lg font-bold text-ink">Të dhënat e kontaktit</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Emri i plotë *">
                  <Input
                    name="name"
                    required
                    minLength={3}
                    defaultValue={session?.user?.name ?? ""}
                    placeholder="p.sh. Arta Krasniqi"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Telefoni *">
                  <Input
                    name="phone"
                    required
                    type="tel"
                    placeholder="+383 4x xxx xxx"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email *" className="sm:col-span-2">
                  <Input
                    name="email"
                    required
                    type="email"
                    defaultValue={session?.user?.email ?? ""}
                    placeholder="ju@email.com"
                    autoComplete="email"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6 card-shadow md:p-8">
              <h2 className="font-display text-lg font-bold text-ink">Adresa e montimit</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Qyteti *">
                  <Input name="city" required placeholder="Prishtinë" autoComplete="address-level2" />
                </Field>
                <Field label="Rruga dhe numri *">
                  <Input name="street" required placeholder="Rr. Agim Ramadani 24" autoComplete="street-address" />
                </Field>
                <Field label="Shënim shtesë (opsionale)" className="sm:col-span-2">
                  <Textarea
                    name="note"
                    placeholder="Kati, orari i preferuar i montimit, veçori të objektit…"
                  />
                </Field>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-500/20 dark:bg-brand-500/10">
                <div className="flex items-center gap-3">
                  <Wrench size={18} className="shrink-0 text-brand-600 dark:text-brand-300" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Dëshiroj montim profesional</p>
                    <p className="text-xs text-ink-2">
                      Çmim preferencial 40–60€, konfirmohet me telefon
                    </p>
                  </div>
                </div>
                <Switch
                  checked={withInstallation}
                  onChange={setWithInstallation}
                  label="Montim profesional"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending || items.length === 0}>
              {isPending ? (
                <>
                  <Loader2 size={17} className="animate-spin" /> Duke dërguar…
                </>
              ) : (
                <>
                  Dërgo Porosinë <ArrowRight size={17} />
                </>
              )}
            </Button>
          </form>

          {/* summary */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-3xl border border-line bg-surface p-6 card-shadow">
              <h2 className="font-display text-lg font-bold text-ink">Përmbledhja</h2>
              <ul className="mt-4 divide-y divide-line">
                {items.map((item) => {
                  const btu = item.variantBtu ?? item.btu;
                  return (
                    <li key={cartLineKey(item)} className="flex items-center gap-3 py-3">
                      <span className="h-13 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                        <ProductVisual render={item.render} accent={item.accent} className="h-full w-full p-1" glow={false} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{item.name}</span>
                        <span className="text-xs text-muted">
                          {btu ? `${formatBtu(btu)} · ` : ""}
                          {item.qty} × {formatEur(item.price)}
                        </span>
                      </span>
                      <span className="text-sm font-bold text-ink">{formatEur(item.price * item.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-ink-2">
                  <span>Nëntotali</span>
                  <span className="font-semibold">{formatEur(total)}</span>
                </div>
                <div className="flex justify-between text-ink-2">
                  <span>Transporti (Prishtinë)</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Falas</span>
                </div>
                <div className="flex justify-between text-ink-2">
                  <span>Montimi</span>
                  <span className="font-semibold">{withInstallation ? "40–60€ (me telefon)" : "—"}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <span className="font-semibold text-ink">Totali</span>
                  <span className="font-display text-2xl font-extrabold text-ink">{formatEur(total)}</span>
                </div>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5 px-2 text-[13px] text-ink-2">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-500" />
                Pa pagesë paraprake — paguani pas montimit
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="shrink-0 text-emerald-500" />
                Garanci zyrtare + 2 vjet garanci pune
              </li>
            </ul>
          </aside>
        </div>
      )}
    </div>
  );
}
