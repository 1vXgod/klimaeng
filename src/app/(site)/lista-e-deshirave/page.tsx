"use client";

import { WishlistGrid } from "@/components/account/WishlistGrid";

export default function WishlistPage() {
  return (
    <div className="container-site pt-28 pb-20 md:pt-36">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        Lista e dëshirave
      </h1>
      <p className="mt-2 mb-10 text-ink-2">
        Produktet që keni ruajtur për më vonë — çmimet përditësohen automatikisht.
      </p>
      <WishlistGrid />
    </div>
  );
}
