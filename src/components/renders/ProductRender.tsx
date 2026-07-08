import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Hand-crafted SVG product renders. Every product in the catalog maps to one
 * of these via `product.render` + `product.accent`, so the whole catalog has
 * consistent, crisp, infinitely-scalable "studio" imagery with zero image weight.
 */

type Accent = "pearl" | "graphite" | "blue" | "frost";

const BODY: Record<Accent, { from: string; to: string; vent: string; ventDark: string; line: string; led: string }> = {
  pearl: { from: "#ffffff", to: "#dde5ef", vent: "#c3cedd", ventDark: "#9fadc2", line: "#e8edf4", led: "#2cc8e8" },
  graphite: { from: "#3d4a63", to: "#111827", vent: "#0d1320", ventDark: "#060a12", line: "#4d5b77", led: "#5ce1f7" },
  blue: { from: "#f6faff", to: "#c9d9f0", vent: "#a9bedd", ventDark: "#8ca4c9", line: "#dfe9f7", led: "#2456e0" },
  frost: { from: "#ffffff", to: "#d7f0f7", vent: "#a8d8e6", ventDark: "#83c2d4", line: "#e4f5fa", led: "#0eaacd" },
};

function useIds(prefix: string) {
  const raw = useId().replace(/[:]/g, "");
  return (name: string) => `${prefix}-${name}-${raw}`;
}

export function WallUnit({ accent = "pearl", className }: { accent?: Accent; className?: string }) {
  const c = BODY[accent];
  const id = useIds("wall");
  return (
    <svg viewBox="0 0 420 250" className={className} role="img" aria-label="Kondicioner me montim në mur">
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.from} />
          <stop offset="72%" stopColor={c.to} />
          <stop offset="100%" stopColor={c.ventDark} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={id("gloss")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={accent === "graphite" ? 0.16 : 0.95} />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id("vent")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.vent} />
          <stop offset="100%" stopColor={c.ventDark} />
        </linearGradient>
        <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <filter id={id("ledGlow")} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx="210" cy="222" rx="150" ry="13" fill="#0b1424" opacity="0.16" filter={`url(#${id("shadow")})`} />

      {/* body */}
      <rect x="38" y="52" width="344" height="128" rx="30" fill={`url(#${id("body")})`} />
      {/* top gloss */}
      <rect x="38" y="52" width="344" height="128" rx="30" fill={`url(#${id("gloss")})`} />
      {/* subtle edge */}
      <rect x="38.5" y="52.5" width="343" height="127" rx="29.5" fill="none" stroke={accent === "graphite" ? "#5b6a89" : "#ffffff"} strokeOpacity="0.5" strokeWidth="1" />

      {/* seam line */}
      <line x1="56" y1="140" x2="364" y2="140" stroke={c.ventDark} strokeOpacity="0.35" strokeWidth="1.2" />

      {/* air outlet flap */}
      <path d="M62 152 h296 a10 10 0 0 1 10 10 v2 a14 14 0 0 1 -14 14 H66 a14 14 0 0 1 -14 -14 v-2 a10 10 0 0 1 10 -10 z" fill={`url(#${id("vent")})`} />
      <line x1="70" y1="166" x2="350" y2="166" stroke="#ffffff" strokeOpacity={accent === "graphite" ? 0.08 : 0.4} strokeWidth="1" />

      {/* LED display */}
      <rect x="296" y="96" width="58" height="26" rx="8" fill={accent === "graphite" ? "#060a12" : "#0b1424"} opacity="0.9" />
      <text x="325" y="114" textAnchor="middle" fontSize="15" fontWeight="700" fill={c.led} filter={`url(#${id("ledGlow")})`} fontFamily="ui-sans-serif, system-ui">22°</text>
      <text x="325" y="114" textAnchor="middle" fontSize="15" fontWeight="700" fill="#eafcff" fontFamily="ui-sans-serif, system-ui">22°</text>

      {/* brand dot + wordmark */}
      <circle cx="68" cy="109" r="3.4" fill={c.led} />
      <text x="78" y="113" fontSize="11" fontWeight="600" letterSpacing="1.5" fill={accent === "graphite" ? "#9fb2d4" : "#8494ad"} fontFamily="ui-sans-serif, system-ui">KLIMAENG</text>
    </svg>
  );
}

export function StandingUnit({ accent = "graphite", className }: { accent?: Accent; className?: string }) {
  const c = BODY[accent];
  const id = useIds("stand");
  return (
    <svg viewBox="0 0 260 420" className={className} role="img" aria-label="Kondicioner qëndrues kolonë">
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.to} />
          <stop offset="30%" stopColor={c.from} />
          <stop offset="75%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
        <linearGradient id={id("grille")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.ventDark} />
          <stop offset="100%" stopColor={c.vent} />
        </linearGradient>
        <filter id={id("shadow")} x="-60%" y="-30%" width="220%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
        </filter>
        <filter id={id("ledGlow")} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx="130" cy="396" rx="86" ry="11" fill="#0b1424" opacity="0.18" filter={`url(#${id("shadow")})`} />

      {/* tower body */}
      <rect x="52" y="26" width="156" height="366" rx="34" fill={`url(#${id("body")})`} />
      <rect x="52.5" y="26.5" width="155" height="365" rx="33.5" fill="none" stroke="#ffffff" strokeOpacity={accent === "graphite" ? 0.14 : 0.6} />

      {/* top grille */}
      <rect x="72" y="48" width="116" height="118" rx="18" fill={`url(#${id("grille")})`} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1="82" y1={62 + i * 15} x2="178" y2={62 + i * 15} stroke="#ffffff" strokeOpacity={accent === "graphite" ? 0.1 : 0.55} strokeWidth="2" strokeLinecap="round" />
      ))}

      {/* LED ring display */}
      <circle cx="130" cy="220" r="27" fill="none" stroke={c.led} strokeWidth="2.4" opacity="0.9" filter={`url(#${id("ledGlow")})`} />
      <circle cx="130" cy="220" r="27" fill="none" stroke={c.led} strokeWidth="1.6" />
      <text x="130" y="226" textAnchor="middle" fontSize="15" fontWeight="700" fill={accent === "graphite" ? "#eafcff" : "#33415e"} fontFamily="ui-sans-serif, system-ui">24°</text>

      {/* lower panel seam */}
      <line x1="72" y1="268" x2="188" y2="268" stroke={c.ventDark} strokeOpacity="0.4" />
      <text x="130" y="330" textAnchor="middle" fontSize="10" fontWeight="600" letterSpacing="2" fill={accent === "graphite" ? "#8fa3c8" : "#8494ad"} fontFamily="ui-sans-serif, system-ui">KLIMAENG</text>

      {/* base */}
      <rect x="66" y="376" width="128" height="12" rx="6" fill={c.ventDark} opacity="0.7" />
    </svg>
  );
}

export function OutdoorUnit({ accent = "pearl", className }: { accent?: Accent; className?: string }) {
  const c = BODY[accent];
  const id = useIds("out");
  return (
    <svg viewBox="0 0 420 300" className={className} role="img" aria-label="Njësi e jashtme kompresori">
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
        <radialGradient id={id("fan")} cx="0.5" cy="0.5" r="0.55">
          <stop offset="0%" stopColor={c.ventDark} />
          <stop offset="68%" stopColor={c.vent} />
          <stop offset="100%" stopColor={c.ventDark} />
        </radialGradient>
        <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>

      <ellipse cx="210" cy="272" rx="160" ry="13" fill="#0b1424" opacity="0.16" filter={`url(#${id("shadow")})`} />

      {/* cabinet */}
      <rect x="44" y="40" width="332" height="222" rx="22" fill={`url(#${id("body")})`} />
      <rect x="44.5" y="40.5" width="331" height="221" rx="21.5" fill="none" stroke="#ffffff" strokeOpacity="0.55" />

      {/* fan housing */}
      <circle cx="150" cy="150" r="82" fill={`url(#${id("fan")})`} />
      <circle cx="150" cy="150" r="82" fill="none" stroke={c.ventDark} strokeWidth="3" strokeOpacity="0.5" />
      {/* fan blades */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          d="M150 150 C 165 118 195 112 208 122 C 196 142 175 152 150 150 Z"
          fill="#ffffff"
          fillOpacity={accent === "graphite" ? 0.16 : 0.75}
          transform={`rotate(${deg} 150 150)`}
        />
      ))}
      <circle cx="150" cy="150" r="17" fill={c.from} stroke={c.ventDark} strokeOpacity="0.4" />
      {/* protective grid rings */}
      {[30, 48, 66].map((r) => (
        <circle key={r} cx="150" cy="150" r={r} fill="none" stroke={c.ventDark} strokeOpacity="0.35" strokeWidth="1.4" />
      ))}

      {/* side louvers */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} x="262" y={64 + i * 22} width="92" height="9" rx="4.5" fill={c.vent} opacity="0.8" />
      ))}

      {/* badge plate */}
      <rect x="262" y="228" width="92" height="20" rx="6" fill="#0b1424" opacity="0.85" />
      <text x="308" y="242" textAnchor="middle" fontSize="9.5" fontWeight="600" letterSpacing="1.4" fill="#9fdcef" fontFamily="ui-sans-serif, system-ui">INVERTER</text>

      {/* feet */}
      <rect x="70" y="262" width="46" height="10" rx="4" fill={c.ventDark} opacity="0.8" />
      <rect x="304" y="262" width="46" height="10" rx="4" fill={c.ventDark} opacity="0.8" />
    </svg>
  );
}

export function BoilerUnit({ accent = "pearl", className }: { accent?: Accent; className?: string }) {
  const c = BODY[accent];
  const id = useIds("boil");
  return (
    <svg viewBox="0 0 260 400" className={className} role="img" aria-label="Boiler uji">
      <defs>
        <linearGradient id={id("body")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.to} />
          <stop offset="28%" stopColor={c.from} />
          <stop offset="70%" stopColor={c.from} />
          <stop offset="100%" stopColor={c.to} />
        </linearGradient>
        <filter id={id("shadow")} x="-60%" y="-30%" width="220%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" />
        </filter>
        <filter id={id("ledGlow")} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      <ellipse cx="130" cy="378" rx="80" ry="10" fill="#0b1424" opacity="0.16" filter={`url(#${id("shadow")})`} />

      {/* cylinder */}
      <path d="M46 78 a84 44 0 0 1 168 0 v240 a84 44 0 0 1 -168 0 Z" fill={`url(#${id("body")})`} />
      <path d="M46.5 78 a83.5 43.5 0 0 1 167 0 v240 a83.5 43.5 0 0 1 -167 0 Z" fill="none" stroke="#ffffff" strokeOpacity="0.55" />

      {/* top cap ellipse highlight */}
      <ellipse cx="130" cy="78" rx="84" ry="44" fill="#ffffff" opacity="0.35" />
      <ellipse cx="130" cy="78" rx="84" ry="44" fill="none" stroke={c.ventDark} strokeOpacity="0.25" />

      {/* control panel */}
      <rect x="86" y="196" width="88" height="58" rx="14" fill="#0b1424" opacity="0.88" />
      <text x="130" y="222" textAnchor="middle" fontSize="17" fontWeight="700" fill={c.led} filter={`url(#${id("ledGlow")})`} fontFamily="ui-sans-serif, system-ui">65°</text>
      <text x="130" y="222" textAnchor="middle" fontSize="17" fontWeight="700" fill="#eafcff" fontFamily="ui-sans-serif, system-ui">65°</text>
      <rect x="100" y="234" width="60" height="5" rx="2.5" fill={c.led} opacity="0.5" />
      <rect x="100" y="234" width="38" height="5" rx="2.5" fill={c.led} />

      {/* heat glow ring */}
      <circle cx="130" cy="300" r="20" fill="none" stroke="#f45d22" strokeWidth="2" opacity="0.65" filter={`url(#${id("ledGlow")})`} />
      <circle cx="130" cy="300" r="20" fill="none" stroke="#f45d22" strokeWidth="1.4" opacity="0.9" />
      <path d="M130 291 c 4 5 6 7 6 10.5 a6 6 0 0 1 -12 0 c 0 -3.5 2 -5.5 6 -10.5 z" fill="#f45d22" />

      {/* pipes */}
      <rect x="96" y="352" width="12" height="34" rx="5" fill={c.ventDark} opacity="0.7" />
      <rect x="152" y="352" width="12" height="34" rx="5" fill="#c87b4a" />
      <text x="130" y="168" textAnchor="middle" fontSize="9.5" fontWeight="600" letterSpacing="2" fill="#8494ad" fontFamily="ui-sans-serif, system-ui">AQUAHEAT</text>
    </svg>
  );
}

export function PipeAccessory({ className }: { accent?: Accent; className?: string }) {
  const id = useIds("pipe");
  return (
    <svg viewBox="0 0 420 300" className={className} role="img" aria-label="Tub bakri i izoluar">
      <defs>
        <linearGradient id={id("copper")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8a76f" />
          <stop offset="45%" stopColor="#c87b4a" />
          <stop offset="100%" stopColor="#8f4f2b" />
        </linearGradient>
        <linearGradient id={id("foam")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a4356" />
          <stop offset="100%" stopColor="#181e2b" />
        </linearGradient>
        <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>

      <ellipse cx="210" cy="262" rx="150" ry="12" fill="#0b1424" opacity="0.15" filter={`url(#${id("shadow")})`} />

      {/* coiled insulated pipe (three loops) */}
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={210} cy={150} r={104 - i * 26} fill="none" stroke={`url(#${id("foam")})`} strokeWidth="22" opacity={1 - i * 0.06} />
      ))}
      {/* copper ends peeking out */}
      <path d="M210 46 q 90 0 104 84" fill="none" stroke={`url(#${id("copper")})`} strokeWidth="12" strokeLinecap="round" />
      <path d="M210 254 q -90 0 -104 -84" fill="none" stroke={`url(#${id("copper")})`} strokeWidth="12" strokeLinecap="round" />
      {/* flare nuts */}
      <rect x="306" y="120" width="22" height="18" rx="4" fill="#d9b23e" transform="rotate(74 317 129)" />
      <rect x="92" y="162" width="22" height="18" rx="4" fill="#d9b23e" transform="rotate(74 103 171)" />
      {/* highlight */}
      <path d="M130 90 a 104 104 0 0 1 76 -34" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function BracketAccessory({ className }: { accent?: Accent; className?: string }) {
  const id = useIds("brk");
  return (
    <svg viewBox="0 0 420 300" className={className} role="img" aria-label="Suport montimi">
      <defs>
        <linearGradient id={id("steel")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#dfe6ef" />
          <stop offset="50%" stopColor="#aab6c8" />
          <stop offset="100%" stopColor="#7e8ba0" />
        </linearGradient>
        <filter id={id("shadow")} x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
      </defs>

      <ellipse cx="210" cy="264" rx="140" ry="12" fill="#0b1424" opacity="0.15" filter={`url(#${id("shadow")})`} />

      {/* two L brackets in perspective */}
      {[0, 1].map((k) => {
        const dx = k * 120;
        return (
          <g key={k} transform={`translate(${70 + dx} 40)`}>
            {/* vertical arm */}
            <rect x="0" y="0" width="34" height="190" rx="6" fill={`url(#${id("steel")})`} stroke="#69758a" strokeOpacity="0.5" />
            {/* horizontal arm */}
            <rect x="0" y="156" width="160" height="34" rx="6" fill={`url(#${id("steel")})`} stroke="#69758a" strokeOpacity="0.5" />
            {/* diagonal brace */}
            <rect x="24" y="52" width="18" height="150" rx="5" fill={`url(#${id("steel")})`} stroke="#69758a" strokeOpacity="0.4" transform="rotate(-38 33 127)" />
            {/* holes */}
            {[24, 62, 100].map((y) => (
              <circle key={y} cx="17" cy={y} r="5" fill="#39445a" opacity="0.75" />
            ))}
            {[52, 96, 140].map((x) => (
              <circle key={x} cx={x} cy="173" r="5" fill="#39445a" opacity="0.75" />
            ))}
            {/* rubber damper */}
            <rect x="118" y="146" width="34" height="12" rx="4" fill="#1f2734" />
          </g>
        );
      })}
    </svg>
  );
}

export type RenderKey = "wall" | "standing" | "outdoor" | "boiler" | "pipe" | "bracket";

export function ProductRender({
  render,
  accent = "pearl",
  className,
}: {
  render: string;
  accent?: string;
  className?: string;
}) {
  const a = (["pearl", "graphite", "blue", "frost"].includes(accent) ? accent : "pearl") as Accent;
  switch (render as RenderKey) {
    case "standing":
      return <StandingUnit accent={a} className={className} />;
    case "outdoor":
      return <OutdoorUnit accent={a} className={className} />;
    case "boiler":
      return <BoilerUnit accent={a} className={className} />;
    case "pipe":
      return <PipeAccessory className={className} />;
    case "bracket":
      return <BracketAccessory className={className} />;
    default:
      return <WallUnit accent={a} className={className} />;
  }
}

/** Studio scene wrapper: soft accent-tinted backdrop behind a render. */
export function ProductVisual({
  render,
  accent = "pearl",
  className,
  glow = true,
}: {
  render: string;
  accent?: string;
  className?: string;
  glow?: boolean;
}) {
  const tint =
    accent === "graphite"
      ? "from-slate-400/25 via-transparent"
      : accent === "frost"
        ? "from-frost-300/40 via-transparent"
        : "from-brand-300/30 via-transparent";
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      {glow && (
        <div
          className={cn(
            "absolute inset-x-6 top-1/2 aspect-square -translate-y-1/2 rounded-full bg-radial to-70% opacity-90",
            tint
          )}
        />
      )}
      <ProductRender
        render={render}
        accent={accent}
        className={cn(
          "relative z-10 h-full w-full drop-shadow-sm",
          (render === "standing" || render === "boiler") && "px-[18%] py-2"
        )}
      />
    </div>
  );
}
