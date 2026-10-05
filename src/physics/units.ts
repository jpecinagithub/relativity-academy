import {
  AU, LY, PARSEC, M_SUN, M_EARTH, R_EARTH, DAY, YEAR,
} from "./constants";
import { betaOf } from "./specialRelativity";

export type Lang = "en" | "es";

/** Format a number with locale-aware grouping and adaptive precision. */
export function fmt(n: number, lang: Lang = "en", digits = 3): string {
  if (!Number.isFinite(n)) return "—";
  const locale = lang === "es" ? "es-ES" : "en-US";
  if (n !== 0 && (Math.abs(n) >= 1e12 || Math.abs(n) < 1e-3)) {
    const exp = Math.floor(Math.log10(Math.abs(n)));
    const mant = n / 10 ** exp;
    return `${mant.toFixed(2)}×10${superscript(exp)}`;
  }
  return n.toLocaleString(locale, { maximumFractionDigits: digits });
}

function superscript(exp: number): string {
  const map: Record<string, string> = {
    "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴",
    5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹",
  };
  return String(exp).split("").map((c) => map[c] ?? c).join("");
}

/** Velocity in m/s → human string, e.g. "0.950c", "285,000 km/s". */
export function fmtVelocity(v: number, lang: Lang = "en"): string {
  if (!Number.isFinite(v)) return "—";
  const beta = betaOf(v);
  if (beta >= 0.01) return `${beta.toFixed(beta >= 0.1 ? 3 : 4)}c`;
  const kms = v / 1000;
  return `${fmt(kms, lang)} km/s`;
}

/** Distance in metres → human string with best unit. */
export function fmtDistance(m: number, lang: Lang = "en"): string {
  if (!Number.isFinite(m)) return "—";
  const a = Math.abs(m);
  if (a >= PARSEC) return `${fmt(m / PARSEC, lang)} pc`;
  if (a >= LY) return `${fmt(m / LY, lang)} ${lang === "es" ? "años luz" : "light years"}`;
  if (a >= AU) return `${fmt(m / AU, lang)} AU`;
  if (a >= 1e6) return `${fmt(m / 1e6, lang)} ${lang === "es" ? "mill. km" : "million km"}`;
  if (a >= 1e3) return `${fmt(m / 1e3, lang)} km`;
  if (a >= 1) return `${fmt(m, lang)} m`;
  if (a >= 1e-3) return `${fmt(m * 1e3, lang)} mm`;
  return `${fmt(m, lang)} m`;
}

/** Mass in kg → human string with best unit. */
export function fmtMass(kg: number, lang: Lang = "en"): string {
  if (!Number.isFinite(kg)) return "—";
  if (kg >= M_SUN) return `${fmt(kg / M_SUN, lang)} M☉`;
  if (kg >= M_EARTH) return `${fmt(kg / M_EARTH, lang)} M⊕`;
  if (kg >= 1e3) return `${fmt(kg / 1e3, lang)} t`;
  return `${fmt(kg, lang)} kg`;
}

/** Energy in joules → human string. */
export function fmtEnergy(j: number, lang: Lang = "en"): string {
  if (!Number.isFinite(j)) return "—";
  const units: Array<[number, string]> = [
    [1e24, "YJ"], [1e21, "ZJ"], [1e18, "EJ"], [1e15, "PJ"],
    [1e12, "TJ"], [1e9, "GJ"], [1e6, "MJ"], [1e3, "kJ"], [1, "J"],
  ];
  for (const [f, u] of units) {
    if (Math.abs(j) >= f) return `${fmt(j / f, lang)} ${u}`;
  }
  return `${fmt(j * 1e3, lang)} mJ`;
}

/** Fun comparison: time for light/Earth-frame to travel Earth→Moon at v. */
export function earthMoonTime(v: number, lang: Lang = "en"): string {
  const d = 384_400_000; // m
  const t = d / Math.max(v, 1);
  const s = lang === "es";
  if (t < 60) return s ? `a esta velocidad llegarías a la Luna en ${t.toFixed(2)} s` : `at this speed you'd reach the Moon in ${t.toFixed(2)} s`;
  return "";
}

/** Compare a Schwarzschild radius with familiar sizes. */
export function sizeComparison(rs: number, lang: Lang = "en"): string {
  if (!Number.isFinite(rs) || rs <= 0) return "—";
  const s = lang === "es";
  const cmp: Array<[number, string, string]> = [
    [R_EARTH, s ? "radios terrestres" : "Earth radii", s ? "radio terrestre" : "Earth radius"],
    [6.96e8, s ? "radios solares" : "solar radii", s ? "radio solar" : "solar radius"],
    [AU, "AU", "AU"],
    [LY, s ? "años luz" : "light years", s ? "año luz" : "light year"],
  ];
  for (const [unit, plural, singular] of cmp) {
    const n = rs / unit;
    if (n >= 0.05 && n < 1000) {
      const r = n >= 100 ? Math.round(n) : Math.round(n * 10) / 10;
      return `${fmt(r, lang)} ${Math.abs(r - 1) < 0.05 ? singular : plural}`;
    }
  }
  if (rs < 0.05 * R_EARTH) return s ? "más pequeño que la Tierra" : "smaller than Earth";
  return s ? "mayor que un año luz" : "larger than a light year";
}

export { DAY, YEAR };
