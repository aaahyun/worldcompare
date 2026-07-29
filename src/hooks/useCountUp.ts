"use client";

import { useEffect, useState } from "react";

function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Animates 0 → target once per `target` change; skips straight to target under reduced-motion. */
export function useCountUp(target: number, durationMs = 1600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      if (prefersReducedMotion) {
        setValue(target);
        return;
      }
      const progress = Math.min((now - start) / durationMs, 1);
      setValue(target * easeOutExpo(progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}
