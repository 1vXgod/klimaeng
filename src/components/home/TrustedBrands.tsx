type Brand = {
  name: string;
  src: string;
};

const MAIN_PARTNER: Brand = { name: "Midea", src: "/partners/midea.svg" };

const BRANDS: Brand[] = [
  { name: "Daikin", src: "/partners/daikin.svg" },
  { name: "Mitsubishi Electric", src: "/partners/mitsubishi-electric.svg" },
  { name: "LG", src: "/partners/lg.svg" },
  { name: "Samsung", src: "/partners/samsung.svg" },
  { name: "Bosch", src: "/partners/bosch.svg" },
  { name: "Gree", src: "/partners/gree.svg" },
  { name: "Toshiba", src: "/partners/toshiba.svg" },
];

/** Midea featured as main partner, remaining logos in a seamless marquee loop. */
export function TrustedBrands() {
  return (
    <section id="brands" aria-label="Markat partnere" className="border-b border-line bg-surface py-10">
      <div className="container-site">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted uppercase">
          Partnerë të autorizuar të markave lider botërore
        </p>

        <div className="mt-8 flex justify-center">
          <div className="group flex flex-col items-center gap-3 rounded-3xl border border-black/5 bg-white px-10 py-6 shadow-[0_2px_6px_rgba(15,23,42,0.06)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-black/10 hover:shadow-[0_24px_48px_-16px_rgba(15,23,42,0.28)] dark:border-white/10 dark:hover:shadow-[0_24px_48px_-16px_rgba(61,116,240,0.5)] sm:px-14 sm:py-7">
            <img
              src={MAIN_PARTNER.src}
              alt={MAIN_PARTNER.name}
              className="h-12 w-auto object-contain opacity-60 grayscale-[0.5] transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 sm:h-14"
            />
            <span className="text-[10px] font-semibold tracking-[0.22em] whitespace-nowrap text-slate-400 uppercase transition-colors duration-500 group-hover:text-[#00B0F0]">
              Partner kryesor i autorizuar
            </span>
          </div>
        </div>

        <div
          className="relative mt-7 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="animate-marquee flex w-max items-center gap-5 pr-5 hover:[animation-play-state:paused] sm:gap-6 sm:pr-6">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <div
                key={`${brand.name}-${i}`}
                className="group flex shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-white px-7 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_16px_32px_-12px_rgba(15,23,42,0.22)] dark:border-white/10 dark:hover:shadow-[0_16px_32px_-12px_rgba(61,116,240,0.45)] sm:px-9 sm:py-6"
              >
                <img
                  src={brand.src}
                  alt={brand.name}
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-auto object-contain opacity-45 grayscale transition-all duration-500 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 sm:h-8"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
