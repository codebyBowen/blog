"use client";

import { useEffect, useRef, useState } from "react";
import { easeCubicOut } from "d3-ease";

/** Observe an element's width (responsive charts). */
export function useResizeObserver<T extends Element>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Fire once when an element scrolls into view (drives entrance animations). */
export function useInView<T extends Element>(
  threshold = 0.25,
  once = true
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once]);

  return [ref, inView] as const;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Eased 0 -> 1 progress that starts when `active` flips true.
 * Honors prefers-reduced-motion by snapping straight to 1.
 * Re-runs whenever `key` changes (used to re-tween on toggles).
 */
export function useAnimatedProgress(
  active: boolean,
  duration = 1200,
  key: unknown = 0,
  ease: (t: number) => number = easeCubicOut
) {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!active) {
      setP(0);
      return;
    }
    if (reduced) {
      setP(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const e = Math.min(1, (t - start) / duration);
      setP(ease(e));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, duration, reduced, key]);

  return p;
}
