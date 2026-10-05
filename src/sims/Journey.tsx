import { useEffect, useMemo, useState } from "react";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  IM,
  PlayPauseControls,
  SegmentedControl,
  PresetBar,
  TryThis,
  useG,
} from "../components/ui";
import { useSimClock, usePrefersReducedMotion } from "../hooks/useAnimation";
import { lorentzFactor, betaOf, dilatedTime } from "../physics/specialRelativity";
import { C, LY, YEAR } from "../physics/constants";
import { fmt, fmtVelocity, fmtDistance } from "../physics/units";
import { formatDuration } from "../physics/generalRelativity";

const MOON_DIST = 384_400_000; // m

type DestId = "moon" | "mars" | "jupiter" | "proxima" | "sirius" | "betelgeuse" | "galactic";

const DESTINATIONS: Array<{ id: DestId; dist: number }> = [
  { id: "moon", dist: MOON_DIST },
  { id: "mars", dist: 225e9 },
  { id: "jupiter", dist: 778.5e9 },
  { id: "proxima", dist: 4.246 * LY },
  { id: "sirius", dist: 8.6 * LY },
  { id: "betelgeuse", dist: 548 * LY },
  { id: "galactic", dist: 26000 * LY },
];

const STRINGS = {
  en: {
    title: "Relativistic Journey",
    subtitle:
      "Pick a destination, choose a cruise velocity, and watch two clocks — one on Earth, one aboard the ship — diverge as the trip unfolds.",
    concept: "Time dilation",
    destination: "Destination",
    velocity: "Cruise velocity",
    destName: {
      moon: "Moon",
      mars: "Mars",
      jupiter: "Jupiter",
      proxima: "Proxima Centauri",
      sirius: "Sirius",
      betelgeuse: "Betelgeuse",
      galactic: "Galactic Center",
    } as Record<DestId, string>,
    earthClock: "Earth clock",
    shipClock: "Ship clock",
    earthTime: "Travel time (Earth frame)",
    shipTime: "Travel time (astronaut)",
    gamma: "Lorentz factor γ",
    speed: "Cruise velocity",
    distance: "Distance",
    covered: "Distance covered",
    progress: "Journey progress",
    complete: "Journey complete",
    speedLabel: "Time-lapse speed",
    speedAuto: "Auto (~20 s trip)",
    moonLine: (t: string) => `At this speed, Earth → Moon takes ${t}.`,
    tryPrompt:
      "Challenge: travel to Proxima Centauri so the astronaut ages less than 1 year while Earth waits more than 4.2 years. Can you find such a velocity?",
    tryHint:
      "Hint: you'll need to push deep into the relativistic regime — far past 0.9c, very close to the speed of light.",
    whatYouSee: (
      <>
        <p>
          The bar shows the whole trip: Earth on the left, your destination on the
          right, and the ship gliding between them. Below it, two clocks count up —
          the <strong style={{ color: "var(--cyan)" }}>Earth clock</strong> and the{" "}
          <strong style={{ color: "var(--amber)" }}>ship clock</strong>.
        </p>
        <p className="mt-2">
          At everyday speeds the two clocks agree. Push the velocity toward{" "}
          <IM tex="c" /> and the astronaut's clock falls further and further behind
          Earth's — even though the ship still needs at least the light-travel time
          to get there.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          In Earth's frame the trip takes <IM tex="\Delta t = d/v" />. The astronaut
          measures their <em>proper time</em> <IM tex="\Delta\tau" />, which is
          shorter by the Lorentz factor:{" "}
          <IM tex="\Delta\tau = \Delta t / \gamma" />.
        </p>
        <p className="mt-2">
          Nothing can exceed <IM tex="c" />, so the Earth-frame time can never drop
          below <IM tex="d/c" /> — but the astronaut's experienced time can shrink
          toward zero as <IM tex="\gamma \to \infty" />.
        </p>
      </>
    ),
    assumptions: [
      "Constant cruise velocity: acceleration and deceleration are assumed instantaneous — an idealized model. A real trip would spend a long time accelerating and braking.",
      "Distances are measured in the Earth frame.",
      "Gravity, the interstellar medium, and cosmic expansion (relevant for very distant targets) are ignored.",
    ],
    equationCaption: "Earth-frame time and the astronaut's proper time",
    mathCaption: "The Lorentz factor, which controls the difference",
  },
  es: {
    title: "Viaje relativista",
    subtitle:
      "Elige un destino y una velocidad de crucero, y observa cómo dos relojes — uno en la Tierra, otro a bordo — divergen a lo largo del viaje.",
    concept: "Dilatación del tiempo",
    destination: "Destino",
    velocity: "Velocidad de crucero",
    destName: {
      moon: "Luna",
      mars: "Marte",
      jupiter: "Júpiter",
      proxima: "Próxima Centauri",
      sirius: "Sirio",
      betelgeuse: "Betelgeuse",
      galactic: "Centro galáctico",
    } as Record<DestId, string>,
    earthClock: "Reloj terrestre",
    shipClock: "Reloj de la nave",
    earthTime: "Duración del viaje (marco terrestre)",
    shipTime: "Duración del viaje (astronauta)",
    gamma: "Factor de Lorentz γ",
    speed: "Velocidad de crucero",
    distance: "Distancia",
    covered: "Distancia recorrida",
    progress: "Progreso del viaje",
    complete: "Viaje completado",
    speedLabel: "Velocidad de la animación",
    speedAuto: "Auto (viaje en ~20 s)",
    moonLine: (t: string) => `A esta velocidad, Tierra → Luna tarda ${t}.`,
    tryPrompt:
      "Reto: viaja a Próxima Centauri de forma que el astronauta envejezca menos de 1 año mientras la Tierra espera más de 4,2 años. ¿Puedes encontrar esa velocidad?",
    tryHint:
      "Pista: tendrás que adentrarte en el régimen relativista — muy por encima de 0,9c, muy cerca de la velocidad de la luz.",
    whatYouSee: (
      <>
        <p>
          La barra muestra el viaje completo: la Tierra a la izquierda, tu destino a
          la derecha y la nave avanzando entre ambos. Debajo, dos relojes cuentan el
          tiempo: el <strong style={{ color: "var(--cyan)" }}>reloj terrestre</strong>{" "}
          y el <strong style={{ color: "var(--amber)" }}>reloj de la nave</strong>.
        </p>
        <p className="mt-2">
          A velocidades cotidianas los dos relojes coinciden. Aumenta la velocidad
          hacia <IM tex="c" /> y el reloj del astronauta se queda cada vez más atrás
          — aunque la nave siga necesitando al menos el tiempo de viaje de la luz
          para llegar.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          En el marco terrestre el viaje dura <IM tex="\Delta t = d/v" />. El
          astronauta mide su <em>tiempo propio</em> <IM tex="\Delta\tau" />, más
          corto por el factor de Lorentz:{" "}
          <IM tex="\Delta\tau = \Delta t / \gamma" />.
        </p>
        <p className="mt-2">
          Nada puede superar <IM tex="c" />, así que el tiempo terrestre nunca baja
          de <IM tex="d/c" /> — pero el tiempo vivido por el astronauta puede
          tender a cero cuando <IM tex="\gamma \to \infty" />.
        </p>
      </>
    ),
    assumptions: [
      "Velocidad de crucero constante: la aceleración y el frenado se suponen instantáneos — un modelo idealizado. Un viaje real pasaría mucho tiempo acelerando y frenando.",
      "Las distancias se miden en el marco terrestre.",
      "Se ignoran la gravedad, el medio interestelar y la expansión cósmica (relevante para destinos muy lejanos).",
    ],
    equationCaption: "Tiempo terrestre y tiempo propio del astronauta",
    mathCaption: "El factor de Lorentz, que controla la diferencia",
  },
};

const BETA_MIN = 0.001;
const BETA_MAX = 0.999;
// Log mapping so low speeds get fine slider control:
// slider u ∈ [0,1] → β = 0.001 · 999^u
const uToBeta = (u: number) => BETA_MIN * Math.pow(BETA_MAX / BETA_MIN, u);
const betaToU = (b: number) => Math.log(b / BETA_MIN) / Math.log(BETA_MAX / BETA_MIN);

const PRESETS = [0.1, 0.5, 0.9, 0.99, 0.999];

export default function Journey() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [destId, setDestId] = useState<DestId>("proxima");
  const [u, setU] = useState(betaToU(0.5));
  const [playing, setPlaying] = useState(!reduced);
  const [warp, setWarp] = useState<"auto" | "1" | "60" | "3600">("auto");

  const dest = useMemo(
    () => DESTINATIONS.find((d) => d.id === destId) ?? DESTINATIONS[3],
    [destId],
  );
  const beta = Math.min(BETA_MAX, Math.max(BETA_MIN, uToBeta(u)));
  const v = beta * C;
  const T = dest.dist / v; // Earth-frame travel time, s
  const gamma = lorentzFactor(v);
  const tauTotal = T / gamma; // astronaut proper time, s

  const clockSpeed = warp === "auto" ? T / 20 : Number(warp);
  const { time: elapsed, reset } = useSimClock(playing, clockSpeed);

  // Reset the trip when destination or velocity changes
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destId, u]);

  const done = elapsed >= T;
  const earthTime = Math.min(elapsed, T);
  const shipTime = dilatedTime(earthTime, v); // Δt/γ
  const progress = T > 0 ? Math.min(1, earthTime / T) : 0;

  // Stop playing when the trip is complete
  useEffect(() => {
    if (done) setPlaying(false);
  }, [done]);

  const shipX = 70 + progress * 760;
  const tryCheck = () => destId === "proxima" && tauTotal < 1 * YEAR && T > 4.2 * YEAR;

  return (
    <SimulationShell
      simId="journey"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={1}
      concept={s.concept}
      visualization={
        <div className="p-4 md:p-6" style={{ background: "var(--bg-inset)" }}>
          {/* Journey bar */}
          <svg
            viewBox="0 0 900 170"
            className="w-full"
            role="img"
            aria-label={`${s.title}: ${s.progress}`}
          >
            {/* track */}
            <line x1={70} y1={70} x2={830} y2={70} stroke="var(--border)" strokeWidth={3} strokeLinecap="round" />
            {/* travelled portion */}
            <line x1={70} y1={70} x2={shipX} y2={70} stroke="var(--cyan)" strokeWidth={3} strokeLinecap="round" />
            {/* quarter ticks */}
            {[0.25, 0.5, 0.75].map((q) => (
              <line
                key={q}
                x1={70 + q * 760}
                y1={62}
                x2={70 + q * 760}
                y2={78}
                stroke="var(--text-faint)"
                strokeWidth={1.5}
              />
            ))}
            {/* Earth */}
            <circle cx={70} cy={70} r={26} fill="var(--cyan)" opacity={0.25} />
            <circle cx={70} cy={70} r={15} fill="var(--cyan)" />
            <text x={70} y={118} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--text)">
              {s.destName.moon === "Luna" ? "Tierra" : "Earth"}
            </text>
            {/* Destination */}
            <circle cx={830} cy={70} r={26} fill="var(--violet)" opacity={0.25} />
            <circle cx={830} cy={70} r={15} fill="var(--violet)" />
            <text x={830} y={118} textAnchor="middle" fontSize={15} fontWeight={700} fill="var(--text)">
              {s.destName[destId]}
            </text>
            <text x={830} y={138} textAnchor="middle" fontSize={12} fill="var(--text-dim)">
              {fmtDistance(dest.dist, lang)}
            </text>
            {/* Ship marker */}
            <g>
              <path
                d={`M ${shipX} 52 L ${shipX + 22} 70 L ${shipX} 88 L ${shipX + 7} 70 Z`}
                fill="var(--amber)"
                stroke="var(--bg-inset)"
                strokeWidth={2}
              />
              {done && (
                <circle cx={shipX} cy={70} r={8} fill="none" stroke="var(--green)" strokeWidth={2.5} />
              )}
            </g>
            {/* distance covered label */}
            <text x={450} y={40} textAnchor="middle" fontSize={13} fill="var(--text-dim)">
              {fmtDistance(progress * dest.dist, lang)} · {(progress * 100).toFixed(1)}%
            </text>
          </svg>

          {/* Dual clocks */}
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="panel p-4 text-center" style={{ borderTop: "3px solid var(--cyan)" }}>
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--cyan)" }}>
                {s.earthClock}
              </div>
              <div className="font-mono2 text-3xl font-bold md:text-4xl" style={{ color: "var(--cyan)" }} aria-live="polite">
                {formatDuration(earthTime, lang)}
              </div>
            </div>
            <div className="panel p-4 text-center" style={{ borderTop: "3px solid var(--amber)" }}>
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--amber)" }}>
                {s.shipClock}
              </div>
              <div className="font-mono2 text-3xl font-bold md:text-4xl" style={{ color: "var(--amber)" }} aria-live="polite">
                {formatDuration(shipTime, lang)}
              </div>
            </div>
          </div>

          {done && (
            <p className="mt-3 text-center text-sm font-semibold" style={{ color: "var(--green)" }} role="status">
              ✓ {s.complete}
            </p>
          )}

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
        </div>
      }
      controls={
        <>
          <SegmentedControl<DestId>
            label={s.destination}
            value={destId}
            onChange={setDestId}
            options={DESTINATIONS.map((d) => ({ value: d.id, label: s.destName[d.id] }))}
          />
          <ParamSlider
            label={s.velocity}
            value={u}
            min={0}
            max={1}
            step={0.001}
            onChange={setU}
            format={() => `${fmtVelocity(v, lang)} (${(betaOf(v) * 100).toFixed(beta < 0.1 ? 1 : 1)}% c)`}
          />
          <PresetBar
            presets={PRESETS.map((b) => ({ label: `${b}c` }))}
            onPick={(i) => setU(betaToU(PRESETS[i]))}
          />
          <SegmentedControl<string>
            label={s.speedLabel}
            value={warp}
            onChange={(w) => setWarp(w as typeof warp)}
            options={[
              { value: "auto", label: s.speedAuto },
              { value: "1", label: "1×" },
              { value: "60", label: "60×" },
              { value: "3600", label: "3600×" },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.earthTime} value={formatDuration(T, lang)} accent="cyan" />
            <PhysicsValue label={s.shipTime} value={formatDuration(tauTotal, lang)} accent="amber" />
            <PhysicsValue label={s.gamma} value={fmt(gamma, lang)} accent="violet" />
            <PhysicsValue label={s.distance} value={fmtDistance(dest.dist, lang)} accent="green" />
          </div>
          <p className="text-sm italic" style={{ color: "var(--text-dim)" }}>
            🚀 {s.moonLine(formatDuration(MOON_DIST / v, lang))}
          </p>
        </>
      }
      whatYouSee={s.whatYouSee}
      physics={s.physics}
      equation={
        <EquationCard
          tex={`\\Delta t = \\frac{d}{v} \\qquad \\Delta\\tau = \\frac{\\Delta t}{\\gamma}`}
          caption={s.equationCaption}
        />
      }
      mathEquation={
        <EquationCard tex={`\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}`} caption={s.mathCaption} />
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
