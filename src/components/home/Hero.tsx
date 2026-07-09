"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck, Snowflake, Star, Sun, Wrench } from "lucide-react";
import { useRef } from "react";
import { WallUnit } from "@/components/renders/ProductRender";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";

/** Deterministic particle field (no Math.random → no hydration mismatch). */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  duration: 9 + (i % 5) * 2,
  delay: (i % 7) * 1.1,
}));

const STATS = [
  { value: 25, suffix: "+", label: "Vjet përvojë" },
  { value: 1200, suffix: "+", label: "Sisteme të montuara" },
  { value: 950, suffix: "+", label: "Klientë të lumtur" },
  { value: 24, suffix: "/7", label: "Servis urgjent" },
];

const ease = [0.21, 0.65, 0.32, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const unitX = useTransform(sx, [-1, 1], [-10, 10]);
  const unitY = useTransform(sy, [-1, 1], [-7, 7]);
  const badgeX = useTransform(sx, [-1, 1], [16, -16]);
  const badgeY = useTransform(sy, [-1, 1], [12, -12]);
  const glowX = useTransform(sx, [-1, 1], [-30, 30]);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden bg-night-950 text-white"
    >
      {/* backdrop: blueprint grid + aurora glows */}
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-60" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52rem 30rem at 12% -10%, rgba(36,86,224,0.35), transparent 60%), radial-gradient(44rem 30rem at 95% 20%, rgba(14,170,205,0.22), transparent 65%), radial-gradient(30rem 22rem at 70% 105%, rgba(36,86,224,0.18), transparent 60%)",
        }}
      />
      {/* drifting cool-air particles */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-frost-300/50"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [-8, 8, -8], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="container-site relative">
        <div className="grid min-h-[calc(100dvh-4rem)] items-center gap-12 pt-28 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pt-24 lg:pb-10">
          {/* ------ copy ------ */}
          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/6 px-4 py-1.5 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-frost-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-frost-400" />
              </span>
              <span className="text-[13px] font-medium text-slate-200">
                Që nga 2000 — Prishtinë, Kosovë
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease }}
              className="mt-6 font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl sm:leading-[1.06] lg:text-[4.2rem]"
            >
              Temperatura e duhur,
              <br />
              <span className="gradient-text">në çdo stinë.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease }}
              className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Shesim, montojmë dhe mirëmbajmë sisteme premium klimatizimi e
              ngrohjeje për shtëpi dhe biznese — nga konsulta e parë falas deri
              te servisimi vjetor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href="/produktet" size="lg" className="group">
                Shiko Produktet
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button href="/kontakti" variant="frost" size="lg">
                <Wrench size={16} />
                Rezervo Montim Falas
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.42 }}
              className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-slate-300"
            >
              <span className="flex items-center gap-1.5">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#f5a623" stroke="#f5a623" />
                  ))}
                </span>
                <strong className="font-semibold text-white">4.9/5</strong> nga 320+ vlerësime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-frost-400" />
                Garanci deri në 5 vjet
              </span>
              <span className="flex items-center gap-1.5">
                <Wrench size={14} className="text-frost-400" />
                Teknikë të certifikuar
              </span>
            </motion.div>
          </div>

          {/* ------ product visual ------ */}
          <div className="relative z-10 mx-auto mb-8 w-full max-w-xl lg:mb-0 lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
              className="relative"
            >
              {/* glow behind unit */}
              <motion.div
                aria-hidden
                style={{ x: glowX }}
                className="absolute inset-x-8 top-1/2 aspect-square -translate-y-1/2 rounded-full bg-radial from-brand-500/30 via-frost-500/10 to-transparent to-70%"
              />

              {/* wall line to anchor the unit */}
              <div aria-hidden className="absolute inset-x-4 top-[12%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <motion.div style={{ x: unitX, y: unitY }} className="relative animate-float-slow">
                <WallUnit accent="graphite" className="w-full drop-shadow-[0_30px_50px_rgba(3,8,20,0.55)]" />

                {/* airflow waves */}
                <svg
                  viewBox="0 0 420 110"
                  className="absolute inset-x-0 -bottom-10 w-full"
                  aria-hidden
                >
                  {[0, 1, 2].map((i) => (
                    <motion.path
                      key={i}
                      d={`M80 ${8 + i * 26} q 65 ${20 + i * 8} 130 ${10 + i * 10} t 130 ${6 + i * 8}`}
                      fill="none"
                      stroke="url(#hero-flow)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0] }}
                      transition={{
                        duration: 3.4,
                        delay: 0.8 + i * 0.55,
                        repeat: Infinity,
                        repeatDelay: 0.6,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="hero-flow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2cc8e8" stopOpacity="0" />
                      <stop offset="50%" stopColor="#2cc8e8" />
                      <stop offset="100%" stopColor="#6ce0f5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* floating energy badges */}
              <motion.div
                style={{ x: badgeX, y: badgeY }}
                className="absolute -top-4 -left-2 sm:top-0 sm:left-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6, ease }}
                  className="flex items-center gap-2 rounded-2xl border border-frost-400/30 bg-night-900/80 py-2 pr-4 pl-2.5 backdrop-blur-md animate-float"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-frost-500/20 text-frost-300">
                    <Snowflake size={16} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Ftohje</p>
                    <p className="text-sm font-bold text-frost-300">Klasa A++</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                style={{ x: badgeX, y: badgeY }}
                className="absolute -right-2 top-[46%] sm:right-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.6, ease }}
                  className="flex items-center gap-2 rounded-2xl border border-flame-400/30 bg-night-900/80 py-2 pr-4 pl-2.5 backdrop-blur-md animate-float"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-flame-500/20 text-flame-300">
                    <Sun size={16} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Ngrohje</p>
                    <p className="text-sm font-bold text-flame-300">Klasa A+++</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* live temperature card */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.65, ease }}
                className="absolute -bottom-6 left-1/2 w-56 -translate-x-1/2 sm:left-[18%] sm:translate-x-0"
              >
                <div className="rounded-2xl border border-white/10 bg-night-900/85 p-4 backdrop-blur-md card-shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
                      Dhoma e ndenjes
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-frost-300">
                      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-frost-400" />
                      Ftohje aktive
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <span className="font-display text-3xl font-bold text-white">22.5°</span>
                    <div className="mb-1 flex h-6 items-end gap-0.5" aria-hidden>
                      {[3, 5, 8, 6, 10, 7, 11, 9].map((h, i) => (
                        <motion.span
                          key={i}
                          className="w-1 rounded-full bg-gradient-to-t from-brand-500 to-frost-400"
                          animate={{ height: [h, h + 6, h] }}
                          transition={{ duration: 1.6, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ------ stats ribbon ------ */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease }}
          className="relative z-10 mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/8 backdrop-blur-md lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-night-900/55 px-6 py-5 text-center">
              <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* scroll indicator */}
        <motion.a
          href="#brands"
          aria-label="Vazhdo më poshtë"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-40 left-1/2 hidden -translate-x-1/2 lg:block"
        >
          <motion.span
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300"
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
