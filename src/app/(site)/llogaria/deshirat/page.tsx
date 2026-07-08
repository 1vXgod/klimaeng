"use client";

import { WishlistGrid } from "@/components/account/WishlistGrid";

export default function AccountWishlistPage() {
  return (
    <div>
      <h2 className="mb-5 font-display text-xl font-bold text-ink">Lista e dëshirave</h2>
      <WishlistGrid columns={2} />
    </div>
  );
}
