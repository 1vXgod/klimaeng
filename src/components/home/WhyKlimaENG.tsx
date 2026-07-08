"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Clock4, PhoneCall, ShieldCheck, Wifi, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Bento grid — each tile has its own micro-visual. */
export function WhyKlimaENG() {
  return (
    <section className="bg-surface py-20 md:py-28" aria-label="Pse KlimaENG">
      <div className="container-site">
        <SectionHeading
          eyebrow="Pse KlimaENG"
          title="Standardi premium i komfortit termik"
          description="Nuk shesim thjesht pajisje — projektojmë, montojmë dhe garantojmë komfortin tuaj për vite me radhë."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Big: energy savings */}
          <Reveal className="sm:col-span-2 lg:row-span-2">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-night-950 p-7 text-white card-shadow-lg md:p-9">
              <div aria-hidden className="absolute inset-0 blueprint-grid opacity-40" />
              <div
                aria-hidden
                className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-brand-600/30 blur-[90px] transition-all duration-700 group-hover:bg-brand-500/40"
              />
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-frost-500/15 text-frost-300">
                <Zap size={20} />
              </span>
              <h3 className="relative mt-5 font-display text-2xl font-bold tracking-tight">
                Deri në 40% kursim energjie
              </h3>
              <p className="relative mt-3 max-w-sm text-[15px] leading-relaxed text-slate-300">
                Teknologjia inverter DC përshtat fuqinë në kohë reale — pa ndezje
                e fikje të vazhdueshme, pa harxhim të panevojshëm.
              </p>

              {/* animated comparison bars */}
              <div className="relative mt-auto space-y-4 pt-8">
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                    <span>Klimë e vjetër (On/Off)</span>
                    <span className="font-semibold text-slate-300">100% konsum</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.21, 0.65, 0.32, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-flame-500 to-flame-400"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                    <span>KlimaENG Inverter A+++</span>
                    <span className="font-semibold text-frost-300">60% konsum</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.25, ease: [0.21, 0.65, 0.32, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-frost-400"
                    />
                  </div>
                </div>
                <p className="pt-1 text-xs text-slate-500">
                  *Krahasim orientues sipas standardit SEER për 12000 BTU.
                </p>
              </div>
            </div>
          </Reveal>

          <BentoTile
            icon={<Clock4 size={19} />}
            title="Montim brenda 48 orëve"
            text="Nga porosia te fllad i parë — ekipet tona montojnë çdo ditë, edhe të shtunave."
            delay={0.05}
          />
          <BentoTile
            icon={<ShieldCheck size={19} />}
            title="Garanci deri në 5 vjet"
            text="Garanci zyrtare e prodhuesit plus mbulim shtesë nga servisi ynë i autorizuar."
            delay={0.1}
          />
          <BentoTile
            icon={<BadgeCheck size={19} />}
            title="Teknikë të certifikuar"
            text="Mbi 20 profesionistë me trajnime të vazhdueshme për teknologjitë inverter."
            delay={0.15}
          />
          <BentoTile
            icon={<PhoneCall size={19} />}
            title="Servis urgjent 24/7"
            text="Defekt në mes të gushtit? Linja jonë e emergjencës përgjigjet çdo orë."
            delay={0.2}
            extra={
              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-500" />
                Aktiv tani
              </span>
            }
          />
        </div>

        {/* wifi strip */}
        <Reveal delay={0.1} className="mt-5">
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-gradient-to-r from-brand-50 to-frost-50 p-6 sm:flex-row sm:items-center md:px-9 dark:from-brand-500/10 dark:to-frost-500/10 dark:border-brand-500/20">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-brand-600 card-shadow dark:bg-night-900">
                <Wifi size={20} />
              </span>
              <div>
                <h3 className="font-display font-bold text-ink">Shtëpi e mençur, klimë e mençur</h3>
                <p className="mt-0.5 text-sm text-ink-2">
                  Modelet me Wi-Fi kontrollohen nga telefoni — ndizni klimën para se të arrini në shtëpi.
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-bold text-brand-700 dark:bg-night-900 dark:border-brand-500/30 dark:text-brand-300">
              Google Home • Alexa • SmartThings
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BentoTile({
  icon,
  title,
  text,
  delay,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  delay: number;
  extra?: React.ReactNode;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group flex h-full flex-col rounded-3xl border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:card-shadow-lg dark:hover:border-brand-500/30 md:p-7">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-300">
          {icon}
        </span>
        <h3 className="mt-4 font-display text-[17px] font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{text}</p>
        {extra}
      </div>
    </Reveal>
  );
}
