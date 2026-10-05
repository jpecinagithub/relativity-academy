import { C, G, DAY, YEAR, isSane } from "./constants";

/**
 * General relativity utilities (simplified models, clearly labelled as such
 * wherever they are displayed).
 */

/** Schwarzschild radius r_s = 2GM/c² (metres). */
export function schwarzschildRadius(massKg: number): number {
  if (!isSane(massKg) || massKg <= 0) return NaN;
  return (2 * G * massKg) / (C * C);
}

/**
 * Gravitational time dilation factor for a static observer at radius r
 * outside a spherical mass M (Schwarzschild): dτ/dt = √(1 − r_s/r).
 * Returns NaN inside or at the horizon (r ≤ r_s).
 */
export function gravitationalTimeFactor(massKg: number, r: number): number {
  const rs = schwarzschildRadius(massKg);
  if (!isSane(rs) || !isSane(r) || r <= rs) return NaN;
  return Math.sqrt(1 - rs / r);
}

/**
 * Proper time accumulated at radius r for coordinate time t:
 * τ = t · √(1 − r_s/r).
 */
export function gravitationalProperTime(
  coordTime: number,
  massKg: number,
  r: number,
): number {
  const f = gravitationalTimeFactor(massKg, r);
  if (!isSane(f)) return NaN;
  return coordTime * f;
}

/** Newtonian escape velocity √(2GM/r), clamped below c for display. */
export function escapeVelocity(massKg: number, r: number): number {
  if (!isSane(massKg) || !isSane(r) || massKg <= 0 || r <= 0) return NaN;
  return Math.min(Math.sqrt((2 * G * massKg) / r), C * 0.9999999);
}

/**
 * Combined SR + GR clock rate for a satellite in circular orbit:
 * rate = √(1 − r_s/r − v²/c²) (weak-field / Schwarzschild circular orbit).
 * v_orbit = √(GM/r) for the Newtonian circular velocity.
 */
export function satelliteClockRate(massKg: number, r: number): {
  sr: number;
  gr: number;
  combined: number;
  orbitVelocity: number;
} {
  const rs = schwarzschildRadius(massKg);
  const v = Math.sqrt((G * massKg) / r);
  const beta2 = (v / C) ** 2;
  const sr = Math.sqrt(Math.max(0, 1 - beta2)); // SR: moving clock runs slow
  const gr = Math.sqrt(Math.max(0, 1 - rs / r)); // GR: higher clock runs fast
  const combined = Math.sqrt(Math.max(0, 1 - rs / r - beta2));
  return { sr, gr, combined, orbitVelocity: v };
}

/**
 * GPS-style daily offset in seconds per day for a satellite, relative to a
 * ground clock (approximate: ground treated as static at R_earth).
 * Positive = satellite clock gains relative to ground.
 */
export function gpsDailyOffset(
  massKg: number,
  rSat: number,
  rGround: number,
): number {
  const sat = satelliteClockRate(massKg, rSat).combined;
  const ground = gravitationalTimeFactor(massKg, rGround);
  if (!isSane(sat) || !isSane(ground)) return NaN;
  return (sat - ground) * DAY;
}

/**
 * Mercury-style perihelion precession per orbit from GR:
 * Δφ = 6πGM / (a(1−e²)c²) radians per orbit.
 */
export function perihelionPrecessionPerOrbit(
  massKg: number,
  semiMajorAxis: number,
  eccentricity: number,
): number {
  if (!isSane(massKg) || !isSane(semiMajorAxis) || massKg <= 0 || semiMajorAxis <= 0)
    return NaN;
  const e = Math.min(Math.max(eccentricity, 0), 0.99);
  return (6 * Math.PI * G * massKg) / (semiMajorAxis * (1 - e * e) * C * C);
}

/** Convert precession per orbit (rad) to arcseconds per century. */
export function precessionArcsecPerCentury(
  perOrbitRad: number,
  orbitalPeriodYears: number,
): number {
  if (!isSane(perOrbitRad) || !isSane(orbitalPeriodYears) || orbitalPeriodYears <= 0)
    return NaN;
  const orbitsPerCentury = 100 / orbitalPeriodYears;
  return perOrbitRad * orbitsPerCentury * (180 / Math.PI) * 3600;
}

/**
 * Approximate light-bending angle for a ray with impact parameter b:
 * α = 4GM/(c²b) radians (weak-field GR, factor 2 over Newtonian).
 */
export function lightBendingAngle(massKg: number, impactParam: number): number {
  if (!isSane(massKg) || !isSane(impactParam) || massKg <= 0 || impactParam <= 0)
    return NaN;
  return (4 * G * massKg) / (C * C * impactParam);
}

/**
 * Gravitational redshift z for a photon climbing from r_emit to r_obs:
 * 1 + z = √(1 − r_s/r_obs) / √(1 − r_s/r_emit)... careful: photon emitted at
 * r_emit observed at r_obs has 1+z = f(r_obs)/f(r_emit) with f = √(1−rs/r).
 * For r_obs → ∞, 1+z = 1/f(r_emit).
 */
export function gravitationalRedshift(
  massKg: number,
  rEmit: number,
  rObs = Infinity,
): number {
  const fEmit = gravitationalTimeFactor(massKg, rEmit);
  const fObs = rObs === Infinity ? 1 : gravitationalTimeFactor(massKg, rObs);
  if (!isSane(fEmit) || !isSane(fObs) || fEmit <= 0) return NaN;
  return fObs / fEmit - 1;
}

/** Photon sphere radius = 1.5 · r_s. */
export function photonSphereRadius(massKg: number): number {
  const rs = schwarzschildRadius(massKg);
  return isSane(rs) ? 1.5 * rs : NaN;
}

/** Format a duration in seconds into a human string (uses largest units). */
export function formatDuration(seconds: number, lang: "en" | "es" = "en"): string {
  if (!isSane(seconds)) return "—";
  const neg = seconds < 0;
  let s = Math.abs(seconds);
  const units: Array<[number, string, string]> = [
    [YEAR, lang === "es" ? "años" : "years", lang === "es" ? "año" : "year"],
    [DAY, lang === "es" ? "días" : "days", lang === "es" ? "día" : "day"],
    [3600, lang === "es" ? "horas" : "hours", lang === "es" ? "hora" : "hour"],
    [60, lang === "es" ? "minutos" : "minutes", lang === "es" ? "minuto" : "minute"],
    [1, lang === "es" ? "segundos" : "seconds", lang === "es" ? "segundo" : "second"],
  ];
  for (const [len, plural, singular] of units) {
    if (s >= len) {
      const n = s / len;
      const rounded = n >= 100 ? Math.round(n) : n >= 10 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100;
      const word = Math.abs(rounded - 1) < 1e-9 ? singular : plural;
      return `${neg ? "−" : ""}${rounded.toLocaleString(lang === "es" ? "es-ES" : "en-US")} ${word}`;
    }
  }
  // sub-second
  if (s >= 1e-3) return `${(s * 1e3).toFixed(2)} ms`;
  if (s >= 1e-6) return `${(s * 1e6).toFixed(2)} µs`;
  return `${(s * 1e9).toFixed(2)} ns`;
}
