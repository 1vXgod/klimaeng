"use client";

import { ChevronDown, Copy, Loader2, Save, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition, type ReactNode } from "react";
import { deleteProducts, saveProduct, type ProductInput } from "@/app/actions/admin";
import { ProductVisual } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { toast } from "@/components/ui/Toast";
import { CATEGORY_LABELS, cn, formatBtu, type CapacitySpecValues } from "@/lib/utils";

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

/** Form fields of one capacity's spec block, in display order. */
const SPEC_FIELDS = [
  { key: "coolingCapacity", label: "Kapaciteti i ftohjes", kind: "text", placeholder: "p.sh. 3,5 kW" },
  { key: "heatingCapacity", label: "Kapaciteti i ngrohjes", kind: "text", placeholder: "p.sh. 3,8 kW" },
  { key: "powerConsumption", label: "Konsumi i energjisë", kind: "text", placeholder: "p.sh. 1,1 kW" },
  { key: "energyCool", label: "Klasa e ftohjes", kind: "energy", placeholder: "" },
  { key: "energyHeat", label: "Klasa e ngrohjes", kind: "energy", placeholder: "" },
  { key: "seer", label: "SEER", kind: "decimal", placeholder: "p.sh. 6.1" },
  { key: "scop", label: "SCOP", kind: "decimal", placeholder: "p.sh. 4.0" },
  { key: "airflow", label: "Rrjedha e ajrit", kind: "text", placeholder: "p.sh. 580 m³/h" },
  { key: "noiseDb", label: "Zhurma (dB)", kind: "decimal", placeholder: "p.sh. 22" },
  { key: "coverageM2", label: "Mbulimi (m²)", kind: "decimal", placeholder: "p.sh. 25" },
  { key: "refrigerant", label: "Gazi ftohës", kind: "text", placeholder: "R32" },
  { key: "dimensions", label: "Dimensionet", kind: "text", placeholder: "790×275×200 mm" },
  { key: "weight", label: "Pesha", kind: "text", placeholder: "p.sh. 9 kg" },
] as const;

type SpecFieldKey = (typeof SPEC_FIELDS)[number]["key"];
type SpecFormState = Record<SpecFieldKey, string>;

const EMPTY_SPEC = Object.fromEntries(SPEC_FIELDS.map((f) => [f.key, ""])) as SpecFormState;

function toFormSpec(values?: CapacitySpecValues): SpecFormState {
  const s = { ...EMPTY_SPEC };
  if (!values) return s;
  for (const f of SPEC_FIELDS) {
    const v = values[f.key];
    if (v !== undefined && v !== null) s[f.key] = String(v);
  }
  return s;
}

/** Form strings → typed spec values; empty fields dropped, decimals accept a comma. */
function specValues(s: SpecFormState): CapacitySpecValues {
  const out: Record<string, string | number> = {};
  for (const f of SPEC_FIELDS) {
    const raw = s[f.key].trim();
    if (!raw) continue;
    if (f.kind === "decimal") {
      const n = Number(raw.replace(",", "."));
      if (Number.isFinite(n) && n > 0) out[f.key] = n;
    } else {
      out[f.key] = raw;
    }
  }
  return out as CapacitySpecValues;
}

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
  const [showRender, setShowRender] = useState((initial?.images ?? []).length === 0);
  const [btuBase, setBtuBase] = useState(initial?.btu ? String(initial.btu) : "");
  const [btu18Enabled, setBtu18Enabled] = useState(initial?.btu18Enabled ?? false);
  const [btu24Enabled, setBtu24Enabled] = useState(initial?.btu24Enabled ?? false);
  const [discountEnabled, setDiscountEnabled] = useState(initial?.discountEnabled ?? false);
  const [discountStart, setDiscountStart] = useState(() => toDatetimeLocalValue(initial?.discountStart));
  const [discountEnd, setDiscountEnd] = useState(() => toDatetimeLocalValue(initial?.discountEnd));
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Per-capacity specs. The base block maps to the product's own capacity
  // (12.000 BTU when unset); 18k/24k blocks are optional, like the prices.
  const initialBaseKey = String(initial?.btu ?? 12000);
  const [specBase, setSpecBase] = useState(() => toFormSpec(initial?.specs?.[initialBaseKey]));
  const [spec18, setSpec18] = useState(() =>
    toFormSpec(initialBaseKey === "18000" ? undefined : initial?.specs?.["18000"])
  );
  const [spec24, setSpec24] = useState(() =>
    toFormSpec(initialBaseKey === "24000" ? undefined : initial?.specs?.["24000"])
  );
  const [spec18On, setSpec18On] = useState(
    () => initialBaseKey !== "18000" && !!initial?.specs?.["18000"]
  );
  const [spec24On, setSpec24On] = useState(
    () => initialBaseKey !== "24000" && !!initial?.specs?.["24000"]
  );

  const btuInt = (() => {
    const n = Number(btuBase);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  })();
  const baseLabel = btuInt ? formatBtu(btuInt) : "Çmimi bazë";
  const baseSpecLabel = btuInt ? formatBtu(btuInt) : "Baza";
  const specCount = 1 + (spec18On ? 1 : 0) + (spec24On ? 1 : 0);

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
    // 18k/24k spec blocks first so a base capacity of 18.000/24.000 BTU
    // overwrites rather than duplicates its own key.
    const specs: Record<string, CapacitySpecValues> = {};
    if (spec18On) specs["18000"] = specValues(spec18);
    if (spec24On) specs["24000"] = specValues(spec24);
    specs[String(btuInt ?? 12000)] = specValues(specBase);
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
        btu: btuInt,
        specs,
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

  const patchBase = (key: SpecFieldKey, value: string) =>
    setSpecBase((s) => ({ ...s, [key]: value }));
  const patch18 = (key: SpecFieldKey, value: string) =>
    setSpec18((s) => ({ ...s, [key]: value }));
  const patch24 = (key: SpecFieldKey, value: string) =>
    setSpec24((s) => ({ ...s, [key]: value }));

  return (
    <form action={submit}>
      <div className="grid items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        {/* left column — content, prices, specs */}
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <FormSection title="Informacioni bazë">
            <div className="space-y-4">
              <Field label="Emri i produktit *">
                <Input name="name" required minLength={3} defaultValue={initial?.name} placeholder="p.sh. KlimaENG Arctic Split 12000 BTU" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
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
                <Field label="Kapaciteti bazë (BTU)" hint="Bosh për boilerë e aksesorë">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="12000"
                    value={btuBase}
                    onChange={(e) => setBtuBase(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Përshkrimi i shkurtër *" hint="Një fjali që shfaqet në kartën e produktit">
                <Input name="shortDesc" required defaultValue={initial?.shortDesc} />
              </Field>
              <Field label="Përshkrimi i plotë">
                <Textarea name="description" rows={4} defaultValue={initial?.description} />
              </Field>
              <Field label="Karakteristikat (një për rresht)">
                <Textarea
                  name="features"
                  rows={3}
                  defaultValue={initial?.features.join("\n")}
                  placeholder={"Kontroll Wi-Fi nga aplikacioni\nModaliteti i gjumit\nVetëpastrim me jonizim"}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Çmimet & stoku"
            hint="Aktivizoni 18.000/24.000 BTU që të shfaqen si karta çmimi në faqen e produktit"
          >
            <div className="space-y-3">
              <VariantPriceBlock
                label={baseLabel}
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
            <div className="mt-4">
              <SwitchRow
                label="Produkt i zgjedhur — shfaqet në ballinë"
                checked={featured}
                onChange={setFeatured}
              />
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
          </FormSection>

          <FormSection
            title="Specifikat teknike"
            hint="Sipas kapacitetit — çdo kapacitet ruan specifikat e veta, si te çmimet"
            chip={specCount === 1 ? "1 kapacitet" : `${specCount} kapacitete`}
            collapsible
            defaultOpen={!!initial?.specs && Object.keys(initial.specs).length > 0}
          >
            <div className="space-y-3">
              <SpecBlock label={baseSpecLabel} always enabled values={specBase} onChange={patchBase} />
              <SpecBlock
                label="18.000 BTU"
                enabled={spec18On}
                onToggle={setSpec18On}
                values={spec18}
                onChange={patch18}
                onCopy={() => {
                  setSpec18({ ...specBase });
                  toast("U kopjuan specifikat e bazës");
                }}
              />
              <SpecBlock
                label="24.000 BTU"
                enabled={spec24On}
                onToggle={setSpec24On}
                values={spec24}
                onChange={patch24}
                onCopy={() => {
                  setSpec24({ ...specBase });
                  toast("U kopjuan specifikat e bazës");
                }}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <SwitchRow label="Teknologji inverter" checked={inverter} onChange={setInverter} />
              <SwitchRow label="Kontroll Wi-Fi" checked={wifi} onChange={setWifi} />
            </div>
          </FormSection>
        </div>

        {/* right column — photos & appearance */}
        <div className="min-w-0">
          <FormSection title="Fotot e produktit" hint="Fotot zëvendësojnë renderin 3D kudo në faqe">
            {/* live preview — uploaded photos fully replace the render */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2 to-surface-3/60">
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
                        className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-night-950/70 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-ring sm:h-5 sm:w-5"
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

            {/* drag & drop upload */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-7 text-center transition-colors",
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
              <span className="text-[11px] text-muted">PNG, JPG, WEBP, SVG · max 4MB</span>
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

            {/* render + accent, tucked away once real photos exist */}
            <div className="mt-5 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => setShowRender((v) => !v)}
                aria-expanded={showRender}
                className="flex w-full items-center justify-between gap-2 rounded-lg text-xs font-semibold tracking-wider text-muted uppercase focus-ring"
              >
                Render 3D & ngjyra
                <ChevronDown size={14} className={cn("transition-transform duration-200", showRender && "rotate-180")} />
              </button>
              <div className={cn("mt-3", !showRender && "hidden")}>
                <div className="grid grid-cols-3 gap-2">
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
                <div className="mt-3 flex gap-2">
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
              </div>
            </div>
          </FormSection>
        </div>
      </div>

      {/* action bar — floats above the bottom edge so Save is always at hand */}
      <div className="sticky bottom-3 z-20 mt-4 sm:mt-5">
        <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface/95 p-3 backdrop-blur-md card-shadow">
          {initial?.id && (
            <Button
              type="button"
              variant="danger"
              size="lg"
              className="shrink-0 px-5"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Fshi produktin</span>
            </Button>
          )}
          <Button
            type="submit"
            size="lg"
            className="min-w-0 flex-1 sm:ml-auto sm:flex-none sm:min-w-64"
            disabled={isPending || uploading}
          >
            {isPending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
            {initial?.id ? "Ruaj ndryshimet" : "Krijo produktin"}
          </Button>
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
 * Card section of the form. Collapsible sections keep their children
 * mounted (hidden, not unmounted) so field values and uncontrolled inputs
 * survive collapsing and still submit with the form.
 */
function FormSection({
  title,
  hint,
  chip,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  title: string;
  hint?: string;
  chip?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(!collapsible || defaultOpen);
  const heading = (
    <div className="min-w-0">
      <span className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-[15px] font-bold text-ink">{title}</h2>
        {chip && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            {chip}
          </span>
        )}
      </span>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
  return (
    <section className="rounded-3xl border border-line bg-surface card-shadow">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 rounded-3xl p-4 text-left focus-ring sm:p-6"
        >
          {heading}
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-muted transition-transform duration-200", open && "rotate-180")}
          />
        </button>
      ) : (
        <div className="p-4 pb-0 sm:p-6 sm:pb-0">{heading}</div>
      )}
      <div
        className={cn(
          "px-4 pb-4 sm:px-6 sm:pb-6",
          !collapsible && "pt-4 sm:pt-5",
          collapsible && !open && "hidden"
        )}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * One BTU capacity's pricing: an enable toggle (except the always-on base
 * variant) plus regular/sale price inputs. Disabled variants keep their
 * inputs mounted (hidden) so typed values survive toggling, but submit()
 * sends null for them, wiping the stored prices on save.
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
      <div className={cn("mt-3 grid gap-4 sm:grid-cols-2", !enabled && "hidden")}>
        <Field label="Çmimi i rregullt (€) *">
          <Input name={priceName} type="number" required={enabled} min={1} defaultValue={initialPrice ?? ""} />
        </Field>
        <Field label="Çmimi me zbritje (€)" hint="Opsional — i rregullti shfaqet i shënjuar">
          <Input name={saleName} type="number" min={1} defaultValue={initialSale ?? ""} />
        </Field>
      </div>
    </div>
  );
}

/**
 * One BTU capacity's technical specifications, mirroring VariantPriceBlock:
 * an enable toggle (except the always-on base block) plus the spec fields.
 * Values are controlled so "Kopjo nga baza" can prefill a capacity.
 */
function SpecBlock({
  label,
  enabled,
  always,
  onToggle,
  values,
  onChange,
  onCopy,
}: {
  label: string;
  enabled: boolean;
  always?: boolean;
  onToggle?: (v: boolean) => void;
  values: SpecFormState;
  onChange: (key: SpecFieldKey, value: string) => void;
  onCopy?: () => void;
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
          <Switch checked={enabled} onChange={(v) => onToggle?.(v)} label={`Aktivizo specifikat ${label}`} />
        )}
      </div>
      <div className={cn(!enabled && "hidden")}>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            <Copy size={12} /> Kopjo nga baza
          </button>
        )}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SPEC_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.kind === "energy" ? (
                <Select value={values[f.key]} onChange={(e) => onChange(f.key, e.target.value)}>
                  {ENERGY_CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c || "—"}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  value={values[f.key]}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  inputMode={f.kind === "decimal" ? "decimal" : undefined}
                />
              )}
            </Field>
          ))}
        </div>
      </div>
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
