import { useEffect, useState } from "react";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  IM,
  MathOnly,
  PlayPauseControls,
  SegmentedControl,
  PresetBar,
  TryThis,
  KeyIdea,
  useG,
} from "../components/ui";
import { useSimClock, usePrefersReducedMotion } from "../hooks/useAnimation";
import {
  gravitationalTimeFactor,
  schwarzschildRadius,
  formatDuration,
} from "../physics/generalRelativity";
import { M_SUN, M_EARTH, R_EARTH, DAY, YEAR } from "../physics/constants";
import { fmtDistance, type Lang } from "../physics/units";

// Local astronomical data not present in physics/constants
const M_MOON = 7.342e22; // kg
const R_MOON = 1.7374e6; // m
const R_SUN = 6.96e8; // m
const GPS_ALT = 20.2e6; // m, nominal GPS orbital altitude

type AId = "earth" | "moon" | "gps" | "far";
type BId =
  | "earth"
  | "everest"
  | "airplane"
  | "gps"
  | "moon"
  | "sun"
  | "whitedwarf"
  | "neutronstar"
  | "blackhole";
type BodyId = AId | BId;
type DurId = "sec" | "day" | "year" | "decade";

interface BodyInfo {
  massKg: number;
  radiusM: number;
}

// Clock A: fixed reference locations (no slider)
const A_BODIES: Record<AId, BodyInfo> = {
  earth: { massKg: M_EARTH, radiusM: R_EARTH },
  moon: { massKg: M_MOON, radiusM: R_MOON },
  gps: { massKg: M_EARTH, radiusM: R_EARTH + GPS_ALT },
  far: { massKg: M_EARTH, radiusM: 100 * R_EARTH },
};
const A_IDS: AId[] = ["earth", "moon", "gps", "far"];

// Clock B: selectable body + log radius slider (r = radiusM * factor)
interface BBodyInfo extends BodyInfo {
  minF: number;
  maxF: number;
  blackHole?: boolean;
}
const B_BODIES: Record<BId, BBodyInfo> = {
  earth: { massKg: M_EARTH, radiusM: R_EARTH, minF: 1, maxF: 100 },
  everest: { massKg: M_EARTH, radiusM: R_EARTH + 8849, minF: 1, maxF: 100 },
  airplane: { massKg: M_EARTH, radiusM: R_EARTH + 12000, minF: 1, maxF: 100 },
  gps: { massKg: M_EARTH, radiusM: R_EARTH + GPS_ALT, minF: 1, maxF: 10 },
  moon: { massKg: M_MOON, radiusM: R_MOON, minF: 1, maxF: 100 },
  sun: { massKg: M_SUN, radiusM: R_SUN, minF: 1, maxF: 100 },
  whitedwarf: { massKg: M_SUN, radiusM: 7e6, minF: 1, maxF: 100 },
  neutronstar: { massKg: 1.4 * M_SUN, radiusM: 12000, minF: 1, maxF: 100 },
  blackhole: {
    massKg: 10 * M_SUN,
    radiusM: schwarzschildRadius(10 * M_SUN),
    minF: 1.05,
    maxF: 100,
    blackHole: true,
  },
};
const B_IDS: BId[] = [
  "earth",
  "everest",
  "airplane",
  "gps",
  "moon",
  "sun",
  "whitedwarf",
  "neutronstar",
  "blackhole",
];

const DURATIONS: Record<DurId, number> = {
  sec: 1,
  day: DAY,
  year: YEAR,
  decade: 10 * YEAR,
};

// slider u ∈ [0,1] → factor = minF · (maxF/minF)^u
const uToFactor = (u: number, b: BBodyInfo) =>
  b.minF * Math.pow(b.maxF / b.minF, Math.min(1, Math.max(0, u)));
const factorToU = (f: number, b: BBodyInfo) =>
  Math.log(f / b.minF) / Math.log(b.maxF / b.minF);

const SCENARIOS: Array<{ id: string; bodyA: AId; bodyB: BId; u: number; dur: DurId }> = [
  { id: "everest", bodyA: "earth", bodyB: "everest", u: 0, dur: "day" },
  { id: "gps", bodyA: "earth", bodyB: "gps", u: 0, dur: "day" },
  { id: "neutron", bodyA: "earth", bodyB: "neutronstar", u: 0, dur: "day" },
  {
    id: "blackhole",
    bodyA: "earth",
    bodyB: "blackhole",
    u: factorToU(1.5, B_BODIES.blackhole),
    dur: "day",
  },
];

/** dτ/dt factor with full precision (trimmed trailing zeros). */
function fmtFactor(f: number): string {
  if (!Number.isFinite(f)) return "—";
  const s = f.toFixed(12);
  return s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
}

/** Signed duration, adaptive units down to picoseconds. */
function fmtDelta(sec: number, lang: Lang): string {
  if (!Number.isFinite(sec)) return "—";
  if (sec === 0) return lang === "es" ? "0 s (idénticos)" : "0 s (identical)";
  const a = Math.abs(sec);
  const sign = sec < 0 ? "−" : "+";
  if (a >= 1) return `${sign}${formatDuration(a, lang)}`;
  let t: string;
  if (a >= 1e-3) t = `${(a * 1e3).toFixed(3)} ms`;
  else if (a >= 1e-6) t = `${(a * 1e6).toFixed(2)} µs`;
  else if (a >= 1e-9) t = `${(a * 1e9).toFixed(2)} ns`;
  else t = `${(a * 1e12).toFixed(2)} ps`;
  return `${sign}${t}`;
}

/** Number formatted for KaTeX with thin-space thousand separators. */
const texNum = (n: number) =>
  n
    .toLocaleString("en-US", { maximumFractionDigits: 1 })
    .replace(/,/g, "\\,");

const STRINGS = {
  en: {
    title: "Gravity Clock",
    subtitle:
      "Place two identical clocks at different gravitational potentials and watch them tick at different rates — time itself runs slower, deeper in a gravitational well.",
    concept: "Gravitational time dilation",
    scenarioLabel: "Scenarios",
    scenarioName: {
      everest: "Everest vs sea level",
      gps: "GPS satellite vs ground",
      neutron: "Neutron star vs Earth",
      blackhole: "Near black hole vs far away",
    } as Record<string, string>,
    clockALabel: "Clock A — reference location",
    clockBLabel: "Clock B — body",
    clockA: "Clock A",
    clockB: "Clock B",
    bodyName: {
      earth: "Earth surface",
      moon: "Moon surface",
      gps: "GPS orbit (20,200 km)",
      far: "Far from Earth",
      everest: "Everest summit",
      airplane: "Airplane (12 km)",
      sun: "Sun surface",
      whitedwarf: "White dwarf",
      neutronstar: "Neutron star",
      blackhole: "Black hole (10 M☉)",
    } as Record<BodyId, string>,
    radiusLabel: "Clock B distance from the body's center",
    radiusLabelBH: "Clock B distance from the singularity",
    durationLabel: "Experiment duration (coordinate time)",
    durations: {
      sec: "1 second",
      day: "1 day",
      year: "1 year",
      decade: "10 years",
    } as Record<DurId, string>,
    factorA: "Rate factor A (dτ/dt)",
    factorB: "Rate factor B (dτ/dt)",
    properA: "Proper time A (total)",
    properB: "Proper time B (total)",
    deltaTotal: "Difference Δτ = τ_B − τ_A",
    driftDay: "Drift rate",
    perDay: "/day",
    rsB: "Schwarzschild radius (B)",
    coordElapsed: "Coordinate time elapsed",
    liveDelta: "Live difference τ_B − τ_A",
    gainB: "Clock B runs faster — it is gaining time on clock A.",
    gainA: "Clock A runs faster — clock B is losing time.",
    tie: "Both clocks tick at exactly the same rate.",
    handNote:
      "Both hands are time-lapsed equally: each sweeps its own clock's proper time. Whenever the hands separate, you are watching gravitational time dilation happen.",
    bhWarning: (x: string) =>
      `Clock B hovers only ${x} above the event horizon. The static-observer formula still holds here, but hovering this deep would demand colossal thrust — treat it as a thought experiment, not an engineering proposal.`,
    horizonError:
      "Inside the event horizon the static-observer formula breaks down: no clock can hover at rest at r ≤ r_s. Choose a radius larger than the Schwarzschild radius.",
    tryPrompt:
      "GPS challenge: put clock A on Earth's surface and clock B in GPS orbit, and find the configuration where clock B gains about +38 to +45 microseconds per day over the ground clock. Honesty clause: this simulator models gravity only, with static (hovering) clocks. Pure general relativity gives ≈ +45.7 µs/day; the satellite's orbital motion (special relativity) subtracts ≈ −7.2 µs/day, for a real-world net of ≈ +38.6 µs/day. Solve the gravitational part here — then visit the GPS lab to see both effects combined.",
    tryHint:
      "Hint: use the “GPS satellite vs ground” scenario, then nudge the radius slider until the drift rate lands inside the target window.",
    keyIdea:
      "Deeper in a gravitational well, a clock ticks slower — as judged by an observer far away. It is not the clock that is broken: time itself flows at a different rate there.",
    whatYouSee: (
      <>
        <p>
          Two identical clocks start together.{" "}
          <strong style={{ color: "var(--cyan)" }}>Clock A</strong> stays at its
          reference location while you place{" "}
          <strong style={{ color: "var(--amber)" }}>clock B</strong> anywhere from
          Earth's surface to the edge of a black hole. Press play and both hands
          sweep their own proper time — scaled equally, so any separation between
          the hands is pure physics, not a display trick.
        </p>
        <p className="mt-2">
          The digital panels accumulate each clock's proper time{" "}
          <IM tex="\tau = f \cdot t" />. The factor panels show{" "}
          <IM tex="d\tau/dt" />: how many seconds tick on the clock for every
          second of coordinate time measured far away.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          In general relativity, gravity is not a force pulling on the clock's
          mechanism — mass curves spacetime, and a clock sitting deeper in the
          curved region simply measures less proper time between the same two
          coordinate instants. For a clock held static at radius <IM tex="r" />{" "}
          outside a spherical mass: <IM tex="d\tau = dt\,\sqrt{1 - r_s/r}" />.
        </p>
        <KeyIdea>
          Deeper in the well means slower ticking, as seen from far away. GPS
          engineers live this every day: a GPS satellite's clock gains about{" "}
          <strong>+45.7 µs per day</strong> from gravity alone — but the
          satellite's orbital motion slows it by about{" "}
          <strong>−7.2 µs per day</strong> (special relativity), for a net gain
          of ≈ +38.6 µs/day. Satellite clocks are pre-corrected for this before
          launch; without the correction, positioning errors would grow by
          roughly 10 km per day.
        </KeyIdea>
        <p>
          Note the honesty clause: this simulator holds clock B{" "}
          <em>static</em> (hovering). A real GPS satellite orbits, so only the
          gravitational part (+45.7 µs/day) is shown here. The GPS lab combines
          both effects.
        </p>
        <MathOnly>
          <p className="mt-2">
            <IM tex="\text{(numerical check for the current setup — mathematical mode only)}" />
          </p>
        </MathOnly>
      </>
    ),
    assumptions: [
      "Static observers: both clocks are held at a fixed radius (hovering). Real GPS satellites orbit — their motion adds a special-relativistic slowdown of ≈ −7.2 µs/day that this simulator does not include.",
      "Schwarzschild (non-rotating, uncharged) mass. The formula dτ/dt = √(1 − r_s/r) applies only outside the event horizon (r > r_s).",
      "Idealized clocks: no mechanical noise, no drift of the mechanism itself.",
      "The experiment duration is coordinate time t — the time that would be measured by an observer infinitely far from the mass.",
      "Hovering near a black hole's horizon would require unimaginable thrust; treat those scenarios as thought experiments.",
    ],
    equationCaption: "Proper time of a static clock at radius r",
    mathCaption: "The Schwarzschild radius of the mass",
  },
  es: {
    title: "Reloj gravitatorio",
    subtitle:
      "Coloca dos relojes idénticos a distinto potencial gravitatorio y obsérvalos avanzar a ritmos diferentes: el tiempo mismo transcurre más despacio en lo profundo de un pozo gravitatorio.",
    concept: "Dilatación gravitatoria del tiempo",
    scenarioLabel: "Escenarios",
    scenarioName: {
      everest: "Everest frente al nivel del mar",
      gps: "Satélite GPS frente a tierra",
      neutron: "Estrella de neutrones frente a la Tierra",
      blackhole: "Cerca de un agujero negro frente a lejos",
    } as Record<string, string>,
    clockALabel: "Reloj A — ubicación de referencia",
    clockBLabel: "Reloj B — cuerpo",
    clockA: "Reloj A",
    clockB: "Reloj B",
    bodyName: {
      earth: "Superficie terrestre",
      moon: "Superficie lunar",
      gps: "Órbita GPS (20 200 km)",
      far: "Lejos de la Tierra",
      everest: "Cima del Everest",
      airplane: "Avión (12 km)",
      sun: "Superficie solar",
      whitedwarf: "Enana blanca",
      neutronstar: "Estrella de neutrones",
      blackhole: "Agujero negro (10 M☉)",
    } as Record<BodyId, string>,
    radiusLabel: "Distancia del reloj B al centro del cuerpo",
    radiusLabelBH: "Distancia del reloj B a la singularidad",
    durationLabel: "Duración del experimento (tiempo coordenado)",
    durations: {
      sec: "1 segundo",
      day: "1 día",
      year: "1 año",
      decade: "10 años",
    } as Record<DurId, string>,
    factorA: "Factor de ritmo A (dτ/dt)",
    factorB: "Factor de ritmo B (dτ/dt)",
    properA: "Tiempo propio A (total)",
    properB: "Tiempo propio B (total)",
    deltaTotal: "Diferencia Δτ = τ_B − τ_A",
    driftDay: "Ritmo de deriva",
    perDay: "/día",
    rsB: "Radio de Schwarzschild (B)",
    coordElapsed: "Tiempo coordenado transcurrido",
    liveDelta: "Diferencia en directo τ_B − τ_A",
    gainB: "El reloj B avanza más rápido: está ganando tiempo al reloj A.",
    gainA: "El reloj A avanza más rápido: el reloj B está perdiendo tiempo.",
    tie: "Ambos relojes avanzan exactamente al mismo ritmo.",
    handNote:
      "Ambas agujas comparten la misma cámara rápida: cada una barre el tiempo propio de su reloj. Cuando las agujas se separan, estás viendo la dilatación gravitatoria del tiempo.",
    bhWarning: (x: string) =>
      `El reloj B se mantiene a solo ${x} sobre el horizonte de sucesos. La fórmula del observador estático sigue valiendo aquí, pero mantenerse inmóvil tan adentro exigiría un empuje colosal: tómalo como un experimento mental, no como una propuesta de ingeniería.`,
    horizonError:
      "Dentro del horizonte de sucesos la fórmula del observador estático deja de valer: ningún reloj puede permanecer en reposo con r ≤ r_s. Elige un radio mayor que el radio de Schwarzschild.",
    tryPrompt:
      "Reto GPS: coloca el reloj A en la superficie terrestre y el reloj B en órbita GPS, y encuentra la configuración en la que el reloj B gane unos +38 a +45 microsegundos al día sobre el reloj de tierra. Cláusula de honestidad: este simulador solo modela la gravedad, con relojes estáticos (en suspensión). La relatividad general pura da ≈ +45,7 µs/día; el movimiento orbital del satélite (relatividad especial) resta ≈ −7,2 µs/día, con un neto real de ≈ +38,6 µs/día. Resuelve aquí la parte gravitatoria y visita el laboratorio GPS para ver ambos efectos combinados.",
    tryHint:
      "Pista: usa el escenario «Satélite GPS frente a tierra» y ajusta el deslizador de radio hasta que el ritmo de deriva caiga dentro del objetivo.",
    keyIdea:
      "En lo profundo de un pozo gravitatorio, un reloj avanza más despacio — juzgado desde lejos. No es que el reloj esté roto: el tiempo mismo fluye a otro ritmo allí.",
    whatYouSee: (
      <>
        <p>
          Dos relojes idénticos parten juntos. El{" "}
          <strong style={{ color: "var(--cyan)" }}>reloj A</strong> permanece en
          su ubicación de referencia mientras tú colocas el{" "}
          <strong style={{ color: "var(--amber)" }}>reloj B</strong> en cualquier
          lugar entre la superficie terrestre y el borde de un agujero negro.
          Pulsa reproducir y ambas agujas barrerán su propio tiempo propio — con
          la misma escala, de modo que cualquier separación entre ellas es pura
          física, no un truco visual.
        </p>
        <p className="mt-2">
          Los paneles digitales acumulan el tiempo propio de cada reloj{" "}
          <IM tex="\tau = f \cdot t" />. Los paneles de factor muestran{" "}
          <IM tex="d\tau/dt" />: cuántos segundos marca el reloj por cada segundo
          de tiempo coordenado medido desde muy lejos.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          En relatividad general, la gravedad no es una fuerza que tira del
          mecanismo del reloj: la masa curva el espaciotiempo, y un reloj situado
          en lo profundo de la región curvada simplemente mide menos tiempo
          propio entre los mismos dos instantes coordenados. Para un reloj
          mantenido estático a un radio <IM tex="r" /> fuera de una masa
          esférica: <IM tex="d\tau = dt\,\sqrt{1 - r_s/r}" />.
        </p>
        <KeyIdea>
          Más hondo en el pozo significa un tic-tac más lento, visto desde
          lejos. Los ingenieros del GPS lo viven a diario: el reloj de un
          satélite GPS gana unos <strong>+45,7 µs al día</strong> solo por la
          gravedad, pero el movimiento orbital lo retrasa unos{" "}
          <strong>−7,2 µs al día</strong> (relatividad especial), con una
          ganancia neta de ≈ +38,6 µs/día. Los relojes se precorrigen antes del
          lanzamiento; sin esa corrección, el error de posición crecería unos 10
          km al día.
        </KeyIdea>
        <p>
          Nota la cláusula de honestidad: este simulador mantiene el reloj B{" "}
          <em>estático</em> (en suspensión). Un satélite GPS real orbita, así
          que aquí solo se muestra la parte gravitatoria (+45,7 µs/día). El
          laboratorio GPS combina ambos efectos.
        </p>
        <MathOnly>
          <p className="mt-2">
            <IM tex="\text{(comprobación numérica de la configuración actual — solo en modo matemático)}" />
          </p>
        </MathOnly>
      </>
    ),
    assumptions: [
      "Observadores estáticos: ambos relojes se mantienen a radio fijo (en suspensión). Los satélites GPS reales orbitan — su movimiento añade un retraso de relatividad especial de ≈ −7,2 µs/día que este simulador no incluye.",
      "Masa de Schwarzschild (sin rotación ni carga). La fórmula dτ/dt = √(1 − r_s/r) solo vale fuera del horizonte de sucesos (r > r_s).",
      "Relojes idealizados: sin ruido mecánico ni deriva propia del mecanismo.",
      "La duración del experimento es tiempo coordenado t — el que mediría un observador infinitamente lejos de la masa.",
      "Mantenerse inmóvil cerca del horizonte de un agujero negro exigiría un empuje inimaginable; trata esos escenarios como experimentos mentales.",
    ],
    equationCaption: "Tiempo propio de un reloj estático a radio r",
    mathCaption: "El radio de Schwarzschild de la masa",
  },
};

/** Analog clock face whose hand sweeps the clock's proper time. */
function ClockFace({
  progress,
  ratio,
  accent,
  label,
}: {
  progress: number;
  ratio: number;
  accent: string;
  label: string;
}) {
  const cx = 80;
  const cy = 80;
  const R = 66;
  const a = 2 * Math.PI * progress * ratio;
  const hx = cx + (R - 12) * Math.sin(a);
  const hy = cy - (R - 12) * Math.cos(a);
  // swept arc showing accumulated proper time
  const arcR = R - 24;
  const ax = cx + arcR * Math.sin(a);
  const ay = cy - arcR * Math.cos(a);
  const large = a > Math.PI ? 1 : 0;
  return (
    <svg
      viewBox="0 0 160 160"
      className="mx-auto h-36 w-36 md:h-44 md:w-44"
      role="img"
      aria-label={label}
    >
      <circle cx={cx} cy={cy} r={R} fill="var(--bg-panel)" stroke="var(--border)" strokeWidth={2} />
      {a > 0.001 && (
        <path
          d={`M ${cx} ${cy - arcR} A ${arcR} ${arcR} 0 ${large} 1 ${ax} ${ay}`}
          fill="none"
          stroke={accent}
          strokeWidth={7}
          strokeLinecap="round"
          opacity={0.3}
        />
      )}
      {Array.from({ length: 12 }).map((_, i) => {
        const t = (i * Math.PI) / 6;
        const major = i % 3 === 0;
        const x1 = cx + (R - 5) * Math.sin(t);
        const y1 = cy - (R - 5) * Math.cos(t);
        const x2 = cx + (R - (major ? 14 : 10)) * Math.sin(t);
        const y2 = cy - (R - (major ? 14 : 10)) * Math.cos(t);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={major ? accent : "var(--text-faint)"}
            strokeWidth={major ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={accent} strokeWidth={3.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill={accent} />
    </svg>
  );
}

export default function GravityClock() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [bodyA, setBodyA] = useState<AId>("earth");
  const [bodyB, setBodyB] = useState<BId>("everest");
  const [u, setU] = useState(0); // log slider position
  const [durId, setDurId] = useState<DurId>("day");
  const [playing, setPlaying] = useState(!reduced);

  const A = A_BODIES[bodyA];
  const B = B_BODIES[bodyB];
  const factor = uToFactor(u, B);
  const rA = A.radiusM;
  const rB = B.radiusM * factor;
  const rsB = schwarzschildRadius(B.massKg);
  const fA = gravitationalTimeFactor(A.massKg, rA);
  const fB = gravitationalTimeFactor(B.massKg, rB);
  const D = DURATIONS[durId];

  const insideHorizon = !Number.isFinite(fB) || rB <= rsB;
  const safeFA = Number.isFinite(fA) && fA > 0 ? fA : NaN;
  const safeFB = Number.isFinite(fB) && fB > 0 ? fB : NaN;

  const tauA = Number.isFinite(safeFA) ? D * safeFA : NaN;
  const tauB = Number.isFinite(safeFB) ? D * safeFB : NaN;
  const totalDelta = Number.isFinite(tauA) && Number.isFinite(tauB) ? tauB - tauA : NaN;
  const driftPerDay =
    Number.isFinite(safeFA) && Number.isFinite(safeFB) ? (safeFB - safeFA) * DAY : NaN;

  // Time-lapse: the whole coordinate duration plays in ~20 s
  const warp = D / 20;
  const { time: coordT, reset } = useSimClock(playing, warp);

  // Restart the experiment whenever the physics setup changes
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyA, bodyB, u, durId]);

  const progress = D > 0 ? Math.min(1, coordT / D) : 0;
  const done = progress >= 1;
  useEffect(() => {
    if (done) setPlaying(false);
  }, [done]);

  const liveA = Number.isFinite(tauA) ? progress * tauA : NaN;
  const liveB = Number.isFinite(tauB) ? progress * tauB : NaN;
  const liveDelta =
    Number.isFinite(liveA) && Number.isFinite(liveB) ? liveB - liveA : NaN;
  const handRatio =
    Number.isFinite(safeFA) && Number.isFinite(safeFB) && safeFA > 0
      ? safeFB / safeFA
      : 1;

  const gainText =
    !Number.isFinite(liveDelta) || liveDelta === 0
      ? s.tie
      : liveDelta > 0
        ? s.gainB
        : s.gainA;

  const applyScenario = (i: number) => {
    const sc = SCENARIOS[i];
    setBodyA(sc.bodyA);
    setBodyB(sc.bodyB);
    setU(sc.u);
    setDurId(sc.dur);
  };

  const fmtRadius = (uu: number) => {
    const f = uToFactor(uu, B);
    const r = B.radiusM * f;
    const mult = B.blackHole
      ? `${parseFloat(f.toPrecision(3))} × r_s`
      : `${parseFloat(f.toPrecision(3))} × R`;
    return `${fmtDistance(r, lang)} (${mult})`;
  };

  const bhClose = B.blackHole === true && factor < 2 && !insideHorizon;
  const timesRs =
    B.blackHole === true && Number.isFinite(rsB) && rsB > 0
      ? `${parseFloat((rB / rsB).toPrecision(3))}× r_s`
      : "";

  // Divergence bar: fraction of the total difference, signed
  const frac =
    Number.isFinite(liveDelta) && Number.isFinite(totalDelta) && totalDelta !== 0
      ? Math.max(-1, Math.min(1, liveDelta / totalDelta))
      : 0;
  const barLeft = frac >= 0 ? "50%" : `${50 + frac * 50}%`;
  const barWidth = `${Math.abs(frac) * 50}%`;
  const barColor =
    !Number.isFinite(liveDelta) || liveDelta === 0
      ? "var(--text-faint)"
      : liveDelta > 0
        ? "var(--amber)"
        : "var(--cyan)";

  // GPS challenge: the GR-only part must land near +45.7 µs/day
  const tryCheck = () =>
    bodyA === "earth" &&
    bodyB === "gps" &&
    Number.isFinite(driftPerDay) &&
    Math.abs(driftPerDay - 45.7e-6) < 8e-6;

  return (
    <SimulationShell
      simId="gravity-clock"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div className="p-4 md:p-6" style={{ background: "var(--bg-inset)" }}>
          {insideHorizon && (
            <div
              className="panel mb-4 p-4 text-sm font-medium"
              style={{ borderColor: "var(--red, #f87171)", color: "var(--text)" }}
              role="alert"
            >
              ⚠ {s.horizonError}
            </div>
          )}
          {bhClose && (
            <div
              className="panel mb-4 p-4 text-sm"
              style={{ borderColor: "var(--amber)", color: "var(--text-dim)" }}
              role="status"
            >
              ⚠ {s.bhWarning(timesRs)}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Clock A */}
            <div className="panel p-4 text-center" style={{ borderTop: "3px solid var(--cyan)" }}>
              <div
                className="mb-2 text-xs font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--cyan)" }}
              >
                {s.clockA} · {s.bodyName[bodyA]}
              </div>
              <ClockFace
                progress={progress}
                ratio={1}
                accent="var(--cyan)"
                label={`${s.clockA}: ${s.bodyName[bodyA]}`}
              />
              <div
                className="font-mono2 mt-2 text-2xl font-bold md:text-3xl"
                style={{ color: "var(--cyan)" }}
                aria-live="polite"
              >
                {formatDuration(liveA, lang)}
              </div>
              <div className="mt-1 font-mono2 text-xs" style={{ color: "var(--text-dim)" }}>
                dτ/dt = {fmtFactor(safeFA)}
              </div>
            </div>
            {/* Clock B */}
            <div className="panel p-4 text-center" style={{ borderTop: "3px solid var(--amber)" }}>
              <div
                className="mb-2 text-xs font-bold uppercase tracking-[0.1em]"
                style={{ color: "var(--amber)" }}
              >
                {s.clockB} · {s.bodyName[bodyB]}
              </div>
              <ClockFace
                progress={progress}
                ratio={handRatio}
                accent="var(--amber)"
                label={`${s.clockB}: ${s.bodyName[bodyB]}`}
              />
              <div
                className="font-mono2 mt-2 text-2xl font-bold md:text-3xl"
                style={{ color: "var(--amber)" }}
                aria-live="polite"
              >
                {formatDuration(liveB, lang)}
              </div>
              <div className="mt-1 font-mono2 text-xs" style={{ color: "var(--text-dim)" }}>
                dτ/dt = {fmtFactor(safeFB)}
              </div>
            </div>
          </div>

          {/* Live difference */}
          <div className="panel mt-4 p-4 text-center">
            <div
              className="text-xs font-bold uppercase tracking-[0.1em]"
              style={{ color: "var(--text-faint)" }}
            >
              {s.liveDelta}
            </div>
            <div
              className="font-mono2 text-2xl font-bold md:text-3xl"
              style={{ color: barColor }}
              aria-live="polite"
            >
              {fmtDelta(liveDelta, lang)}
            </div>
            <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>
              {gainText}
            </p>
            <div
              className="relative mx-auto mt-3 h-2 max-w-md overflow-hidden rounded-full"
              style={{ background: "var(--border)" }}
              aria-hidden
            >
              <div
                className="absolute top-0 h-full w-px"
                style={{ left: "50%", background: "var(--text-faint)" }}
              />
              <div
                className="absolute top-0 h-full rounded-full"
                style={{ left: barLeft, width: barWidth, background: barColor }}
              />
            </div>
          </div>

          {/* Coordinate progress */}
          <div className="mt-4">
            <div
              className="mb-1 flex justify-between text-xs"
              style={{ color: "var(--text-dim)" }}
            >
              <span>{s.coordElapsed}</span>
              <span className="font-mono2">{formatDuration(Math.min(coordT, D), lang)}</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, background: "var(--violet)" }}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <PlayPauseControls
              playing={playing}
              onToggle={() => {
                if (done) reset();
                setPlaying((p) => !p);
              }}
              onReset={reset}
            />
          </div>
          <p
            className="mx-auto mt-3 max-w-2xl text-center text-sm italic"
            style={{ color: "var(--text-dim)" }}
          >
            {s.handNote}
          </p>
        </div>
      }
      controls={
        <>
          <div>
            <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
              {s.scenarioLabel}
            </div>
            <PresetBar
              presets={SCENARIOS.map((sc) => ({ label: s.scenarioName[sc.id] }))}
              onPick={applyScenario}
            />
          </div>
          <SegmentedControl<AId>
            label={s.clockALabel}
            value={bodyA}
            onChange={setBodyA}
            options={A_IDS.map((id) => ({ value: id, label: s.bodyName[id] }))}
          />
          <div>
            <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
              {s.clockBLabel}
            </div>
            <PresetBar
              presets={B_IDS.map((id) => ({ label: s.bodyName[id] }))}
              onPick={(i) => {
                setBodyB(B_IDS[i]);
                setU(0);
              }}
            />
          </div>
          <ParamSlider
            label={B.blackHole === true ? s.radiusLabelBH : s.radiusLabel}
            value={u}
            min={0}
            max={1}
            step={0.001}
            onChange={setU}
            format={fmtRadius}
            accent={B.blackHole === true ? "amber" : "cyan"}
          />
          <SegmentedControl<DurId>
            label={s.durationLabel}
            value={durId}
            onChange={setDurId}
            options={(Object.keys(DURATIONS) as DurId[]).map((id) => ({
              value: id,
              label: s.durations[id],
            }))}
          />
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.factorA} value={fmtFactor(safeFA)} accent="cyan" />
            <PhysicsValue label={s.factorB} value={fmtFactor(safeFB)} accent="amber" />
            <PhysicsValue label={s.properA} value={formatDuration(tauA, lang)} accent="cyan" />
            <PhysicsValue label={s.properB} value={formatDuration(tauB, lang)} accent="amber" />
            <PhysicsValue label={s.deltaTotal} value={fmtDelta(totalDelta, lang)} accent="violet" />
            <PhysicsValue
              label={s.driftDay}
              value={fmtDelta(driftPerDay, lang)}
              unit={s.perDay}
              accent="green"
            />
            <PhysicsValue
              label={s.rsB}
              value={fmtDistance(rsB, lang)}
              accent="violet"
            />
          </div>
          <MathOnly>
            <div className="inset px-3 py-2.5 text-center">
              <IM
                tex={`\\left.\\frac{d\\tau}{dt}\\right|_B = \\sqrt{1 - ${texNum(rsB)} / ${texNum(rB)}} = ${fmtFactor(safeFB)}`}
              />
            </div>
          </MathOnly>
        </>
      }
      whatYouSee={s.whatYouSee}
      physics={s.physics}
      equation={
        <EquationCard
          tex="d\tau = dt\,\sqrt{1 - \frac{r_s}{r}}"
          caption={s.equationCaption}
        />
      }
      mathEquation={
        <EquationCard tex="r_s = \frac{2GM}{c^2}" caption={s.mathCaption} />
      }
      tryThis={
        <TryThis prompt={s.tryPrompt} check={tryCheck}>
          <p className="mt-2 text-sm italic" style={{ color: "var(--text-dim)" }}>
            {s.tryHint}
          </p>
        </TryThis>
      }
      assumptions={s.assumptions}
    />
  );
}
