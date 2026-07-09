"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Lightweight product snapshot stored client-side for cart/wishlist/compare. */
export type ProductSnapshot = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number | null;
  render: string;
  accent: string;
  imageUrl?: string | null;
  category: string;
  btu?: number | null;
  energyCool?: string | null;
  energyHeat?: string | null;
};

/** A snapshot headed for the cart, optionally pinned to a BTU price variant. */
export type CartProduct = ProductSnapshot & {
  /**
   * Selected higher-capacity variant (18000/24000); null/undefined = the base
   * price. `price`/`oldPrice` must already be the variant's own pair.
   */
  variantBtu?: number | null;
};

type CartItem = CartProduct & { qty: number };

/**
 * One cart line per product+capacity. Base lines keep the bare product id so
 * quick-adds (product cards, wishlist, compare) and carts persisted before
 * variants existed keep merging into the same line.
 */
export function cartLineKey(i: { id: string; variantBtu?: number | null }) {
  return i.variantBtu ? `${i.id}:${i.variantBtu}` : i.id;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (p: CartProduct, qty?: number) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (p, qty = 1) =>
        set((s) => {
          const key = cartLineKey(p);
          const existing = s.items.find((i) => cartLineKey(i) === key);
          const items = existing
            ? s.items.map((i) =>
                cartLineKey(i) === key ? { ...i, qty: Math.min(i.qty + qty, 9) } : i
              )
            : [...s.items, { ...p, qty }];
          return { items, isOpen: true };
        }),
      remove: (key) =>
        set((s) => ({ items: s.items.filter((i) => cartLineKey(i) !== key) })),
      setQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => cartLineKey(i) !== key)
              : s.items.map((i) =>
                  cartLineKey(i) === key ? { ...i, qty: Math.min(qty, 9) } : i
                ),
        })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: "klimaeng-cart", partialize: (s) => ({ items: s.items, isOpen: false }) }
  )
);

type WishlistState = {
  items: ProductSnapshot[];
  toggle: (p: ProductSnapshot) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) =>
        set((s) =>
          s.items.some((i) => i.id === p.id)
            ? { items: s.items.filter((i) => i.id !== p.id) }
            : { items: [...s.items, p] }
        ),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "klimaeng-wishlist" }
  )
);

type CompareState = {
  items: ProductSnapshot[];
  toggle: (p: ProductSnapshot) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

export const MAX_COMPARE = 3;

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (p) =>
        set((s) => {
          if (s.items.some((i) => i.id === p.id)) {
            return { items: s.items.filter((i) => i.id !== p.id) };
          }
          if (s.items.length >= MAX_COMPARE) return s;
          return { items: [...s.items, p] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "klimaeng-compare" }
  )
);
