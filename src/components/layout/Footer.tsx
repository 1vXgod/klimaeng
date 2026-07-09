import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SOCIAL_LINKS } from "@/components/ui/SocialIcons";

const COLUMNS = [
  {
    title: "Kompania",
    links: [
      { label: "Rreth Nesh", href: "/rreth-nesh" },
      { label: "Shërbimet", href: "/sherbimet" },
      { label: "Produktet", href: "/produktet" },
      { label: "Kontakti", href: "/kontakti" },
    ],
  },
  {
    title: "Produktet",
    links: [
      { label: "Split AC", href: "/produktet?kategoria=SPLIT" },
      { label: "AC Qëndrues", href: "/produktet?kategoria=STANDING" },
      { label: "Pompa Termike", href: "/produktet?kategoria=HEATPUMP" },
      { label: "Boilerë", href: "/produktet?kategoria=BOILER" },
      { label: "Aksesorë", href: "/produktet?kategoria=ACCESSORY" },
    ],
  },
  {
    title: "Llogaria",
    links: [
      { label: "Kyçu", href: "/kycu" },
      { label: "Regjistrohu", href: "/regjistrohu" },
      { label: "Porositë e mia", href: "/llogaria/porosite" },
      { label: "Lista e dëshirave", href: "/lista-e-deshirave" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night-950 text-slate-300">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[46rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[110px]"
      />
      <div className="container-site relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <Logo onDark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              KlimaENG ofron zgjidhje profesionale HVAC që nga viti 2000, të
              specializuara në shitjen, montimin dhe servisimin e sistemeve të
              klimatizimit dhe ngrohjes. Me mbi 25 vjet përvojë, ofrojmë
              zgjidhje klimatike të besueshme dhe profesionale për klientët
              tanë.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href="https://maps.app.goo.gl/UYm7o5rTbATJKRox7"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <MapPin size={16} className="shrink-0 text-frost-400" />
                  Rr. Fahri Fazliu Nr-326, Kodra e Trimave, Prishtinë
                </a>
              </li>
              <li>
                <a
                  href="tel:+38344111051"
                  className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <Phone size={16} className="shrink-0 text-frost-400" />
                  044-111-051
                </a>
              </li>
              <li>
                <a
                  href="tel:+38349111051"
                  className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <Phone size={16} className="shrink-0 text-frost-400" />
                  049-111-051
                </a>
              </li>
              <li>
                <a
                  href="mailto:avnibunjaku@hotmail.com"
                  className="flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <Mail size={16} className="shrink-0 text-frost-400" />
                  avnibunjaku@hotmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Clock size={16} className="shrink-0 text-frost-400" />E Hënë – E
                Shtunë: 08:00 – 18:00
              </li>
            </ul>

            <ul className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-colors hover:border-frost-400/40 hover:bg-white/10 hover:text-white focus-ring"
                  >
                    <Icon size={17} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-display text-sm font-bold tracking-wider text-white uppercase">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-frost-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/8 py-7 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} KlimaENG. Të gjitha të drejtat e rezervuara.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
            Servis urgjent 24/7 — përgjigje brenda 24 orëve
          </p>
        </div>
      </div>
    </footer>
  );
}
