import { cn } from "@/lib/utils";

const CLASS_COLORS: Record<string, string> = {
  "A+++": "#00934c",
  "A++": "#4bb748",
  "A+": "#bfd630",
  A: "#fef200",
  B: "#fdb813",
  C: "#f37021",
  D: "#ed1c24",
};

/** EU-style energy class arrow chip. */
export function EnergyBadge({
  value,
  mode,
  size = "md",
  className,
}: {
  value: string;
  mode?: "cool" | "heat";
  size?: "sm" | "md";
  className?: string;
}) {
  const color = CLASS_COLORS[value] ?? "#4bb748";
  return (
    <span
      className={cn(
        "relative inline-flex items-center font-bold text-white",
        size === "sm" ? "h-5 pl-1.5 pr-2 text-[10px]" : "h-6 pl-2 pr-2.5 text-xs",
        className
      )}
      style={{
        background: color,
        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
        textShadow: "0 1px 1px rgba(0,0,0,0.25)",
      }}
      title={
        mode === "cool"
          ? `Klasa energjetike (ftohje): ${value}`
          : mode === "heat"
            ? `Klasa energjetike (ngrohje): ${value}`
            : `Klasa energjetike: ${value}`
      }
    >
      {mode === "cool" && <span className="mr-1 text-[0.9em]">❄</span>}
      {mode === "heat" && <span className="mr-1 text-[0.9em]">☀</span>}
      {value}
    </span>
  );
}
