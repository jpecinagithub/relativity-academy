import { useMemo, useState } from "react";
import {
  SimulationShell,
  PhysicsValue,
  SegmentedControl,
  PlayPauseControls,
  TryThis,
  EquationCard,
  KeyIdea,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";
import {
  satelliteClockRate,
  gravitationalTimeFactor,
  formatDuration,
} from "../physics/generalRelativity";
import { M_EARTH, R_EARTH, DAY, C } from "../physics/constants";
import { fmt, fmtVelocity, fmtDistance } from "../physics/units";

const STRINGS = {
  en: {
    title: "GPS Relativity Lab",
    subtitle:
      "Six GPS satellites orbit Earth at 20,200 km altitude. Their atomic clocks are pulled in two opposite relativistic directions — and your phone's map depends on both being corrected.",
    concept: "Real-world relativity",
    groundObserver: "Ground observer",
    satellite: "Satellite",
    orbit: "GPS orbit · 20,200 km",
    speed: "Time-lapse",
    speed1h: "1 h / s",
    speed6h: "6 h / s",
    speed24h: "24 h / s",
    corrections: "Relativistic corrections",
    on: "ON",
    off: "OFF",
    correctionsOn: "Clocks pre-corrected — error stays ~0",
    correctionsOff: "Clocks uncorrected — watch the error grow",
    srLabel: "Special relativity — motion slows the clock",
    grLabel: "General relativity — weaker gravity speeds the clock",
    netLabel: "Combined drift (what GPS must correct)",
    usPerDay: "µs/day",
    readouts: {
      orbVel: "Orbital velocity",
      orbPeriod: "Orbital period",
      sr: "SR drift",
      gr: "GR drift",
      net: "Net drift",
      error: "Position error",
      elapsed: "Simulated time",
    },
    errorTitle: "What if we ignored relativity?",
    errorExpl:
      "Uncorrected satellite clocks drift every day. A 1 µs timing error is a ~300 m ranging error, so the drift above turns directly into a position error that grows at c × drift. Toggle corrections OFF and watch the fix slide away from the target.",
    errZero: "Corrected — error ≈ 0",
    errScale: "scale",
    tryPrompt:
      "Turn relativistic corrections OFF and let 2 simulated days pass. How large is the positioning error?",
    tryHint: "Hint: the error grows by roughly 11.6 km per simulated day.",
    trySolvedExtra: "",
    keyIdea:
      "Relativity is not abstract theory: without correcting both the SR and GR clock effects, GPS positions would be wrong by kilometres within a single day — your phone's navigation would fail within minutes of the correction being switched off.",
    whatYouSee1:
      "Earth sits at the center with a ground observer (pulsing dot). Six GPS satellites circle in their semi-synchronous orbit. Below, three bars separate the two competing relativistic effects on the satellite clocks — motion slowing them (violet), weaker gravity speeding them up (amber) — and their combination (cyan), the value GPS engineers must subtract from the clock rate.",
    whatYouSee2:
      "The crosshair panel shows the consequence: with corrections ON the position fix stays on target; with them OFF it drifts further off target every simulated day, exactly as a real receiver would misplace you.",
    physics1:
      "A satellite clock runs slow by the Lorentz factor γ because of its ~3.9 km/s orbital speed (special relativity, −7.2 µs/day), but runs fast because it sits higher in Earth's gravitational well than a ground clock (general relativity, +45.7 µs/day). The two effects partly cancel, leaving a net gain of about +38.6 µs/day relative to a ground clock.",
    physics2:
      "GPS receivers convert signal travel times into distances, so a clock error Δt becomes a ranging error of c·Δt. Engineers pre-offset each satellite's clock frequency before launch (by about 38.6 µs/day) so that it ticks correctly once in orbit — relativity as everyday engineering.",
    equationCaption: "Daily clock offset vs. a ground clock (negative = clock runs slow)",
    mathCaption:
      "Weak-field circular-orbit rate: dτ/dt = √(1 − rₛ/r − v²/c²). GPS pre-offsets the transmitted clock frequency by this amount.",
    assumptions: [
      "Circular orbit at 20,200 km altitude (the real GPS constellation uses semi-synchronous orbits with slight eccentricity).",
      "Earth is treated as a perfect sphere; the ground clock sits at sea level and does not rotate — rotation/Sagnac effects are real but ignored here.",
      "Satellites are idealized to pure circular motion: no eccentricity, atmospheric drag, or clock noise.",
      "Position error is modelled as c × accumulated clock drift, the dominant uncorrected term.",
    ],
  },
  es: {
    title: "Laboratorio de Relatividad GPS",
    subtitle:
      "Seis satélites GPS orbitan la Tierra a 20 200 km de altitud. Sus relojes atómicos sufren dos efectos relativistas opuestos, y el mapa de tu teléfono depende de que ambos estén corregidos.",
    concept: "Relatividad real",
    groundObserver: "Observador en tierra",
    satellite: "Satélite",
    orbit: "Órbita GPS · 20 200 km",
    speed: "Lapso de tiempo",
    speed1h: "1 h / s",
    speed6h: "6 h / s",
    speed24h: "24 h / s",
    corrections: "Correcciones relativistas",
    on: "ACTIVADAS",
    off: "DESACTIVADAS",
    correctionsOn: "Relojes precorregidos — el error se mantiene en ~0",
    correctionsOff: "Relojes sin corregir — observa cómo crece el error",
    srLabel: "Relatividad especial — el movimiento retrasa el reloj",
    grLabel: "Relatividad general — la gravedad débil adelanta el reloj",
    netLabel: "Deriva combinada (lo que el GPS debe corregir)",
    usPerDay: "µs/día",
    readouts: {
      orbVel: "Velocidad orbital",
      orbPeriod: "Periodo orbital",
      sr: "Deriva RE",
      gr: "Deriva RG",
      net: "Deriva neta",
      error: "Error de posición",
      elapsed: "Tiempo simulado",
    },
    errorTitle: "¿Y si ignorásemos la relatividad?",
    errorExpl:
      "Sin corrección, los relojes de los satélites derivan cada día. Un error de 1 µs en el tiempo equivale a ~300 m de error en distancia, así que esa deriva se convierte directamente en un error de posición que crece a c × deriva. Desactiva las correcciones y observa cómo la posición se aleja del objetivo.",
    errZero: "Corregido — error ≈ 0",
    errScale: "escala",
    tryPrompt:
      "Desactiva las correcciones relativistas y deja pasar 2 días simulados. ¿De qué magnitud es el error de posicionamiento?",
    tryHint: "Pista: el error crece unos 11,6 km por día simulado.",
    trySolvedExtra: "",
    keyIdea:
      "La relatividad no es teoría abstracta: sin corregir ambos efectos (RE y RG) en los relojes, las posiciones del GPS errarían por kilómetros en un solo día; la navegación de tu teléfono fallaría minutos después de desactivar la corrección.",
    whatYouSee1:
      "La Tierra está en el centro con un observador en tierra (punto pulsante). Seis satélites GPS giran en su órbita semisíncrona. Debajo, tres barras separan los dos efectos relativistas opuestos sobre los relojes: el movimiento los retrasa (violeta), la gravedad más débil los adelanta (ámbar), y su combinación (cian), el valor que los ingenieros del GPS deben restar a la frecuencia del reloj.",
    whatYouSee2:
      "El panel con la cruz muestra la consecuencia: con las correcciones ACTIVADAS la posición permanece en el objetivo; con ellas DESACTIVADAS se aleja cada día simulado, exactamente como un receptor real te ubicaría mal.",
    physics1:
      "El reloj de un satélite se retrasa por el factor de Lorentz γ debido a su velocidad orbital de ~3,9 km/s (relatividad especial, −7,2 µs/día), pero se adelanta porque está más alto en el pozo gravitatorio terrestre que un reloj en tierra (relatividad general, +45,7 µs/día). Ambos efectos se cancelan en parte, dejando una ganancia neta de unos +38,6 µs/día respecto a un reloj terrestre.",
    physics2:
      "Los receptores GPS convierten tiempos de viaje de la señal en distancias, así que un error de reloj Δt se convierte en un error de distancia de c·Δt. Los ingenieros ajustan de antemano la frecuencia de cada reloj satelital (unos 38,6 µs/día) para que marque bien una vez en órbita: la relatividad como ingeniería cotidiana.",
    equationCaption: "Desfase diario del reloj frente a un reloj terrestre (negativo = el reloj atrasa)",
    mathCaption:
      "Tasa en órbita circular (campo débil): dτ/dt = √(1 − rₛ/r − v²/c²). El GPS compensa la frecuencia transmitida en esta cantidad.",
    assumptions: [
      "Órbita circular a 20 200 km de altitud (la constelación GPS real usa órbitas semisíncronas con ligera excentricidad).",
      "La Tierra se trata como una esfera perfecta; el reloj terrestre está al nivel del mar y no rota: los efectos de rotación/Sagnac son reales pero se ignoran aquí.",
      "Los satélites se idealizan con movimiento circular puro: sin excentricidad, rozamiento atmosférico ni ruido del reloj.",
      "El error de posición se modela como c × deriva acumulada del reloj, el término dominante sin corregir.",
    ],
  },
};

const R_SAT = R_EARTH + 20_200_000; // m
const N_SATS = 6;
const SR_COLOR = "var(--violet)";
const GR_COLOR = "var(--amber)";
const NET_COLOR = "var(--cyan)";

function fmtSignedUs(v: number, lang: "en" | "es"): string {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${fmt(Math.abs(v), lang, 1)}`;
}

export default function GpsLab() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();
  const [running, setRunning] = useState(!reduced);
  const [relativityOn, setRelativityOn] = useState(true);
  const [speedStr, setSpeedStr] = useState("21600"); // simulated seconds per real second
  const [simSeconds, setSimSeconds] = useState(0);

  const speed = Number(speedStr);
  useRaf((dt) => setSimSeconds((t) => t + dt * speed), running);

  const p = useMemo(() => {
    const sat = satelliteClockRate(M_EARTH, R_SAT);
    const ground = gravitationalTimeFactor(M_EARTH, R_EARTH);
    const srUs = (sat.sr - 1) * DAY * 1e6; // ≈ −7.2
    const grUs = (sat.gr - ground) * DAY * 1e6; // ≈ +45.7
    const netUs = (sat.combined - ground) * DAY * 1e6; // ≈ +38.6
    const period = (2 * Math.PI * R_SAT) / sat.orbitVelocity; // ≈ 11h58m
    const driftRate = (sat.combined - ground) * C; // m/s of range-error growth
    return { ...sat, ground, srUs, grUs, netUs, period, driftRate };
  }, []);

  const errorM = relativityOn ? 0 : p.driftRate * simSeconds;
  const simDays = simSeconds / DAY;
  const phase = (simSeconds * p.orbitVelocity) / R_SAT;

  // ── Scene geometry (SVG) ────────────────────────────────────────────────
  const CX = 210;
  const CY = 200;
  const orbitR = 172;
  const earthR = orbitR * (R_EARTH / R_SAT);

  const satPos = (i: number): [number, number] => {
    const a = phase + (i * 2 * Math.PI) / N_SATS;
    return [CX + orbitR * Math.cos(a), CY + orbitR * Math.sin(a)];
  };

  // ── Contribution bars (diverging, zero at center, scale ±60 µs/day) ──────
  const barScale = 60;
  const bar = (v: number, color: string) => {
    const w = (Math.abs(v) / barScale) * 50;
    return (
      <div
        className="relative h-3.5 flex-1 overflow-hidden rounded-full"
        style={{ background: "var(--inset, rgba(255,255,255,0.05))" }}
        role="img"
        aria-label={`${fmtSignedUs(v, lang)} ${s.usPerDay}`}
      >
        <div
          className="absolute top-0 h-full w-px"
          style={{ left: "50%", background: "var(--text-faint)" }}
        />
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            background: color,
            left: v < 0 ? `${50 - w}%` : "50%",
            width: `${w}%`,
          }}
        />
      </div>
    );
  };

  // ── Crosshair error readout ─────────────────────────────────────────────
  const ERR_MAX = 30_000; // 30 km full scale
  const errFrac = Math.min(errorM / ERR_MAX, 1);
  const dotX = 100 + errFrac * 82;

  return (
    <SimulationShell
      simId="gps"
      title={s.title}
      subtitle={s.subtitle}
      concept={s.concept}
      difficulty={2}
      visualization={
        <div className="p-4">
          {/* ── Orbit scene ── */}
          <svg
            viewBox="0 0 420 400"
            className="mx-auto block w-full max-w-[520px]"
            role="img"
            aria-label={s.title}
          >
            {/* orbit ring */}
            <circle
              cx={CX}
              cy={CY}
              r={orbitR}
              fill="none"
              stroke="var(--cyan)"
              strokeOpacity={0.45}
              strokeWidth={1.5}
              strokeDasharray="5 5"
            />
            {/* Earth */}
            <circle cx={CX} cy={CY} r={earthR} fill="url(#gpsEarth)" stroke="var(--cyan)" strokeOpacity={0.6} />
            <defs>
              <radialGradient id="gpsEarth" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.55} />
                <stop offset="70%" stopColor="#0f766e" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#134e4a" />
              </radialGradient>
            </defs>
            {/* ground observer */}
            <circle cx={CX} cy={CY + earthR} r={6.5} fill="var(--amber)" opacity={0.25} className="animate-ping" />
            <circle cx={CX} cy={CY + earthR} r={3.5} fill="var(--amber)" stroke="#000" strokeOpacity={0.3} />
            <text
              x={CX + 12}
              y={CY + earthR + 4}
              fontSize={11}
              fill="var(--text-dim)"
            >
              {s.groundObserver}
            </text>
            {/* satellites */}
            {Array.from({ length: N_SATS }, (_, i) => {
              const [x, y] = satPos(i);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={4.5} fill="var(--cyan)" stroke="#000" strokeOpacity={0.35} />
                  <circle cx={x} cy={y} r={4.5} fill="none" stroke="var(--cyan)" strokeOpacity={0.4} />
                </g>
              );
            })}
            <text x={CX + orbitR * 0.72} y={CY - orbitR * 0.72} fontSize={11} fill="var(--text-dim)">
              {s.orbit}
            </text>
          </svg>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* ── Contributions ── */}
            <div className="inset p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>
                {s.corrections}
              </div>
              <div className="space-y-3.5">
                <div>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span style={{ color: "var(--text-dim)" }}>{s.srLabel}</span>
                    <span className="font-mono2 font-semibold" style={{ color: SR_COLOR }}>
                      {fmtSignedUs(p.srUs, lang)} <span className="text-xs">{s.usPerDay}</span>
                    </span>
                  </div>
                  {bar(p.srUs, SR_COLOR)}
                </div>
                <div>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span style={{ color: "var(--text-dim)" }}>{s.grLabel}</span>
                    <span className="font-mono2 font-semibold" style={{ color: GR_COLOR }}>
                      {fmtSignedUs(p.grUs, lang)} <span className="text-xs">{s.usPerDay}</span>
                    </span>
                  </div>
                  {bar(p.grUs, GR_COLOR)}
                </div>
                <div>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-medium" style={{ color: "var(--text)" }}>{s.netLabel}</span>
                    <span className="font-mono2 font-semibold" style={{ color: NET_COLOR }}>
                      {fmtSignedUs(p.netUs, lang)} <span className="text-xs">{s.usPerDay}</span>
                    </span>
                  </div>
                  {bar(p.netUs, NET_COLOR)}
                </div>
              </div>
            </div>

            {/* ── Position error crosshair ── */}
            <div className="inset p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>
                {s.errorTitle}
              </div>
              <svg viewBox="0 0 200 120" className="mx-auto block w-full max-w-[320px]" role="img" aria-label={s.errorTitle}>
                <line x1={100} y1={8} x2={100} y2={112} stroke="var(--text-faint)" strokeWidth={1} />
                <line x1={60} y1={60} x2={182} y2={60} stroke="var(--text-faint)" strokeWidth={1} />
                <circle cx={100} cy={60} r={10} fill="none" stroke="var(--text-faint)" strokeWidth={1.5} />
                <circle cx={100} cy={60} r={2} fill="var(--text-faint)" />
                {[120, 140, 160, 180].map((x) => (
                  <line key={x} x1={x} y1={55} x2={x} y2={65} stroke="var(--text-faint)" strokeWidth={1} />
                ))}
                <text x={182} y={78} fontSize={9} fill="var(--text-dim)" textAnchor="end">
                  30 km {s.errScale}
                </text>
                <circle
                  cx={dotX}
                  cy={60}
                  r={6}
                  fill={errorM > 0 ? "#f43f5e" : "var(--green)"}
                  stroke="#000"
                  strokeOpacity={0.3}
                />
              </svg>
              <div className="mt-1 text-center font-mono2 text-sm font-semibold" style={{ color: errorM > 0 ? "#f43f5e" : "var(--green)" }}>
                {errorM > 0 ? `≈ ${fmtDistance(errorM, lang)}` : s.errZero}
              </div>
            </div>
          </div>
        </div>
      }
      controls={
        <>
          <PlayPauseControls
            playing={running}
            onToggle={() => setRunning((r) => !r)}
            onReset={() => setSimSeconds(0)}
          />
          <SegmentedControl
            label={s.speed}
            options={[
              { value: "3600", label: s.speed1h },
              { value: "21600", label: s.speed6h },
              { value: "86400", label: s.speed24h },
            ]}
            value={speedStr}
            onChange={setSpeedStr}
          />
          <SegmentedControl
            label={s.corrections}
            options={[
              { value: "on", label: s.on },
              { value: "off", label: s.off },
            ]}
            value={relativityOn ? "on" : "off"}
            onChange={(v) => setRelativityOn(v === "on")}
          />
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>
            {relativityOn ? s.correctionsOn : s.correctionsOff}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.readouts.orbVel} value={fmtVelocity(p.orbitVelocity, lang)} accent="cyan" />
            <PhysicsValue label={s.readouts.orbPeriod} value={formatDuration(p.period, lang)} accent="cyan" />
            <PhysicsValue label={s.readouts.sr} value={fmtSignedUs(p.srUs, lang)} unit={s.usPerDay} accent="violet" />
            <PhysicsValue label={s.readouts.gr} value={fmtSignedUs(p.grUs, lang)} unit={s.usPerDay} accent="amber" />
            <PhysicsValue label={s.readouts.net} value={fmtSignedUs(p.netUs, lang)} unit={s.usPerDay} accent="cyan" />
            <PhysicsValue label={s.readouts.elapsed} value={formatDuration(simSeconds, lang)} accent="green" />
          </div>
          <PhysicsValue
            label={`${s.readouts.error} · ${fmt(simDays, lang, 1)} ${lang === "es" ? "días" : "days"}`}
            value={errorM > 0 ? fmtDistance(errorM, lang) : "≈ 0"}
            accent="amber"
          />
        </>
      }
      whatYouSee={
        <>
          <p>{s.whatYouSee1}</p>
          <p className="mt-2">{s.whatYouSee2}</p>
          <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
            {s.errorExpl}
          </p>
        </>
      }
      physics={
        <>
          <p>{s.physics1}</p>
          <p className="mt-2">{s.physics2}</p>
          <KeyIdea>{s.keyIdea}</KeyIdea>
        </>
      }
      equation={
        <EquationCard
          tex="\\Delta t_{\\text{day}} = (f_{sat} - f_{gnd}) \\times 86400\\,\\text{s} \\qquad \\Delta x \\approx c \\cdot \\Delta t_{drift} \\cdot t"
          caption={s.equationCaption}
        />
      }
      mathEquation={<EquationCard tex="\\frac{d\\tau}{dt} = \\sqrt{1 - \\frac{r_s}{r} - \\frac{v^2}{c^2}}" caption={s.mathCaption} />}
      tryThis={
        <TryThis prompt={s.tryPrompt} check={() => !relativityOn && errorM > 20_000}>
          <p className="mt-2 text-sm italic" style={{ color: "var(--text-dim)" }}>
            {s.tryHint}
          </p>
        </TryThis>
      }
      assumptions={s.assumptions}
    />
  );
}
