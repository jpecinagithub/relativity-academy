import { useMemo, useRef, useState } from "react";
import {
  Rocket,
  Globe,
  Eye,
  EyeOff,
  ArrowDownToLine,
  Zap,
  Scale as ScaleIcon,
} from "lucide-react";
import {
  SimulationShell,
  PhysicsValue,
  EquationCard,
  IM,
  PlayPauseControls,
  SegmentedControl,
  TryThis,
  KeyIdea,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";
import { G, M_EARTH, R_EARTH } from "../physics/constants";

// ─── Physics ─────────────────────────────────────────────────────────────────
// Both scenarios use the same magnitude of acceleration: the whole point.
const A = 9.8; // m/s² — rocket thrust and (rounded) surface gravity
const BALL_H = 2; // m — ball release height above the floor
const T_FALL = Math.sqrt((2 * BALL_H) / A); // ≈ 0.64 s
const PERSON_M = 70; // kg
const SCALE_N = PERSON_M * A; // 686 N
const gSurf = (G * M_EARTH) / (R_EARTH * R_EARTH); // ≈ 9.82 m/s²

// Animation timing (slow-motion dramatizations)
const DUR = { ball: 1.5, beam: 1.8, scale: 1.2 } as const;
type ExpKind = keyof typeof DUR;
type Mode = "rocket" | "earth";

const STRINGS = {
  en: {
    title: "Einstein's Elevator",
    subtitle:
      "A sealed cabin, three experiments, two possible worlds. Can you tell whether you're accelerating through deep space or standing still on Earth?",
    concept: "Equivalence principle",
    modeLabel: "Scenario",
    modeRocket: "Rocket · deep space",
    modeEarth: "Earth · surface",
    viewLabel: "Cabin window",
    viewInside: "Inside (sealed)",
    viewOutside: "Outside (revealed)",
    expLabel: "Run an experiment",
    expBall: "Drop a ball",
    expBeam: "Fire a light beam",
    expScale: "Step on the scale",
    beamTrace: "Trace beam in the cabin frame",
    beamTraceHint:
      "ON: what the passenger inside the cabin sees (the beam appears to bend). OFF: the outside inertial view (the beam travels straight).",
    roMode: "Scenario",
    roAccel: "Acceleration",
    roScale: "Scale reading",
    roFall: "Ball fall time (2 m)",
    measured: "measured",
    theory: "theory",
    sealed: "Window sealed — the passenger sees only the cabin interior.",
    rocketOut: "Outside: deep space. The engine fires, accelerating the cabin upward at 9.8 m/s².",
    earthOut: "Outside: Earth. The cabin rests on the ground in a gravitational field of 9.8 m/s².",
    photon: "photon",
    ballTimer: "fall timer",
    tryPrompt:
      "With the window SEALED (Inside view), run all three experiments in both scenarios. Can you find any single measurement that tells the two worlds apart?",
    tryProgress: (done: number, total: number) =>
      `${done} of ${total} sealed experiments complete — switch scenarios and keep going.`,
    trySolved:
      "You can't — that's the point. Locally, gravity and acceleration are indistinguishable. This is the equivalence principle.",
    whatYouSee: (
      <>
        <p>
          A small elevator cabin with a passenger, a ball held near the ceiling, a
          light-beam emitter on the left wall and a weighing scale on the floor.
          The cabin window can be <strong>sealed</strong> (Inside view) or{" "}
          <strong>revealed</strong> (Outside view).
        </p>
        <p className="mt-2">
          In the <strong style={{ color: "var(--amber)" }}>Rocket</strong> scenario the
          cabin accelerates upward through deep space at 9.8 m/s² — watch the stars
          stream past. In the <strong style={{ color: "var(--cyan)" }}>Earth</strong>{" "}
          scenario the cabin simply stands on the ground. The light beam is shown in
          extreme slow motion and its bending is exaggerated so the effect is
          visible — in reality the deflection across a 2 m cabin is about 10⁻¹⁶ m.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          In 1907 Einstein called it his <em>“happiest thought”</em>: a person in
          free fall feels no gravity, and a person in a sealed, accelerating cabin
          feels exactly as if standing in a gravitational field. No experiment
          performed <em>inside</em> the cabin can distinguish uniform acceleration
          from uniform gravity.
        </p>
        <p className="mt-2">
          The deep reason is that inertial mass (resistance to acceleration) and
          gravitational mass (response to gravity) are the same thing — verified
          experimentally to 1 part in 10¹⁵. If gravity is locally equivalent to
          acceleration, and acceleration is motion through spacetime, then gravity
          itself must be a property of <strong>spacetime</strong>: curvature.
        </p>
        <p className="mt-2">
          Surface gravity from Newton's law:{" "}
          <IM tex="g = \tfrac{GM_\oplus}{R_\oplus^2} \approx 9.8\ \mathrm{m/s^2}" />.
        </p>
      </>
    ),
    keyIdea:
      "Einstein's happiest thought — gravity ≡ acceleration, locally. A sealed cabin accelerating at 9.8 m/s² through empty space is physically indistinguishable from one standing on Earth. If gravity behaves exactly like acceleration, it cannot be an ordinary force: it must be the geometry of spacetime itself. That single insight became General Relativity.",
    equationCaption:
      "The weak equivalence principle: inertial mass equals gravitational mass.",
    mathCaption:
      "Free fall from rest: distance, time and acceleration — identical in both scenarios.",
    assumptions: [
      "Uniform field: the cabin is small, so tidal effects (the field changing across the cabin) are negligible.",
      "The cabin is perfectly sealed — no light, sound, vibration or window leaks information about the outside.",
      "Speeds stay far below c and the rocket thrust is perfectly steady; relativistic and thrust-noise effects are ignored.",
      "The light-beam bending is a dramatized slow-motion analogy. A real photon crosses the 2 m cabin in ~7 ns and deflects by ~10⁻¹⁶ m — utterly invisible.",
    ],
  },
  es: {
    title: "El ascensor de Einstein",
    subtitle:
      "Una cabina sellada, tres experimentos, dos mundos posibles. ¿Puedes distinguir si aceleras por el espacio profundo o estás quieto sobre la Tierra?",
    concept: "Principio de equivalencia",
    modeLabel: "Escenario",
    modeRocket: "Cohete · espacio profundo",
    modeEarth: "Tierra · superficie",
    viewLabel: "Ventana de la cabina",
    viewInside: "Dentro (sellada)",
    viewOutside: "Fuera (revelada)",
    expLabel: "Realiza un experimento",
    expBall: "Soltar una bola",
    expBeam: "Disparar un rayo de luz",
    expScale: "Subirse a la báscula",
    beamTrace: "Trazar el rayo en el marco de la cabina",
    beamTraceHint:
      "ACTIVADO: lo que ve el pasajero dentro de la cabina (el rayo parece curvarse). DESACTIVADO: la vista inercial exterior (el rayo viaja recto).",
    roMode: "Escenario",
    roAccel: "Aceleración",
    roScale: "Lectura de la báscula",
    roFall: "Tiempo de caída (2 m)",
    measured: "medido",
    theory: "teoría",
    sealed: "Ventana sellada: el pasajero solo ve el interior de la cabina.",
    rocketOut: "Exterior: espacio profundo. El motor empuja y la cabina acelera hacia arriba a 9,8 m/s².",
    earthOut: "Exterior: la Tierra. La cabina reposa en el suelo en un campo gravitatorio de 9,8 m/s².",
    photon: "fotón",
    ballTimer: "cronómetro",
    tryPrompt:
      "Con la ventana SELLADA (vista interior), realiza los tres experimentos en ambos escenarios. ¿Puedes encontrar alguna medida que distinga los dos mundos?",
    tryProgress: (done: number, total: number) =>
      `${done} de ${total} experimentos sellados completos: cambia de escenario y continúa.`,
    trySolved:
      "No puedes: ese es el punto. Localmente, la gravedad y la aceleración son indistinguibles. Este es el principio de equivalencia.",
    whatYouSee: (
      <>
        <p>
          Una pequeña cabina de ascensor con un pasajero, una bola sujeta cerca del
          techo, un emisor de rayos de luz en la pared izquierda y una báscula en
          el suelo. La ventana de la cabina puede estar <strong>sellada</strong> (vista
          interior) o <strong>revelada</strong> (vista exterior).
        </p>
        <p className="mt-2">
          En el escenario del <strong style={{ color: "var(--amber)" }}>cohete</strong> la
          cabina acelera hacia arriba por el espacio profundo a 9,8 m/s² — observa
          cómo las estrellas pasan. En el escenario de la{" "}
          <strong style={{ color: "var(--cyan)" }}>Tierra</strong> la cabina simplemente
          está sobre el suelo. El rayo de luz se muestra a cámara superlenta y su
          curvatura está exagerada para hacerla visible: en realidad, la desviación
          en una cabina de 2 m es de unos 10⁻¹⁶ m.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          En 1907 Einstein lo llamó su <em>«pensamiento más feliz»</em>: una persona
          en caída libre no siente la gravedad, y una persona en una cabina sellada
          que acelera siente exactamente lo mismo que de pie en un campo
          gravitatorio. Ningún experimento realizado <em>dentro</em> de la cabina
          puede distinguir la aceleración uniforme de la gravedad uniforme.
        </p>
        <p className="mt-2">
          La razón profunda es que la masa inercial (resistencia a la aceleración)
          y la masa gravitatoria (respuesta a la gravedad) son la misma cosa,
          verificado experimentalmente hasta 1 parte en 10¹⁵. Si la gravedad es
          localmente equivalente a la aceleración, y la aceleración es movimiento
          por el espaciotiempo, entonces la gravedad debe ser una propiedad del{" "}
          <strong>espaciotiempo</strong>: la curvatura.
        </p>
        <p className="mt-2">
          Gravedad superficial según la ley de Newton:{" "}
          <IM tex="g = \tfrac{GM_\oplus}{R_\oplus^2} \approx 9{,}8\ \mathrm{m/s^2}" />.
        </p>
      </>
    ),
    keyIdea:
      "El «pensamiento más feliz» de Einstein: gravedad ≡ aceleración, localmente. Una cabina sellada que acelera a 9,8 m/s² por el espacio vacío es físicamente indistinguible de una que está sobre la Tierra. Si la gravedad se comporta exactamente como la aceleración, no puede ser una fuerza ordinaria: tiene que ser la geometría del propio espaciotiempo. Esa única idea se convirtió en la Relatividad General.",
    equationCaption:
      "El principio de equivalencia débil: la masa inercial es igual a la masa gravitatoria.",
    mathCaption:
      "Caída libre desde el reposo: distancia, tiempo y aceleración — idénticos en ambos escenarios.",
    assumptions: [
      "Campo uniforme: la cabina es pequeña, así que los efectos de marea (variación del campo en la cabina) son despreciables.",
      "La cabina está perfectamente sellada: ni la luz, ni el sonido, ni las vibraciones ni la ventana filtran información del exterior.",
      "Las velocidades están muy por debajo de c y el empuje del cohete es perfectamente constante; se ignoran efectos relativistas y ruido del motor.",
      "La curvatura del rayo de luz es una analogía dramatizada a cámara lenta. Un fotón real cruza la cabina de 2 m en ~7 ns y se desvía ~10⁻¹⁶ m: totalmente invisible.",
    ],
  },
} as const;

type Lang = keyof typeof STRINGS;

// ─── Deterministic star field ─────────────────────────────────────────────────
function makeStars(n: number, w: number, h: number) {
  let seed = 42;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: n }, () => ({
    x: rnd() * w,
    y: rnd() * h,
    r: 0.6 + rnd() * 1.6,
    o: 0.35 + rnd() * 0.65,
  }));
}

const W = 640;
const H = 440;
// Cabin frame opening (the "window" is the open interior between walls)
const CAB = { x: 220, y: 80, w: 200, h: 280 };
const FLOOR_Y = CAB.y + CAB.h; // 360
const BALL_X = 372;
const BALL_HOLD_Y = 140;
const PX_PER_M = (FLOOR_Y - 24 - BALL_HOLD_Y) / BALL_H; // ≈110 px/m
const EMIT = { x: CAB.x + 14, y: 196 };
const BEAM_R = CAB.x + CAB.w - 14;
const BEAM_DROP = 46; // px of apparent drop over the crossing (dramatized)

export default function Elevator() {
  const { lang } = useG();
  const s = STRINGS[lang as Lang];
  const reduced = usePrefersReducedMotion();

  const [mode, setMode] = useState<Mode>("rocket");
  const [inside, setInside] = useState(true); // true = window sealed
  const [playing, setPlaying] = useState(!reduced);
  const [traceCabin, setTraceCabin] = useState(true);
  const [exp, setExp] = useState<{ kind: ExpKind; t: number } | null>(null);
  const [ballT, setBallT] = useState<number | null>(null);
  const [scaleVal, setScaleVal] = useState<number | null>(null);
  const [beamDone, setBeamDone] = useState(false);
  const [starOff, setStarOff] = useState(0);
  const [runs, setRuns] = useState<Record<Mode, ExpKind[]>>({ rocket: [], earth: [] });

  const expRef = useRef(exp);
  expRef.current = exp;
  const starOffRef = useRef(starOff);
  starOffRef.current = starOff;

  const stars = useMemo(() => makeStars(90, W, H), []);
  const expRunning = exp !== null && exp.t < DUR[exp.kind];

  // Experiment animation clock
  useRaf(
    (dt) => {
      const e = expRef.current;
      if (!e) return;
      const dur = DUR[e.kind];
      const nt = e.t + dt;
      if (nt >= dur) {
        if (e.kind === "ball") setBallT(T_FALL);
        if (e.kind === "scale") setScaleVal(SCALE_N);
        if (e.kind === "beam") setBeamDone(true);
        setExp({ kind: e.kind, t: dur });
      } else {
        setExp({ kind: e.kind, t: nt });
      }
    },
    expRunning,
  );

  // Ambient motion: stars stream past the accelerating rocket
  useRaf(
    (dt) => setStarOff((o) => (o + dt * 70) % H),
    playing && mode === "rocket",
  );

  const trigger = (kind: ExpKind) => {
    setExp({ kind, t: 0 });
    if (kind === "ball") setBallT(null);
    if (kind === "scale") setScaleVal(null);
    if (kind === "beam") setBeamDone(false);
    if (inside) {
      setRuns((r) => ({
        ...r,
        [mode]: r[mode].includes(kind) ? r[mode] : [...r[mode], kind],
      }));
    }
  };

  const reset = () => {
    setExp(null);
    setBallT(null);
    setScaleVal(null);
    setBeamDone(false);
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    reset();
  };
  const changeView = (v: "in" | "out") => {
    setInside(v === "in");
    reset();
  };

  const doneCount = runs.rocket.length + runs.earth.length;
  const solved = runs.rocket.length === 3 && runs.earth.length === 3;

  // ── Derived render values ────────────────────────────────────────────────
  const p = exp ? Math.min(exp.t / DUR[exp.kind], 1) : 0;

  // Ball
  const ballTp = exp?.kind === "ball" ? p * T_FALL : null;
  const ballY =
    ballTp !== null
      ? BALL_HOLD_Y + 0.5 * A * ballTp * ballTp * PX_PER_M
      : ballT !== null
        ? FLOOR_Y - 24
        : BALL_HOLD_Y;
  const ballOnFloor = ballT !== null && exp?.kind !== "ball";

  // Beam
  const beamP = exp?.kind === "beam" ? p : beamDone ? 1 : 0;
  const beamActive = exp?.kind === "beam" || beamDone;
  const beamDrop = BEAM_DROP * beamP * beamP;
  const photonX = EMIT.x + (BEAM_R - EMIT.x) * beamP;
  // Cabin rises in the outside inertial view while the photon crosses (rocket)
  const cabinLift =
    !inside && !traceCabin && mode === "rocket" && exp?.kind === "beam"
      ? BEAM_DROP * p * p
      : 0;
  const cabinY = -cabinLift;
  const cabinTrace = inside || traceCabin; // draw curved apparent path
  const photonY = cabinTrace ? EMIT.y + beamDrop : EMIT.y;
  // Precomputed curved trail path (parabola in cabin frame)
  const trailPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 24; i++) {
      const q = i / 24;
      pts.push(`${i === 0 ? "M" : "L"}${(EMIT.x + (BEAM_R - EMIT.x) * q).toFixed(1)},${(EMIT.y + BEAM_DROP * q * q).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  // Scale
  const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
  const scaleShown =
    exp?.kind === "scale" ? SCALE_N * easeOut(p) : scaleVal;

  const starY = (y: number) => ((y + starOff) % H + H) % H;
  const accelLabel = mode === "rocket" ? "9.8" : gSurf.toFixed(1);

  // ── Scene ────────────────────────────────────────────────────────────────
  const visualization = (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={s.title}
      >
        <defs>
          <linearGradient id="cabinWall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a4152" />
            <stop offset="0.5" stopColor="#525b73" />
            <stop offset="1" stopColor="#3a4152" />
          </linearGradient>
          <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b2a4a" />
            <stop offset="1" stopColor="#2c4a6e" />
          </linearGradient>
          <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill="#2b3040" />
            <line x1="0" y1="0" x2="0" y2="10" stroke="#454c63" strokeWidth="3" />
          </pattern>
          <radialGradient id="photonGlow">
            <stop offset="0" stopColor="#ffe9a8" stopOpacity="1" />
            <stop offset="0.4" stopColor="#ffc94d" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffc94d" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Outside world ── */}
        {mode === "rocket" ? (
          <g>
            <rect x="0" y="0" width={W} height={H} fill="#05070f" />
            {stars.map((st, i) => (
              <circle
                key={i}
                cx={st.x}
                cy={starY(st.y)}
                r={st.r}
                fill="#dfe8ff"
                opacity={st.o}
              />
            ))}
            {/* distant planet for parallax flavor */}
            <circle cx="560" cy={starY(70)} r="26" fill="#1d2b52" opacity="0.9" />
            <circle cx="552" cy={starY(62)} r="26" fill="#05070f" opacity="0.55" />
          </g>
        ) : (
          <g>
            <rect x="0" y="0" width={W} height={H} fill="url(#skyDay)" />
            <circle cx="90" cy="70" r="24" fill="#f5e6b8" opacity="0.9" />
            {/* distant buildings */}
            <g fill="#16233c" opacity="0.85">
              <rect x="30" y="250" width="70" height="110" />
              <rect x="470" y="230" width="90" height="130" />
              <rect x="575" y="270" width="55" height="90" />
            </g>
            <g fill="#f5e6b8" opacity="0.5">
              {Array.from({ length: 12 }, (_, i) => (
                <rect
                  key={i}
                  x={38 + (i % 4) * 16}
                  y={262 + Math.floor(i / 4) * 26}
                  width="8"
                  height="10"
                />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <rect
                  key={i + 12}
                  x={480 + (i % 4) * 20}
                  y={244 + Math.floor(i / 4) * 28}
                  width="9"
                  height="11"
                />
              ))}
            </g>
            {/* ground */}
            <rect x="0" y={FLOOR_Y} width={W} height={H - FLOOR_Y} fill="#23301f" />
            <rect x="0" y={FLOOR_Y} width={W} height="6" fill="#31452c" />
          </g>
        )}

        {/* ── Acceleration / gravity arrows (outside view only) ── */}
        {!inside && mode === "rocket" && (
          <g>
            <line x1="150" y1="330" x2="150" y2="180" stroke="var(--amber)" strokeWidth="7" strokeLinecap="round" />
            <polygon points="150,162 132,196 168,196" fill="var(--amber)" />
            <text x="150" y="352" textAnchor="middle" fill="var(--amber)" fontSize="15" fontWeight="700">
              a = 9.8 m/s²
            </text>
          </g>
        )}
        {!inside && mode === "earth" && (
          <g>
            <line x1="490" y1="180" x2="490" y2="330" stroke="var(--cyan)" strokeWidth="7" strokeLinecap="round" />
            <polygon points="490,348 472,314 508,314" fill="var(--cyan)" />
            <text x="490" y="372" textAnchor="middle" fill="var(--cyan)" fontSize="15" fontWeight="700">
              g = 9.8 m/s²
            </text>
          </g>
        )}

        {/* ── Engine flame (rocket, playing) ── */}
        {mode === "rocket" && playing && (
          <g transform={`translate(0 ${cabinY})`}>
            <polygon
              points={`292,${FLOOR_Y + 4} 348,${FLOOR_Y + 4} 320,${FLOOR_Y + 34 + 10 * Math.abs(Math.sin(starOff / 6))}`}
              fill="var(--amber)"
              opacity="0.85"
            />
            <polygon
              points={`306,${FLOOR_Y + 4} 334,${FLOOR_Y + 4} 320,${FLOOR_Y + 22 + 6 * Math.abs(Math.sin(starOff / 4))}`}
              fill="#ffe9a8"
              opacity="0.9"
            />
          </g>
        )}

        {/* ── Cabin ── */}
        <g transform={`translate(0 ${cabinY})`}>
          {/* walls, ceiling, floor (open interior = the window) */}
          <rect x={CAB.x} y={CAB.y} width={CAB.w} height={22} fill="url(#cabinWall)" stroke="#1c2130" />
          <rect x={CAB.x} y={CAB.y} width={20} height={CAB.h} fill="url(#cabinWall)" stroke="#1c2130" />
          <rect x={CAB.x + CAB.w - 20} y={CAB.y} width={20} height={CAB.h} fill="url(#cabinWall)" stroke="#1c2130" />
          <rect x={CAB.x} y={FLOOR_Y - 20} width={CAB.w} height={20} fill="#2b3040" stroke="#1c2130" />
          {/* rivets */}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} fill="#7b8499">
              <circle cx={CAB.x + 10} cy={CAB.y + 60 + i * 40} r="3" />
              <circle cx={CAB.x + CAB.w - 10} cy={CAB.y + 60 + i * 40} r="3" />
            </g>
          ))}

          {/* shutter when sealed */}
          {inside && (
            <g>
              <rect
                x={CAB.x + 20}
                y={CAB.y + 22}
                width={CAB.w - 40}
                height={CAB.h - 42}
                fill="url(#hatch)"
                stroke="#1c2130"
                strokeWidth="2"
              />
              <rect
                x={CAB.x + 20}
                y={CAB.y + 22}
                width={CAB.w - 40}
                height={CAB.h - 42}
                fill="#05070f"
                opacity="0.45"
              />
            </g>
          )}

          {/* interior elements drawn above shutter so they stay visible */}
          {/* beam trail (behind photon) */}
          {beamActive && cabinTrace && (
            <path
              d={trailPath}
              fill="none"
              stroke="var(--amber)"
              strokeWidth={beamP > 0 && beamP < 1 ? 3 : 2}
              strokeDasharray={beamDone ? "none" : "7 5"}
              opacity={beamDone ? 0.55 : 0.95}
            />
          )}
          {beamActive && !cabinTrace && beamP > 0 && (
            <line
              x1={EMIT.x}
              y1={EMIT.y}
              x2={photonX}
              y2={EMIT.y}
              stroke="var(--amber)"
              strokeWidth="3"
              strokeDasharray={beamDone ? "none" : "7 5"}
              opacity={beamDone ? 0.55 : 0.95}
            />
          )}

          {/* emitter */}
          <g>
            <rect x={EMIT.x - 16} y={EMIT.y - 12} width="18" height="24" rx="4" fill="#454c63" stroke="#1c2130" />
            <circle cx={EMIT.x + 2} cy={EMIT.y} r="4" fill="var(--amber)" />
          </g>

          {/* photon */}
          {beamActive && (
            <g>
              <circle cx={photonX} cy={photonY} r="13" fill="url(#photonGlow)" />
              <circle cx={photonX} cy={photonY} r="5" fill="#fff3c4" />
              <text
                x={photonX}
                y={photonY - 20}
                textAnchor="middle"
                fill="var(--amber)"
                fontSize="12"
                fontWeight="600"
              >
                {s.photon}
              </text>
            </g>
          )}
          {/* impact flash where beam hits the right wall */}
          {beamDone && (
            <circle
              cx={BEAM_R}
              cy={cabinTrace ? EMIT.y + BEAM_DROP : EMIT.y}
              r="7"
              fill="var(--amber)"
              opacity="0.8"
            />
          )}

          {/* ball + string */}
          {!ballOnFloor && (
            <line
              x1={BALL_X}
              y1={CAB.y + 22}
              x2={BALL_X}
              y2={ballY - 9}
              stroke="#7b8499"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
          )}
          <circle cx={BALL_X} cy={ballY} r="9" fill="var(--violet)" stroke="#241d3d" strokeWidth="2" />
          {/* fall timer */}
          {(exp?.kind === "ball" || ballT !== null) && (
            <g>
              <rect x={BALL_X + 16} y={ballY - 34} width="86" height="26" rx="6" fill="#05070f" opacity="0.85" stroke="#454c63" />
              <text
                x={BALL_X + 59}
                y={ballY - 16}
                textAnchor="middle"
                fill="var(--cyan)"
                fontSize="14"
                fontFamily="monospace"
                fontWeight="700"
              >
                {(ballTp ?? ballT ?? 0).toFixed(2)} s
              </text>
            </g>
          )}

          {/* person on scale */}
          <g>
            {/* scale platform */}
            <rect x="252" y={FLOOR_Y - 30} width="76" height="10" rx="3" fill="#454c63" stroke="#1c2130" />
            {/* digital readout */}
            <rect x="252" y={FLOOR_Y - 66} width="76" height="30" rx="5" fill="#05070f" stroke="#454c63" />
            <text
              x="290"
              y={FLOOR_Y - 46}
              textAnchor="middle"
              fill={scaleShown !== null && scaleShown !== undefined ? "var(--green)" : "#5a6378"}
              fontSize="14"
              fontFamily="monospace"
              fontWeight="700"
            >
              {scaleShown !== null && scaleShown !== undefined ? `${Math.round(scaleShown)} N` : "— N"}
            </text>
            {/* person */}
            <circle cx="290" cy={FLOOR_Y - 108} r="13" fill="#d9a066" />
            <rect x="277" y={FLOOR_Y - 95} width="26" height="52" rx="10" fill="#3f6d9e" />
            <line x1="283" y1={FLOOR_Y - 43} x2="283" y2={FLOOR_Y - 30} stroke="#d9a066" strokeWidth="7" strokeLinecap="round" />
            <line x1="297" y1={FLOOR_Y - 43} x2="297" y2={FLOOR_Y - 30} stroke="#d9a066" strokeWidth="7" strokeLinecap="round" />
            <line x1="277" y1={FLOOR_Y - 82} x2="264" y2={FLOOR_Y - 60} stroke="#d9a066" strokeWidth="6" strokeLinecap="round" />
            <line x1="303" y1={FLOOR_Y - 82} x2="316" y2={FLOOR_Y - 60} stroke="#d9a066" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* ceiling hook label */}
          <text
            x={CAB.x + CAB.w / 2}
            y={CAB.y + 16}
            textAnchor="middle"
            fill="#9aa3b8"
            fontSize="11"
            letterSpacing="2"
          >
            {inside ? "▓▓ SEALED ▓▓" : "ELEVATOR-1"}
          </text>
        </g>

        {/* caption */}
        <text
          x={W / 2}
          y={H - 10}
          textAnchor="middle"
          fill="var(--text-faint)"
          fontSize="13"
        >
          {inside ? s.sealed : mode === "rocket" ? s.rocketOut : s.earthOut}
        </text>
      </svg>
    </div>
  );

  // ── Controls ─────────────────────────────────────────────────────────────
  const controls = (
    <div className="space-y-5">
      <SegmentedControl<Mode>
        label={s.modeLabel}
        value={mode}
        onChange={changeMode}
        options={[
          { value: "rocket", label: s.modeRocket, icon: <Rocket size={15} /> },
          { value: "earth", label: s.modeEarth, icon: <Globe size={15} /> },
        ]}
      />
      <SegmentedControl<"in" | "out">
        label={s.viewLabel}
        value={inside ? "in" : "out"}
        onChange={changeView}
        options={[
          { value: "in", label: s.viewInside, icon: <EyeOff size={15} /> },
          { value: "out", label: s.viewOutside, icon: <Eye size={15} /> },
        ]}
      />
      <div>
        <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
          {s.expLabel}
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              { kind: "ball", label: s.expBall, icon: <ArrowDownToLine size={14} /> },
              { kind: "beam", label: s.expBeam, icon: <Zap size={14} /> },
              { kind: "scale", label: s.expScale, icon: <ScaleIcon size={14} /> },
            ] as Array<{ kind: ExpKind; label: string; icon: React.ReactNode }>
          ).map((b) => (
            <button
              key={b.kind}
              onClick={() => trigger(b.kind)}
              className="btn-primary !px-3 !py-2 text-sm"
              aria-pressed={exp?.kind === b.kind && exp.t < DUR[b.kind]}
            >
              {b.icon} {b.label}
            </button>
          ))}
        </div>
        <label
          className="mt-3 flex cursor-pointer items-start gap-2 text-sm"
          style={{ color: "var(--text-dim)" }}
          title={s.beamTraceHint}
        >
          <input
            type="checkbox"
            checked={traceCabin}
            onChange={(e) => setTraceCabin(e.target.checked)}
            className="mt-1 accent-[var(--cyan)]"
          />
          <span>{s.beamTrace}</span>
        </label>
      </div>
      <PlayPauseControls
        playing={playing}
        onToggle={() => setPlaying((pl) => !pl)}
        onReset={reset}
      />
      <div className="grid grid-cols-2 gap-2">
        <PhysicsValue
          label={s.roMode}
          value={mode === "rocket" ? s.modeRocket.split(" ·")[0] : s.modeEarth.split(" ·")[0]}
          accent="amber"
        />
        <PhysicsValue label={s.roAccel} value={accelLabel} unit="m/s²" accent="cyan" />
        <PhysicsValue
          label={s.roScale}
          value={scaleVal !== null ? String(Math.round(scaleVal)) : "—"}
          unit="N"
          accent="green"
          title={`${PERSON_M} kg × ${A} m/s²`}
        />
        <PhysicsValue
          label={`${s.roFall} · ${s.theory}`}
          value={T_FALL.toFixed(2)}
          unit="s"
          accent="violet"
          title={`t = √(2h/a), h = ${BALL_H} m`}
        />
      </div>
      {inside && (
        <p className="text-xs" style={{ color: "var(--text-faint)" }} role="status">
          {s.tryProgress(doneCount, 6)}
        </p>
      )}
    </div>
  );

  return (
    <SimulationShell
      simId="elevator"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={1}
      concept={s.concept}
      visualization={visualization}
      controls={controls}
      whatYouSee={s.whatYouSee}
      physics={
        <>
          {s.physics}
          <KeyIdea>{s.keyIdea}</KeyIdea>
        </>
      }
      equation={<EquationCard tex="m_{\text{inertial}}\,a = m_{\text{gravitational}}\,g" caption={s.equationCaption} />}
      mathEquation={
        <EquationCard
          tex={`h = \\tfrac{1}{2}at^2 \\;\\Rightarrow\\; t = \\sqrt{\\tfrac{2h}{a}} = \\sqrt{\\tfrac{2\\cdot ${BALL_H}}{${A}}} \\approx ${T_FALL.toFixed(2)}\\ \\mathrm{s}`}
          caption={s.mathCaption}
        />
      }
      assumptions={[...s.assumptions]}
      tryThis={
        <>
          <TryThis prompt={s.tryPrompt} check={() => solved} />
          {solved && (
            <p
              className="panel mt-2 border p-4 text-sm font-medium"
              style={{ borderColor: "var(--green)", color: "var(--green)" }}
              role="status"
            >
              {s.trySolved}
            </p>
          )}
        </>
      }
    />
  );
}
