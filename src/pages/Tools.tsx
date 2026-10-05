import { useState, type ReactNode } from "react";
import { Wrench } from "lucide-react";
import { useG, ParamSlider, PhysicsValue, IM } from "../components/ui";
import {
  lorentzFactor, dilatedTime, contractedLength, velocityAddition,
  totalEnergy, kineticEnergy, restEnergy,
} from "../physics/specialRelativity";
import {
  schwarzschildRadius, gravitationalTimeFactor, formatDuration,
} from "../physics/generalRelativity";
import { C, M_SUN } from "../physics/constants";
import { fmt, fmtVelocity, fmtDistance, fmtEnergy } from "../physics/units";

const STRINGS = {
  en: {
    title: "Relativity Toolkit",
    sub: "Seven calculators. Every number is computed live from the formulas — no black boxes.",
    lorentz: "Lorentz factor",
    lorentzD: "How much time dilates and lengths contract at a given velocity.",
    vel: "Velocity",
    timeDil: "Time dilation",
    timeDilD: "A moving clock's proper time vs the time seen by a stationary observer.",
    properTime: "Proper time (s)",
    coordTime: "Coordinate time",
    length: "Length contraction",
    lengthD: "The measured length of a moving object vs its rest length.",
    restLength: "Rest length (m)",
    observedLength: "Observed length",
    energy: "Relativistic energy",
    energyD: "Rest, kinetic and total energy of a massive particle.",
    mass: "Mass (kg)",
    restE: "Rest energy",
    kineticE: "Kinetic energy",
    totalE: "Total energy",
    schwarz: "Schwarzschild radius",
    schwarzD: "The event-horizon radius for a non-rotating mass.",
    massSun: "Mass (solar masses)",
    radius: "Schwarzschild radius",
    grav: "Gravitational time dilation",
    gravD: "Clock rate at radius r around a mass M (Schwarzschild).",
    radiusR: "Radius (× rs)",
    clockRate: "Clock rate dτ/dt",
    perDay: "Drift per day",
    velAdd: "Velocity addition",
    velAddD: "Combining collinear velocities the Einstein way.",
    result: "Result",
    invalid: "Enter valid numbers",
    noteC: "v must be below c for massive objects.",
    gamma: "γ",
    beta: "β = v/c",
    ofC: "% of c",
  },
  es: {
    title: "Caja de herramientas",
    sub: "Siete calculadoras. Todos los números se calculan en vivo con las fórmulas, sin cajas negras.",
    lorentz: "Factor de Lorentz",
    lorentzD: "Cuánto se dilata el tiempo y se contrae la longitud a una velocidad dada.",
    vel: "Velocidad",
    timeDil: "Dilatación del tiempo",
    timeDilD: "Tiempo propio de un reloj en movimiento frente al tiempo visto por un observador fijo.",
    properTime: "Tiempo propio (s)",
    coordTime: "Tiempo coordenado",
    length: "Contracción de la longitud",
    lengthD: "Longitud medida de un objeto en movimiento frente a su longitud en reposo.",
    restLength: "Longitud en reposo (m)",
    observedLength: "Longitud observada",
    energy: "Energía relativista",
    energyD: "Energía en reposo, cinética y total de una partícula con masa.",
    mass: "Masa (kg)",
    restE: "Energía en reposo",
    kineticE: "Energía cinética",
    totalE: "Energía total",
    schwarz: "Radio de Schwarzschild",
    schwarzD: "Radio del horizonte de sucesos para una masa sin rotación.",
    massSun: "Masa (masas solares)",
    radius: "Radio de Schwarzschild",
    grav: "Dilatación gravitatoria",
    gravD: "Ritmo de un reloj a radio r alrededor de una masa M (Schwarzschild).",
    radiusR: "Radio (× rs)",
    clockRate: "Ritmo del reloj dτ/dt",
    perDay: "Deriva por día",
    velAdd: "Suma de velocidades",
    velAddD: "Cómo se combinan velocidades colineales a lo Einstein.",
    result: "Resultado",
    invalid: "Introduce números válidos",
    noteC: "v debe ser menor que c para objetos con masa.",
    gamma: "γ",
    beta: "β = v/c",
    ofC: "% de c",
  },
} as const;

function Card({ title, desc, formula, children }: { title: string; desc: string; formula: ReactNode; children: ReactNode }) {
  return (
    <section className="panel p-5">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <p className="mb-3 mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{desc}</p>
      <div className="mb-4 text-center">{formula}</div>
      {children}
    </section>
  );
}

function NumInput({ label, value, onChange, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium" style={{ color: "var(--text-dim)" }}>{label}</span>
      <input
        type="number"
        className="inset font-mono2 w-full px-3 py-2 text-sm"
        style={{ color: "var(--text)" }}
        value={Number.isFinite(value) ? value : ""}
        min={min}
        max={max}
        step={step ?? "any"}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

type S = (typeof STRINGS)[keyof typeof STRINGS];

function LorentzCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [x, setX] = useState(0.8);
  const beta = Math.pow(x, 2.2) * 0.999;
  const v = beta * C;
  const g = lorentzFactor(v);
  return (
    <Card title={s.lorentz} desc={s.lorentzD} formula={<IM tex="\gamma = \frac{1}{\sqrt{1-v^2/c^2}}" />}>
      <ParamSlider label={s.vel} value={x} min={0} max={1} step={0.001} onChange={setX}
        format={() => `${(beta * 100).toFixed(2)}${s.ofC}`} />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PhysicsValue label={s.gamma} value={g > 1e6 ? ">10⁶" : fmt(g, lang)} accent="cyan" />
        <PhysicsValue label={s.beta} value={beta.toFixed(5)} accent="amber" />
      </div>
      <p className="mt-2 text-xs" style={{ color: "var(--text-faint)" }}>{s.noteC}</p>
    </Card>
  );
}

function TimeDilationCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [x, setX] = useState(0.75);
  const [tau, setTau] = useState(1);
  const beta = Math.pow(x, 2.2) * 0.999;
  const t = dilatedTime(tau, beta * C);
  return (
    <Card title={s.timeDil} desc={s.timeDilD} formula={<IM tex="\Delta t = \gamma\,\Delta\tau" />}>
      <div className="space-y-3">
        <NumInput label={s.properTime} value={tau} onChange={(v) => setTau(Math.max(0, v))} min={0} />
        <ParamSlider label={s.vel} value={x} min={0} max={1} step={0.001} onChange={setX}
          format={() => `${(beta * 100).toFixed(2)}${s.ofC}`} />
      </div>
      <div className="mt-3">
        <PhysicsValue label={s.coordTime} value={formatDuration(t, lang)} accent="amber" />
      </div>
    </Card>
  );
}

function LengthCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [x, setX] = useState(0.7);
  const [L0, setL0] = useState(100);
  const beta = Math.pow(x, 2.2) * 0.999;
  const L = contractedLength(L0, beta * C);
  return (
    <Card title={s.length} desc={s.lengthD} formula={<IM tex="L = L_0/\gamma" />}>
      <div className="space-y-3">
        <NumInput label={s.restLength} value={L0} onChange={(v) => setL0(Math.max(0, v))} min={0} />
        <ParamSlider label={s.vel} value={x} min={0} max={1} step={0.001} onChange={setX}
          format={() => `${(beta * 100).toFixed(2)}${s.ofC}`} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PhysicsValue label={s.observedLength} value={Number.isFinite(L) ? `${fmt(L, lang)} m` : "—"} accent="violet" />
        <PhysicsValue label="L/L₀" value={L0 > 0 && Number.isFinite(L) ? `${((L / L0) * 100).toFixed(1)}%` : "—"} accent="cyan" />
      </div>
    </Card>
  );
}

function EnergyCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [x, setX] = useState(0.65);
  const [mExp, setMExp] = useState(-27);
  const beta = Math.pow(x, 2.2) * 0.999;
  const m = 10 ** mExp;
  const v = beta * C;
  return (
    <Card title={s.energy} desc={s.energyD} formula={<IM tex="E^2 = (pc)^2 + (mc^2)^2" />}>
      <div className="space-y-3">
        <ParamSlider label={s.mass} value={mExp} min={-31} max={2} step={0.1} onChange={setMExp}
          format={(e) => `10^${e.toFixed(1)} kg`} />
        <ParamSlider label={s.vel} value={x} min={0} max={1} step={0.001} onChange={setX}
          format={() => `${(beta * 100).toFixed(2)}${s.ofC}`} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <PhysicsValue label={s.restE} value={fmtEnergy(restEnergy(m), lang)} accent="cyan" />
        <PhysicsValue label={s.kineticE} value={fmtEnergy(kineticEnergy(m, v), lang)} accent="amber" />
        <PhysicsValue label={s.totalE} value={fmtEnergy(totalEnergy(m, v), lang)} accent="violet" />
      </div>
    </Card>
  );
}

function SchwarzCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [x, setX] = useState(1);
  const m = 10 ** x * M_SUN;
  const rs = schwarzschildRadius(m);
  return (
    <Card title={s.schwarz} desc={s.schwarzD} formula={<IM tex="r_s = \frac{2GM}{c^2}" />}>
      <ParamSlider label={s.massSun} value={x} min={-6} max={10} step={0.1} onChange={setX}
        format={(e) => `10^${e.toFixed(1)} M☉`} />
      <div className="mt-3">
        <PhysicsValue label={s.radius} value={fmtDistance(rs, lang)} accent="amber" />
      </div>
    </Card>
  );
}

function GravTimeCalc({ s }: { s: S; lang: "en" | "es" }) {
  const [mExp, setMExp] = useState(0);
  const [rMult, setRMult] = useState(1);
  const m = 10 ** mExp * M_SUN;
  const rs = schwarzschildRadius(m);
  const r = rs * (1 + Math.pow(rMult, 3) * 99);
  const f = gravitationalTimeFactor(m, r);
  return (
    <Card title={s.grav} desc={s.gravD} formula={<IM tex="d\tau = dt\sqrt{1 - r_s/r}" />}>
      <div className="space-y-3">
        <ParamSlider label={s.massSun} value={mExp} min={-6} max={10} step={0.1} onChange={setMExp}
          format={(e) => `10^${e.toFixed(1)} M☉`} />
        <ParamSlider label={s.radiusR} value={rMult} min={0} max={1} step={0.01} onChange={setRMult}
          format={() => `${(r / rs).toFixed(2)} rs`} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PhysicsValue label={s.clockRate} value={Number.isFinite(f) ? f.toFixed(6) : "—"} accent="cyan" />
        <PhysicsValue label={s.perDay} value={Number.isFinite(f) ? `${(((1 - f) * 86400) * 1e6).toFixed(1)} µs` : "—"} accent="amber" />
      </div>
    </Card>
  );
}

function VelAddCalc({ s, lang }: { s: S; lang: "en" | "es" }) {
  const [u, setU] = useState(0.5);
  const [vv, setVv] = useState(0.5);
  const w = velocityAddition(u * C, vv * C);
  const classical = (u + vv) * C;
  return (
    <Card title={s.velAdd} desc={s.velAddD} formula={<IM tex="u' = \frac{u+v}{1+uv/c^2}" />}>
      <div className="space-y-3">
        <ParamSlider label="u" value={u} min={-0.999} max={0.999} step={0.001} onChange={setU} format={(x) => `${x.toFixed(3)}c`} />
        <ParamSlider label="v" value={vv} min={-0.999} max={0.999} step={0.001} onChange={setVv} format={(x) => `${x.toFixed(3)}c`} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <PhysicsValue label={s.result} value={fmtVelocity(w, lang)} accent="cyan" />
        <PhysicsValue label={lang === "es" ? "Clásico: u+v" : "Classical: u+v"} value={fmtVelocity(Math.min(classical, C * 2), lang)} accent="violet" />
      </div>
    </Card>
  );
}

export default function Tools() {
  const { lang } = useG();
  const s = STRINGS[lang];
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <header className="pb-8 pt-10">
        <p className="chip mb-3"><Wrench size={13} /> 7</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mt-2 max-w-3xl text-lg" style={{ color: "var(--text-dim)" }}>{s.sub}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <LorentzCalc s={s} lang={lang} />
        <TimeDilationCalc s={s} lang={lang} />
        <LengthCalc s={s} lang={lang} />
        <EnergyCalc s={s} lang={lang} />
        <SchwarzCalc s={s} lang={lang} />
        <GravTimeCalc s={s} lang={lang} />
        <VelAddCalc s={s} lang={lang} />
      </div>
    </div>
  );
}
