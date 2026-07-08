"use client";

import { Home, Loader2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAddress, saveAddress } from "@/app/actions/account";
import { Button } from "@/components/ui/Button";
import { Field, Input, Switch } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/Badge";

export type AddressData = {
  id: string;
  label: string;
  street: string;
  city: string;
  zip: string | null;
  phone: string | null;
  isDefault: boolean;
};

export function AddressManager({ addresses }: { addresses: AddressData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AddressData | null | "new">(null);
  const [isDefault, setIsDefault] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = (address: AddressData | "new") => {
    setEditing(address);
    setIsDefault(address !== "new" && address.isDefault);
    setError(null);
  };

  const submit = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveAddress({
        id: editing !== "new" && editing ? editing.id : undefined,
        label: String(formData.get("label") ?? ""),
        street: String(formData.get("street") ?? ""),
        city: String(formData.get("city") ?? ""),
        zip: String(formData.get("zip") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        isDefault,
      });
      if (result.ok) {
        toast(editing === "new" ? "Adresa u shtua" : "Adresa u përditësua");
        setEditing(null);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const removeAddress = (id: string) => {
    startTransition(async () => {
      const result = await deleteAddress(id);
      if (result.ok) {
        toast("Adresa u fshi", "info");
        router.refresh();
      }
    });
  };

  const current = editing !== "new" ? editing : null;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">Adresat e ruajtura</h2>
        <Button size="sm" onClick={() => open("new")}>
          <Plus size={15} /> Shto adresë
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-2 bg-surface px-6 py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2 text-muted">
            <MapPin size={24} />
          </span>
          <p className="mt-4 font-display font-bold text-ink">Asnjë adresë e ruajtur</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Ruani adresat ku montojmë më shpesh — porositë plotësohen më shpejt.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="flex flex-col rounded-3xl border border-line bg-surface p-5 card-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <Home size={17} />
                </span>
                {address.isDefault && <Badge tone="brand">Kryesore</Badge>}
              </div>
              <h3 className="mt-3 font-display font-bold text-ink">{address.label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {address.street}
                <br />
                {address.city}
                {address.zip ? `, ${address.zip}` : ""}
              </p>
              {address.phone && <p className="mt-1 text-xs text-muted">{address.phone}</p>}
              <div className="mt-4 flex gap-2 border-t border-line pt-4">
                <button
                  onClick={() => open(address)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-brand-300 hover:text-brand-700 focus-ring dark:hover:text-brand-300"
                >
                  <Pencil size={12} /> Ndrysho
                </button>
                <button
                  onClick={() => removeAddress(address.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-2 px-3.5 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-red-200 hover:text-red-500 focus-ring disabled:opacity-50"
                >
                  <Trash2 size={12} /> Fshi
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Adresë e re" : "Ndrysho adresën"}
      >
        <form action={submit} className="space-y-4">
          <Field label="Emërtimi" hint="p.sh. Shtëpia, Zyra, Lokali">
            <Input name="label" defaultValue={current?.label ?? "Shtëpia"} required />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Qyteti *">
              <Input name="city" defaultValue={current?.city ?? ""} required placeholder="Prishtinë" />
            </Field>
            <Field label="Kodi postar">
              <Input name="zip" defaultValue={current?.zip ?? ""} placeholder="10000" />
            </Field>
          </div>
          <Field label="Rruga dhe numri *">
            <Input name="street" defaultValue={current?.street ?? ""} required placeholder="Rr. Agim Ramadani 24" />
          </Field>
          <Field label="Telefoni">
            <Input name="phone" type="tel" defaultValue={current?.phone ?? ""} placeholder="+383 4x xxx xxx" />
          </Field>
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-2/60 px-4 py-3">
            <span className="text-sm font-semibold text-ink">Adresa kryesore</span>
            <Switch checked={isDefault} onChange={setIsDefault} label="Adresa kryesore" />
          </label>

          {error && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" type="button" onClick={() => setEditing(null)}>
              Anulo
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
              Ruaj adresën
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
