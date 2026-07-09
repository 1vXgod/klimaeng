import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://klimaeng.vercel.app"),
  title: {
    default: "KlimaENG — Klimatizim & Ngrohje Premium në Prishtinë",
    template: "%s — KlimaENG",
  },
  description:
    "Shitje, montim dhe servisim i sistemeve premium të klimatizimit dhe ngrohjes për shtëpi dhe biznese në Prishtinë e më gjerë. Teknikë të certifikuar, garanci deri në 5 vjet.",
  keywords: [
    "klima",
    "kondicioner",
    "ngrohje",
    "HVAC",
    "Prishtinë",
    "Kosovë",
    "montim klimash",
    "servisim klimash",
  ],
  openGraph: {
    type: "website",
    locale: "sq_AL",
    siteName: "KlimaENG",
    title: "KlimaENG — Klimatizim & Ngrohje Premium",
    description:
      "Temperatura e duhur, në çdo stinë. Sisteme premium klimatizimi dhe ngrohjeje me montim profesional në Kosovë.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070b13" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Applies the saved theme before first paint to avoid a flash. */
const themeInit = `(function(){try{if(localStorage.getItem("klimaeng-theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
