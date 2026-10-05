import { useEffect, useState } from "react";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  IM,
  PlayPauseControls,
  PresetBar,
  TryThis,
  useG,
} from "../components/ui";
import { lorentzFactor } from "../physics/specialRelativity";
import { C, LY, YEAR } from "../physics/constants";
import { fmt, fmtVelocity, fmtDistance } from "../physics/units";
import { formatDuration } from "../physics/generalRelativity";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Bilingual strings ────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    title: "Twin Paradox Lab",
    subtitle:
      "Alice stays on Earth. Bob flies to a star and back at nearly the speed of light. Who ages more — and why isn't it a paradox?",
    concept: "Twin paradox",
    distance: "Destination distance",
    velocity: "Cruise velocity",
    alice: "Alice · Earth",
    bob: "Bob · traveler",
    phaseOutbound: "Outbound leg",
    phaseTurnaround: "Turnaround!",
    phaseInbound: "Inbound leg",
    phaseArrived: "Arrived — compare the clocks",
    aliceAge: "Alice ages",
    bobAge: "Bob ages",
    ageDiff: "Age difference",
    gamma: "Lorentz factor γ",
    earthTrip: "Earth-frame trip",
    shipTrip: "Ship-frame trip",
    timelapse: "Time-lapse",
    destination: "Destination",
    lightSignal: "light signal",
    turnaroundEvent: "turnaround event",
    whatYouSee:
      "The top view follows Bob's journey: Earth on the left, the destination star on the right. The two big counters tick at different rates — Alice's counter runs on Earth-frame time while Bob's runs on his proper time, slowed by the Lorentz factor. Beside it, the spacetime diagram tells the same story geometrically: Alice's worldline is straight (a single inertial frame), while Bob's worldline bends at the turnaround event. A longer detour through space means a shorter path through time.",
    physicsTitle: "Why isn't this a paradox?",
    physics:
      "Each twin does see the other's clock running slow — and that part is symmetric and perfectly consistent. The asymmetry is the turnaround: Alice stays in one inertial frame for the entire trip, but Bob does not. Bob's journey is stitched from two different inertial frames (outbound and inbound), joined at the turnaround where he must accelerate to reverse direction. Because Bob changes inertial frames and Alice doesn't, their situations are not symmetric, and the clock that changes frames accumulates less proper time. No general relativity is needed — special relativity handles acceleration perfectly well. The common phrasing “acceleration makes Bob younger” is misleading: what matters is the frame change at the turnaround, not the g-force itself.",
    eqPerLeg: "Proper time per leg (outbound or inbound)",
    eqRoundTrip: "Bob's total proper time, round trip",
    eqDerivation: "From T = 2D/v (Earth frame) and τ = T/γ",
    tryPrompt:
      "Make Bob age 10 years while Alice ages 40 years. Tune the velocity and the distance until the readouts match.",
    tryHint:
      "Hint: Alice ages 40 Earth years and Bob 10, so you need γ = 4 — that means β ≈ 0.9682. Then choose the distance so the Earth-frame round trip lasts 40 years: D = T·v/2.",
    assumptions: [
      "Instantaneous turnaround (idealized): a realistic turnaround with finite acceleration gives nearly the same aging difference.",
      "Constant cruise speed on each leg; acceleration and deceleration phases are neglected.",
      "Earth and the destination star are treated as stationary in a single inertial frame; gravity and cosmic expansion are ignored.",
    ],
    solved_extra: "",
  },
  es: {
    title: "Laboratorio de la paradoja de los gemelos",
    subtitle:
      "Alice se queda en la Tierra. Bob vuela hasta una estrella y regresa a casi la velocidad de la luz. ¿Quién envejece más… y por qué no es una paradoja?",
    concept: "Paradoja de los gemelos",
    distance: "Distancia al destino",
    velocity: "Velocidad de crucero",
    alice: "Alice · Tierra",
    bob: "Bob · viajero",
    phaseOutbound: "Viaje de ida",
    phaseTurnaround: "¡Media vuelta!",
    phaseInbound: "Viaje de vuelta",
    phaseArrived: "Llegada — compara los relojes",
    aliceAge: "Alice envejece",
    bobAge: "Bob envejece",
    ageDiff: "Diferencia de edad",
    gamma: "Factor de Lorentz γ",
    earthTrip: "Viaje (marco terrestre)",
    shipTrip: "Viaje (marco de la nave)",
    timelapse: "Lapso de tiempo",
    destination: "Destino",
    lightSignal: "señal de luz",
    turnaroundEvent: "evento de media vuelta",
    whatYouSee:
      "La vista superior sigue el viaje de Bob: la Tierra a la izquierda y la estrella de destino a la derecha. Los dos grandes contadores avanzan a ritmos distintos: el de Alice corre con el tiempo del marco terrestre, mientras el de Bob corre con su tiempo propio, ralentizado por el factor de Lorentz. Al lado, el diagrama de espaciotiempo cuenta la misma historia en forma geométrica: la línea de universo de Alice es recta (un único marco inercial), mientras que la de Bob se quiebra en el evento de media vuelta. Un rodeo más largo por el espacio significa un camino más corto por el tiempo.",
    physicsTitle: "¿Por qué no es una paradoja?",
    physics:
      "Cada gemelo ve efectivamente el reloj del otro marchar más lento, y esa parte es simétrica y totalmente consistente. La asimetría está en la media vuelta: Alice permanece en un único marco inercial durante todo el viaje, pero Bob no. El viaje de Bob se compone de dos marcos inerciales distintos (ida y vuelta), unidos en la media vuelta, donde debe acelerar para invertir su dirección. Como Bob cambia de marco inercial y Alice no, sus situaciones no son simétricas, y el reloj que cambia de marco acumula menos tiempo propio. No hace falta la relatividad general: la relatividad especial maneja la aceleración sin problema. La frase habitual «la aceleración rejuvenece a Bob» es engañosa: lo que importa es el cambio de marco en la media vuelta, no la fuerza g en sí.",
    eqPerLeg: "Tiempo propio por tramo (ida o vuelta)",
    eqRoundTrip: "Tiempo propio total de Bob, ida y vuelta",
    eqDerivation: "A partir de T = 2D/v (marco terrestre) y τ = T/γ",
    tryPrompt:
      "Haz que Bob envejezca 10 años mientras Alice envejece 40 años. Ajusta la velocidad y la distancia hasta que las lecturas coincidan.",
    tryHint:
      "Pista: Alice envejece 40 años terrestres y Bob 10, así que necesitas γ = 4, es decir, β ≈ 0.9682. Después elige la distancia para que el viaje de ida y vuelta dure 40 años en el marco terrestre: D = T·v/2.",
    assumptions: [
      "Media vuelta instantánea (idealizada): una media vuelta realista con aceleración finita da casi la misma diferencia de envejecimiento.",
      "Velocidad de crucero constante en cada tramo; se desprecian las fases de aceleración y frenado.",
      "La Tierra y la estrella de destino se consideran fijas en un único marco inercial; se ignoran la gravedad y la expansión cósmica.",
    ],
    solved_extra: "",
  },
} as const;

// Nonlinear distance mapping: slider t ∈ [0,100] → D ∈ [1,60] ly (log scale)
const D_MIN = 1;
const D_MAX = 60;
const d2t = (d: number) => (Math.log(d / D_MIN) / Math.log(D_MAX / D_MIN)) * 100;
const t2d = (t: number) => D_MIN * Math.pow(D_MAX / D_MIN, t / 100);

const PRESETS = [
  { ly: 4.246, name: { en: "Proxima Centauri", es: "Próxima Centauri" } },
  { ly: 8.6, name: { en: "Sirius", es: "Sirio" } },
  { ly: 11, name: { en: "Ross 128", es: "Ross 128" } },
  { ly: 25, name: { en: "Vega", es: "Vega" } },
];

const TRIP_SECONDS = 25; // full journey ≈ 25 s of real time

export default function TwinParadox() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [beta, setBeta] = useState(0.9);
  const [distLy, setDistLy] = useState(8.6);
  const [playing, setPlaying] = useState(!reduced);
  const [simTime, setSimTime] = useState(0); // Earth-frame elapsed seconds

  // ── Physics from live state ──────────────────────────────────────────────
  const v = beta * C;
  const gamma = lorentzFactor(v);
  const D = distLy * LY; // metres, one way
  const T1 = D / v; // one-way Earth time, s
  const T = 2 * T1; // round-trip Earth time, s
  const tau = T / gamma; // Bob's proper time, s
  const ageDiff = T - tau;

  const speed = T / TRIP_SECONDS; // sim-seconds per real second

  useRaf(
    (dt) => {
      setSimTime((t) => {
        const next = t + dt * speed;
        return next >= T ? T : next;
      });
    },
    playing,
  );

  useEffect(() => {
    if (simTime >= T) setPlaying(false);
  }, [simTime, T]);

  const restart = () => setSimTime(0);
  const changeBeta = (b: number) => {
    setBeta(b);
    restart();
  };
  const changeDist = (d: number) => {
    setDistLy(d);
    restart();
  };

  // ── Animated positions ───────────────────────────────────────────────────
  const outbound = simTime <= T1;
  const bobX = outbound ? v * simTime : 2 * D - v * simTime; // metres from Earth
  const bobProper = simTime / gamma;
  const flashWindow = Math.abs(simTime - T1) < T / 60 && simTime < T;
  const phase = simTime >= T ? s.phaseArrived : flashWindow ? s.phaseTurnaround : outbound ? s.phaseOutbound : s.phaseInbound;

  const checkSolved = () =>
    Math.abs(tau - 10 * YEAR) < 0.6 * YEAR && Math.abs(T - 40 * YEAR) < 2 * YEAR;

  // ── Visualization: journey timeline ──────────────────────────────────────
  const JW = 640;
  const JH = 200;
  const X0 = 70;
  const X1 = JW - 70;
  const JY = 100;
  const bobPx = X0 + (D > 0 ? Math.min(Math.max(bobX / D, 0), 1) : 0) * (X1 - X0);

  const journeySvg = (
    <svg viewBox={`0 0 ${JW} ${JH}`} className="h-auto w-full" role="img" aria-label={s.title}>
      {/* route */}
      <line x1={X0} y1={JY} x2={X1} y2={JY} stroke="var(--border-strong)" strokeWidth={2} strokeDasharray="7 6" />
      {/* traversed trail */}
      <line x1={X0} y1={JY} x2={bobPx} y2={JY} stroke="var(--amber)" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
      {/* Earth */}
      <circle cx={X0} cy={JY} r={17} fill="var(--cyan-dim)" stroke="var(--cyan)" strokeWidth={2} />
      <text x={X0} y={JY + 38} textAnchor="middle" fontSize={12} fill="var(--text-dim)">
        {lang === "es" ? "Tierra" : "Earth"}
      </text>
      {/* destination star */}
      <polygon
        points={starPoints(X1, JY, 16, 7)}
        fill="var(--amber-dim)"
        stroke="var(--amber)"
        strokeWidth={2}
      />
      <text x={X1} y={JY + 38} textAnchor="middle" fontSize={12} fill="var(--text-dim)">
        {s.destination} · {fmtDistance(D, lang)}
      </text>
      {/* turnaround flash */}
      {flashWindow && (
        <circle cx={X1} cy={JY} r={30} fill="none" stroke="var(--amber)" strokeWidth={3} opacity={0.8}>
          <animate attributeName="r" values="18;34" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.1" dur="0.7s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Alice stays home */}
      <circle cx={X0} cy={JY - 26} r={6} fill="var(--cyan)" />
      <text x={X0} y={JY - 40} textAnchor="middle" fontSize={11} fill="var(--cyan)">
        Alice
      </text>
      {/* Bob the traveler */}
      <g>
        <circle cx={bobPx} cy={JY - 26} r={7} fill="var(--amber)" />
        <text x={bobPx} y={JY - 40} textAnchor="middle" fontSize={11} fill="var(--amber)">
          Bob
        </text>
      </g>
      {/* phase badge */}
      <text x={JW / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--text)">
        {phase}
      </text>
    </svg>
  );

  // ── Visualization: spacetime diagram ─────────────────────────────────────
  const DW2 = 300;
  const DH2 = 300;
  const ML = 46;
  const MR = 16;
  const MT = 20;
  const MB = 34;
  const px = (x: number) => ML + (D > 0 ? x / D : 0) * (DW2 - ML - MR);
  const py = (ct: number) => DH2 - MB - (T * C > 0 ? ct / (T * C) : 0) * (DH2 - MT - MB);
  const ctNow = C * simTime;

  const diagramSvg = (
    <svg viewBox={`0 0 ${DW2} ${DH2}`} className="h-auto w-full max-w-[340px]" role="img" aria-label="Spacetime diagram">
      {/* axes */}
      <line x1={ML} y1={MT - 6} x2={ML} y2={DH2 - MB} stroke="var(--text-faint)" strokeWidth={1.5} />
      <line x1={ML} y1={DH2 - MB} x2={DW2 - MR + 8} y2={DH2 - MB} stroke="var(--text-faint)" strokeWidth={1.5} />
      <text x={ML - 12} y={MT} fontSize={12} fill="var(--text-dim)" fontStyle="italic">ct</text>
      <text x={DW2 - MR + 2} y={DH2 - MB + 16} fontSize={12} fill="var(--text-dim)" fontStyle="italic">x</text>
      {/* light cone from departure */}
      <line x1={px(0)} y1={py(0)} x2={px(D)} y2={py(D)} stroke="var(--text-faint)" strokeWidth={1} strokeDasharray="4 4" opacity={0.8} />
      <text x={px(D) - 4} y={py(D) - 8} fontSize={10} fill="var(--text-faint)" textAnchor="end">
        {s.lightSignal}
      </text>
      {/* Alice worldline */}
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(T * C)} stroke="var(--cyan)" strokeWidth={3} />
      <text x={px(0) - 8} y={py(T * C) + 4} fontSize={11} fill="var(--cyan)" textAnchor="end">Alice</text>
      {/* Bob worldline */}
      <polyline
        points={`${px(0)},${py(0)} ${px(D)},${py(C * T1)} ${px(0)},${py(C * T)}`}
        fill="none"
        stroke="var(--amber)"
        strokeWidth={3}
      />
      <text x={px(D) + 8} y={py(C * T1) + 4} fontSize={11} fill="var(--amber)">{s.turnaroundEvent}</text>
      <text x={(px(0) + px(D)) / 2} y={py(C * T1) - 26} fontSize={11} fill="var(--amber)" textAnchor="middle">Bob</text>
      {/* turnaround event marker */}
      <rect
        x={px(D) - 5}
        y={py(C * T1) - 5}
        width={10}
        height={10}
        transform={`rotate(45 ${px(D)} ${py(C * T1)})`}
        fill="var(--amber)"
      />
      {/* moving "now" dots */}
      <circle cx={px(0)} cy={py(ctNow)} r={6} fill="var(--cyan)" stroke="var(--bg)" strokeWidth={2} />
      <circle cx={px(bobX)} cy={py(ctNow)} r={6} fill="var(--amber)" stroke="var(--bg)" strokeWidth={2} />
      {/* destination tick */}
      <text x={px(D)} y={DH2 - MB + 18} fontSize={10} fill="var(--text-faint)" textAnchor="middle">
        {fmtDistance(D, lang)}
      </text>
    </svg>
  );

  const visualization = (
    <div className="p-4 md:p-6">
      {journeySvg}
      {/* age counters */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="inset p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--cyan)" }}>
            {s.alice}
          </div>
          <div className="font-mono2 mt-1 text-2xl font-bold md:text-3xl" style={{ color: "var(--cyan)" }} aria-live="polite">
            {formatDuration(simTime, lang)}
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
            {lang === "es" ? "tiempo del marco terrestre" : "Earth-frame time"}
          </div>
        </div>
        <div className="inset p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--amber)" }}>
            {s.bob}
          </div>
          <div className="font-mono2 mt-1 text-2xl font-bold md:text-3xl" style={{ color: "var(--amber)" }} aria-live="polite">
            {formatDuration(bobProper, lang)}
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
            {lang === "es" ? "tiempo propio" : "proper time"}
          </div>
        </div>
      </div>
      {/* spacetime diagram + readouts */}
      <div className="mt-4 grid gap-4 md:grid-cols-[300px_1fr]">
        <div className="flex justify-center">{diagramSvg}</div>
        <div className="grid content-start grid-cols-2 gap-2.5 sm:grid-cols-3">
          <PhysicsValue label={s.aliceAge} value={formatDuration(T, lang)} accent="cyan" />
          <PhysicsValue label={s.bobAge} value={formatDuration(tau, lang)} accent="amber" />
          <PhysicsValue label={s.ageDiff} value={formatDuration(ageDiff, lang)} accent="violet" />
          <PhysicsValue label={s.gamma} value={fmt(gamma, lang, 3)} accent="cyan" />
          <PhysicsValue label={s.velocity} value={fmtVelocity(v, lang)} accent="cyan" />
          <PhysicsValue label={s.earthTrip} value={formatDuration(T, lang)} accent="green" />
          <PhysicsValue label={s.shipTrip} value={formatDuration(tau, lang)} accent="green" />
        </div>
      </div>
      <p className="mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
        {s.timelapse}: 1 s ≈ {fmt(speed / YEAR, lang, 2)} {lang === "es" ? "años" : "years"}
      </p>
    </div>
  );

  const controls = (
    <>
      <PlayPauseControls
        playing={playing}
        onToggle={() => {
          if (simTime >= T) restart();
          setPlaying((p) => !p);
        }}
        onReset={() => {
          restart();
          setPlaying(false);
        }}
      />
      <PresetBar
        presets={PRESETS.map((p) => ({
          label: `${p.name[lang]} · ${fmt(p.ly, lang, 2)} ${lang === "es" ? "al" : "ly"}`,
          hint: `${p.name[lang]}`,
        }))}
        onPick={(i) => changeDist(PRESETS[i].ly)}
      />
      <ParamSlider
        label={s.distance}
        value={d2t(distLy)}
        min={0}
        max={100}
        step={0.5}
        onChange={(t) => changeDist(t2d(t))}
        format={(t) => fmtDistance(t2d(t) * LY, lang)}
        accent="amber"
      />
      <ParamSlider
        label={s.velocity}
        value={beta}
        min={0.1}
        max={0.999}
        step={0.001}
        onChange={changeBeta}
        format={(b) => `${b.toFixed(3)}c · ${(b * 100).toFixed(1)}% c`}
        accent="cyan"
      />
      <div className="inset p-3 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
        <span style={{ color: "var(--cyan)", fontWeight: 600 }}>γ = {fmt(gamma, lang, 3)}</span>
        {" · "}
        <IM tex="\tau = T/\gamma" />
      </div>
    </>
  );

  return (
    <SimulationShell
      simId="twin-paradox"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={visualization}
      controls={controls}
      whatYouSee={<p>{s.whatYouSee}</p>}
      physics={
        <div>
          <p className="mb-2 font-semibold" style={{ color: "var(--text)" }}>
            {s.physicsTitle}
          </p>
          <p>{s.physics}</p>
        </div>
      }
      equation={
        <>
          <EquationCard tex="\Delta\tau = \dfrac{\Delta t}{\gamma}" caption={s.eqPerLeg} />
          <div className="mt-3">
            <EquationCard tex="\tau_{\mathrm{Bob}} = \dfrac{2D}{\gamma\,v}" caption={s.eqRoundTrip} />
          </div>
        </>
      }
      mathEquation={
        <EquationCard
          tex="T = \dfrac{2D}{v}\quad\Longrightarrow\quad \tau_{\mathrm{Bob}} = \dfrac{T}{\gamma} = \dfrac{2D}{\gamma v},\qquad \gamma = \dfrac{1}{\sqrt{1-\beta^2}}"
          caption={s.eqDerivation}
        />
      }
      assumptions={[...s.assumptions]}
      tryThis={
        <TryThis prompt={s.tryPrompt} check={checkSolved}>
          <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
            {s.tryHint}
          </p>
        </TryThis>
      }
    />
  );
}

function starPoints(cx: number, cy: number, rOuter: number, rInner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
