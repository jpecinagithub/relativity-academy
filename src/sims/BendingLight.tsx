import { useState } from "react";
import { lightBendingAngle } from "../physics/generalRelativity";
import { C, M_SUN } from "../physics/constants";
import { fmt } from "../physics/units";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  SegmentedControl,
  PlayPauseControls,
  PresetBar,
  TryThis,
  EquationCard,
  KeyIdea,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Constants ──────────────────────────────────────────────────────────────
const R_SUN = 6.957e8; // solar radius, m (not in constants.ts)
const EXAG = 1000; // drawing exaggeration of the deflection angle
const CABIN_W = 3; // cabin width, m
const RAD2ARCSEC = 206264.80624709636;

const crossTime = CABIN_W / C; // real crossing time of the cabin, s
const sagAtWall = (a: number) => 0.5 * a * crossTime * crossTime;

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  tabElevator: string; tabStar: string;
  viewOutside: string; viewCabin: string; viewLabel: string;
  accel: string; mass: string; impact: string;
  presets: [string, string, string];
  roA: string; roCross: string; roSag: string;
  roAlphaGR: string; roAlphaN: string; roRatio: string;
  sagNote: string; exagNote: string; slowNote: string;
  liveFormula: string; emit: string; screen: string; cabinUp: string;
  lens: string; unlensed: string; starC: string;
  wysElev: string[]; physElev: string[];
  wysStar: string[]; physStar: string[];
  keyIdea: string;
  eqElevCap: string; eqStarCap: string; eqNewtonCap: string;
  tryPrompt: string; revealBtn: string;
  reveal1: string; reveal2: string;
  assumptions: string[];
}

const STRINGS: Record<"en" | "es", Strings> = {
  en: {
    title: "Bending Light",
    subtitle:
      "Fire a laser inside an accelerating elevator, then bend starlight around a massive star. Accelerating frames and gravity both bend light — and the bending can be measured.",
    concept: "Light in gravity",
    tabElevator: "Elevator",
    tabStar: "Star",
    viewOutside: "Outside frame",
    viewCabin: "Cabin frame",
    viewLabel: "Reference frame",
    accel: "Cabin acceleration",
    mass: "Star mass",
    impact: "Impact parameter",
    presets: ["Earth · 9.8", "Mars · 3.7", "Jupiter · 24.8"],
    roA: "Acceleration a",
    roCross: "Beam crossing time",
    roSag: "Beam sag at right wall",
    roAlphaGR: "Deflection α · general relativity",
    roAlphaN: "Deflection α · Newtonian",
    roRatio: "GR / Newton ratio",
    sagNote: "Beam trajectory exaggerated for visibility — the true sag is shown below.",
    exagNote: "Deflection exaggerated ×1000 for visibility — readout shows the true angle.",
    slowNote:
      "Animation slowed down: the photon crosses the cabin in a few seconds on screen. In reality it crosses in 10 nanoseconds.",
    liveFormula: "Live: at the right wall (x = 3 m)",
    emit: "laser",
    screen: "screen",
    cabinUp: "a ↑",
    lens: "star",
    unlensed: "undeflected path",
    starC: "star centre",
    wysElev: [
      "In the outside (inertial) frame the photon flies perfectly straight — light always travels in a straight line for an inertial observer. The cabin simply accelerates upward around it.",
      "Switch to the cabin frame: the cabin is still, but the photon now leaves a curved, downward-sagging trail. Inside an accelerating cabin, the light beam visibly bends.",
      "The sag is real but absurdly small for everyday accelerations (see the readout). The shape of the trail is exact: y = ½·a·(x/c)².",
    ],
    physElev: [
      "The curve is not an optical illusion. In the time t = x/c the photon needs to travel the horizontal distance x, the cabin floor has risen by ½·a·t². Relative to the cabin, the photon has fallen by exactly that amount.",
      "Einstein's leap (the equivalence principle): an accelerating cabin is indistinguishable from a cabin at rest in a gravitational field. If acceleration bends light, gravity must bend light too.",
    ],
    wysStar: [
      "A light ray from a distant star grazes a massive star and is deflected toward it by the angle α. The dashed line shows where the ray would have gone without gravity.",
      "The solid readout angle is the real physical value, α = 4GM/(c²b). Only the drawing is magnified ×1000 so the bend is visible at all.",
      "Drag the sliders: more mass bends light more; a closer approach (smaller impact parameter b) bends it more.",
    ],
    physStar: [
      "General relativity predicts exactly twice the deflection of a naive Newtonian 'light as particles' calculation — and the 1919 Eddington eclipse expedition measured the GR value (about 1.75 arcseconds at the Sun's limb), making Einstein famous.",
      "This is the physics behind gravitational lensing: entire galaxies act as lenses, producing Einstein rings and multiple images of background objects.",
    ],
    keyIdea:
      "Light bends in an accelerating cabin — and, by the equivalence principle, it must bend in a gravitational field. General relativity predicts exactly twice the Newtonian deflection, a prediction confirmed in 1919.",
    eqElevCap: "Sag of the beam in the cabin frame, derived honestly from y = ½·a·t² with t = x/c.",
    eqStarCap: "GR light-bending angle in the weak-field, small-angle limit.",
    eqNewtonCap: "The old Newtonian 'corpuscular' prediction — exactly half the GR value.",
    tryPrompt:
      "Switch to the cabin frame and set the acceleration to 9.8 m/s² with the 3 m wide cabin. How far does the beam sag between the walls?",
    revealBtn: "Reveal the answer",
    reveal1: "sag = ½ × 9.8 × (3 m / c)² ≈ 4.9×10⁻¹⁶ m — about a million times smaller than a proton!",
    reveal2:
      "That is the lesson: the effect is perfectly real but ridiculously tiny on Earth. Only near a star does the bending grow large enough to measure — that is why the 1919 eclipse mattered.",
    assumptions: [
      "Elevator: the cabin moves far below light speed during the photon's crossing, so the non-relativistic y = ½·a·t² applies; the acceleration is uniform.",
      "Star: weak-field, small-angle approximation (α = 4GM/c²b). The deflection is drawn ×1000 — the readout is the true physical angle.",
      "The photon is treated as a test particle; the star's own motion and the photon's back-reaction are ignored.",
    ],
  },
  es: {
    title: "La luz se curva",
    subtitle:
      "Dispara un láser dentro de un ascensor acelerado y luego curva la luz de una estrella alrededor de una estrella masiva. Los sistemas acelerados y la gravedad curvan la luz — y la curvatura se puede medir.",
    concept: "La luz en la gravedad",
    tabElevator: "Ascensor",
    tabStar: "Estrella",
    viewOutside: "Vista exterior",
    viewCabin: "Vista cabina",
    viewLabel: "Sistema de referencia",
    accel: "Aceleración de la cabina",
    mass: "Masa de la estrella",
    impact: "Parámetro de impacto",
    presets: ["Tierra · 9,8", "Marte · 3,7", "Júpiter · 24,8"],
    roA: "Aceleración a",
    roCross: "Tiempo de cruce del haz",
    roSag: "Caída del haz en la pared derecha",
    roAlphaGR: "Desviación α · relatividad general",
    roAlphaN: "Desviación α · newtoniana",
    roRatio: "Cociente RG / Newton",
    sagNote: "Trayectoria del haz exagerada para verla — la caída real se muestra abajo.",
    exagNote: "Desviación exagerada ×1000 para verla — la lectura muestra el ángulo real.",
    slowNote:
      "Animación ralentizada: el fotón cruza la cabina en unos segundos en pantalla. En realidad cruza en 10 nanosegundos.",
    liveFormula: "En directo: en la pared derecha (x = 3 m)",
    emit: "láser",
    screen: "pantalla",
    cabinUp: "a ↑",
    lens: "estrella",
    unlensed: "trayectoria sin desviar",
    starC: "centro estelar",
    wysElev: [
      "En el sistema exterior (inercial) el fotón vuela perfectamente recto — la luz siempre viaja en línea recta para un observador inercial. La cabina simplemente acelera hacia arriba a su alrededor.",
      "Cambia a la vista de cabina: la cabina está quieta, pero el fotón deja una estela curvada hacia abajo. Dentro de una cabina acelerada, el haz de luz se curva visiblemente.",
      "La caída es real pero absurdamente pequeña para aceleraciones cotidianas (ver lectura). La forma de la estela es exacta: y = ½·a·(x/c)².",
    ],
    physElev: [
      "La curva no es una ilusión óptica. En el tiempo t = x/c que el fotón tarda en recorrer la distancia horizontal x, el suelo de la cabina ha subido ½·a·t². Respecto a la cabina, el fotón ha caído exactamente esa cantidad.",
      "El salto de Einstein (principio de equivalencia): una cabina acelerada es indistinguible de una cabina en reposo en un campo gravitatorio. Si la aceleración curva la luz, la gravedad también debe curvarla.",
    ],
    wysStar: [
      "Un rayo de luz de una estrella lejana roza una estrella masiva y se desvía hacia ella un ángulo α. La línea discontinua muestra por dónde habría pasado el rayo sin gravedad.",
      "El ángulo de la lectura es el valor físico real, α = 4GM/(c²b). Solo el dibujo está ampliado ×1000 para que la curvatura se vea.",
      "Mueve los controles: más masa curva más la luz; un paso más cercano (menor parámetro de impacto b) también la curva más.",
    ],
    physStar: [
      "La relatividad general predice exactamente el doble de desviación que el cálculo newtoniano ingenuo de la «luz como partículas» — y la expedición del eclipse de Eddington en 1919 midió el valor de la RG (unos 1,75 segundos de arco en el limbo solar), lo que hizo famoso a Einstein.",
      "Esta es la física de las lentes gravitacionales: galaxias enteras actúan como lentes, produciendo anillos de Einstein e imágenes múltiples de objetos de fondo.",
    ],
    keyIdea:
      "La luz se curva en una cabina acelerada — y, por el principio de equivalencia, debe curvarse en un campo gravitatorio. La relatividad general predice exactamente el doble de la desviación newtoniana, una predicción confirmada en 1919.",
    eqElevCap: "Caída del haz en el sistema de la cabina, deducida honestamente de y = ½·a·t² con t = x/c.",
    eqStarCap: "Ángulo de desviación de la luz en RG, en el límite de campo débil y ángulo pequeño.",
    eqNewtonCap: "La antigua predicción newtoniana «corpuscular» — exactamente la mitad del valor de la RG.",
    tryPrompt:
      "Cambia a la vista de cabina y ajusta la aceleración a 9,8 m/s² con la cabina de 3 m de ancho. ¿Cuánto cae el haz entre las paredes?",
    revealBtn: "Mostrar la respuesta",
    reveal1: "caída = ½ × 9,8 × (3 m / c)² ≈ 4,9×10⁻¹⁶ m — ¡un millón de veces menor que un protón!",
    reveal2:
      "Esa es la lección: el efecto es perfectamente real pero ridículamente diminuto en la Tierra. Solo cerca de una estrella la curvatura crece lo suficiente para medirse — por eso importó el eclipse de 1919.",
    assumptions: [
      "Ascensor: la cabina se mueve muy por debajo de la velocidad de la luz durante el cruce del fotón, así que aplica la fórmula no relativista y = ½·a·t²; la aceleración es uniforme.",
      "Estrella: aproximación de campo débil y ángulo pequeño (α = 4GM/c²b). La desviación se dibuja ×1000 — la lectura es el ángulo físico real.",
      "El fotón se trata como partícula de prueba; se ignoran el movimiento propio de la estrella y la reacción del fotón.",
    ],
  },
};

// ─── Elevator canvas ──────────────────────────────────────────────────────────
const VW = 560;
const VH = 360;
const CX0 = 70; // cabin left wall, px
const CX1 = 490; // cabin right wall, px
const CY0 = 60; // cabin ceiling, px
const CY1 = 300; // cabin floor, px
const YL = 150; // laser height, px
const SAG_PX = 88; // exaggerated visual sag at the right wall, px

function ElevatorCanvas({
  view, p, s,
}: {
  view: "outside" | "cabin";
  p: number; // photon progress 0..1
  s: Strings;
}) {
  const px = CX0 + p * (CX1 - CX0);
  // Cabin-frame trajectory: y = sag * (x/W)^2, drawn exaggerated
  const yAt = (t: number) => YL + SAG_PX * t * t;
  const trace: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * p;
    trace.push(`${CX0 + t * (CX1 - CX0)},${yAt(t)}`);
  }
  const py = view === "cabin" ? yAt(p) : YL;

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="h-auto w-full"
      role="img"
      aria-label={s.tabElevator}
    >
      {/* cabin */}
      <rect
        x={CX0} y={CY0} width={CX1 - CX0} height={CY1 - CY0}
        fill="none" stroke="var(--border)" strokeWidth={2.5}
      />
      {/* floor hatch lines */}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={i}
          x1={CX0 + 20 + i * 44} y1={CY1 - 8} x2={CX0 + 34 + i * 44} y2={CY1}
          stroke="var(--text-faint)" strokeWidth={1.5}
        />
      ))}
      {/* acceleration arrow (cabin frame: gravity-like field) */}
      {view === "cabin" && (
        <g>
          <line x1={CX1 + 34} y1={CY1 - 10} x2={CX1 + 34} y2={CY0 + 30}
            stroke="var(--amber)" strokeWidth={2.5} markerEnd="url(#arrA)" />
          <text x={CX1 + 42} y={CY0 + 52} fontSize={13} fontWeight={700} fill="var(--amber)">{s.cabinUp}</text>
        </g>
      )}
      {/* laser emitter on left wall */}
      <rect x={CX0 - 12} y={YL - 8} width={12} height={16} fill="var(--amber)" />
      <text x={CX0 - 14} y={YL - 16} fontSize={11} fill="var(--text-dim)" textAnchor="end">{s.emit}</text>
      {/* screen on right wall + impact mark */}
      <rect x={CX1} y={YL - 8} width={10} height={16 + SAG_PX + 8} fill="var(--border)" />
      <text x={CX1 + 22} y={YL + 24} fontSize={11} fill="var(--text-dim)">{s.screen}</text>
      <circle
        cx={CX1 + 5} cy={view === "cabin" ? yAt(1) : YL}
        r={3.5} fill="var(--cyan)"
      >
        <title>{s.roSag}</title>
      </circle>
      {/* straight reference path (outside truth) */}
      <line
        x1={CX0} y1={YL} x2={CX1} y2={YL}
        stroke="var(--text-faint)" strokeWidth={1.2} strokeDasharray="5 5"
      />
      {/* beam so far */}
      {view === "outside" ? (
        <line x1={CX0} y1={YL} x2={px} y2={YL} stroke="var(--amber)" strokeWidth={3} />
      ) : (
        <polyline
          points={trace.join(" ")}
          fill="none" stroke="var(--amber)" strokeWidth={3} strokeLinecap="round"
        />
      )}
      {/* photon */}
      <circle cx={px} cy={py} r={6} fill="var(--amber)">
        <animate attributeName="r" values="6;7.5;6" dur="1.2s" repeatCount="indefinite" />
      </circle>
      {/* frame label */}
      <text x={VW / 2} y={34} fontSize={14} fontWeight={700} fill="var(--text)" textAnchor="middle">
        {view === "outside" ? s.viewOutside : s.viewCabin}
      </text>
      <text x={VW / 2} y={VH - 12} fontSize={11} fill="var(--text-faint)" textAnchor="middle">
        {view === "cabin" ? s.sagNote : s.slowNote}
      </text>
      <defs>
        <marker id="arrA" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--amber)" />
        </marker>
      </defs>
    </svg>
  );
}

// ─── Star canvas ────────────────────────────────────────────────────────────
const SW = 620;
const SH = 380;
const SX = 300; // star centre x
const SY = 190; // star centre y
const SR = 42; // star radius, px (represents R*)

function StarCanvas({
  massKg, bR, s,
}: {
  massKg: number; bR: number; s: Strings;
}) {
  const alpha = lightBendingAngle(massKg, bR * R_SUN); // true angle, rad
  const drawAngle = Math.min(alpha * EXAG, 0.38); // exaggerate, clamp for sanity
  const bPx = SR + 14 + ((bR - 1) / 19) * 110; // visual height of the ray
  const y0 = SY - bPx;
  const xIn = 12;
  const xBend = SX - 8;
  const xOut = SW - 12;
  const yOut = y0 + Math.tan(drawAngle) * (xOut - xBend);
  const yStraight = y0; // undeflected continuation

  return (
    <svg viewBox={`0 0 ${SW} ${SH}`} className="h-auto w-full" role="img" aria-label={s.tabStar}>
      {/* distant source label */}
      <text x={xIn} y={y0 - 12} fontSize={11} fill="var(--text-dim)">✶</text>
      {/* undeflected path (dashed) */}
      <line x1={xBend} y1={yStraight} x2={xOut} y2={yStraight}
        stroke="var(--text-faint)" strokeWidth={1.2} strokeDasharray="6 5" />
      <text x={xOut - 4} y={yStraight - 8} fontSize={11} fill="var(--text-faint)" textAnchor="end">
        {s.unlensed}
      </text>
      {/* incoming ray */}
      <line x1={xIn} y1={y0} x2={xBend} y2={y0} stroke="var(--amber)" strokeWidth={2.5} />
      {/* bent ray */}
      <line x1={xBend} y1={y0} x2={xOut} y2={yOut} stroke="var(--amber)" strokeWidth={2.5} />
      {/* angle arc near the bend point */}
      <path
        d={`M ${xBend + 46} ${y0} A 46 46 0 0 1 ${xBend + 46 * Math.cos(drawAngle)} ${y0 + 46 * Math.sin(drawAngle)}`}
        fill="none" stroke="var(--cyan)" strokeWidth={1.6}
      />
      <text x={xBend + 56} y={y0 + 26} fontSize={13} fontWeight={700} fill="var(--cyan)">α</text>
      {/* impact parameter guide */}
      <line x1={SX + SR + 18} y1={SY} x2={SX + SR + 18} y2={y0}
        stroke="var(--violet)" strokeWidth={1.2} strokeDasharray="3 3" />
      <text x={SX + SR + 24} y={(SY + y0) / 2} fontSize={11} fill="var(--violet)">b</text>
      {/* star */}
      <circle cx={SX} cy={SY} r={SR + 10} fill="var(--amber)" opacity={0.18} />
      <circle cx={SX} cy={SY} r={SR} fill="var(--amber)" opacity={0.9} />
      <text x={SX} y={SY + SR + 22} fontSize={11} fill="var(--text-dim)" textAnchor="middle">{s.lens}</text>
      <text x={SX} y={SY + 4} fontSize={10} fill="#1a1206" textAnchor="middle">{s.starC}</text>
      {/* title + exaggeration badge */}
      <text x={SW / 2} y={30} fontSize={14} fontWeight={700} fill="var(--text)" textAnchor="middle">
        {s.tabStar}
      </text>
      <text x={SW / 2} y={SH - 10} fontSize={11} fill="var(--text-faint)" textAnchor="middle">
        {s.exagNote}
      </text>
    </svg>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function BendingLight() {
  const { lang, g } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [tab, setTab] = useState<"elevator" | "star">("elevator");
  const [view, setView] = useState<"outside" | "cabin">("outside");
  const [a, setA] = useState(15);
  const [playing, setPlaying] = useState(!reduced);
  const [p, setP] = useState(0);
  const [logM, setLogM] = useState(0); // 10^logM solar masses
  const [bR, setBR] = useState(1); // impact parameter in stellar radii
  const [revealed, setRevealed] = useState(false);

  useRaf((dt) => {
    if (tab !== "elevator") return;
    setP((prev) => {
      const next = prev + dt / 4; // one crossing ≈ 4 s of screen time
      return next >= 1 ? 0 : next;
    });
  }, playing && !reduced);

  const massKg = Math.pow(10, logM) * M_SUN;
  const alphaGR = lightBendingAngle(massKg, bR * R_SUN);
  const alphaN = alphaGR / 2;
  const arcsec = (rad: number) => (rad * RAD2ARCSEC).toLocaleString(
    lang === "es" ? "es-ES" : "en-US", { maximumFractionDigits: 3 },
  );

  const elevPresets = [9.8, 3.7, 24.8];
  const starPresets = [
    { label: lang === "es" ? "Limbo solar" : "Sun's limb", logM: 0, b: 1 },
    { label: "5 M☉ · b = 3 R*", logM: Math.log10(5), b: 3 },
    { label: "50 M☉ · b = 2 R*", logM: Math.log10(50), b: 2 },
  ];

  return (
    <SimulationShell
      simId="bending-light"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div>
          <div className="mb-3 flex justify-center">
            <SegmentedControl
              value={tab}
              onChange={setTab}
              options={[
                { value: "elevator", label: s.tabElevator },
                { value: "star", label: s.tabStar },
              ]}
            />
          </div>
          {tab === "elevator" ? (
            <>
              <ElevatorCanvas view={view} p={p} s={s} />
              <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>
                <span className="font-mono2 font-semibold" style={{ color: "var(--cyan)" }}>
                  {s.liveFormula}:&nbsp;y = ½·{fmt(a, lang)}·(3/{lang === "es" ? "c" : "c"})² =&nbsp;
                  {fmt(sagAtWall(a), lang)}&nbsp;m
                </span>
              </p>
            </>
          ) : (
            <StarCanvas massKg={massKg} bR={bR} s={s} />
          )}
        </div>
      }
      controls={
        <div className="space-y-5">
          {tab === "elevator" ? (
            <>
              <SegmentedControl
                label={s.viewLabel}
                value={view}
                onChange={(v) => { setView(v); setP(0); }}
                options={[
                  { value: "outside", label: s.viewOutside },
                  { value: "cabin", label: s.viewCabin },
                ]}
              />
              <ParamSlider
                label={s.accel}
                value={a} min={1} max={50} step={0.1}
                onChange={setA}
                format={(v) => `${fmt(v, lang)} m/s²`}
                accent="amber"
              />
              <PresetBar
                presets={elevPresets.map((_, i) => ({ label: s.presets[i] }))}
                onPick={(i) => setA(elevPresets[i])}
              />
              <PlayPauseControls
                playing={playing}
                onToggle={() => setPlaying((pl) => !pl)}
                onReset={() => setP(0)}
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <PhysicsValue label={s.roA} value={fmt(a, lang)} unit="m/s²" accent="amber" />
                <PhysicsValue label={s.roCross} value={fmt(crossTime, lang)} unit="s" accent="cyan" />
                <PhysicsValue label={s.roSag} value={fmt(sagAtWall(a), lang)} unit="m" accent="violet" />
              </div>
            </>
          ) : (
            <>
              <ParamSlider
                label={s.mass}
                value={logM} min={0} max={2} step={0.01}
                onChange={setLogM}
                format={(v) => `${fmt(Math.pow(10, v), lang)} M☉`}
                accent="amber"
              />
              <ParamSlider
                label={s.impact}
                value={bR} min={1} max={20} step={0.5}
                onChange={setBR}
                format={(v) => `${fmt(v, lang)} R* · ${fmt((v * R_SUN) / 1000, lang)} km`}
                accent="violet"
              />
              <PresetBar
                presets={starPresets.map((x) => ({ label: x.label }))}
                onPick={(i) => { setLogM(starPresets[i].logM); setBR(starPresets[i].b); }}
              />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <PhysicsValue
                  label={s.roAlphaGR}
                  value={`${arcsec(alphaGR)}″`}
                  accent="cyan"
                  title="α = 4GM/(c²b)"
                />
                <PhysicsValue
                  label={s.roAlphaN}
                  value={`${arcsec(alphaN)}″`}
                  accent="amber"
                  title="α = 2GM/(c²b)"
                />
                <PhysicsValue
                  label={s.roRatio}
                  value={(alphaGR / alphaN).toFixed(2)}
                  accent="violet"
                />
              </div>
            </>
          )}
        </div>
      }
      whatYouSee={
        <div className="space-y-2">
          {(tab === "elevator" ? s.wysElev : s.wysStar).map((t, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{t}</p>
          ))}
        </div>
      }
      physics={
        <div className="space-y-2">
          <KeyIdea>{s.keyIdea}</KeyIdea>
          {(tab === "elevator" ? s.physElev : s.physStar).map((t, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{t}</p>
          ))}
        </div>
      }
      equation={
        <div className="space-y-4">
          {tab === "elevator" ? (
            <EquationCard
              tex={`y = \\tfrac12 a (x/c)^2 = \\tfrac12 \\cdot ${fmt(a, lang)}\\;\\mathrm{m/s^2}\\left(\\frac{3\\;\\mathrm{m}}{c}\\right)^2 = ${fmt(sagAtWall(a), lang)}\\;\\mathrm{m}`}
              caption={s.eqElevCap}
            />
          ) : (
            <>
              <EquationCard tex="\\alpha = 4GM/(c^2b)" caption={s.eqStarCap} />
              <EquationCard tex="\\alpha_N = 2GM/(c^2b)" caption={s.eqNewtonCap} />
            </>
          )}
        </div>
      }
      assumptions={s.assumptions}
      tryThis={
        tab === "elevator" ? (
          <TryThis
            prompt={s.tryPrompt}
            check={() => view === "cabin" && Math.abs(a - 9.8) < 0.05}
          >
            <button
              className="btn-ghost mt-2 !px-3 !py-1.5 text-sm"
              onClick={() => setRevealed(true)}
            >
              {s.revealBtn}
            </button>
            {revealed && (
              <div className="mt-2 space-y-1 text-sm" style={{ color: "var(--text-dim)" }}>
                <p className="font-mono2 font-semibold" style={{ color: "var(--cyan)" }}>{s.reveal1}</p>
                <p>{s.reveal2}</p>
              </div>
            )}
          </TryThis>
        ) : undefined
      }
      related={[
        { to: "/lab/elevator", label: g.nav?.lab ?? "Spacetime Lab" },
      ]}
    />
  );
}
