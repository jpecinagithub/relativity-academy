// ─── Physical constants (SI) ────────────────────────────────────────────────
export const C = 299_792_458; // speed of light, m/s
export const G = 6.6743e-11; // gravitational constant, m^3 kg^-1 s^-2
export const M_SUN = 1.98847e30; // solar mass, kg
export const M_EARTH = 5.97237e24; // earth mass, kg
export const R_EARTH = 6.371e6; // earth radius, m
export const AU = 1.495978707e11; // astronomical unit, m
export const LY = 9.4607304725808e15; // light year, m
export const PARSEC = 3.08567758149137e16; // parsec, m
export const DAY = 86_400; // seconds
export const YEAR = 365.25 * DAY; // seconds
export const M_ELECTRON = 9.1093837015e-31; // kg
export const M_PROTON = 1.67262192369e-27; // kg
export const M_MUON = 1.883531627e-28; // kg
export const E_CHARGE = 1.602176634e-19; // coulomb
export const H_PLANCK = 6.62607015e-34; // J·s

/** Clamp a velocity to the physically allowed range for massive objects. */
export function clampVelocity(v: number, maxFrac = 0.9999999): number {
  if (!Number.isFinite(v)) return 0;
  const vmax = maxFrac * C;
  if (v >= vmax) return vmax;
  if (v <= -vmax) return -vmax;
  return v;
}

/** True when the value is a usable finite number. */
export function isSane(x: number): boolean {
  return Number.isFinite(x);
}
