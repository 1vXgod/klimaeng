import { ArrowUpRight, ShoppingCart, Wrench, Settings2 } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const SERVICES = [
  {
    icon: <ShoppingCart size={21} />,
    title: "Shitje & Këshillim",
    text: "Vlerësim falas i hapësirës suaj dhe rekomandim i saktë i kapacitetit — kurrë mos paguani për BTU që s'ju duhen.",
    href: "/sherbimet#shitje",
    accent: "from-brand-500/12 to-transparent text-brand-600 dark:text-brand-300",
  },
  {
    icon: <Wrench size={21} />,
    title: "Montim Profesional",
    text: "Teknikë të certifikuar, montim brenda 48 orëve, testim vakumi dhe presioni sipas standardit evropian EN 378.",
    href: "/sherbimet#montim",
    accent: "from-frost-500/12 to-transparent text-frost-600 dark:text-frost-300",
  },
  {
    icon: <Settings2 size={21} />,
    title: "Servisim & Mirëmbajtje",
    text: "Pastrim kimik, kontroll gazi dhe diagnostikim për të gjitha markat — me kontrata vjetore që zgjasin jetën e pajisjes.",
    href: "/sherbimet#servisim",
    accent: "from-flame-500/12 to-transparent text-flame-600 dark:text-flame-300",
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 md:py-28" aria-label="Shërbimet">
      <div className="container-site">
        <SectionHeading
          eyebrow="Shërbimet"
          title="Nga konsulta te komforti — çdo hap i mbuluar"
          description="Një partner i vetëm për të gjithë ciklin e jetës së sistemit tuaj të klimatizimit dhe ngrohjes."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.08}>
              <Link
                href={service.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:card-shadow-lg focus-ring dark:hover:border-brand-500/30 md:p-8"
              >
                <div
                  aria-hidden
                  className={`absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-b ${service.accent.split(" ").slice(0, 2).join(" ")} blur-2xl transition-transform duration-500 group-hover:scale-125`}
                />
                <span
                  className={`relative grid h-12 w-12 place-items-center rounded-2xl bg-surface-2 ${service.accent.split(" ").slice(2).join(" ")}`}
                >
                  {service.icon}
                </span>
                <h3 className="relative mt-5 font-display text-xl font-bold text-ink">
                  {service.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-ink-2">
                  {service.text}
                </p>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300">
                  Mëso më shumë
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
