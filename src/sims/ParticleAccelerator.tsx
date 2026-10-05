import { useRef, useState } from "react";
import {
  lorentzFactor,
  relativisticMomentum,
  totalEnergy,
  velocityFromKineticEnergy,
  betaOf,
} from "../physics/specialRelativity";
import { C, M_ELECTRON, M_PROTON, M_MUON, E_CHARGE } from "../physics/constants";
import { fmt, fmtEnergy } from "../physics/units";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  PlayPauseControls,
  PresetBar,
  TryThis,
  SegmentedControl,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";
import type { Lang } from "../physics/units";

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  particle: string; electron: string; proton: string; muon: string;
  kinetic: string;
  pCrt: string; pLhc: string; pMuon: string;
  pCrtHint: string; pLhcHint: string; pMuonHint: string;
  roKE: string; roKJ: string; roVelPct: string; roVelKms: string;
  roGamma: string; roP: string; roPMeVc: string; roTotal: string;
  roLaps: string; roLapsUnit: string; ringTitle: string; ringSub: string;
  graphTitle: string; graphCaption: string;
  graphX: string; graphY: string;
  eqKCap: string; eqPCap: string;
  tryPrompt: string; tryHint: string; trySolved: string;
  wys: string[]; phys: string[];
  assumptions: string[];
  now: string;
}

const STRINGS: Record<Lang, Strings> = {
  en: {
    title: "Particle Accelerator",
    subtitle:
      "Choose a particle, crank up its kinetic energy, and watch speed saturate while energy keeps exploding — the relativistic discovery machines of the 20th century.",
    concept: "Relativistic energy",
    particle: "Particle",
    electron: "Electron", proton: "Proton", muon: "Muon",
    kinetic: "Kinetic energy K (log scale)",
    pCrt: "CRT television", pLhc: "LHC proton", pMuon: "Cosmic muon",
    pCrtHint: "Electron at 20 keV — the old cathode-ray tube",
    pLhcHint: "Proton at 6.5 TeV — Large Hadron Collider, Run 2",
    pMuonHint: "Muon at 3 GeV — a cosmic-ray muon hitting the atmosphere",
    roKE: "Kinetic energy", roKJ: "Kinetic energy", roVelPct: "Velocity (% of c)",
    roVelKms: "Velocity", roGamma: "Lorentz factor γ",
    roP: "Momentum", roPMeVc: "Momentum", roTotal: "Total energy",
    roLaps: "Laps / s · 27 km ring",
    roLapsUnit: "laps/s",
    ringTitle: "Storage ring",
    ringSub: "Each turn the magnets bend the particle around. The dot's speed saturates — the glow is the energy.",
    graphTitle: "Kinetic energy vs. velocity",
    graphCaption:
      "Velocity flattens toward 100% of c no matter how much energy you add. Energy and momentum grow without bound; speed does not.",
    graphX: "Kinetic energy (eV)", graphY: "v (% of c)",
    eqKCap: "Kinetic energy: the energy of motion. At high speed it dwarfs the rest energy.",
    eqPCap: "Relativistic momentum: the γ factor is why pions and protons at the LHC carry enormous momentum.",
    tryPrompt:
      "Push a proton past 7 TeV with the slider. Look at the velocity readout — and then at the Lorentz factor.",
    tryHint: "Hint: the LHC preset puts you at 6.5 TeV. Keep going.",
    trySolved:
      "Done: v = 0.999999…c — closer, but never equal. The extra 500 GeV went almost entirely into γ and momentum, not speed.",
    wys: [
      "The ring is a particle storage ring (like the LHC's). The dot is your particle; its angular speed is proportional to its real velocity. Increase the kinetic energy from 1 eV to 10 TeV with the slider.",
      "Watch the dot: at first it visibly accelerates, but past a few MeV it stops getting faster — it is already grazing c. Meanwhile the energy and γ readouts explode, and the amber glow around the dot swells with the logarithm of γ.",
      "The chart shows why: velocity as a percentage of c flattens toward 100% on the vertical axis while the horizontal axis spans thirteen orders of magnitude of energy. The marker follows your slider.",
    ],
    phys: [
      "Kinetic energy is K = (γ − 1)·mc². For an electron (rest energy 0.511 MeV), just 20 keV of kinetic energy already reaches 27% of c — but beyond a few MeV every new order of magnitude of energy buys only a smaller fraction of the remaining sliver below c.",
      "Momentum p = γmv tells the same story: it grows without bound as v → c. That is why accelerator physicists quote momentum in GeV/c and why colliders are measured by their energy, not by how fast the particles move.",
      "Massive particles can never reach c: it would require infinite kinetic energy. This is not a technological limit of our accelerators — it is built into the geometry of spacetime.",
    ],
    assumptions: [
      "No radiation losses: a real ring loses energy to synchrotron radiation on every turn; here it is ignored.",
      "The particle is treated as already injected at kinetic energy K; injection and the acceleration history are ignored.",
      "The ring visualization is schematic: the dot's angular speed is scaled for visibility, not to a real magnet layout.",
    ],
    now: "now",
  },
  es: {
    title: "Acelerador de partículas",
    subtitle:
      "Elige una partícula, aumenta su energía cinética y observa cómo la velocidad se satura mientras la energía sigue explotando: las máquinas de descubrimiento relativista del siglo XX.",
    concept: "Energía relativista",
    particle: "Partícula",
    electron: "Electrón", proton: "Protón", muon: "Muón",
    kinetic: "Energía cinética K (escala log)",
    pCrt: "Televisor CRT", pLhc: "Protón del LHC", pMuon: "Muón cósmico",
    pCrtHint: "Electrón a 20 keV — el antiguo tubo de rayos catódicos",
    pLhcHint: "Protón a 6,5 TeV — Gran Colisionador de Hadrones, Run 2",
    pMuonHint: "Muón a 3 GeV — un muón de rayos cósmicos en la atmósfera",
    roKE: "Energía cinética", roKJ: "Energía cinética", roVelPct: "Velocidad (% de c)",
    roVelKms: "Velocidad", roGamma: "Factor de Lorentz γ",
    roP: "Momento", roPMeVc: "Momento", roTotal: "Energía total",
    roLaps: "Vueltas / s · anillo de 27 km",
    roLapsUnit: "vueltas/s",
    ringTitle: "Anillo de almacenamiento",
    ringSub: "En cada vuelta los imanes curvan la trayectoria. La velocidad del punto se satura; el brillo es la energía.",
    graphTitle: "Energía cinética frente a velocidad",
    graphCaption:
      "La velocidad se aplana hacia el 100 % de c por mucha energía que añadas. La energía y el momento crecen sin límite; la velocidad no.",
    graphX: "Energía cinética (eV)", graphY: "v (% de c)",
    eqKCap: "Energía cinética: la energía del movimiento. A alta velocidad eclipsa la energía en reposo.",
    eqPCap: "Momento relativista: el factor γ explica por qué los protones del LHC transportan un momento enorme.",
    tryPrompt:
      "Lleva un protón más allá de 7 TeV con el deslizador. Mira la velocidad… y luego el factor de Lorentz.",
    tryHint: "Pista: el preajuste del LHC te deja en 6,5 TeV. Sigue subiendo.",
    trySolved:
      "Hecho: v = 0,999999…c — más cerca, pero nunca igual. Los 500 GeV extra fueron casi íntegramente a γ y al momento, no a la velocidad.",
    wys: [
      "El anillo es un anillo de almacenamiento de partículas (como el del LHC). El punto es tu partícula; su velocidad angular es proporcional a su velocidad real. Aumenta la energía cinética de 1 eV a 10 TeV con el deslizador.",
      "Observa el punto: al principio acelera visiblemente, pero a partir de unos MeV deja de ir más rápido: ya roza c. Mientras tanto, la energía y γ se disparan, y el brillo ámbar alrededor del punto crece con el logaritmo de γ.",
      "El gráfico explica por qué: la velocidad en porcentaje de c se aplana hacia el 100 % en el eje vertical mientras el eje horizontal abarca trece órdenes de magnitud de energía. El marcador sigue a tu deslizador.",
    ],
    phys: [
      "La energía cinética es K = (γ − 1)·mc². Para un electrón (energía en reposo 0,511 MeV), solo 20 keV de energía cinética ya alcanzan el 27 % de c; pero más allá de unos MeV, cada nuevo orden de magnitud de energía compra solo una fracción menor del resto que falta para llegar a c.",
      "El momento p = γmv cuenta la misma historia: crece sin límite cuando v → c. Por eso los físicos de aceleradores expresan el momento en GeV/c y por eso los colisionadores se miden por su energía, no por la velocidad de sus partículas.",
      "Las partículas con masa nunca pueden alcanzar c: requeriría energía cinética infinita. No es un límite tecnológico de nuestros aceleradores, sino una propiedad de la geometría del espaciotiempo.",
    ],
    assumptions: [
      "Sin pérdidas por radiación: un anillo real pierde energía por radiación de sincrotrón en cada vuelta; aquí se ignora.",
      "La partícula se considera ya inyectada con energía cinética K; la inyección y la historia de aceleración se ignoran.",
      "La visualización del anillo es esquemática: la velocidad angular del punto está escalada para la visualización, no corresponde a un diseño real de imanes.",
    ],
    now: "ahora",
  },
};

// ─── Particle data ──────────────────────────────────────────────────────────
type Particle = "electron" | "proton" | "muon";
const MASSES: Record<Particle, number> = {
  electron: M_ELECTRON,
  proton: M_PROTON,
  muon: M_MUON,
};

const RING_KM = 27; // LHC-like circumference

/** Slider 0..1 → kinetic energy in eV: K = 10^(13·s). */
const sliderToKEV = (s: number) => 10 ** (13 * s);
const kevToSlider = (kev: number) => Math.log10(kev) / 13;

const fmtKEV = (kev: number, lang: Lang) => `${fmt(kev, lang)} eV`;

// ─── Ring visualization ─────────────────────────────────────────────────────
function RingView({
  beta,
  gamma,
  laps,
  running,
  s,
}: {
  beta: number;
  gamma: number;
  laps: number;
  running: boolean;
  s: Strings;
}) {
  const angleRef = useRef(0);
  const dotRef = useRef<SVGCircleElement | null>(null);
  const glowRef = useRef<SVGCircleElement | null>(null);

  // Angular speed saturates with β: the whole point of the demo.
  const omega = 2 * Math.PI * (0.12 + 0.88 * beta);
  useRaf((dt) => {
    angleRef.current = (angleRef.current + omega * dt) % (2 * Math.PI);
    const a = angleRef.current;
    const x = 150 + 96 * Math.cos(a);
    const y = 150 + 96 * Math.sin(a);
    if (dotRef.current) {
      dotRef.current.setAttribute("cx", x.toFixed(2));
      dotRef.current.setAttribute("cy", y.toFixed(2));
    }
    if (glowRef.current) {
      glowRef.current.setAttribute("cx", x.toFixed(2));
      glowRef.current.setAttribute("cy", y.toFixed(2));
    }
  }, running);

  const glowR = Math.min(30, 4 + 3.4 * Math.log10(Math.max(gamma, 1)));
  const dipoles = Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8);

  return (
    <div className="p-5">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {s.ringTitle}
        </h3>
        <span className="font-mono2 text-xs" style={{ color: "var(--text-dim)" }}>
          {fmt(laps, undefined, 0)} {s.roLapsUnit}
        </span>
      </div>
      <svg
        viewBox="0 0 300 300"
        className="mx-auto w-full max-w-[380px]"
        role="img"
        aria-label={s.ringTitle}
      >
        <defs>
          <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--amber)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* orbit */}
        <circle cx="150" cy="150" r="96" fill="none" stroke="var(--border)" strokeWidth="10" opacity="0.35" />
        <circle cx="150" cy="150" r="96" fill="none" stroke="var(--cyan)" strokeWidth="2" opacity="0.5" />
        {/* dipoles */}
        {dipoles.map((a, i) => (
          <rect
            key={i}
            x={150 + 96 * Math.cos(a) - 5}
            y={150 + 96 * Math.sin(a) - 5}
            width="10"
            height="10"
            rx="2"
            fill="var(--violet)"
            opacity="0.55"
            transform={`rotate(${(a * 180) / Math.PI + 45} ${150 + 96 * Math.cos(a)} ${150 + 96 * Math.sin(a)})`}
          />
        ))}
        {/* energy glow + particle */}
        <circle ref={glowRef} r={glowR} fill="url(#ringGlow)" />
        <circle
          ref={dotRef}
          r="7"
          fill="var(--amber)"
          stroke="var(--bg)"
          strokeWidth="2"
          cx={150 + 96}
          cy={150}
        />
        {/* center label */}
        <text
          x="150"
          y="146"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fill="var(--cyan)"
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {(beta * 100).toFixed(beta > 0.99 ? 4 : 2)}%
        </text>
        <text
          x="150"
          y="166"
          textAnchor="middle"
          fontSize="11"
          fill="var(--text-dim)"
        >
          c
        </text>
      </svg>
      <p className="mt-2 text-center text-xs" style={{ color: "var(--text-faint)" }}>
        {s.ringSub}
      </p>
    </div>
  );
}

// ─── Log–log chart ──────────────────────────────────────────────────────────
function EnergyChart({ m, kEV, s }: { m: number; kEV: number; s: Strings }) {
  const W = 560, H = 300;
  const padL = 56, padR = 14, padT = 14, padB = 44;
  const iw = W - padL - padR, ih = H - padT - padB;

  const xOf = (logK: number) => padL + (logK / 13) * iw;
  const yOf = (pct: number) => padT + (1 - Math.min(pct, 100) / 100) * ih;

  let d = "";
  for (let i = 0; i <= 130; i++) {
    const logK = (i / 130) * 13;
    const kev = 10 ** logK;
    const v = velocityFromKineticEnergy(m, kev * E_CHARGE);
    const pct = betaOf(v) * 100;
    d += `${i === 0 ? "M" : "L"}${xOf(logK).toFixed(1)},${yOf(pct).toFixed(1)} `;
  }

  const beta = betaOf(velocityFromKineticEnergy(m, kEV * E_CHARGE));
  const mx = xOf(Math.log10(kEV));
  const my = yOf(beta * 100);
  const xticks = [0, 2, 4, 6, 8, 10, 12];

  return (
    <div className="p-5">
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
        {s.graphTitle}
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={s.graphTitle}>
        {/* grid */}
        {xticks.map((t) => (
          <g key={t}>
            <line x1={xOf(t)} y1={padT} x2={xOf(t)} y2={H - padB} stroke="var(--border)" strokeWidth="1" />
            <text x={xOf(t)} y={H - padB + 18} textAnchor="middle" fontSize="11" fill="var(--text-faint)">
              10<tspan dy="-4" fontSize="8">{t}</tspan>
            </text>
          </g>
        ))}
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={padL} y1={yOf(p)} x2={W - padR} y2={yOf(p)} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 8} y={yOf(p) + 4} textAnchor="end" fontSize="11" fill="var(--text-faint)">
              {p}
            </text>
          </g>
        ))}
        {/* 100% asymptote */}
        <line
          x1={padL} y1={yOf(100)} x2={W - padR} y2={yOf(100)}
          stroke="var(--amber)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7"
        />
        <text x={W - padR} y={yOf(100) - 6} textAnchor="end" fontSize="11" fill="var(--amber)">
          c
        </text>
        {/* curve */}
        <path d={d} fill="none" stroke="var(--cyan)" strokeWidth="2.5" />
        {/* marker */}
        <circle cx={mx} cy={my} r="7" fill="var(--amber)" stroke="var(--bg)" strokeWidth="2" />
        <line x1={mx} y1={my} x2={mx} y2={H - padB} stroke="var(--amber)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        {/* axis labels */}
        <text x={(W + padL) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--text-dim)">
          {s.graphX}
        </text>
        <text
          x="14"
          y={(H + padT - padB) / 2}
          textAnchor="middle"
          fontSize="12"
          fill="var(--text-dim)"
          transform={`rotate(-90 14 ${(H + padT - padB) / 2})`}
        >
          {s.graphY}
        </text>
      </svg>
      <p className="mt-2 text-xs" style={{ color: "var(--text-faint)" }}>
        {s.graphCaption}
      </p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ParticleAccelerator() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [particle, setParticle] = useState<Particle>("proton");
  const [slider, setSlider] = useState(() => kevToSlider(6.5e12)); // LHC proton
  const [playing, setPlaying] = useState(!reduced);

  const m = MASSES[particle];
  const kEV = sliderToKEV(slider);
  const kJ = kEV * E_CHARGE;
  const v = velocityFromKineticEnergy(m, kJ);
  const beta = betaOf(v);
  const gamma = lorentzFactor(v);
  const p = relativisticMomentum(m, v);
  const pMeVc = (p * C) / (E_CHARGE * 1e6); // MeV/c
  const eTot = totalEnergy(m, v);
  const laps = v / (RING_KM * 1000);

  const presets = [
    { label: s.pCrt, hint: s.pCrtHint },
    { label: s.pLhc, hint: s.pLhcHint },
    { label: s.pMuon, hint: s.pMuonHint },
  ];
  const onPreset = (i: number) => {
    if (i === 0) { setParticle("electron"); setSlider(kevToSlider(2e4)); }
    if (i === 1) { setParticle("proton"); setSlider(kevToSlider(6.5e12)); }
    if (i === 2) { setParticle("muon"); setSlider(kevToSlider(3e9)); }
  };

  const trySolvedNow = particle === "proton" && kEV >= 7e12;

  return (
    <SimulationShell
      simId="particle-accelerator"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div>
          <RingView beta={beta} gamma={gamma} laps={laps} running={playing} s={s} />
          <div className="mx-4 mb-4 rounded-xl" style={{ borderTop: "1px solid var(--border)" }}>
            <EnergyChart m={m} kEV={kEV} s={s} />
          </div>
        </div>
      }
      controls={
        <div className="space-y-5">
          <PlayPauseControls playing={playing} onToggle={() => setPlaying((x) => !x)} />
          <SegmentedControl<Particle>
            label={s.particle}
            value={particle}
            onChange={setParticle}
            options={[
              { value: "electron", label: s.electron },
              { value: "proton", label: s.proton },
              { value: "muon", label: s.muon },
            ]}
          />
          <ParamSlider
            label={s.kinetic}
            value={slider}
            min={0}
            max={1}
            step={0.002}
            onChange={setSlider}
            accent="amber"
            format={(sv) => fmtKEV(sliderToKEV(sv), lang)}
          />
          <PresetBar presets={presets} onPick={onPreset} />
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.roKE} value={fmt(kEV, lang)} unit="eV" accent="amber" />
            <PhysicsValue label={s.roKJ} value={fmtEnergy(kJ, lang)} accent="amber" />
            <PhysicsValue label={s.roVelPct} value={`${(beta * 100).toFixed(beta > 0.99 ? 5 : 3)}`} unit="% c" accent="cyan" />
            <PhysicsValue label={s.roVelKms} value={fmt(v / 1000, lang)} unit="km/s" accent="cyan" />
            <PhysicsValue label={s.roGamma} value={fmt(gamma, lang)} accent="violet" />
            <PhysicsValue label={s.roLaps} value={fmt(laps, lang, 0)} unit={s.roLapsUnit} accent="violet" />
            <PhysicsValue label={s.roP} value={fmt(p, lang)} unit="kg·m/s" accent="green" />
            <PhysicsValue label={s.roPMeVc} value={fmt(pMeVc, lang)} unit="MeV/c" accent="green" />
            <PhysicsValue label={s.roTotal} value={fmtEnergy(eTot, lang)} accent="amber" />
          </div>
        </div>
      }
      whatYouSee={<ul className="list-disc space-y-2 pl-5">{s.wys.map((t, i) => <li key={i}>{t}</li>)}</ul>}
      physics={<ul className="list-disc space-y-2 pl-5">{s.phys.map((t, i) => <li key={i}>{t}</li>)}</ul>}
      equation={
        <div className="grid gap-4 md:grid-cols-2">
          <EquationCard tex="K = (\gamma - 1)\,m c^2" caption={s.eqKCap} />
          <EquationCard tex="p = \gamma\,m v" caption={s.eqPCap} />
        </div>
      }
      tryThis={
        <TryThis
          prompt={s.tryPrompt}
          check={() => particle === "proton" && sliderToKEV(slider) >= 7e12}
        >
          <p className="mt-2 text-sm" style={{ color: "var(--text-faint)" }}>
            {s.tryHint}
          </p>
          {trySolvedNow && (
            <p className="mt-2 text-sm font-medium" style={{ color: "var(--green)" }}>
              {s.trySolved}
            </p>
          )}
        </TryThis>
      }
      assumptions={s.assumptions}
    />
  );
}
