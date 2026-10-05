import { useEffect, useMemo, useRef, useState } from "react";
import { PersonStanding, TrainFront, Zap } from "lucide-react";
import { lorentzFactor, lorentzTransform } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { fmt, fmtVelocity, type Lang } from "../physics/units";
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
  KeyIdea,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

type Frame = "platform" | "train";

const STRINGS = {
  en: {
    title: "Einstein's Train",
    subtitle:
      "Two lightning bolts strike a moving train — at the same instant. Or do they? Change the reference frame and watch simultaneity fall apart.",
    concept: "Simultaneity",
    velocity: "Train velocity",
    frame: "Reference frame",
    framePlatform: "Platform frame",
    frameTrain: "Train frame",
    speed: "Playback speed",
    strike: "Strike lightning again",
    gammaL: "Lorentz factor γ",
    velL: "Train velocity",
    tFrontL: "Front strike t′",
    tRearL: "Rear strike t′",
    dtStrikesL: "Δt′ between strikes",
    dtRecvL: "Train observer meets front light earlier by",
    scaleNote:
      "At everyday speeds this Δt′ is far below a nanosecond. The animation slows time enormously — event ordering and time ratios are exact, the playback rate is not.",
    obsPlatform: "Platform",
    obsTrain: "Train",
    legStrike: "Lightning strike point",
    legWave: "Light wavefront (expands at c)",
    legPlat: "Platform observer",
    legTrain: "Train observer",
    legRecv: "Wavefront received",
    frameNoteP: "Train moves right at v — the strikes are simultaneous here",
    frameNoteT: "Train at rest, platform rushes left — the strikes are NOT simultaneous here",
    timeline: "Event timeline (this frame)",
    rowStrikes: "Strikes",
    rowRecv: "Receptions",
    elapsed: "frame time",
    evFrontStrike: "Front strike",
    evRearStrike: "Rear strike",
    evBoth: "Both strikes (simultaneous)",
    evRecvPlat: "Platform receives both",
    evRecvTrainF: "Train receives front light",
    evRecvTrainR: "Train receives rear light",
    front: "front",
    rear: "rear",
    platformLabel: "PLATFORM",
    see1:
      "Two bolts strike the front and rear of the train. In the platform frame they strike at the same instant — watch the amber markers: both flashes fire together, and the light circles expand at speed c from fixed points in space.",
    see2:
      "The platform observer stands exactly midway between the strike points and never moves. Both wavefronts reach them at the same moment (cyan flash): simultaneous strikes, simultaneous reception.",
    see3:
      "The train observer rides at the exact middle of the train. They rush toward the front wavefront and away from the rear one, so they meet the front light first (violet flash).",
    see4:
      "Now switch to the train frame. The train sits still while the platform slides past — and the strikes are no longer simultaneous: the front strike happened first. Nothing about the lightning changed; the two frames simply slice spacetime differently.",
    phys1:
      "Both observers measure every light wavefront expanding at c — Einstein's second postulate, built directly into the animation.",
    phys2:
      "The platform observer is equidistant from the two emission events, so simultaneous emission gives simultaneous reception. The train observer moves toward one wavefront and away from the other, so the two receptions are separated in time.",
    phys3:
      "Since light also travels at c for the train observer, the earlier arrival of the front light can only mean one thing: in the train frame, the front strike happened first. Simultaneity is frame-dependent. In symbols:",
    keyIdea:
      "There is no universal “now”. Two events simultaneous for one inertial observer are not simultaneous for another moving relative to them — this is the relativity of simultaneity.",
    eqCap:
      "Two events simultaneous in S (Δt = 0) but at different places (Δx ≠ 0) are separated in time in S′ by Δt′ = −γvΔx/c².",
    eqMathCap:
      "Full Lorentz transformation of an event (t, x) into a frame moving at +v relative to the original.",
    assumptions: [
      "The strikes are idealized as instantaneous point events hitting the exact ends of the train.",
      "The train is treated as rigid in its own rest frame; subtleties of Born rigidity are ignored — acceptable in a thought experiment.",
      "Animation time is slowed enormously and distances are drawn schematically; event ordering and time ratios are exact.",
      "Only inertial frames are considered; acceleration phases are neglected.",
    ],
    tryPrompt:
      "Set the velocity to 0.9c and switch to the train frame. Which lightning strike happened first — and does the platform observer agree?",
    tryFront: "Front strike first",
    tryRear: "Rear strike first",
    trySim: "Simultaneous in both frames",
    tryWrong:
      "Not quite — watch which wavefront reaches the moving observer first, then read the strike times in the train-frame timeline.",
  },
  es: {
    title: "El tren de Einstein",
    subtitle:
      "Dos rayos caen sobre un tren en movimiento — al mismo instante. ¿O no? Cambia de sistema de referencia y observa cómo la simultaneidad se desmorona.",
    concept: "Simultaneidad",
    velocity: "Velocidad del tren",
    frame: "Sistema de referencia",
    framePlatform: "Sistema del andén",
    frameTrain: "Sistema del tren",
    speed: "Velocidad de reproducción",
    strike: "Provocar los rayos de nuevo",
    gammaL: "Factor de Lorentz γ",
    velL: "Velocidad del tren",
    tFrontL: "Rayo delantero t′",
    tRearL: "Rayo trasero t′",
    dtStrikesL: "Δt′ entre los rayos",
    dtRecvL: "El observador del tren alcanza la luz delantera antes por",
    scaleNote:
      "A velocidades cotidianas este Δt′ está muy por debajo del nanosegundo. La animación ralentiza el tiempo enormemente: el orden de los eventos y las proporciones temporales son exactos, el ritmo de reproducción no.",
    obsPlatform: "Andén",
    obsTrain: "Tren",
    legStrike: "Punto de impacto del rayo",
    legWave: "Frente de onda luminosa (se expande a c)",
    legPlat: "Observador del andén",
    legTrain: "Observador del tren",
    legRecv: "Frente de onda recibido",
    frameNoteP: "El tren se mueve a la derecha con v — aquí los rayos son simultáneos",
    frameNoteT: "Tren en reposo, el andén se desplaza a la izquierda — aquí los rayos NO son simultáneos",
    timeline: "Línea temporal de eventos (este sistema)",
    rowStrikes: "Rayos",
    rowRecv: "Recepciones",
    elapsed: "tiempo del sistema",
    evFrontStrike: "Rayo delantero",
    evRearStrike: "Rayo trasero",
    evBoth: "Ambos rayos (simultáneos)",
    evRecvPlat: "El andén recibe ambos",
    evRecvTrainF: "El tren recibe la luz delantera",
    evRecvTrainR: "El tren recibe la luz trasera",
    front: "delantero",
    rear: "trasero",
    platformLabel: "ANDÉN",
    see1:
      "Dos rayos impactan en la parte delantera y trasera del tren. En el sistema del andén caen al mismo instante: observa los marcadores ámbar — ambos destellos se producen juntos y los círculos de luz se expanden a velocidad c desde puntos fijos del espacio.",
    see2:
      "El observador del andén está justo en el punto medio entre los impactos y no se mueve. Ambos frentes de onda le alcanzan al mismo tiempo (destello cian): rayos simultáneos, recepción simultánea.",
    see3:
      "El observador del tren viaja justo en el centro del tren. Se acerca al frente de onda delantero y se aleja del trasero, así que se encuentra primero con la luz delantera (destello violeta).",
    see4:
      "Cambia ahora al sistema del tren. El tren está quieto mientras el andén se desliza — y los rayos ya no son simultáneos: el delantero ocurrió primero. Los rayos no han cambiado; cada sistema «corta» el espaciotiempo de forma distinta.",
    phys1:
      "Ambos observadores miden todos los frentes de onda expandiéndose a c: el segundo postulado de Einstein, incorporado directamente en la animación.",
    phys2:
      "El observador del andén está a la misma distancia de los dos eventos de emisión, así que una emisión simultánea produce una recepción simultánea. El observador del tren se mueve hacia un frente de onda y se aleja del otro, de modo que las dos recepciones están separadas en el tiempo.",
    phys3:
      "Como la luz también viaja a c para el observador del tren, que la luz delantera llegue antes solo puede significar una cosa: en el sistema del tren, el rayo delantero ocurrió primero. La simultaneidad depende del sistema de referencia. En símbolos:",
    keyIdea:
      "No existe un «ahora» universal. Dos eventos simultáneos para un observador inercial no lo son para otro que se mueva respecto a él: es la relatividad de la simultaneidad.",
    eqCap:
      "Dos eventos simultáneos en S (Δt = 0) en lugares distintos (Δx ≠ 0) están separados en el tiempo en S′ por Δt′ = −γvΔx/c².",
    eqMathCap:
      "Transformación de Lorentz completa de un evento (t, x) a un sistema que se mueve a +v respecto al original.",
    assumptions: [
      "Los rayos se idealizan como eventos puntuales instantáneos que impactan justo en los extremos del tren.",
      "El tren se trata como rígido en su propio sistema en reposo; se ignoran las sutilezas de la rigidez de Born, aceptable en un experimento mental.",
      "El tiempo de la animación está ralentizado enormemente y las distancias son esquemáticas; el orden de los eventos y las proporciones temporales son exactos.",
      "Solo se consideran sistemas inerciales; se desprecian las fases de aceleración.",
    ],
    tryPrompt:
      "Pon la velocidad a 0,9c y cambia al sistema del tren. ¿Qué rayo ocurrió primero, y está de acuerdo el observador del andén?",
    tryFront: "El delantero primero",
    tryRear: "El trasero primero",
    trySim: "Simultáneos en ambos sistemas",
    tryWrong:
      "Casi — observa qué frente de onda alcanza primero al observador en movimiento y luego lee los tiempos de los rayos en la línea temporal del sistema del tren.",
  },
} as const;

const L = 300; // train rest length, metres
const DURATION = 9; // seconds per full sweep at 1× playback
const W = 960;
const H = 400;
const HALF_VIEW = 1.9; // train-lengths visible on each side of the train centre
const SX = W / 2 / HALF_VIEW; // px per train-length
const ROOF_Y = 204;
const BODY_BOT = 288;
const RAIL_Y = 304;
const GROUND_Y = 326;

function fmtTime(s: number, lang: Lang): string {
  const a = Math.abs(s);
  if (a === 0) return "0 ns";
  if (a < 1e-15) return `${fmt(s * 1e18, lang, 2)} as`;
  if (a < 1e-12) return `${fmt(s * 1e15, lang, 2)} fs`;
  if (a < 1e-9) return `${fmt(s * 1e12, lang, 2)} ps`;
  if (a < 1e-6) return `${fmt(s * 1e9, lang, 2)} ns`;
  if (a < 1e-3) return `${fmt(s * 1e6, lang, 2)} µs`;
  return `${fmt(s * 1e3, lang, 2)} ms`;
}

function Person({ x, feetY, color, h }: { x: number; feetY: number; color: string; h: number }) {
  const headR = 7;
  const headCY = feetY - h + headR;
  const shoulderY = headCY + headR + 4;
  const hipY = feetY - 14;
  return (
    <g stroke={color} strokeWidth={3} strokeLinecap="round" fill="none">
      <circle cx={x} cy={headCY} r={headR} fill={color} stroke="none" />
      <line x1={x} y1={shoulderY} x2={x} y2={hipY} />
      <line x1={x} y1={hipY} x2={x - 9} y2={feetY} />
      <line x1={x} y1={hipY} x2={x + 9} y2={feetY} />
      <line x1={x} y1={shoulderY + 6} x2={x - 10} y2={shoulderY + 14} />
      <line x1={x} y1={shoulderY + 6} x2={x + 10} y2={shoulderY + 14} />
    </g>
  );
}

interface Ev {
  t: number;
  x: number;
}

export default function EinsteinTrain() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [beta, setBeta] = useState(0.9);
  const [frame, setFrame] = useState<Frame>("platform");
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [prog, setProg] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const interacted = useRef(false);

  useEffect(() => {
    if (!interacted.current) setPlaying(!reduced);
  }, [reduced ]);
  useEffect(() => {
    setProg(0);
  }, [beta, frame]);
  useEffect(() => {
    if (prog >= 1) setPlaying(false);
  }, [prog]);

  useRaf(
    (dt) => setProg((p) => Math.min(1, p + (dt * speed) / DURATION)),
    playing,
  );

  const v = beta * C;
  const gamma = lorentzFactor(v);
  const Lc = L / gamma; // contracted train length in the platform frame

  // All events are defined in the platform frame S (SI units), then Lorentz-
  // transformed into the selected drawing frame. Nothing is hardcoded: the
  // story (simultaneous vs. non-simultaneous strikes) emerges from the math.
  const ev = useMemo(() => {
    const half = Lc / 2;
    const sEv = {
      strikeF: { t: 0, x: half },
      strikeR: { t: 0, x: -half },
      recvP: { t: half / C, x: 0 },
      recvTF: { t: half / (C + v), x: (v * half) / (C + v) },
      recvTR: { t: half / (C - v), x: (v * half) / (C - v) },
    };
    if (frame === "platform") return sEv;
    const T = (e: Ev): Ev => lorentzTransform(e.t, e.x, v);
    return {
      strikeF: T(sEv.strikeF),
      strikeR: T(sEv.strikeR),
      recvP: T(sEv.recvP),
      recvTF: T(sEv.recvTF),
      recvTR: T(sEv.recvTR),
    };
  }, [Lc, v, frame]);

  const tFirst = Math.min(ev.strikeF.t, ev.strikeR.t);
  const tLast = Math.max(ev.recvP.t, ev.recvTF.t, ev.recvTR.t);
  const span = Math.max(tLast - tFirst, 1e-12);
  const tStart = tFirst - 0.12 * span;
  const tEnd = tLast + 0.3 * span;
  const p = Math.min(prog, 1);
  const ft = tStart + p * (tEnd - tStart); // current frame time (s)

  // ── drawing helpers (positions in train-lengths, time in seconds) ──
  const camU = frame === "platform" ? (v * ft) / L : 0; // camera follows train centre
  const X = (u: number) => W / 2 + (u - camU) * SX;
  const trainLenU = frame === "platform" ? Lc / L : 1;
  const platU = frame === "platform" ? 0 : (-v * ft) / L;
  const sFu = ev.strikeF.x / L;
  const sRu = ev.strikeR.x / L;
  const flashWin = span * 0.02;

  const togglePlay = () => {
    interacted.current = true;
    setPlaying((pl) => !pl);
  };
  const strikeNow = () => {
    interacted.current = true;
    setProg(0);
    setPlaying(true);
  };

  // ── timeline items, grouped when (near-)coincident ──
  interface TLItem {
    t: number;
    kind: "strike" | "recvP" | "recvT";
    label: string;
  }
  const rawItems: TLItem[] = [
    { t: ev.strikeF.t, kind: "strike", label: s.evFrontStrike },
    { t: ev.strikeR.t, kind: "strike", label: s.evRearStrike },
    { t: ev.recvP.t, kind: "recvP", label: s.evRecvPlat },
    { t: ev.recvTF.t, kind: "recvT", label: s.evRecvTrainF },
    { t: ev.recvTR.t, kind: "recvT", label: s.evRecvTrainR },
  ];
  const groups: TLItem[][] = [];
  for (const it of [...rawItems].sort((a, b) => a.t - b.t)) {
    const last = groups[groups.length - 1];
    if (last && Math.abs(it.t - last[0].t) < span * 0.004) last.push(it);
    else groups.push([it]);
  }
  const strikeGroups = groups.filter((g) => g[0].kind === "strike");
  const recvGroups = groups.filter((g) => g[0].kind !== "strike");

  const recvFlashes = [
    {
      e: ev.recvP,
      color: "var(--cyan)",
      headY: GROUND_Y - 40,
      obsU: frame === "platform" ? 0 : (-v * ev.recvP.t) / L,
    },
    {
      e: ev.recvTF,
      color: "var(--violet)",
      headY: ROOF_Y - 32,
      obsU: frame === "platform" ? (v * ev.recvTF.t) / L : 0,
    },
    {
      e: ev.recvTR,
      color: "var(--violet)",
      headY: ROOF_Y - 32,
      obsU: frame === "platform" ? (v * ev.recvTR.t) / L : 0,
    },
  ];

  const bodyW = trainLenU * SX;
  const x0 = W / 2 - bodyW / 2;
  const nWin = Math.max(2, Math.floor(bodyW / 52));
  const tieOff = frame === "train" ? (((v * ft) / L) * SX) % 76 : 0;

  const timelineRow = (title: string, gs: TLItem[][]) => (
    <div className="flex items-center gap-2">
      <span
        className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--text-faint)" }}
      >
        {title}
      </span>
      <div className="relative h-7 flex-1">
        {gs.map((g, gi) => {
          const pct = ((g[0].t - tStart) / (tEnd - tStart)) * 100;
          const label = g.length > 1 ? s.evBoth : g[0].label;
          const col =
            g[0].kind === "strike"
              ? "var(--amber)"
              : g[0].kind === "recvP"
                ? "var(--cyan)"
                : "var(--violet)";
          return (
            <div
              key={gi}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct}%` }}
              title={`${label} · ${fmtTime(g[0].t, lang)}`}
            >
              {g[0].kind === "strike" ? (
                <div style={{ width: 10, height: 10, transform: "rotate(45deg)", background: col }} />
              ) : (
                <div
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    background: col,
                  }}
                />
              )}
            </div>
          );
        })}
        <div
          className="absolute bottom-0 top-0 w-px"
          style={{ left: `${p * 100}%`, background: "var(--text)", opacity: 0.7 }}
        />
      </div>
    </div>
  );

  return (
    <SimulationShell
      simId="einstein-train"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={s.title}>
            <rect x={0} y={0} width={W} height={H} fill="var(--bg-inset)" />

            {/* rail + scrolling ties */}
            <line x1={0} y1={RAIL_Y} x2={W} y2={RAIL_Y} stroke="var(--border-strong)" strokeWidth={3} />
            {Array.from({ length: 16 }, (_, i) => (
              <rect
                key={i}
                x={i * 76 - tieOff - 40}
                y={RAIL_Y + 4}
                width={34}
                height={7}
                rx={2}
                fill="var(--border)"
              />
            ))}

            {/* platform deck follows the platform observer */}
            <rect
              x={X(platU) - 120}
              y={GROUND_Y}
              width={240}
              height={20}
              rx={4}
              fill="var(--bg-elev)"
              stroke="var(--border)"
            />
            <text
              x={X(platU)}
              y={GROUND_Y + 14}
              textAnchor="middle"
              fontSize={10}
              letterSpacing={2}
              fill="var(--text-faint)"
            >
              {s.platformLabel}
            </text>

            {/* light wavefronts: circles expanding at c from fixed emission points */}
            {[ev.strikeF, ev.strikeR].map((e, i) => {
              if (ft < e.t) return null;
              const r = ((C * (ft - e.t)) / L) * SX;
              if (r > 2400) return null;
              return (
                <circle
                  key={i}
                  cx={X(e.x / L)}
                  cy={ROOF_Y}
                  r={Math.max(r, 1)}
                  fill="none"
                  stroke="rgba(255,205,110,0.5)"
                  strokeWidth={2}
                />
              );
            })}

            {/* persistent strike-point markers (fixed emission points in this frame) */}
            {[sFu, sRu].map((u, i) => (
              <g key={i} transform={`translate(${X(u)},${ROOF_Y - 16})`}>
                <rect x={-6} y={-6} width={12} height={12} transform="rotate(45)" fill="var(--amber)" opacity={0.9} />
              </g>
            ))}

            {/* lightning bolt flash */}
            {[ev.strikeF, ev.strikeR].map((e, i) =>
              Math.abs(ft - e.t) <= flashWin ? (
                <g key={i} transform={`translate(${X(e.x / L)},${ROOF_Y})`}>
                  <circle r={34} fill="rgba(245,165,36,0.25)" />
                  <polygon
                    points="0,-52 10,-24 3,-22 12,-4 -4,-9 0,8 -12,-16 -4,-18"
                    fill="#ffd34d"
                    stroke="#fff3c4"
                    strokeWidth={1.5}
                  />
                </g>
              ) : null,
            )}

            {/* train */}
            <g>
              <rect
                x={x0}
                y={ROOF_Y}
                width={bodyW}
                height={BODY_BOT - ROOF_Y}
                rx={14}
                fill="var(--bg-elev)"
                stroke="var(--border-strong)"
                strokeWidth={1.5}
              />
              {Array.from({ length: nWin }, (_, i) => (
                <rect
                  key={i}
                  x={x0 + ((i + 0.5) * bodyW) / nWin - 14}
                  y={ROOF_Y + 16}
                  width={28}
                  height={22}
                  rx={4}
                  fill="rgba(62,230,255,0.16)"
                  stroke="var(--cyan)"
                  strokeOpacity={0.5}
                />
              ))}
              <rect x={x0 + 6} y={BODY_BOT - 26} width={Math.max(bodyW - 12, 1)} height={6} rx={3} fill="var(--cyan)" opacity={0.35} />
              <circle cx={x0 + bodyW * 0.22} cy={BODY_BOT + 8} r={10} fill="var(--bg-panel)" stroke="var(--text-faint)" strokeWidth={2} />
              <circle cx={x0 + bodyW * 0.78} cy={BODY_BOT + 8} r={10} fill="var(--bg-panel)" stroke="var(--text-faint)" strokeWidth={2} />
              <text x={x0 + 12} y={BODY_BOT - 36} fontSize={10} fill="var(--text-faint)">
                {s.rear}
              </text>
              <text x={x0 + bodyW - 12} y={BODY_BOT - 36} fontSize={10} textAnchor="end" fill="var(--text-faint)">
                {s.front}
              </text>
            </g>

            {/* velocity arrow (platform frame only) */}
            {frame === "platform" && beta > 0 && (
              <g>
                <line x1={W / 2 - 70} y1={120} x2={W / 2 + 70} y2={120} stroke="var(--cyan)" strokeWidth={2} />
                <polygon points={`${W / 2 + 70},120 ${W / 2 + 58},114 ${W / 2 + 58},126`} fill="var(--cyan)" />
                <text x={W / 2} y={108} textAnchor="middle" fontSize={12} fill="var(--cyan)" className="font-mono2">
                  v = {fmtVelocity(v, lang)}
                </text>
              </g>
            )}

            {/* observers */}
            <Person x={X(platU)} feetY={GROUND_Y} color="var(--cyan)" h={48} />
            <text x={X(platU)} y={GROUND_Y - 60} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--cyan)">
              {s.obsPlatform}
            </text>
            <Person x={W / 2} feetY={ROOF_Y} color="var(--violet)" h={40} />
            <text x={W / 2} y={ROOF_Y - 54} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--violet)">
              {s.obsTrain}
            </text>

            {/* reception flashes */}
            {recvFlashes.map((r, i) => {
              if (ft < r.e.t) return null;
              const k = (ft - r.e.t) / (span * 0.12);
              if (k >= 1) return null;
              const rr = 8 + 42 * (1 - Math.exp(-3 * k));
              return (
                <circle
                  key={i}
                  cx={X(r.obsU)}
                  cy={r.headY}
                  r={rr}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={3}
                  opacity={(1 - k) * 0.9}
                />
              );
            })}

            {/* legend */}
            <g fontSize={11}>
              <rect x={12} y={12} width={300} height={134} rx={8} fill="var(--bg-panel)" stroke="var(--border)" opacity={0.94} />
              {[
                { y: 34, label: s.legStrike, sw: <rect x={20} y={28} width={10} height={10} transform="rotate(45 25 33)" fill="var(--amber)" /> },
                { y: 58, label: s.legWave, sw: <circle cx={25} cy={58} r={7} fill="none" stroke="rgba(255,205,110,0.8)" strokeWidth={2} /> },
                { y: 82, label: s.legPlat, sw: <circle cx={25} cy={82} r={6} fill="var(--cyan)" /> },
                { y: 106, label: s.legTrain, sw: <circle cx={25} cy={106} r={6} fill="var(--violet)" /> },
                { y: 130, label: s.legRecv, sw: <circle cx={25} cy={130} r={7} fill="none" stroke="var(--text)" strokeWidth={2.5} /> },
              ].map((row, i) => (
                <g key={i}>
                  {row.sw}
                  <text x={42} y={row.y + 4} fill="var(--text-dim)">
                    {row.label}
                  </text>
                </g>
              ))}
            </g>

            {/* frame indicator */}
            <text x={W - 16} y={32} textAnchor="end" fontSize={13} fontWeight={700} fill="var(--text)">
              {frame === "platform" ? s.framePlatform : s.frameTrain}
            </text>
            <text x={W - 16} y={50} textAnchor="end" fontSize={11} fill="var(--text-dim)">
              {frame === "platform" ? s.frameNoteP : s.frameNoteT}
            </text>
          </svg>

          <div className="grid grid-cols-2 gap-2 px-4 pt-3 md:grid-cols-3">
            <PhysicsValue label={s.gammaL} value={fmt(gamma, lang, 3)} accent="cyan" />
            <PhysicsValue label={s.velL} value={fmtVelocity(v, lang)} accent="cyan" />
            <PhysicsValue label={s.tFrontL} value={fmtTime(ev.strikeF.t, lang)} accent="amber" />
            <PhysicsValue label={s.tRearL} value={fmtTime(ev.strikeR.t, lang)} accent="amber" />
            <PhysicsValue label={s.dtStrikesL} value={fmtTime(ev.strikeR.t - ev.strikeF.t, lang)} accent="amber" />
            <PhysicsValue label={s.dtRecvL} value={fmtTime(ev.recvTR.t - ev.recvTF.t, lang)} accent="violet" />
          </div>
          <p className="px-4 pb-1 pt-2 text-xs" style={{ color: "var(--text-faint)" }}>
            {s.scaleNote}
          </p>

          <div className="px-4 pb-4">
            <div className="mb-1 flex items-baseline justify-between">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-faint)" }}
              >
                {s.timeline}
              </span>
              <span className="font-mono2 text-xs" style={{ color: "var(--text-dim)" }}>
                {s.elapsed}: {fmtTime(ft - tFirst, lang)}
              </span>
            </div>
            <div className="inset space-y-1 rounded-lg px-3 py-2">
              {timelineRow(s.rowStrikes, strikeGroups)}
              {timelineRow(s.rowRecv, recvGroups)}
            </div>
          </div>
        </div>
      }
      controls={
        <div className="space-y-5">
          <ParamSlider
            label={s.velocity}
            value={beta}
            min={0}
            max={0.99}
            step={0.01}
            onChange={setBeta}
            format={(b) => fmtVelocity(b * C, lang)}
          />
          <SegmentedControl<Frame>
            label={s.frame}
            value={frame}
            onChange={setFrame}
            options={[
              { value: "platform", label: s.framePlatform, icon: <PersonStanding size={14} /> },
              { value: "train", label: s.frameTrain, icon: <TrainFront size={14} /> },
            ]}
          />
          <PresetBar
            presets={[{ label: "0.10c" }, { label: "0.50c" }, { label: "0.90c" }, { label: "0.99c" }]}
            onPick={(i) => setBeta([0.1, 0.5, 0.9, 0.99][i])}
          />
          <PlayPauseControls
            playing={playing}
            onToggle={togglePlay}
            onReset={() => {
              interacted.current = true;
              setProg(0);
            }}
          />
          <ParamSlider
            label={s.speed}
            value={speed}
            min={0.1}
            max={2}
            step={0.1}
            onChange={setSpeed}
            format={(x) => `${x.toFixed(1)}×`}
            accent="violet"
          />
          <button className="btn-ghost flex w-full items-center justify-center gap-2 !px-3 !py-2 text-sm" onClick={strikeNow}>
            <Zap size={15} /> {s.strike}
          </button>
        </div>
      }
      whatYouSee={
        <div className="space-y-3">
          <p>{s.see1}</p>
          <p>{s.see2}</p>
          <p>{s.see3}</p>
          <p>{s.see4}</p>
        </div>
      }
      physics={
        <div className="space-y-3">
          <p>{s.phys1}</p>
          <p>{s.phys2}</p>
          <p>
            {s.phys3} <IM tex="\\Delta t' = -\\gamma v \\Delta x / c^2" />
          </p>
          <KeyIdea>{s.keyIdea}</KeyIdea>
        </div>
      }
      equation={
        <EquationCard
          tex="t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)"
          caption={s.eqCap}
        />
      }
      mathEquation={
        <EquationCard
          tex="\\begin{aligned} t' &= \\gamma\\left(t - \\frac{vx}{c^2}\\right) \\\\ x' &= \\gamma\\left(x - vt\\right) \\end{aligned}"
          caption={s.eqMathCap}
        />
      }
      tryThis={
        <TryThis prompt={s.tryPrompt} check={() => answer === "front"}>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { v: "front", label: s.tryFront },
              { v: "rear", label: s.tryRear },
              { v: "sim", label: s.trySim },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setAnswer(o.v)}
                aria-pressed={answer === o.v}
                className="chip"
                style={
                  answer === o.v
                    ? { borderColor: "var(--cyan)", color: "var(--cyan)", cursor: "pointer" }
                    : { cursor: "pointer" }
                }
              >
                {o.label}
              </button>
            ))}
          </div>
          {answer !== null && answer !== "front" && (
            <p className="mt-2 text-sm" style={{ color: "var(--red)" }}>
              {s.tryWrong}
            </p>
          )}
        </TryThis>
      }
      assumptions={[...s.assumptions]}
    />
  );
}
