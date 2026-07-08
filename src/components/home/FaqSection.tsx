import { MessageCircle, PhoneCall } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const FAQS = [
  {
    q: "Sa zgjat montimi i një klime?",
    a: "Një montim standard split zgjat 2–4 orë. Nga momenti i porosisë, ekipi ynë vjen brenda 48 orëve — shpesh edhe të nesërmen. Për sisteme multi-split ose pompa termike, koha koordinohet gjatë konsultës.",
  },
  {
    q: "Çfarë garancie ofroni?",
    a: "Të gjitha pajisjet vijnë me garanci zyrtare të prodhuesit nga 2 deri në 5 vjet, ndërsa puna e montimit mbulohet me 2 vjet garanci nga KlimaENG. Me kontratë mirëmbajtjeje vjetore, garancia e punës zgjatet automatikisht.",
  },
  {
    q: "A ofroni pagesë me këste?",
    a: "Po — bashkëpunojmë me bankat kryesore në Kosovë për financim 6–24 muaj pa interes për blerje mbi 300€. Sillni vetëm letërnjoftimin; procedura zgjat rreth 15 minuta.",
  },
  {
    q: "Në cilat zona operoni?",
    a: "Mbulojmë Prishtinën dhe rrethinën: Fushë Kosovë, Obiliq, Podujevë, Graçanicë, Lipjan dhe Vushtrri. Për projekte komerciale operojmë në gjithë Kosovën.",
  },
  {
    q: "Sa shpesh duhet servisuar klima?",
    a: "Rekomandojmë servisim një herë në vit — idealisht në pranverë, para sezonit të ftohjes. Pastrimi i filtrave dhe kontrolli i gazit mbajnë efikasitetin maksimal dhe zgjasin jetën e pajisjes deri në 5 vjet shtesë.",
  },
  {
    q: "Si e di çfarë kapaciteti (BTU) më duhet?",
    a: "Rregulli bazë: rreth 340 BTU për m². Për një dhomë 25 m² mjafton 9000 BTU; për 35 m² duhet 12000 BTU. Por izolimi, kthina nga dielli dhe lartësia e tavanit ndikojnë — prandaj konsulta jonë në terren është falas.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 md:py-28" aria-label="Pyetjet e shpeshta">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Pyetjet që na bëhen më shpesh"
              description="Nuk e gjetët përgjigjen? Na shkruani në chat ose telefononi — përgjigjemi brenda pak minutash."
              className="mb-8"
            />
            <Reveal delay={0.1}>
              <div className="space-y-3">
                <Button href="/kontakti" variant="secondary" className="w-full justify-start sm:w-auto">
                  <MessageCircle size={16} className="text-brand-500" />
                  Na shkruani një mesazh
                </Button>
                <a
                  href="tel:+38344000000"
                  className="flex w-fit items-center gap-2 px-1 text-sm font-semibold text-ink-2 transition-colors hover:text-brand-600"
                >
                  <PhoneCall size={15} className="text-brand-500" />
                  +383 44 000 000 — çdo ditë 08:00–18:00
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <Accordion items={FAQS} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
