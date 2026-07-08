import { Snowflake, Sun, Volume2 } from "lucide-react";

const SCALE = [
  { label: "A+++", color: "#00934c" },
  { label: "A++", color: "#4bb748" },
  { label: "A+", color: "#bfd630" },
  { label: "A", color: "#fef200" },
  { label: "B", color: "#fdb813" },
  { label: "C", color: "#f37021" },
  { label: "D", color: "#ed1c24" },
];

/** EU-inspired energy label card for the product page. */
export function EnergyLabel({
  brand,
  model,
  energyCool,
  energyHeat,
  seer,
  scop,
  noiseDb,
}: {
  brand: string;
  model: string;
  energyCool?: string | null;
  energyHeat?: string | null;
  seer?: number | null;
  scop?: number | null;
  noiseDb?: number | null;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white text-[#0b1424] card-shadow dark:border-white/10">
      {/* header */}
      <div className="flex items-center justify-between bg-[#0055a5] px-5 py-3 text-white">
        <span className="font-display text-sm font-bold tracking-widest">ENERGY</span>
        <span className="text-[10px] font-semibold tracking-wider opacity-90">EU 2017/1369</span>
      </div>
      <div className="border-b border-slate-200 px-5 py-2.5">
        <p className="text-xs font-bold tracking-wide uppercase">{brand}</p>
        <p className="truncate text-[11px] text-slate-500">{model}</p>
      </div>

      {/* scale + assigned classes */}
      <div className="flex gap-4 px-5 py-4">
        <div className="flex-1 space-y-1">
          {SCALE.map((cls, i) => (
            <div key={cls.label} className="flex items-center">
              <span
                className="flex h-5 items-center pl-2 text-[10px] font-bold text-white"
                style={{
                  width: `${38 + i * 9}%`,
                  background: cls.color,
                  clipPath: "polygon(0 0, calc(100% - 7px) 0, 100% 50%, calc(100% - 7px) 100%, 0 100%)",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                }}
              >
                {cls.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2.5">
          {energyCool && (
            <div className="flex items-center gap-2">
              <Snowflake size={15} className="text-[#0055a5]" />
              <span
                className="flex h-7 items-center px-2.5 text-sm font-bold text-white"
                style={{
                  background: SCALE.find((s) => s.label === energyCool)?.color ?? "#4bb748",
                  clipPath: "polygon(7px 0, 100% 0, 100% 100%, 7px 100%, 0 50%)",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                }}
              >
                {energyCool}
              </span>
            </div>
          )}
          {energyHeat && (
            <div className="flex items-center gap-2">
              <Sun size={15} className="text-[#f45d22]" />
              <span
                className="flex h-7 items-center px-2.5 text-sm font-bold text-white"
                style={{
                  background: SCALE.find((s) => s.label === energyHeat)?.color ?? "#4bb748",
                  clipPath: "polygon(7px 0, 100% 0, 100% 100%, 7px 100%, 0 50%)",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                }}
              >
                {energyHeat}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* metrics */}
      <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 text-center">
        <div className="px-2 py-3">
          <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">SEER</p>
          <p className="font-display text-lg font-bold">{seer ?? "—"}</p>
        </div>
        <div className="px-2 py-3">
          <p className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">SCOP</p>
          <p className="font-display text-lg font-bold">{scop ?? "—"}</p>
        </div>
        <div className="px-2 py-3">
          <p className="flex items-center justify-center gap-1 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
            <Volume2 size={11} /> Zhurma
          </p>
          <p className="font-display text-lg font-bold">
            {noiseDb ? `${noiseDb} dB` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
