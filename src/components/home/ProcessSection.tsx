"use client";

import { motion } from "framer-motion";
import { CalendarCheck, ClipboardList, Sparkles, Wrench } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: <ClipboardList size={20} />,
    step: "01",
    title: "Konsulta falas",
    text: "Vizitojmë hapësirën tuaj, matim sipërfaqen dhe izolimin, dhe ju rekomandojmë kapacitetin e saktë.",
  },
  {
    icon: <Sparkles size={20} />,
    step: "02",
    title: "Zgjedhja e pajisjes",
    text: "Ju prezantojmë 2–3 opsione të përshtatura me buxhetin dhe nevojat — pa presion shitjeje.",
  },
  {
    icon: <Wrench size={20} />,
    step: "03",
    title: "Montimi në 48 orë",
    text: "Montim i pastër me testim vakumi, presioni dhe rrjedhjeje — dorëzim me demonstrim të plotë.",
  },
  {
    icon: <CalendarCheck size={20} />,
    step: "04",
    title: "Mirëmbajtja vjetore",
    text: "Ju kujtojmë ne për servisin — pastrim, kontroll gazi dhe garanci e vazhdueshme funksionimi.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-surface py-20 md:py-28" aria-label="Procesi i montimit">
      <div className="container-site">
        <SectionHeading
          eyebrow="Si funksionon"
          title="Katër hapa deri te komforti"
          description="Një proces i provuar në mbi 1.200 montime — i qartë, i shpejtë dhe pa surpriza."
        />

        <div className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {/* connector line (desktop) */}
          <div aria-hidden className="absolute top-6 right-[12%] left-[12%] hidden h-px md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.21, 0.65, 0.32, 1] }}
              className="h-full origin-left bg-gradient-to-r from-brand-500 via-frost-400 to-brand-500"
            />
          </div>

          {STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.12}>
              <div className="relative flex gap-5 md:block">
                <div className="relative z-10 flex flex-col items-center md:mb-5">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-[0_8px_20px_-6px_rgba(36,86,224,0.55)]">
                    {step.icon}
                  </span>
                  <span aria-hidden className="mt-2 w-px flex-1 bg-line md:hidden" />
                </div>
                <div className="pb-2 md:text-center">
                  <span className="font-display text-xs font-bold tracking-[0.25em] text-brand-500">
                    HAPI {step.step}
                  </span>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
