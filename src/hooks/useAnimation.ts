import { useEffect, useRef, useState } from "react";

/** True when the user prefers reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return reduced;
}

/**
 * Run `tick(dtSeconds, elapsedSeconds)` on every animation frame while
 * `running` is true. Automatically pauses when the tab is hidden.
 * Respects nothing by itself — callers should default `running` to false
 * when prefers-reduced-motion is set.
 */
export function useRaf(
  tick: (dt: number, elapsed: number) => void,
  running: boolean,
) {
  const tickRef = useRef(tick);
  tickRef.current = tick;
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      if (document.hidden) {
        last = now;
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsedRef.current += dt;
      tickRef.current(dt, elapsedRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      elapsedRef.current = 0;
    };
  }, [running]);
}

/** Resettable clock: returns [time, reset]. */
export function useSimClock(running: boolean, speed = 1) {
  const [time, setTime] = useState(0);
  const reset = () => setTime(0);
  useRaf((dt) => setTime((t) => t + dt * speed), running);
  return { time, reset, setTime };
}
