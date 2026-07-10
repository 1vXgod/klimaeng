"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { EnergyLabel } from "@/components/products/EnergyLabel";
import { cn, formatBtu } from "@/lib/utils";

/**
 * Shared "which BTU capacity is selected" state for the product page. The
 * BuyBox pricing cards, the specs table and the energy label all read and
 * write the same index (into the getBtuVariants array, base first), so
 * picking a capacity anywhere switches the whole page instantly.
 */
const CapacityContext = createContext<{
  index: number;
  setIndex: (i: number) => void;
}>({ index: 0, setIndex: () => {} });

export function CapacityProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  return (
    <CapacityContext.Provider value={{ index, setIndex }}>{children}</CapacityContext.Provider>
  );
}

export function useCapacity() {
  return useContext(CapacityContext);
}

export type SpecsEntry = {
  /** Capacity label; null for products without a BTU rating (boilers etc.). */
  btu: number | null;
  /** Ready-to-render [label, value] rows for this capacity. */
  rows: [string, string][];
};

/**
 * The technical-specifications table, one entry per purchasable capacity
 * (aligned with the BuyBox variants). Rendering follows the selected
 * capacity; small pills above the table allow switching in place.
 */
export function SpecsTable({ entries }: { entries: SpecsEntry[] }) {
  const { index, setIndex } = useCapacity();
  const entry = entries[index] ?? entries[0];
  if (!entry) return null;

  return (
    <div>
      {entries.length > 1 && (
        <div
          role="radiogroup"
          aria-label="Specifikat sipas kapacitetit"
          className="mt-4 flex flex-wrap gap-2"
        >
          {entries.map((e, i) => (
            <button
              key={e.btu ?? "base"}
              type="button"
              role="radio"
              aria-checked={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-ring",
                i === index
                  ? "border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300"
                  : "border-line-2 bg-surface text-ink-2 hover:border-brand-300"
              )}
            >
              {e.btu !== null ? formatBtu(e.btu) : "Bazë"}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[280px] text-sm">
          <tbody className="divide-y divide-line">
            {entry.rows.map(([key, value], i) => (
              <tr key={key} className={i % 2 === 0 ? "bg-surface" : "bg-surface-2/50"}>
                <th
                  scope="row"
                  className="w-1/2 px-4 py-2.5 text-left font-medium text-muted sm:px-5 sm:py-3"
                >
                  {key}
                </th>
                <td className="px-4 py-2.5 font-semibold text-ink sm:px-5 sm:py-3">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type EnergyEntry = {
  energyCool: string | null;
  energyHeat: string | null;
  seer: number | null;
  scop: number | null;
  noiseDb: number | null;
} | null;

/**
 * EU energy label following the selected capacity; hides itself (heading
 * included) for capacities without an energy class.
 */
export function CapacityEnergyLabel({
  brand,
  model,
  entries,
}: {
  brand: string;
  model: string;
  entries: EnergyEntry[];
}) {
  const { index } = useCapacity();
  // No fallback to the base entry here: a capacity without energy data
  // hides the label instead of showing another capacity's values.
  const entry = entries[index] ?? null;
  if (!entry) return null;

  return (
    <div>
      <h3 className="mb-4 font-display text-lg font-bold text-ink">Etiketa energjetike</h3>
      <EnergyLabel
        brand={brand}
        model={model}
        energyCool={entry.energyCool}
        energyHeat={entry.energyHeat}
        seer={entry.seer}
        scop={entry.scop}
        noiseDb={entry.noiseDb}
      />
    </div>
  );
}
