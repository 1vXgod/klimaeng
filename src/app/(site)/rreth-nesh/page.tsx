import { Award, HeartHandshake, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import { CtaSection } from "@/components/home/CtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Rreth Nesh",
  description:
    "Nga tre teknikë dhe një furgon në 2016, te mbi 20 profesionistë dhe 1.200+ montime — historia e KlimaENG, kompanisë premium të klimatizimit në Prishtinë.",
};

const TIMELINE = [
  {
    year: "2016",
    title: "Fillimi modest",
    text: "Tre teknikë, një furgon i vjetër dhe një bindje: montimi cilësor nuk duhet të jetë luks. KlimaENG hap dyert në Prishtinë.",
  },
  {
    year: "2018",
    title: "Rritja e parë",
    text: "Bëhemi partner i autorizuar i Midea-s për Kosovën dhe kalojmë montimin e 200-të. Ekipi rritet në 8 profesionistë.",
  },
  {
    year: "2021",
    title: "Projektet komerciale",
    text: "Realizojmë projektin e parë të madh — 64 njësi në kompleksin “Arbëria Residence”. Hapet departamenti i sistemeve VRF dhe pompave termike.",
  },
  {
    year: "2024",
    title: "Standardi premium",
    text: "Mbi 20 profesionistë, 1.000+ montime dhe linja e parë e produkteve me markën KlimaENG. Nis programi i mirëmbajtjes me kontrata vjetore.",
  },
  {
    year: "Sot",
    title: "1.200+ montime e në rritje",
    text: "Çdo javë, dhjetëra familje dhe biznese në Prishtinë e rrethinë na besojnë komfortin e tyre. Dhe ne e marrim seriozisht.",
  },
];

const VALUES = [
  {
    icon: <Award size={20} />,
    title: "Cilësi pa kompromis",
    text: "Marka të certifikuara ndërkombtarisht, montim sipas EN 378 dhe garanci deri në 5 vjet — sepse komforti nuk duhet të jetë bast.",
  },
  {
    icon: <HeartHandshake size={20} />,
    title: "Klienti në qendër",
    text: "Çdo projekt nis me vlerësim falas të hapësirës. Rekomandojmë atë që ju duhet — jo atë që na leverdis të shesim.",
  },
  {
    icon: <Target size={20} />,
    title: "Saktësi teknike",
    text: "Teknikët tanë trajnohen vazhdimisht për teknologjitë inverter dhe gazrat e rinj ekologjikë. Matim dy herë, montojmë një herë.",
  },
  {
    icon: <Users size={20} />,
    title: "Ekip vendor",
    text: "Mbi 20 profesionistë nga Prishtina dhe rrethina — njerëz që i gjeni nesër po aty ku i gjetët sot.",
  },
];

const STATS = [
  { value: 8, suffix: "+", label: "Vjet në treg" },
  { value: 1200, suffix: "+", label: "Montime të përfunduara" },
  { value: 20, suffix: "+", label: "Profesionistë në ekip" },
  { value: 98, suffix: "%", label: "Klientë të kënaqur" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Rreth Nesh"
        title="Komforti termik, i ndërtuar me duar vendore"
        description="Misioni ynë: t'i sjellim çdo shtëpie dhe biznesi në Kosovë komfort termik të qëndrueshëm, me çmime të drejta dhe punë që flet vetë."
      />

      {/* stats band */}
      <section className="border-b border-line bg-surface">
        <div className="container-site grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-9 text-center">
              <p className="font-display text-3xl font-extrabold text-ink md:text-4xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-xs font-medium tracking-wide text-muted md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* story timeline */}
      <section className="py-16 md:py-24" aria-label="Historia jonë">
        <div className="container-site">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Nga një furgon, te lider i tregut
            </h2>
            <p className="mt-3 text-ink-2">
              Historia jonë nuk nisi me investitorë — nisi me tre teknikë që nuk
              duronin montimet gjysmake.
            </p>
          </Reveal>

          <div className="relative mx-auto max-w-3xl">
            <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-brand-500 via-frost-400 to-brand-200 md:left-1/2" />
            <div className="space-y-10">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={0.05}>
                  <div
                    className={`relative flex gap-6 md:w-1/2 ${
                      i % 2 === 0
                        ? "md:pr-10 md:text-right"
                        : "md:ml-auto md:flex-row-reverse md:pl-10 md:text-left"
                    }`}
                  >
                    <span
                      className={`absolute left-0 z-10 grid h-10 w-10 shrink-0 -translate-x-0 place-items-center rounded-full border-4 border-bg bg-gradient-to-b from-brand-500 to-brand-700 font-display text-[10px] font-bold text-white md:left-auto ${
                        i % 2 === 0 ? "md:-right-5 md:translate-x-0" : "md:-left-5"
                      }`}
                    >
                      {item.year === "Sot" ? "★" : item.year.slice(2)}
                    </span>
                    <div className="ml-14 md:ml-0">
                      <span className="font-display text-xs font-bold tracking-[0.25em] text-brand-500 uppercase">
                        {item.year}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-bold text-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="bg-surface py-16 md:py-24" aria-label="Vlerat tona">
        <div className="container-site">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Katër parime, zero përjashtime
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.07}>
                <div className="group h-full rounded-3xl border border-line bg-bg p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:card-shadow-lg dark:hover:border-brand-500/30">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-500/10 dark:text-brand-300">
                    {value.icon}
                  </span>
                  <h3 className="mt-4 font-display text-[17px] font-bold text-ink">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-16 md:pt-24">
        <CtaSection />
      </div>
    </>
  );
}
