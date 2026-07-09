import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";

export const metadata: Metadata = {
  title: "Kontakti",
  description:
    "Na kontaktoni për ofertë falas: 044-111-051 / 049-111-051 · avnibunjaku@hotmail.com · Rr. Fahri Fazliu Nr-326, Kodra e Trimave, Prishtinë. Përgjigjemi brenda 24 orëve.",
};

const CARDS = [
  {
    icon: <Phone size={19} />,
    title: "Telefoni",
    lines: ["044-111-051", "049-111-051"],
    href: "tel:+38344111051",
    note: "Urgjenca teknike: 24/7",
  },
  {
    icon: <Mail size={19} />,
    title: "Email",
    lines: ["avnibunjaku@hotmail.com"],
    href: "mailto:avnibunjaku@hotmail.com",
    note: "Përgjigje brenda 24 orëve",
  },
  {
    icon: <MapPin size={19} />,
    title: "Adresa",
    lines: ["Rr. Fahri Fazliu Nr-326", "Kodra e Trimave, Prishtinë"],
    href: "https://maps.app.goo.gl/UYm7o5rTbATJKRox7",
    note: "Parking falas para objektit",
  },
  {
    icon: <Clock size={19} />,
    title: "Orari",
    lines: ["E Hënë – E Shtunë", "08:00 – 18:00"],
    note: "E Diel: vetëm urgjenca",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Kontakti"
        title="Le të flasim për komfortin tuaj"
        description="Konsulta dhe vlerësimi i hapësirës janë falas — pa asnjë detyrim blerjeje."
      />

      <div className="container-site py-14 md:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.06}>
              {card.href ? (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group block h-full rounded-3xl border border-line bg-surface p-6 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:card-shadow-lg focus-ring dark:hover:border-brand-500/30"
                >
                  <ContactCardBody card={card} />
                </a>
              ) : (
                <div className="h-full rounded-3xl border border-line bg-surface p-6 card-shadow">
                  <ContactCardBody card={card} />
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <Reveal>
            <ContactForm />
          </Reveal>

          {/* stylized location panel */}
          <Reveal delay={0.1}>
            <div className="relative flex h-full min-h-80 flex-col justify-end overflow-hidden rounded-3xl bg-night-950 p-7 text-white card-shadow-lg">
              <div aria-hidden className="absolute inset-0 blueprint-grid opacity-70" />
              {/* abstract streets */}
              <svg aria-hidden viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-40">
                <path d="M-20 80 Q 120 60 200 120 T 420 140" stroke="#2cc8e8" strokeWidth="2.5" fill="none" opacity="0.5" />
                <path d="M60 -20 Q 90 100 60 180 T 100 320" stroke="#3d74f0" strokeWidth="2" fill="none" opacity="0.5" />
                <path d="M-20 200 L 420 230" stroke="#3d74f0" strokeWidth="1.4" fill="none" opacity="0.35" />
                <path d="M240 -20 Q 260 120 330 190 T 420 260" stroke="#2cc8e8" strokeWidth="1.6" fill="none" opacity="0.35" />
              </svg>
              {/* pin */}
              <div className="absolute top-[34%] left-1/2 -translate-x-1/2 -translate-y-full">
                <span className="relative block">
                  <span className="absolute -inset-4 animate-ping rounded-full bg-frost-400/25" />
                  <span className="relative grid h-12 w-12 place-items-center rounded-full border border-frost-300/40 bg-gradient-to-b from-brand-500 to-brand-700 shadow-xl">
                    <MapPin size={20} />
                  </span>
                </span>
              </div>

              <div className="relative">
                <p className="text-xs font-semibold tracking-[0.2em] text-frost-300 uppercase">
                  Zyra qendrore
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-bold">
                  Kodra e Trimave, Prishtinë
                </h3>
                <p className="mt-1 text-sm text-slate-300">Rr. Fahri Fazliu Nr-326</p>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
                  Ejani për një kafe dhe shikoni modelet e ekspozuara nga afër —
                  ose kërkoni vizitë falas në hapësirën tuaj.
                </p>
                <a
                  href="https://maps.app.goo.gl/UYm7o5rTbATJKRox7"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/20 focus-ring"
                >
                  <MapPin size={15} />
                  Hape në Google Maps
                </a>

                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">
                    Na ndiqni
                  </span>
                  <ul className="flex items-center gap-2.5">
                    {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-ring"
                        >
                          <Icon size={15} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}

function ContactCardBody({
  card,
}: {
  card: { icon: React.ReactNode; title: string; lines: string[]; note: string };
}) {
  return (
    <>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        {card.icon}
      </span>
      <h2 className="mt-4 font-display text-[15px] font-bold text-ink">{card.title}</h2>
      {card.lines.map((line) => (
        <p key={line} className="mt-0.5 text-sm font-semibold text-ink-2">
          {line}
        </p>
      ))}
      <p className="mt-2 text-xs text-muted">{card.note}</p>
    </>
  );
}
