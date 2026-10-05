import { describe, it, expect } from "vitest";
import {
  lorentzFactor, dilatedTime, contractedLength, velocityAddition,
  relativisticMomentum, totalEnergy, kineticEnergy, restEnergy,
  velocityFromKineticEnergy, classifySeparation, lorentzTransform,
} from "./specialRelativity";
import {
  schwarzschildRadius, gravitationalTimeFactor, satelliteClockRate,
  perihelionPrecessionPerOrbit, precessionArcsecPerCentury, lightBendingAngle,
} from "./generalRelativity";
import { C, M_SUN, M_EARTH, M_PROTON, M_ELECTRON, R_EARTH, AU } from "./constants";

describe("special relativity", () => {
  it("γ = 1 at rest", () => expect(lorentzFactor(0)).toBeCloseTo(1, 12));
  it("γ ≈ 7.0888 at 0.99c", () => expect(lorentzFactor(0.99 * C)).toBeCloseTo(7.0888, 3));
  it("γ = 2 at β = √3/2", () => expect(lorentzFactor((Math.sqrt(3) / 2) * C)).toBeCloseTo(2, 9));
  it("clamps v below c (never NaN)", () => {
    expect(Number.isFinite(lorentzFactor(C))).toBe(true);
    expect(Number.isFinite(lorentzFactor(5 * C))).toBe(true);
  });
  it("time dilation: 1 s at 0.99c → 7.0888 s", () =>
    expect(dilatedTime(1, 0.99 * C)).toBeCloseTo(7.0888, 3));
  it("length contraction: 100 m at 0.8c → 60 m", () =>
    expect(contractedLength(100, 0.8 * C)).toBeCloseTo(60, 9));
  it("velocity addition never exceeds c", () => {
    const w = velocityAddition(0.9 * C, 0.9 * C);
    expect(w).toBeLessThan(C);
    expect(w / C).toBeCloseTo(0.9944751, 6);
  });
  it("light + anything = c", () =>
    expect(velocityAddition(C, 0.5 * C)).toBeCloseTo(C, 6));
  it("E = γmc² consistent with K + E₀", () => {
    const m = M_PROTON, v = 0.9 * C;
    expect(totalEnergy(m, v)).toBeCloseTo(kineticEnergy(m, v) + restEnergy(m), 6);
  });
  it("velocity from KE inverts KE(v)", () => {
    const m = M_ELECTRON, K = 1e-12;
    expect(velocityFromKineticEnergy(m, K)).toBeCloseTo(
      C * Math.sqrt(1 - 1 / (1 + K / (m * C * C)) ** 2), 9);
  });
  it("momentum grows without bound as v→c", () => {
    expect(relativisticMomentum(1, 0.999 * C)).toBeGreaterThan(relativisticMomentum(1, 0.99 * C));
  });
  it("classifies separations", () => {
    expect(classifySeparation(1, 0)).toBe("timelike");
    expect(classifySeparation(0, 1)).toBe("spacelike");
    expect(classifySeparation(1, C)).toBe("lightlike");
  });
  it("Lorentz transform preserves the interval", () => {
    const t = 2, x = 3e8, v = 0.6 * C;
    const p = lorentzTransform(t, x, v);
    const s2 = (C * t) ** 2 - x * x;
    const s2p = (C * p.t) ** 2 - p.x * p.x;
    expect(Math.abs(s2p - s2) / Math.abs(s2)).toBeLessThan(1e-9);
  });
});

describe("general relativity", () => {
  it("Sun's Schwarzschild radius ≈ 2.95 km", () =>
    expect(schwarzschildRadius(M_SUN) / 1000).toBeCloseTo(2.953, 2));
  it("Earth's Schwarzschild radius ≈ 8.87 mm", () =>
    expect(schwarzschildRadius(M_EARTH) * 1000).toBeCloseTo(8.87, 1));
  it("NaN for non-positive mass", () =>
    expect(schwarzschildRadius(-1)).toBeNaN());
  it("gravitational time factor at infinity → 1", () =>
    expect(gravitationalTimeFactor(M_EARTH, 1e12)).toBeCloseTo(1, 9));
  it("NaN at/inside horizon", () =>
    expect(gravitationalTimeFactor(M_SUN, schwarzschildRadius(M_SUN))).toBeNaN());
  it("GPS: satellite gains ≈ +38 µs/day vs ground", () => {
    const { combined, orbitVelocity } = satelliteClockRate(M_EARTH, R_EARTH + 20_200_000);
    expect(orbitVelocity).toBeGreaterThan(3000);
    expect(combined).toBeGreaterThan(0);
    const ground = gravitationalTimeFactor(M_EARTH, R_EARTH);
    const diffPerDay = (combined - ground) * 86400;
    expect(diffPerDay).toBeGreaterThan(20e-6);
    expect(diffPerDay).toBeLessThan(60e-6);
  });
  it("Mercury perihelion precession ≈ 43″/century", () => {
    const perOrbit = perihelionPrecessionPerOrbit(M_SUN, 0.387 * AU, 0.2056);
    const arcsec = precessionArcsecPerCentury(perOrbit, 0.2408);
    expect(arcsec).toBeGreaterThan(40);
    expect(arcsec).toBeLessThan(46);
  });
  it("Sun light bending at limb ≈ 1.75″", () => {
    const arcsec = lightBendingAngle(M_SUN, 6.96e8) * (180 / Math.PI) * 3600;
    expect(arcsec).toBeGreaterThan(1.6);
    expect(arcsec).toBeLessThan(1.9);
  });
  it("time dilation factor on a neutron star surface is significant", () => {
    const M = 1.4 * M_SUN, R = 12_000;
    const f = gravitationalTimeFactor(M, R);
    expect(f).toBeLessThan(0.85);
    expect(f).toBeGreaterThan(0.5);
  });
});
