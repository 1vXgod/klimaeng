"use client";

import { useEffect } from "react";

/**
 * iOS Safari scrolls the document past its real end when the keyboard opens
 * for an input inside a fixed container (e.g. the chat widget), and often
 * leaves it there after the keyboard closes — showing a viewport-sized empty
 * area below the footer. `overscroll-behavior` has no effect on this.
 * Once the visual viewport settles back to full height, clamp the scroll
 * position to the true document end.
 */
export function OverscrollGuard() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const clamp = () => {
      // Skip while the keyboard is up or the page is pinch-zoomed.
      if (vv.scale !== 1 || vv.height < window.innerHeight - 1) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY > max + 1) window.scrollTo(0, Math.max(0, max));
    };

    vv.addEventListener("resize", clamp);
    return () => vv.removeEventListener("resize", clamp);
  }, []);

  return null;
}
