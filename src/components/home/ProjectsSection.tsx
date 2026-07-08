import { Building2, Hotel, Store } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PROJECTS = [
  {
    icon: <Building2 size={22} />,
    title: "Kompleksi banesor “Arbëria Residence”",
    location: "Prishtinë",
    scope: "64 njësi split + 4 pompa termike qendrore",
    result: "Montim i plotë në 6 javë, zero reklamacione në 2 vjet",
    tags: ["Rezidencial", "Multi-Split"],
    gradient: "from-brand-600 via-brand-800 to-night-900",
  },
  {
    icon: <Hotel size={22} />,
    title: "Hotel “Panorama” — 42 dhoma",
    location: "Prishtinë",
    scope: "Sistem VRF me kontroll qendror + boilerë industrialë",
    result: "38% ulje e kostos vjetore të energjisë",
    tags: ["Hoteleri", "VRF"],
    gradient: "from-frost-500 via-brand-700 to-night-900",
  },
  {
    icon: <Store size={22} />,
    title: "Qendra tregtare “Aktash Center”",
    location: "Fushë Kosovë",
    scope: "12 njësi qëndruese 48000 BTU + ventilim i integruar",
    result: "Klimatizim uniform në 2.400 m² hapësirë",
    tags: ["Komercial", "Standing"],
    gradient: "from-flame-500 via-brand-800 to-night-900",
  },
];

export function ProjectsSection() {
  return (
    <section className="py-20 md:py-28" aria-label="Projektet e realizuara">
      <div className="container-site">
        <SectionHeading
          eyebrow="Projektet"
          title="Punë që flasin vetë"
          description="Nga banesa te hotele dhe qendra tregtare — disa nga projektet tona më përfaqësuese."
        />

        <div className="grid gap-5 md:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface card-shadow transition-all duration-300 hover:-translate-y-1.5 hover:card-shadow-lg">
                {/* abstract cover */}
                <div
                  className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${project.gradient}`}
                >
                  <div aria-hidden className="absolute inset-0 blueprint-grid opacity-30" />
                  <div
                    aria-hidden
                    className="absolute -bottom-10 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-2xl"
                  />
                  <span className="relative grid h-16 w-16 place-items-center rounded-3xl border border-white/20 bg-white/10 text-white backdrop-blur transition-transform duration-500 group-hover:scale-110">
                    {project.icon}
                  </span>
                  <span className="absolute right-4 bottom-3 text-[11px] font-semibold tracking-wider text-white/70 uppercase">
                    {project.location}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} tone="brand">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="mt-3 font-display text-lg leading-snug font-bold text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-2">{project.scope}</p>
                  <p className="mt-4 border-t border-line pt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ✓ {project.result}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
