import { useEffect, useRef, useState } from 'react';

/**
 * Progressive enhancement for trust counters. The final value is rendered first (and is in the
 * prerendered HTML). Only if the counter is still below the fold, and the user hasn't asked for
 * reduced motion, does it reset to 0 and count up when scrolled into view.
 */
export function useCountUp<T extends HTMLElement>(target: number, durationMs = 1200) {
  const ref = useRef<T>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible: leave it

    let frame = 0;
    setValue(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / durationMs);
          setValue(Math.round(target * (1 - (1 - p) ** 3)));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      setValue(target);
    };
  }, [target, durationMs]);

  return { ref, value };
}
