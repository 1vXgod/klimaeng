import type { ReactNode } from "react";
import { BackToTop } from "@/components/layout/BackToTop";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { OverscrollGuard } from "@/components/layout/OverscrollGuard";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CompareBar } from "@/components/products/CompareBar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* Mobile rubber-band overscroll below the document exposes the raw
          canvas (near-white), which reads as a blank page under the dark
          footer. Fixed elements ride the bounce, so this strip parked just
          below the viewport slides up to fill that region in the footer's
          color. It never occupies layout space or extends the scroll area. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-full -z-10 h-dvh bg-night-950"
      />
      <OverscrollGuard />
      <CartDrawer />
      <CompareBar />
      <BackToTop />
      <ChatWidget />
    </>
  );
}
