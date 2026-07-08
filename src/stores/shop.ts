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
  category: string;
  btu?: number | null;
  energyCool?: string | null;
  energyHeat?: string | null;
};

type CartItem = ProductSnapshot & { qty: number };

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  add: (p: ProductSnapshot, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
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
          const existing = s.items.find((i) => i.id === p.id);
          const items = existing
            ? s.items.map((i) =>
                i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, 9) } : i
              )
            : [...s.items, { ...p, qty }];
          return { items, isOpen: true };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 9) } : i)),
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
