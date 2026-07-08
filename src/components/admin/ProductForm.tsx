"use client";

import { Loader2, Save, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { deleteProducts, saveProduct, type ProductInput } from "@/app/actions/admin";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { CATEGORY_LABELS, cn } from "@/lib/utils";

const RENDERS = [
  { id: "wall", label: "Njësi murale" },
  { id: "standing", label: "Kolonë" },
  { id: "outdoor", label: "Njësi e jashtme" },
  { id: "boiler", label: "Boiler" },
  { id: "pipe", label: "Tubacion" },
  { id: "bracket", label: "Suport" },
];

const ACCENTS = [
  { id: "pearl", label: "Perlë" },
  { id: "graphite", label: "Grafit" },
  { id: "blue", label: "Blu" },
  { id: "frost", label: "Akull" },
];

const ENERGY_CLASSES = ["", "A+++", "A++", "A+", "A", "B", "C", "D"];

export type ProductFormData = Omit<ProductInput, "features"> & {
  id?: string;
  features: string[];
};

export function ProductForm({ initial }: { initial?: ProductFormData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [render, setRender] = useState(initial?.render ?? "wall");
  const [accent, setAccent] = useState(initial?.accent ?? "pearl");
  const [wifi, setWifi] = useState(initial?.wifi ?? false);
  const [inverter, setInverter] = useState(initial?.inverter ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ngarkimi dështoi");
      setImageUrl(data.url);
      toast("Imazhi u ngarkua");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Ngarkimi dështoi", "error");
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) void upload(file);
    },
    [upload]
  );

  const submit = (formData: FormData) => {
    const num = (name: string) => {
      const v = String(formData.get(name) ?? "").trim();
      return v ? Number(v) : null;
    };
    startTransition(async () => {
      const result = await saveProduct({
        id: initial?.id,
        name: String(formData.get("name") ?? ""),
        brand: String(formData.get("brand") ?? ""),
        category: String(formData.get("category") ?? "SPLIT"),
        price: num("price") ?? 0,
        oldPrice: num("oldPrice"),
        shortDesc: String(formData.get("shortDesc") ?? ""),
        description: String(formData.get("description") ?? ""),
        btu: num("btu"),
        coverageM2: num("coverageM2"),
        energyCool: String(formData.get("energyCool") ?? "") || null,
        energyHeat: String(formData.get("energyHeat") ?? "") || null,
        seer: num("seer"),
        scop: num("scop"),
        refrigerant: String(formData.get("refrigerant") ?? "") || null,
        noiseDb: num("noiseDb"),
        wifi,
        inverter,
        warrantyYears: num("warrantyYears") ?? 2,
        stock: num("stock") ?? 0,
        featured,
        badge: String(formData.get("badge") ?? "") || null,
        render,
        accent,
        features: String(formData.get("features") ?? "")
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        imageUrl,
      });
      if (result.ok) {
        toast(initial?.id ? "Produkti u përditësua" : "Produkti u krijua");
        router.push("/admin/produktet");
        router.refresh();
      } else {
        toast(result.error, "error");
      }
    });
  };

  const removeProduct = () => {
    if (!initial?.id) return;
    startTransition(async () => {
      const result = await deleteProducts([initial.id!]);
      if (result.ok) {
        toast("Produkti u fshi", "info");
        router.push("/admin/produktet");
        router.refresh();
      }
    });
  };

  return (
    <form action={submit} className="grid gap-6 xl:grid-cols-[1fr_22rem]">
      {/* left column — fields */}
      <div className="space-y-5">
        <section className="rounded-3xl border border-line bg-surface p-6 card-shadow">
          <h2 className="font-display text-[15px] font-bold text-ink">Informacioni bazë</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Emri i produktit *" className="sm:col-span-2">
              <Input name="name" required minLength={3} defaultValue={initial?.name} placeholder="p.sh. KlimaENG Arctic Split 12000 BTU" />
            </Field>
            <Field label="Marka">
              <Input name="brand" defaultValue={initial?.brand ?? "KlimaENG"} />
            </Field>
            <Field label="Kategoria">
              <Select name="category" defaultValue={initial?.category ?? "SPLIT"}>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Përshkrimi i shkurtër *" className="sm:col-span-2">
              <Input name="shortDesc" required defaultValue={initial?.shortDesc} placeholder="Një fjali që shfaqet në kartën e produktit" />
            </Field>
            <Field label="Përshkrimi i plotë" className="sm:col-span-2">
              <Textarea name="description" rows={5} defaultValue={initial?.description} />
            </Field>
            <Field label="Karakteristikat (një për rresht)" className="sm:col-span-2">
              <Textarea
                name="features"
                rows={4}
                defaultValue={initial?.features.join("\n")}
                placeholder={"Kontroll Wi-Fi nga aplikacioni\nModaliteti i gjumit\nVetëpastrim me jonizim"}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6 card-shadow">
          <h2 className="font-display text-[15px] font-bold text-ink">Çmimi & stoku</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field label="Çmimi (€) *">
              <Input name="price" type="number" required min={1} defaultValue={initial?.price || ""} />
            </Field>
            <Field label="Çmimi i vjetër (€)" hint="Për të shfaqur zbritjen">
              <Input name="oldPrice" type="number" min={1} defaultValue={initial?.oldPrice ?? ""} />
            </Field>
            <Field label="Stoku *">
              <Input name="stock" type="number" required min={0} defaultValue={initial?.stock ?? 0} />
            </Field>
            <Field label="Garancia (vite)">
              <Input name="warrantyYears" type="number" min={1} max={10} defaultValue={initial?.warrantyYears ?? 2} />
            </Field>
            <Field label="Etiketa" hint="p.sh. I ri, Premium, Ofertë">
              <Input name="badge" defaultValue={initial?.badge ?? ""} />
            </Field>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6 card-shadow">
          <h2 className="font-display text-[15px] font-bold text-ink">Specifikat teknike</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <Field label="Kapaciteti (BTU)">
              <Input name="btu" type="number" defaultValue={initial?.btu ?? ""} />
            </Field>
            <Field label="Mbulimi (m²)">
              <Input name="coverageM2" type="number" defaultValue={initial?.coverageM2 ?? ""} />
            </Field>
            <Field label="Zhurma (dB)">
              <Input name="noiseDb" type="number" defaultValue={initial?.noiseDb ?? ""} />
            </Field>
            <Field label="Klasa e ftohjes">
              <Select name="energyCool" defaultValue={initial?.energyCool ?? ""}>
                {ENERGY_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c || "—"}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Klasa e ngrohjes">
              <Select name="energyHeat" defaultValue={initial?.energyHeat ?? ""}>
                {ENERGY_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c || "—"}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Gazi ftohës">
              <Input name="refrigerant" defaultValue={initial?.refrigerant ?? ""} placeholder="R32" />
            </Field>
            <Field label="SEER">
              <Input name="seer" type="number" step="0.1" defaultValue={initial?.seer ?? ""} />
            </Field>
            <Field label="SCOP">
              <Input name="scop" type="number" step="0.1" defaultValue={initial?.scop ?? ""} />
            </Field>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SwitchRow label="Teknologji inverter" checked={inverter} onChange={setInverter} />
            <SwitchRow label="Kontroll Wi-Fi" checked={wifi} onChange={setWifi} />
            <SwitchRow label="Produkt i zgjedhur" checked={featured} onChange={setFeatured} />
          </div>
        </section>
      </div>

      {/* right column — visual + actions */}
      <div className="space-y-5">
        <section className="rounded-3xl border border-line bg-surface p-6 card-shadow">
          <h2 className="font-display text-[15px] font-bold text-ink">Pamja vizuale</h2>

          {/* live preview */}
          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-surface-3/60">
            {imageUrl ? (
              <div className="relative h-full w-full">
                <Image src={imageUrl} alt="Imazhi i produktit" fill className="object-contain p-3" unoptimized />
              </div>
            ) : (
              <ProductVisual render={render} accent={accent} className="h-full w-full p-4" />
            )}
          </div>

          <p className="mt-4 text-xs font-semibold tracking-wider text-muted uppercase">Rendera 3D</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {RENDERS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRender(r.id)}
                aria-pressed={render === r.id}
                className={cn(
                  "rounded-xl border p-1.5 transition-all focus-ring",
                  render === r.id
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-500/10"
                    : "border-line hover:border-brand-200"
                )}
              >
                <span className="block h-10">
                  <ProductVisual render={r.id} accent={accent} className="h-full w-full" glow={false} />
                </span>
                <span className="mt-1 block text-center text-[10px] font-semibold text-ink-2">
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs font-semibold tracking-wider text-muted uppercase">Ngjyra</p>
          <div className="mt-2 flex gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setAccent(a.id)}
                aria-pressed={accent === a.id}
                title={a.label}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition-all focus-ring",
                  a.id === "pearl" && "bg-gradient-to-b from-white to-slate-300",
                  a.id === "graphite" && "bg-gradient-to-b from-slate-600 to-slate-900",
                  a.id === "blue" && "bg-gradient-to-b from-blue-100 to-blue-400",
                  a.id === "frost" && "bg-gradient-to-b from-cyan-50 to-cyan-300",
                  accent === a.id
                    ? "border-brand-600 ring-2 ring-brand-500/25 scale-110"
                    : "border-line-2"
                )}
              />
            ))}
          </div>

          {/* drag & drop upload */}
          <p className="mt-5 text-xs font-semibold tracking-wider text-muted uppercase">
            Ose ngarko foto reale
          </p>
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors",
              dragging
                ? "border-brand-500 bg-brand-50/70 dark:bg-brand-500/10"
                : "border-line-2 hover:border-brand-300"
            )}
          >
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
              }}
            />
            {uploading ? (
              <Loader2 size={22} className="animate-spin text-brand-500" />
            ) : (
              <UploadCloud size={22} className="text-muted" />
            )}
            <span className="text-xs font-semibold text-ink-2">
              {uploading ? "Duke ngarkuar…" : "Tërhiqni imazhin këtu ose klikoni"}
            </span>
            <span className="text-[11px] text-muted">PNG, JPG, WEBP, SVG · max 4MB</span>
          </label>
          {imageUrl && (
            <button
              type="button"
              onClick={() => setImageUrl(null)}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
            >
              <X size={12} /> Hiq imazhin, përdor renderin
            </button>
          )}
        </section>

        <div className="space-y-2.5">
          <Button type="submit" size="lg" className="w-full" disabled={isPending || uploading}>
            {isPending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {initial?.id ? "Ruaj ndryshimet" : "Krijo produktin"}
          </Button>
          {initial?.id && (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
            >
              <Trash2 size={15} /> Fshi produktin
            </Button>
          )}
        </div>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title="Fshi produktin?">
        <p className="text-sm leading-relaxed text-ink-2">
          “{initial?.name}” do të hiqet përfundimisht nga katalogu. Ky veprim
          është i pakthyeshëm.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" type="button" onClick={() => setConfirmDelete(false)}>
            Anulo
          </Button>
          <Button variant="danger" type="button" onClick={removeProduct} disabled={isPending}>
            <Trash2 size={15} /> Fshi përfundimisht
          </Button>
        </div>
      </Modal>
    </form>
  );
}

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-bg px-4 py-3">
      <span className="text-sm font-semibold text-ink">{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </label>
  );
}
