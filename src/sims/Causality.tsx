import { useRef, useState } from "react";
import { classifySeparation, spacetimeInterval } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import {
  SimulationShell,
  PhysicsValue,
  SegmentedControl,
  TryThis,
  KeyIdea,
  EquationCard,
  useG,
} from "../components/ui";

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  canvasLabel: string; dragHint: string;
  pFuture: string; pOutside: string; pOnCone: string;
  pFutureHint: string; pOutsideHint: string; pOnConeHint: string;
  reset: string;
  flipLabel: string; on: string; off: string;
  flipHint: string; flipDisabled: string;
  flipNote: (v: string) => string;
  roDt: string; roDx: string; roS2: string; roUnits: string;
  sepTimelike: string; sepLightlike: string; sepSpacelike: string;
  verdictQ: string;
  vYes: string; vYesReason: string;
  vPast: string; vPastReason: string;
  vNo: string; vNoReason: string;
  vLight: string; vLightReason: string;
  legendIn: string; legendOn: string; legendOut: string;
  signNeg: string; signZero: string; signPos: string;
  eqCap: string; mathCap: string;
  wys: string[]; phys: string[]; keyIdea: string;
  tryPrompt: string; tryHint: string;
  assumptions: string[];
}

const STRINGS: Record<"en" | "es", Strings> = {
  en: {
    title: "Causality Explorer",
    subtitle:
      "Drag Event B through spacetime and watch what the light cone says about cause and effect.",
    concept: "Light cones",
    canvasLabel:
      "Interactive spacetime diagram with a fixed Event A, a draggable Event B, and the light cone of A",
    dragHint:
      "Drag B anywhere in the diagram (touch works too). Click it once and use the arrow keys for fine steps.",
    pFuture: "Place B in the future cone",
    pOutside: "Place B outside the cone",
    pOnCone: "Place B on the cone",
    pFutureHint: "Put B inside A's future light cone: timelike separation.",
    pOutsideHint: "Put B outside A's light cone: spacelike separation.",
    pOnConeHint: "Put B exactly on the light cone: lightlike separation.",
    reset: "Reset",
    flipLabel: "Order-flip view",
    on: "On",
    off: "Off",
    flipHint:
      "While B sits outside the cone (spacelike, violet), switch this on to see a frame of reference in which B happens before A.",
    flipDisabled:
      "Drag B outside the light cone (spacelike, violet) to unlock this view.",
    flipNote: (v: string) =>
      `In a frame moving at v ≈ ${v}c, the tilted violet line is that frame's “now” — its line of simultaneity through A. B lies below it, so that observer measures t′_B < 0: B happens before A. Infinitely many such frames exist.`,
    roDt: "Δt · B relative to A",
    roDx: "Δx · B relative to A",
    roS2: "Δs² · spacetime interval",
    roUnits: "c = 1 units",
    sepTimelike: "TIMELIKE",
    sepLightlike: "LIGHTLIKE",
    sepSpacelike: "SPACELIKE",
    verdictQ: "Can A cause B?",
    vYes: "YES — A can cause B",
    vYesReason:
      "B lies inside A's future light cone: a signal slower than light can travel from A to B.",
    vPast: "Yes — but B precedes A",
    vPastReason:
      "B lies inside A's past light cone: a signal could have travelled from B to A, never from A to B.",
    vNo: "NO — A cannot cause B",
    vNoReason:
      "B lies outside the light cone: no signal, however fast, can connect the two events.",
    vLight: "Only via light",
    vLightReason:
      "B sits exactly on the light cone: only a light-speed signal could make the journey.",
    legendIn: "inside cone — causal contact possible",
    legendOn: "on the cone — light only",
    legendOut: "outside cone — no influence possible",
    signNeg: "Δs² < 0 → timelike: one event can influence the other.",
    signZero: "Δs² = 0 → lightlike: only light can connect them.",
    signPos: "Δs² > 0 → spacelike: neither can influence the other.",
    eqCap:
      "The spacetime interval. Its sign — not its value — decides whether causality between the events is possible.",
    mathCap:
      "In a frame moving at velocity v, simultaneity tilts: that frame's “now” through A is the line t = vx/c² (t′ = 0). For spacelike separation some v with |v| < c places B at t′ < 0.",
    wys: [
      "Event A is fixed near the centre of the diagram. The two 45° lines through it are A's light cone — the paths of light rays A could emit or receive. The blue-tinted wedges mark where causal contact with A is possible.",
      "Event B is yours to move: drag it anywhere, or jump it with the preset buttons. Δt, Δx, Δs², the classification badge and the verdict all update live.",
      "Inside the cone the separation is timelike (cyan): slower-than-light signals can connect the events. On the cone it is lightlike (amber): only light can. Outside it is spacelike (violet): nothing can — and different observers disagree about which event happened first.",
    ],
    phys: [
      "The spacetime interval Δs² = Δx² − c²Δt² is the geometric “distance” of spacetime, and it is identical in every inertial frame. Its sign — never its value — classifies how two events relate.",
      "Timelike separation means one event lies inside the other's light cone: some slower-than-light signal, or a material object, could travel between them, so one can cause the other. This causal order is absolute: all observers agree which event came first.",
      "Spacelike separation means the events are too far apart in space for the time available: even light cannot bridge the gap. No influence is possible, and different inertial observers genuinely disagree about the time order — switch on the order-flip view to see one such frame.",
    ],
    keyIdea:
      "Causality in relativity is not about time order — it is about the light cone. Timelike and lightlike events have an absolute order; spacelike events do not.",
    tryPrompt:
      "Drag B so the events are SPACELIKE separated and B sits below A's horizontal simultaneity line — that is, some observer sees B happen first. Then switch on the order-flip view to see which observer.",
    tryHint:
      "Push B far sideways from A and a little below it. The badge turns violet and Δt goes negative.",
    assumptions: [
      "A 1+1-dimensional spacetime: one space axis and one time axis, which captures all the physics of causal structure.",
      "Natural units c = 1: distance and time are measured in the same units, so light rays travel at exactly 45°.",
      "Event A is held fixed so you can focus on how B's position changes everything.",
      "The order-flip view shows one representative boosted frame; infinitely many inertial frames disagree on the order of spacelike events.",
    ],
  },
  es: {
    title: "Explorador de causalidad",
    subtitle:
      "Arrastra el suceso B por el espaciotiempo y observa lo que el cono de luz dice sobre causa y efecto.",
    concept: "Conos de luz",
    canvasLabel:
      "Diagrama interactivo de espaciotiempo con un suceso A fijo, un suceso B arrastrable y el cono de luz de A",
    dragHint:
      "Arrastra B a cualquier punto del diagrama (funciona con el dedo). Haz clic en él y usa las flechas del teclado para pasos finos.",
    pFuture: "Colocar B en el cono futuro",
    pOutside: "Colocar B fuera del cono",
    pOnCone: "Colocar B sobre el cono",
    pFutureHint: "Coloca B dentro del cono de luz futuro de A: separación temporal.",
    pOutsideHint: "Coloca B fuera del cono de luz de A: separación espacial.",
    pOnConeHint: "Coloca B exactamente sobre el cono de luz: separación luminosa.",
    reset: "Reiniciar",
    flipLabel: "Vista de orden invertido",
    on: "Sí",
    off: "No",
    flipHint:
      "Mientras B esté fuera del cono (espacial, violeta), actívala para ver un sistema de referencia en el que B ocurre antes que A.",
    flipDisabled:
      "Arrastra B fuera del cono de luz (espacial, violeta) para desbloquear esta vista.",
    flipNote: (v: string) =>
      `En un sistema que se mueve a v ≈ ${v}c, la línea violeta inclinada es el «ahora» de ese sistema: su línea de simultaneidad a través de A. B queda por debajo de ella, así que ese observador mide t′_B < 0: B ocurre antes que A. Existen infinitos sistemas así.`,
    roDt: "Δt · B respecto a A",
    roDx: "Δx · B respecto a A",
    roS2: "Δs² · intervalo de espaciotiempo",
    roUnits: "unidades c = 1",
    sepTimelike: "TEMPORAL",
    sepLightlike: "LUMINOSA",
    sepSpacelike: "ESPACIAL",
    verdictQ: "¿Puede A causar B?",
    vYes: "SÍ — A puede causar B",
    vYesReason:
      "B está dentro del cono de luz futuro de A: una señal más lenta que la luz puede viajar de A a B.",
    vPast: "Sí — pero B precede a A",
    vPastReason:
      "B está dentro del cono de luz pasado de A: una señal podría haber viajado de B a A, nunca de A a B.",
    vNo: "NO — A no puede causar B",
    vNoReason:
      "B está fuera del cono de luz: ninguna señal, por rápida que sea, puede conectar ambos sucesos.",
    vLight: "Solo mediante la luz",
    vLightReason:
      "B está exactamente sobre el cono de luz: solo una señal a la velocidad de la luz podría hacer el recorrido.",
    legendIn: "dentro del cono — contacto causal posible",
    legendOn: "sobre el cono — solo la luz",
    legendOut: "fuera del cono — ninguna influencia posible",
    signNeg: "Δs² < 0 → temporal: un suceso puede influir en el otro.",
    signZero: "Δs² = 0 → luminosa: solo la luz puede conectarlos.",
    signPos: "Δs² > 0 → espacial: ninguno puede influir en el otro.",
    eqCap:
      "El intervalo de espaciotiempo. Su signo — no su valor — decide si la causalidad entre los sucesos es posible.",
    mathCap:
      "En un sistema que se mueve a velocidad v, la simultaneidad se inclina: el «ahora» de ese sistema a través de A es la recta t = vx/c² (t′ = 0). Para separación espacial existe algún v con |v| < c que coloca a B en t′ < 0.",
    wys: [
      "El suceso A está fijo cerca del centro del diagrama. Las dos rectas a 45° que pasan por él son su cono de luz: las trayectorias de los rayos de luz que A podría emitir o recibir. Las cuñas azules marcan dónde es posible el contacto causal con A.",
      "El suceso B es tuyo: arrástralo a cualquier punto, o muévelo con los botones de ajuste rápido. Δt, Δx, Δs², la insignia de clasificación y el veredicto se actualizan en directo.",
      "Dentro del cono la separación es temporal (cian): señales más lentas que la luz pueden conectar los sucesos. Sobre el cono es luminosa (ámbar): solo la luz puede. Fuera es espacial (violeta): nada puede, y distintos observadores discrepan sobre cuál suceso ocurrió primero.",
    ],
    phys: [
      "El intervalo de espaciotiempo Δs² = Δx² − c²Δt² es la «distancia» geométrica del espaciotiempo, y es idéntico en todos los sistemas inerciales. Su signo — nunca su valor — clasifica cómo se relacionan dos sucesos.",
      "La separación temporal significa que un suceso está dentro del cono de luz del otro: alguna señal más lenta que la luz, o un objeto material, podría viajar entre ellos, así que uno puede causar al otro. Este orden causal es absoluto: todos los observadores coinciden en cuál ocurrió primero.",
      "La separación espacial significa que los sucesos están demasiado separados en el espacio para el tiempo disponible: ni siquiera la luz puede salvar la distancia. No es posible ninguna influencia, y distintos observadores inerciales discrepan de verdad sobre el orden temporal: activa la vista de orden invertido para ver uno de esos sistemas.",
    ],
    keyIdea:
      "En relatividad la causalidad no trata del orden temporal, sino del cono de luz. Los sucesos temporales y luminosos tienen un orden absoluto; los espaciales no.",
    tryPrompt:
      "Arrastra B de modo que los sucesos estén separados ESPACIALMENTE y B quede por debajo de la línea horizontal de simultaneidad de A; es decir, algún observador ve a B ocurrir primero. Después activa la vista de orden invertido para ver qué observador es.",
    tryHint:
      "Empuja B lejos de A hacia un lado y un poco por debajo. La insignia se vuelve violeta y Δt se hace negativo.",
    assumptions: [
      "Un espaciotiempo de 1+1 dimensiones: un eje espacial y un eje temporal, que captura toda la física de la estructura causal.",
      "Unidades naturales c = 1: distancia y tiempo se miden en las mismas unidades, así que los rayos de luz viajan exactamente a 45°.",
      "El suceso A se mantiene fijo para que puedas concentrarte en cómo la posición de B lo cambia todo.",
      "La vista de orden invertido muestra un sistema acelerado representativo; infinitos sistemas inerciales discrepan sobre el orden de sucesos espaciales.",
    ],
  },
};

// ─── Diagram geometry (c = 1 natural units) ──────────────────────────────────
const X_MIN = -5, X_MAX = 5, T_MIN = -4.6, T_MAX = 4.6;
const W = 620, H = 580;
const ML = 46, MR = 18, MT = 18, MB = 42;
const PW = W - ML - MR, PH = H - MT - MB;

const sx = (x: number) => ML + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
const sy = (t: number) => MT + ((T_MAX - t) / (T_MAX - T_MIN)) * PH;
const toX = (px: number) => X_MIN + ((px - ML) / PW) * (X_MAX - X_MIN);
const toT = (py: number) => T_MAX - ((py - MT) / PH) * (T_MAX - T_MIN);

const DEFAULT_B = { x: 3.2, t: 1.0 };
const PRESETS = [
  { x: 1.0, t: 2.6 }, // future cone → timelike
  { x: 3.4, t: 1.2 }, // outside → spacelike
  { x: 2.2, t: 2.2 }, // on cone → lightlike
];

const SEP_COLOR: Record<string, string> = {
  timelike: "var(--cyan)",
  lightlike: "var(--amber)",
  spacelike: "var(--violet)",
};

const fmt2 = (n: number) => {
  const v = Math.abs(n) < 0.005 ? 0 : n;
  return v.toFixed(2);
};

export default function Causality() {
  const { lang, g } = useG();
  const t = STRINGS[lang];
  const [b, setB] = useState(DEFAULT_B);
  const [flip, setFlip] = useState<"on" | "off">("off");
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // In c = 1 units: Δt_si = dt_units / C, so Δs² = dx² − C²(dt/C)² = dx² − dt².
  const dt = b.t, dx = b.x;
  const s2 = spacetimeInterval(dt / C, dx);
  const sep = classifySeparation(dt / C, dx);
  const color = SEP_COLOR[sep];
  const spacelike = sep === "spacelike";

  // A boost velocity that puts B strictly before A: t' = γ(dt − v·dx) < 0,
  // i.e. dt < v·dx. Midpoint between v* = dt/dx (simultaneity) and ±c.
  const vFlip =
    dx > 0 ? (dt / dx + 1) / 2 : dx < 0 ? (dt / dx - 1) / 2 : 0;
  const showFlip = flip === "on" && spacelike && Math.abs(dx) > 1e-9;

  const place = (p: { x: number; t: number }) => setB({ ...p });

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    setB({
      x: Math.min(X_MAX - 0.05, Math.max(X_MIN + 0.05, toX(px))),
      t: Math.min(T_MAX - 0.05, Math.max(T_MIN + 0.05, toT(py))),
    });
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.5 : 0.1;
    let nx = b.x, nt = b.t;
    if (e.key === "ArrowLeft") nx -= step;
    else if (e.key === "ArrowRight") nx += step;
    else if (e.key === "ArrowUp") nt += step;
    else if (e.key === "ArrowDown") nt -= step;
    else return;
    e.preventDefault();
    setB({
      x: Math.min(X_MAX - 0.05, Math.max(X_MIN + 0.05, nx)),
      t: Math.min(T_MAX - 0.05, Math.max(T_MIN + 0.05, nt)),
    });
  };

  // Verdict
  const verdict =
    sep === "timelike" && dt > 0
      ? { title: t.vYes, reason: t.vYesReason }
      : sep === "timelike"
        ? { title: t.vPast, reason: t.vPastReason }
        : sep === "lightlike"
          ? { title: t.vLight, reason: t.vLightReason }
          : { title: t.vNo, reason: t.vNoReason };

  const sepLabel =
    sep === "timelike" ? t.sepTimelike : sep === "lightlike" ? t.sepLightlike : t.sepSpacelike;

  const ticksX = Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => X_MIN + i);
  const ticksT = Array.from({ length: Math.floor(T_MAX) - Math.ceil(T_MIN) + 1 }, (_, i) => Math.ceil(T_MIN) + i);

  const visualization = (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full select-none"
        role="img"
        aria-label={t.canvasLabel}
      >
        {/* causal wedges: future & past light cones */}
        <polygon
          points={`${sx(0)},${sy(0)} ${sx(T_MAX)},${sy(T_MAX)} ${sx(-T_MAX)},${sy(T_MAX)}`}
          fill="var(--cyan)"
          opacity={0.07}
        />
        <polygon
          points={`${sx(0)},${sy(0)} ${sx(T_MIN)},${sy(T_MIN)} ${sx(-T_MIN)},${sy(T_MIN)}`}
          fill="var(--cyan)"
          opacity={0.07}
        />
        {/* grid */}
        {ticksX.map((x) => (
          <line
            key={`gx${x}`}
            x1={sx(x)} y1={sy(T_MIN)} x2={sx(x)} y2={sy(T_MAX)}
            stroke="var(--border)"
            strokeWidth={x === 0 ? 1.5 : 0.6}
            opacity={x === 0 ? 1 : 0.55}
          />
        ))}
        {ticksT.map((tt) => (
          <line
            key={`gt${tt}`}
            x1={sx(X_MIN)} y1={sy(tt)} x2={sx(X_MAX)} y2={sy(tt)}
            stroke="var(--border)"
            strokeWidth={tt === 0 ? 1.5 : 0.6}
            opacity={tt === 0 ? 1 : 0.55}
          />
        ))}
        {/* light cone: 45° lines through A */}
        <line x1={sx(-T_MAX)} y1={sy(T_MAX)} x2={sx(-T_MIN)} y2={sy(T_MIN)} stroke="var(--cyan)" strokeWidth={2.2} opacity={0.85} />
        <line x1={sx(T_MAX)} y1={sy(T_MAX)} x2={sx(T_MIN)} y2={sy(T_MIN)} stroke="var(--cyan)" strokeWidth={2.2} opacity={0.85} />
        {/* rest-frame simultaneity through A (only with flip view) */}
        {showFlip && (
          <g>
            <line
              x1={sx(X_MIN)} y1={sy(0)} x2={sx(X_MAX)} y2={sy(0)}
              stroke="var(--text-dim)" strokeWidth={1.4} strokeDasharray="7 5" opacity={0.7}
            />
            {/* boosted observer worldline x = v·t  →  t = x/v */}
            <line
              x1={sx(X_MIN)} y1={sy(X_MIN / vFlip)} x2={sx(X_MAX)} y2={sy(X_MAX / vFlip)}
              stroke="var(--violet)" strokeWidth={1.6} opacity={0.9}
            />
            {/* boosted simultaneity t = v·x */}
            <line
              x1={sx(X_MIN)} y1={sy(vFlip * X_MIN)} x2={sx(X_MAX)} y2={sy(vFlip * X_MAX)}
              stroke="var(--violet)" strokeWidth={2.2} strokeDasharray="9 5"
            />
            <text x={sx(X_MAX) - 8} y={sy(vFlip * X_MAX) - 10} textAnchor="end" fill="var(--violet)" fontSize={13} fontStyle="italic">
              t′ = 0
            </text>
            <text x={sx(-4.4)} y={sy(0) - 10} fill="var(--text-dim)" fontSize={13} fontStyle="italic">
              t = 0
            </text>
          </g>
        )}
        {/* axis labels */}
        <text x={sx(X_MAX) + 2} y={sy(0) - 8} fill="var(--text-dim)" fontSize={14} fontStyle="italic">x</text>
        <text x={sx(0) + 8} y={MT - 4} fill="var(--text-dim)" fontSize={14} fontStyle="italic">ct</text>
        {/* A marker (fixed) */}
        <g>
          <circle cx={sx(0)} cy={sy(0)} r={10} fill="var(--text)" stroke="var(--bg)" strokeWidth={2} />
          <text x={sx(0) - 22} y={sy(0) + 5} fill="var(--text)" fontSize={15} fontWeight={700}>A</text>
        </g>
        {/* B marker (draggable) */}
        <g
          tabIndex={0}
          role="slider"
          aria-label={`${t.title} — B`}
          aria-valuetext={`Δt ${fmt2(dt)}, Δx ${fmt2(dx)}, ${sepLabel}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none", outline: "none" }}
        >
          <circle cx={sx(b.x)} cy={sy(b.t)} r={20} fill="transparent" />
          <circle cx={sx(b.x)} cy={sy(b.t)} r={11} fill={color} stroke="var(--bg)" strokeWidth={2.5} />
          <text x={sx(b.x) + 20} y={sy(b.t) + 5} fill={color} fontSize={15} fontWeight={700}>B</text>
        </g>
      </svg>
      {/* live classification badge */}
      <div className="absolute left-3 top-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em]"
          style={{
            color,
            border: `1.5px solid ${color}`,
            background: "color-mix(in srgb, var(--bg) 72%, transparent)",
          }}
          aria-live="polite"
        >
          {sepLabel}
        </span>
      </div>
    </div>
  );

  const controls = (
    <>
      <p className="text-sm" style={{ color: "var(--text-dim)" }}>{t.dragHint}</p>
      <div>
        <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
          {g.common.presets}
        </div>
        <div className="flex flex-wrap gap-2">
          {[t.pFuture, t.pOutside, t.pOnCone].map((label, i) => (
            <button
              key={i}
              onClick={() => place(PRESETS[i])}
              title={[t.pFutureHint, t.pOutsideHint, t.pOnConeHint][i]}
              className="chip transition-transform hover:-translate-y-px"
              style={{ cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => { place(DEFAULT_B); }}
            className="chip transition-transform hover:-translate-y-px"
            style={{ cursor: "pointer", color: "var(--text-dim)" }}
          >
            {t.reset}
          </button>
        </div>
      </div>
      <SegmentedControl
        label={t.flipLabel}
        value={flip}
        onChange={setFlip}
        options={[
          { value: "off", label: t.off },
          { value: "on", label: t.on },
        ]}
      />
      <p className="text-xs leading-relaxed" style={{ color: "var(--text-faint)" }}>
        {spacelike ? t.flipHint : t.flipDisabled}
      </p>
      <div>
        <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>
          {t.verdictQ}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <PhysicsValue label="Δt" value={fmt2(dt)} unit={t.roUnits} accent={sep === "spacelike" ? "violet" : "cyan"} />
          <PhysicsValue label="Δx" value={fmt2(dx)} unit={t.roUnits} accent={sep === "spacelike" ? "violet" : "cyan"} />
          <PhysicsValue label="Δs²" value={fmt2(s2)} unit={t.roUnits} accent={sep === "lightlike" ? "amber" : sep === "spacelike" ? "violet" : "cyan"} />
        </div>
      </div>
      <div
        className="inset p-3.5"
        style={{ borderLeft: `3.5px solid ${color}` }}
        role="status"
        aria-live="polite"
      >
        <div className="text-sm font-bold" style={{ color }}>{verdict.title}</div>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {verdict.reason}
        </p>
        {showFlip && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--violet)" }}>
            {t.flipNote(vFlip.toFixed(2))}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs" style={{ color: "var(--text-dim)" }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--cyan)" }} />
          {t.legendIn}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--amber)" }} />
          {t.legendOn}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--violet)" }} />
          {t.legendOut}
        </span>
      </div>
    </>
  );

  return (
    <SimulationShell
      simId="causality"
      title={t.title}
      subtitle={t.subtitle}
      difficulty={2}
      concept={t.concept}
      visualization={visualization}
      controls={controls}
      whatYouSee={
        <>
          {t.wys.map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
        </>
      }
      physics={
        <>
          {t.phys.map((p, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>{p}</p>
          ))}
          <KeyIdea>{t.keyIdea}</KeyIdea>
        </>
      }
      equation={
        <>
          <EquationCard
            tex={"\\Delta s^2 = \\Delta x^2 - c^2\\Delta t^2"}
            caption={t.eqCap}
          />
          <div className="mt-3 space-y-1.5 text-sm">
            {[
              { c: "var(--cyan)", s: t.signNeg },
              { c: "var(--amber)", s: t.signZero },
              { c: "var(--violet)", s: t.signPos },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ background: r.c }} />
                <span style={{ color: "var(--text-dim)" }}>{r.s}</span>
              </div>
            ))}
          </div>
        </>
      }
      mathEquation={
        <EquationCard
          tex={"t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)"}
          caption={t.mathCap}
        />
      }
      tryThis={
        <TryThis
          prompt={t.tryPrompt}
          check={() => spacelike && dt < 0}
        >
          <p className="mt-2 text-sm" style={{ color: "var(--text-faint)" }}>{t.tryHint}</p>
        </TryThis>
      }
      assumptions={t.assumptions}
    />
  );
}
