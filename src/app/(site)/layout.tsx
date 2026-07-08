import type { ReactNode } from "react";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CompareBar } from "@/components/products/CompareBar";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <CompareBar />
      <ChatWidget />
    </>
  );
}
