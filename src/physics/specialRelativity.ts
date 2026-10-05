import { C, clampVelocity, isSane } from "./constants";

/**
 * Special relativity utilities.
 * All velocities are in m/s unless noted. Beta (β) = v/c.
 */

/** Lorentz factor γ = 1 / √(1 − β²). v is clamped below c. */
export function lorentzFactor(v: number): number {
  const vc = clampVelocity(v);
  const beta = vc / C;
  const inv = 1 - beta * beta;
  if (inv <= 0) return Infinity;
  return 1 / Math.sqrt(inv);
}

/** β = v/c as a fraction. */
export function betaOf(v: number): number {
  return clampVelocity(v) / C;
}

/**
 * Time dilation: coordinate time Δt seen by a stationary observer for a
 * clock moving at v that measures proper time Δτ: Δt = γ·Δτ.
 */
export function dilatedTime(properTime: number, v: number): number {
  return properTime * lorentzFactor(v);
}

/**
 * Length contraction: L = L₀/γ for an object moving at v relative to observer.
 */
export function contractedLength(restLength: number, v: number): number {
  return restLength / lorentzFactor(v);
}

/**
 * Relativistic velocity addition (collinear):
 * u' = (u + v) / (1 + uv/c²).
 */
export function velocityAddition(u: number, v: number): number {
  const num = u + v;
  const den = 1 + (u * v) / (C * C);
  if (!isSane(num) || !isSane(den) || den === 0) return NaN;
  return num / den;
}

/** Relativistic momentum p = γ·m·v (kg·m/s). */
export function relativisticMomentum(m: number, v: number): number {
  if (m <= 0) return NaN;
  return lorentzFactor(v) * m * clampVelocity(v);
}

/** Total relativistic energy E = γ·m·c² (joules). */
export function totalEnergy(m: number, v: number): number {
  if (m <= 0) return NaN;
  return lorentzFactor(v) * m * C * C;
}

/** Rest energy E₀ = m·c² (joules). */
export function restEnergy(m: number): number {
  if (m <= 0) return NaN;
  return m * C * C;
}

/** Kinetic energy K = (γ − 1)·m·c² (joules). */
export function kineticEnergy(m: number, v: number): number {
  if (m <= 0) return NaN;
  return (lorentzFactor(v) - 1) * m * C * C;
}

/**
 * Velocity of a massive particle from its kinetic energy:
 * γ = 1 + K/(mc²), β = √(1 − 1/γ²).
 */
export function velocityFromKineticEnergy(m: number, K: number): number {
  if (m <= 0 || K < 0 || !isSane(K)) return NaN;
  const gamma = 1 + K / (m * C * C);
  const beta = Math.sqrt(Math.max(0, 1 - 1 / (gamma * gamma)));
  return beta * C;
}

/** E² = (pc)² + (mc²)² — invariant mass-energy relation, returns E. */
export function energyFromMomentum(m: number, p: number): number {
  if (m <= 0 || !isSane(p)) return NaN;
  return Math.sqrt((p * C) ** 2 + (m * C * C) ** 2);
}

/** Relativistic Doppler factor for receding source: √((1+β)/(1−β)). */
export function dopplerFactor(beta: number): number {
  const b = Math.min(Math.max(beta, -0.9999999), 0.9999999);
  return Math.sqrt((1 + b) / (1 - b));
}

/**
 * Lorentz transform of an event (t, x) into a frame moving at velocity v
 * relative to the original: t' = γ(t − vx/c²), x' = γ(x − vt).
 * t in seconds, x in metres.
 */
export function lorentzTransform(
  t: number,
  x: number,
  v: number,
): { t: number; x: number } {
  const g = lorentzFactor(v);
  return {
    t: g * (t - (v * x) / (C * C)),
    x: g * (x - v * t),
  };
}

/** Spacetime interval Δs² = −c²Δt² + Δx² (m²). Sign convention (−,+,+,+). */
export function spacetimeInterval(dt: number, dx: number): number {
  return dx * dx - C * C * dt * dt;
}

export type Separation = "timelike" | "lightlike" | "spacelike";

/** Classify the separation of two events given Δt (s) and Δx (m). */
export function classifySeparation(dt: number, dx: number): Separation {
  const s2 = spacetimeInterval(dt, dx);
  const tol = Math.max(1e-9 * (C * C * dt * dt + dx * dx), 1e-30);
  if (Math.abs(s2) <= tol) return "lightlike";
  return s2 < 0 ? "timelike" : "spacelike";
}

/** Rapidity φ = artanh(β). Useful for additive boosts. */
export function rapidity(v: number): number {
  const b = betaOf(v);
  return 0.5 * Math.log((1 + b) / (1 - b));
}
