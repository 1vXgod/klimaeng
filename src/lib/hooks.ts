"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { DiscountInfo } from "@/lib/utils";

const emptySubscribe = () => () => {};

/** True once the component is mounted on the client — guards persisted-store UI against hydration mismatch. */
export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function subscribeToThemeClass(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/** Tracks the `.dark` class on <html> — the single source of truth for theme. */
export function useIsDark() {
  return useSyncExternalStore(
    subscribeToThemeClass,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
}

/**
 * Ticks a server-computed discount window down to zero, then flips it off —
 * lets a live product page auto-expire a discount without a reload. Starts
 * from the server-rendered `discount` value (hydration-safe) and only ticks
 * while a timer-driven discount is actually active.
 */
export function useLiveDiscount(discount: DiscountInfo) {
  const [live, setLive] = useState(discount);

  useEffect(() => {
    if (!discount.active || !discount.endsAt) return;
    const deadline = new Date(discount.endsAt).getTime();
    const tick = () => {
      const remainingMs = deadline - Date.now();
      setLive(
        remainingMs > 0
          ? { active: true, endsAt: discount.endsAt, remainingMs }
          : { active: false, endsAt: null, remainingMs: null }
      );
    };
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [discount.active, discount.endsAt]);

  return live;
}

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
