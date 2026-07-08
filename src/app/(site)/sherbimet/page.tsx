import { BadgeCheck, Check, ClipboardCheck, Gauge, ShoppingCart, Sparkles, Wrench } from "lucide-react";
import type { Metadata } from "next";
import { CtaSection } from "@/components/home/CtaSection";
import { PageHero } from "@/components/layout/PageHero";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shërbimet",
  description:
    "Shitje me këshillim profesional, montim brenda 48 orëve dhe servisim për të gjitha markat — çdo hap i udhëtimit tuaj drejt komfortit termik.",
};

const SERVICES = [
  {
    id: "shitje",
    icon: <ShoppingCart size={22} />,
    eyebrow: "01 — Shitje & Këshillim",
    title: "Zgjedhja e duhur nis me matjen e duhur",
    text: "Para se t'ju shesim çfarëdo, vijmë falas në hapësirën tuaj: masim sipërfaqen, vlerësojmë izolimin, orientimin nga dielli dhe numrin e personave. Vetëm pastaj rekomandojmë kapacitetin — kështu nuk paguani kurrë për BTU të tepërt, as nuk mbeteni me pajisje të pamjaftueshme.",
    bullets: [
      "Vlerësim falas i hapësirës në terren",
      "Rekomandim i pavarur — jo modeli më i shtrenjtë, por i duhuri",
      "Financim 6–24 muaj pa interes për blerje mbi 300€",
      "Ofertë me shkrim brenda 24 orëve",
    ],
    tone: "brand",
  },
  {
    id: "montim",
    icon: <Wrench size={22} />,
    eyebrow: "02 — Montim Profesional",
    title: "Montim si në libër, brenda 48 orëve",
    text: "Montimi i dobët është arsyeja #1 e defekteve të hershme. Ekipet tona punojnë sipas standardit evropian EN 378: testim vakumi 30-minutësh, kontroll presioni me azot dhe izolim i plotë i tubacioneve. Në fund ju demonstrojmë çdo funksion dhe ju lëmë hapësirën të pastër siç e gjetëm.",
    bullets: [
      "Teknikë të certifikuar me mbi 1.200 montime",
      "Testim vakumi dhe presioni në çdo montim",
      "Mbrojtje e plotë e mobiljeve dhe pastrim pas punës",
      "2 vjet garanci pune nga KlimaENG",
    ],
    tone: "frost",
  },
  {
    id: "servisim",
    icon: <Gauge size={22} />,
    eyebrow: "03 — Servisim & Mirëmbajtje",
    title: "Kujdesi që zgjat jetën e pajisjes suaj",
    text: "Një klimë e pashërbyer humb 5–10% efikasitet çdo vit dhe bëhet vatër bakteresh. Servisimi ynë vjetor përfshin pastrim kimik të njësisë së brendshme dhe të jashtme, kontroll të gazit ftohës, matje të temperaturave dhe diagnostikim të plotë — për të gjitha markat, jo vetëm ato që shesim ne.",
    bullets: [
      "Pastrim kimik me solucione antibakteriale",
      "Kontroll gazi dhe presioni me instrumente të kalibruara",
      "Servisim për të gjitha markat",
      "Linjë urgjence 24/7 për defekte",
    ],
    tone: "flame",
  },
];

const PLANS = [
  {
    name: "Bazik",
    price: "29€",
    period: "/ servisim",
    description: "Për një pajisje, një herë në vit",
    features: [
      "Pastrim i filtrave dhe njësisë së brendshme",
      "Kontroll vizual i instalimit",
      "Matje e temperaturës së daljes",
      "Raport i gjendjes",
    ],
    featured: false,
  },
  {
    name: "Kujdesi Vjetor",
    price: "49€",
    period: "/ vit",
    description: "Plani më i zgjedhur për shtëpi",
    features: [
      "Gjithçka nga plani Bazik",
      "Pastrim kimik i të dy njësive",
      "Kontroll i gazit ftohës + rimbushje deri 100g",
      "Prioritet në termine + kujtesë automatike",
      "10% zbritje në riparime",
    ],
    featured: true,
  },
  {
    name: "Biznes",
    price: "Me ofertë",
    period: "",
    description: "Për zyre, lokale dhe objekte komerciale",
    features: [
      "Plan i personalizuar sipas numrit të njësive",
      "2 vizita në vit + kontrolle sezonale",
      "SLA me kohë reagimi 4 orë",
      "Faturim mujor me kontratë",
    ],
    featured: false,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Shërbimet"
        title="Çdo hap drejt komfortit termik, i mbuluar"
        description="Nga konsulta e parë deri te servisimi i përvitshëm — një partner i vetëm, një standard i vetëm cilësie."
      />

      {/* services detail */}
      <div className="container-site space-y-6 py-16 md:py-20">
        {SERVICES.map((service, i) => (
          <Reveal key={service.id} delay={0.05}>
            <section
              id={service.id}
              className="grid scroll-mt-28 gap-8 rounded-4xl border border-line bg-surface p-7 card-shadow md:grid-cols-[1fr_1.4fr] md:p-12 lg:gap-14"
            >
              <div className={cn(i % 2 === 1 && "md:order-2")}>
                <span
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-2xl",
                    service.tone === "brand" && "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
                    service.tone === "frost" && "bg-frost-50 text-frost-600 dark:bg-frost-500/10 dark:text-frost-300",
                    service.tone === "flame" && "bg-flame-50 text-flame-600 dark:bg-flame-500/10 dark:text-flame-300"
                  )}
                >
                  {service.icon}
                </span>
                <p className="mt-5 font-display text-xs font-bold tracking-[0.25em] text-brand-500 uppercase">
                  {service.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{service.text}</p>
              </div>
              <div className={cn("flex flex-col justify-center", i % 2 === 1 && "md:order-1")}>
                <ul className="grid gap-3 sm:grid-cols-1">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 rounded-2xl border border-line bg-bg px-5 py-4 text-sm font-medium text-ink-2"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* maintenance plans */}
      <section className="bg-surface py-16 md:py-24" aria-label="Planet e mirëmbajtjes">
        <div className="container-site">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold tracking-widest text-brand-700 uppercase dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-brand-300">
              <Sparkles size={12} /> Planet e mirëmbajtjes
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
              Zgjidhni planin e kujdesit
            </h2>
            <p className="mt-3 text-ink-2">
              Pa kontrata të fshehta — anuloni kur të doni.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1",
                    plan.featured
                      ? "border-brand-500/40 bg-night-950 text-white card-shadow-lg"
                      : "border-line bg-bg card-shadow"
                  )}
                >
                  {plan.featured && (
                    <Badge tone="frost" className="absolute -top-3 left-7">
                      Më i zgjedhuri
                    </Badge>
                  )}
                  <h3 className={cn("font-display text-lg font-bold", plan.featured ? "text-white" : "text-ink")}>
                    {plan.name}
                  </h3>
                  <p className={cn("mt-1 text-sm", plan.featured ? "text-slate-400" : "text-muted")}>
                    {plan.description}
                  </p>
                  <p className="mt-5">
                    <span className={cn("font-display text-4xl font-extrabold", plan.featured ? "text-white" : "text-ink")}>
                      {plan.price}
                    </span>
                    <span className={cn("text-sm font-medium", plan.featured ? "text-slate-400" : "text-muted")}>
                      {plan.period}
                    </span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-start gap-2.5 text-sm",
                          plan.featured ? "text-slate-300" : "text-ink-2"
                        )}
                      >
                        <BadgeCheck
                          size={16}
                          className={cn("mt-0.5 shrink-0", plan.featured ? "text-frost-400" : "text-brand-500")}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="/kontakti"
                    variant={plan.featured ? "primary" : "secondary"}
                    className="mt-7 w-full"
                  >
                    <ClipboardCheck size={16} />
                    Rezervo tani
                  </Button>
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
