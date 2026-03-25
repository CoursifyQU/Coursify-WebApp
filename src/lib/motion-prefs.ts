"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type MotionTier = "full" | "lite";

/**
 * Use "lite" on viewports ≤767px or when the user prefers reduced motion.
 * Lite tier skips staggers and long transitions to reduce scroll jank on mobile GPUs.
 */
export function useMotionTier(): MotionTier {
  const reducedMotion = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Keep SSR and first client render identical to avoid hydration mismatches.
  if (!hydrated) return "full";
  if (reducedMotion === true || narrow) return "lite";
  return "full";
}
