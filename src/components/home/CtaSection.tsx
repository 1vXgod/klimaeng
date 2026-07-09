import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaSection() {
  return (
    <section className="pb-20 md:pb-28" aria-label="Kontaktoni tani">
      <div className="container-site">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-700 via-brand-600 to-frost-500 px-7 py-14 text-center text-white card-shadow-lg md:px-16 md:py-20">
            {/* decorative rings */}
            <div aria-hidden className="absolute -top-28 -left-20 h-72 w-72 rounded-full border border-white/15" />
            <div aria-hidden className="absolute -top-16 -left-8 h-48 w-48 rounded-full border border-white/10" />
            <div aria-hidden className="absolute -right-24 -bottom-32 h-80 w-80 rounded-full border border-white/15" />
            <div aria-hidden className="absolute -right-10 -bottom-16 h-52 w-52 rounded-full border border-white/10" />
            {/* snow accents */}
            <span aria-hidden className="absolute top-10 left-[15%] text-2xl opacity-30 animate-float">❄</span>
            <span aria-hidden className="absolute right-[18%] bottom-12 text-xl opacity-25 animate-float-slow">❄</span>

            <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl">
              Gati për temperaturën perfekte?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-lg">
              Konsulta dhe vlerësimi i hapësirës suaj janë falas — pa asnjë
              detyrim. Merrni ofertën tuaj brenda 24 orëve.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/kontakti"
                size="lg"
                className="group w-full bg-white !text-brand-700 shadow-xl hover:bg-brand-50 sm:w-auto from-white to-white"
              >
                Na Kontaktoni
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button href="tel:+38344000000" variant="frost" size="lg" className="w-full sm:w-auto">
                <PhoneCall size={16} />
                +383 44 000 000
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
