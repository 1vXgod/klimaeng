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

/** Formats an ISO date as the local "YYYY-MM-DDTHH:mm" value `<input type="datetime-local">` expects. */
function toDatetimeLocalValue(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Default discount window when the timer is first enabled: now → +2 weeks. */
function defaultDiscountWindow() {
  const start = new Date();
  const end = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
  return { start: toDatetimeLocalValue(start.toISOString()), end: toDatetimeLocalValue(end.toISOString()) };
}

export function ProductForm({ initial }: { initial?: ProductFormData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [render, setRender] = useState(initial?.render ?? "wall");
  const [accent, setAccent] = useState(initial?.accent ?? "pearl");
  const [wifi, setWifi] = useState(initial?.wifi ?? false);
  const [inverter, setInverter] = useState(initial?.inverter ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [btu18Enabled, setBtu18Enabled] = useState(initial?.btu18Enabled ?? false);
  const [btu24Enabled, setBtu24Enabled] = useState(initial?.btu24Enabled ?? false);
  const [discountEnabled, setDiscountEnabled] = useState(initial?.discountEnabled ?? false);
  const [discountStart, setDiscountStart] = useState(() => toDatetimeLocalValue(initial?.discountStart));
  const [discountEnd, setDiscountEnd] = useState(() => toDatetimeLocalValue(initial?.discountEnd));
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const uploadOne = useCallback(async (file: File) => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });

    // Never assume JSON: an infrastructure error (413, timeout, crash)
    // can return an empty or HTML body — surface the real cause instead
    // of a JSON parse error.
    const raw = await res.text();
    let data: { url?: string; error?: string } = {};
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(
        `Serveri u përgjigj me gabim (HTTP ${res.status}). Provoni një imazh më të vogël ose përsëri më vonë.`
      );
    }
    if (!res.ok || !data.url) {
      throw new Error(data.error ?? `Ngarkimi dështoi (HTTP ${res.status}).`);
    }
    return data.url;
  }, []);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const list = [...files];
      if (list.length === 0) return;
      setUploading(true);
      try {
        for (const file of list) {
          const url = await uploadOne(file);
          setImages((prev) => [...prev, url]);
        }
        toast(list.length === 1 ? "Imazhi u ngarkua" : `${list.length} imazhe u ngarkuan`);
      } catch (e) {
        toast(e instanceof Error ? e.message : "Ngarkimi dështoi", "error");
      } finally {
        setUploading(false);
      }
    },
    [uploadOne]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) void upload(e.dataTransfer.files);
    },
    [upload]
  );

  const submit = (formData: FormData) => {
    const num = (name: string) => {
      const v = String(formData.get(name) ?? "").trim();
      return v ? Number(v) : null;
    };
    // The DB stores the selling price in `price` and the struck-through
    // regular price in `oldPrice`; the form speaks regular/sale instead.
    const regularPrice = num("regularPrice") ?? 0;
    const salePrice = num("salePrice");
    startTransition(async () => {
      const result = await saveProduct({
        id: initial?.id,
        name: String(formData.get("name") ?? ""),
        brand: String(formData.get("brand") ?? ""),
        category: String(formData.get("category") ?? "SPLIT"),
        price: salePrice ?? regularPrice,
        oldPrice: salePrice ? regularPrice : null,
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
        images,
        discountEnabled,
        discountStart: discountEnabled && discountStart ? new Date(discountStart).toISOString() : null,
        discountEnd: discountEnabled && discountEnd ? new Date(discountEnd).toISOString() : null,
        btu18Enabled,
        btu18Price: btu18Enabled ? num("btu18Price") : null,
        btu18SalePrice: btu18Enabled ? num("btu18SalePrice") : null,
        btu24Enabled,
        btu24Price: btu24Enabled ? num("btu24Price") : null,
        btu24SalePrice: btu24Enabled ? num("btu24SalePrice") : null,
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
          <h2 className="font-display text-[15px] font-bold text-ink">Çmimet sipas kapacitetit</h2>
          <p className="mt-1 text-xs text-muted">
            Varianti 12.000 BTU është gjithmonë aktiv. Aktivizoni 18.000/24.000 BTU që
            të shfaqen si karta çmimi në faqen e produktit.
          </p>

          <div className="mt-5 space-y-3">
            <VariantPriceBlock
              label="12.000 BTU"
              always
              enabled
              priceName="regularPrice"
              saleName="salePrice"
              initialPrice={initial ? (initial.oldPrice ?? initial.price) : null}
              initialSale={initial?.oldPrice ? initial.price : null}
            />
            <VariantPriceBlock
              label="18.000 BTU"
              enabled={btu18Enabled}
              onToggle={setBtu18Enabled}
              priceName="btu18Price"
              saleName="btu18SalePrice"
              initialPrice={initial?.btu18Price ?? null}
              initialSale={initial?.btu18SalePrice ?? null}
            />
            <VariantPriceBlock
              label="24.000 BTU"
              enabled={btu24Enabled}
              onToggle={setBtu24Enabled}
              priceName="btu24Price"
              saleName="btu24SalePrice"
              initialPrice={initial?.btu24Price ?? null}
              initialSale={initial?.btu24SalePrice ?? null}
            />
          </div>

          <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-3">
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

          <div className="mt-5 border-t border-line pt-5">
            <SwitchRow
              label="Aktivizo kohëmatësin e zbritjes"
              checked={discountEnabled}
              onChange={(v) => {
                setDiscountEnabled(v);
                if (v && !discountStart && !discountEnd) {
                  const def = defaultDiscountWindow();
                  setDiscountStart(def.start);
                  setDiscountEnd(def.end);
                }
              }}
            />
            {discountEnabled && (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <Field label="Zbritja fillon *">
                  <Input
                    type="datetime-local"
                    required
                    value={discountStart}
                    onChange={(e) => setDiscountStart(e.target.value)}
                  />
                </Field>
                <Field label="Zbritja mbaron *" hint="Çmimi kthehet automatikisht në normal pas kësaj date">
                  <Input
                    type="datetime-local"
                    required
                    value={discountEnd}
                    onChange={(e) => setDiscountEnd(e.target.value)}
                  />
                </Field>
              </div>
            )}
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

          {/* live preview — uploaded photos fully replace the render */}
          <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-surface-3/60">
            {images[0] ? (
              <div className="relative h-full w-full">
                <Image src={images[0]} alt="Imazhi i produktit" fill className="object-contain p-3" unoptimized />
              </div>
            ) : (
              <ProductVisual render={render} accent={accent} className="h-full w-full p-4" />
            )}
          </div>

          {images.length > 0 && (
            <>
              <p className="mt-3 text-xs font-semibold tracking-wider text-muted uppercase">
                Imazhet e ngarkuara · i pari është kryesori
              </p>
              <ul className="mt-2 grid grid-cols-4 gap-2">
                {images.map((url, i) => (
                  <li key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-surface-2">
                    <Image src={url} alt={`Imazhi ${i + 1}`} fill className="object-contain p-1" unoptimized />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                      aria-label={`Hiq imazhin ${i + 1}`}
                      className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-night-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-ring"
                    >
                      <X size={11} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-brand-600/85 py-0.5 text-center text-[9px] font-bold tracking-wider text-white uppercase">
                        Kryesori
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

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
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) void upload(e.target.files);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <Loader2 size={22} className="animate-spin text-brand-500" />
            ) : (
              <UploadCloud size={22} className="text-muted" />
            )}
            <span className="text-xs font-semibold text-ink-2">
              {uploading ? "Duke ngarkuar…" : "Tërhiqni imazhet këtu ose klikoni"}
            </span>
            <span className="text-[11px] text-muted">
              PNG, JPG, WEBP, SVG · max 4MB · fotot zëvendësojnë renderin kudo
            </span>
          </label>
          {images.length > 0 && (
            <button
              type="button"
              onClick={() => setImages([])}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
            >
              <X size={12} /> Hiq të gjitha imazhet, përdor renderin
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

/**
 * One BTU capacity's pricing: an enable toggle (except the always-on base
 * variant) plus regular/sale price inputs. Disabled variants don't submit
 * their inputs, so their stored prices are wiped on save.
 */
function VariantPriceBlock({
  label,
  enabled,
  always,
  onToggle,
  priceName,
  saleName,
  initialPrice,
  initialSale,
}: {
  label: string;
  enabled: boolean;
  always?: boolean;
  onToggle?: (v: boolean) => void;
  priceName: string;
  saleName: string;
  initialPrice: number | null;
  initialSale: number | null;
}) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-ink">{label}</span>
        {always ? (
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            Gjithmonë aktiv
          </span>
        ) : (
          <Switch checked={enabled} onChange={(v) => onToggle?.(v)} label={`Aktivizo ${label}`} />
        )}
      </div>
      {enabled && (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Çmimi i rregullt (€) *">
            <Input name={priceName} type="number" required min={1} defaultValue={initialPrice ?? ""} />
          </Field>
          <Field label="Çmimi me zbritje (€)" hint="Opsional — i rregullti shfaqet i shënjuar">
            <Input name={saleName} type="number" min={1} defaultValue={initialSale ?? ""} />
          </Field>
        </div>
      )}
    </div>
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
