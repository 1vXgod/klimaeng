const BRANDS = [
  "Midea",
  "Daikin",
  "Mitsubishi Electric",
  "LG",
  "Samsung",
  "Bosch",
  "Gree",
  "Toshiba",
];

/** Elegant wordmark marquee — duplicated list for a seamless loop. */
export function TrustedBrands() {
  return (
    <section id="brands" aria-label="Markat partnere" className="border-b border-line bg-surface py-10">
      <div className="container-site">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-muted uppercase">
          Partnerë të autorizuar të markave lider botërore
        </p>
        <div
          className="relative mt-7 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="flex w-max animate-marquee items-center gap-14 pr-14 hover:[animation-play-state:paused]">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="font-display text-xl font-bold whitespace-nowrap text-ink-2/45 transition-colors duration-300 hover:text-ink-2 sm:text-2xl"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
