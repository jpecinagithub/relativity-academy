import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AlertTriangle } from "lucide-react";
import { schwarzschildRadius, formatDuration } from "../physics/generalRelativity";
import { M_SUN, M_EARTH, G, isSane } from "../physics/constants";
import { fmt, fmtMass, fmtDistance } from "../physics/units";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  SegmentedControl,
  EquationCard,
  KeyIdea,
  TryThis,
  PlayPauseControls,
  MathOnly,
  useG,
} from "../components/ui";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

// NOTE: @react-three/fiber + three are imported statically here, but this whole
// module is itself loaded through React.lazy in sims/registry.ts — so the 3D
// libraries are only downloaded when this simulator is opened, never on the
// landing page.

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  canvasLabel: string;
  presetLabel: string;
  pEarth: string; pSun: string; pNeutron: string; pBlackHole: string;
  massFactor: string; massFactorHint: string;
  exagg: string; exaggHint: string;
  viewLabel: string; viewSolid: string; viewWire: string;
  honestyTitle: string; honestyItems: string[];
  legendSheet: string; legendHorizon: string; legendParticle: string; legendCore: string;
  illustrativeNote: string;
  roMass: string; roRs: string; roDepth: string; roDepthNote: string;
  roPeriod: string; roOrbitR: string;
  wys: string[]; phys: string[]; keyIdea: string;
  eqRsCap: string; eqVisualCap: string;
  tryPrompt: string; assumptions: string[];
}

const STRINGS: Record<"en" | "es", Strings> = {
  en: {
    title: "Spacetime Curvature Lab",
    subtitle:
      "The famous rubber-sheet analogy: place a mass on the fabric of space and watch it sag — then ask what the model gets wrong.",
    concept: "Curved spacetime",
    canvasLabel:
      "Interactive 3D rubber-sheet visualization of spacetime curvature",
    presetLabel: "Central body",
    pEarth: "Earth",
    pSun: "Sun",
    pNeutron: "Neutron star",
    pBlackHole: "Black hole",
    massFactor: "Mass multiplier",
    massFactorHint: "Logarithmic: 0.1× to 1000× the preset mass.",
    exagg: "Well depth · visual exaggeration",
    exaggHint:
      "Purely visual: deepens the well so you can see it. It changes no physics.",
    viewLabel: "Sheet rendering",
    viewSolid: "Solid",
    viewWire: "Wireframe",
    honestyTitle: "What is misleading about this model?",
    honestyItems: [
      "It shows curved 2-D space, not 4-D spacetime. For everyday gravity — like Earth's pull on you — the curvature of time matters far more than the curvature of space, and time appears nowhere on this sheet.",
      "The sheet sags because an external gravity pulls it down — but that gravity is exactly what the model is trying to explain. The analogy is circular: it uses gravity to explain gravity.",
      "Objects don't roll “downhill” in general relativity. There is no downhill. Bodies follow the straightest possible paths — geodesics — through curved spacetime; the sheet's slopes are not forces.",
      "The model shows no time dilation. Two clocks at different depths of the well tick at different rates in real GR — the rubber sheet cannot show you that.",
    ],
    legendSheet: "Illustrative embedding of space",
    legendHorizon: "Schwarzschild radius (visual scale)",
    legendParticle: "Test particle (illustrative orbit)",
    legendCore: "Central mass",
    illustrativeNote: "Illustrative orbits — not true geodesics",
    roMass: "Central mass M",
    roRs: "Schwarzschild radius rₛ",
    roDepth: "Well depth at rₛ",
    roDepthNote: "visual units",
    roPeriod: "Innermost orbit period",
    roOrbitR: "Innermost orbit radius",
    wys: [
      "A square grid represents a slice of space. Adding a mass dents it into a well — deeper and steeper for heavier bodies. The amber ring marks the Schwarzschild radius on a purely visual scale.",
      "Six test particles circle the well. Their relative speeds follow Kepler's law (inner orbits are faster), but the absolute animation speed is illustrative, not to scale.",
      "Drag to rotate the view, scroll to zoom. Switch between solid and wireframe to inspect how the grid itself is stretched by the well.",
      "Raise the mass multiplier: the well deepens and the physical readouts grow — but the depth you see is deliberately exaggerated, so compare numbers, not just pictures.",
    ],
    phys: [
      "In general relativity, mass and energy curve spacetime, and curved spacetime guides how matter moves. John Archibald Wheeler's famous summary — “Matter tells spacetime how to curve; curved spacetime tells matter how to move.” — is a conceptual simplification, not the field equations themselves.",
      "The well is inspired by the Flamm paraboloid — the shape you get by embedding the equatorial slice of Schwarzschild spacetime in 3-D — but here it is simplified, smoothed and exaggerated for visibility. The real geometry is four-dimensional and cannot be drawn.",
      "The particles ride Newtonian circles (v = √(GM/r)) drawn on the sheet for illustration. Real orbits are geodesics of the curved spacetime metric, which include effects such as perihelion precession that this toy model cannot show.",
    ],
    keyIdea:
      "Gravity is not a force pulling things down a slope — it is the shape of spacetime itself. The rubber sheet helps you picture “shape”, but the physics lives in four dimensions, and mostly in time.",
    eqRsCap:
      "Schwarzschild radius: the size a mass would need to be compressed to for its escape velocity to reach c.",
    eqVisualCap:
      "The visual model drawn above (illustrative embedding — inspired by, but not equal to, the exact Flamm paraboloid).",
    tryPrompt:
      "Start from the Sun preset. Adjust the mass multiplier until the Schwarzschild radius is about 30 km — the scale of a stellar-mass black hole.",
    assumptions: [
      "2-D embedding analogy: a dented sheet of space is not literal four-dimensional spacetime.",
      "Test-particle orbits are Newtonian circles on the sheet, not geodesics of the Schwarzschild metric.",
      "Static snapshot: the field itself has no dynamics here — no gravitational waves, no frame dragging.",
      "Well depth is log-compressed and exaggerated for visibility; the vertical axis carries no physical units.",
      "Animation time is illustrative: relative orbital speeds follow Kepler's law, but the absolute rate is chosen for watchability.",
    ],
  },
  es: {
    title: "Laboratorio de curvatura del espaciotiempo",
    subtitle:
      "La famosa analogía de la lámina de goma: coloca una masa sobre el tejido del espacio y mírala hundirse; después pregúntate qué falla en el modelo.",
    concept: "Espaciotiempo curvo",
    canvasLabel:
      "Visualización 3D interactiva de la curvatura del espaciotiempo (analogía de la lámina de goma)",
    presetLabel: "Cuerpo central",
    pEarth: "Tierra",
    pSun: "Sol",
    pNeutron: "Estrella de neutrones",
    pBlackHole: "Agujero negro",
    massFactor: "Multiplicador de masa",
    massFactorHint: "Logarítmico: de 0,1× a 1000× la masa del cuerpo.",
    exagg: "Profundidad del pozo · exageración visual",
    exaggHint:
      "Puramente visual: ahonda el pozo para que se vea. No cambia ninguna física.",
    viewLabel: "Representación de la lámina",
    viewSolid: "Sólida",
    viewWire: "Alambre",
    honestyTitle: "¿Qué tiene de engañoso este modelo?",
    honestyItems: [
      "Muestra espacio 2D curvado, no espaciotiempo 4D. Para la gravedad cotidiana —como la que te atrae hacia la Tierra— la curvatura del tiempo importa mucho más que la del espacio, y el tiempo no aparece en esta lámina.",
      "La lámina se hunde porque una gravedad externa tira de ella hacia abajo, pero esa gravedad es justo lo que el modelo intenta explicar. La analogía es circular: usa la gravedad para explicar la gravedad.",
      "En relatividad general los objetos no «ruedan cuesta abajo». No hay cuesta abajo. Los cuerpos siguen los caminos más rectos posibles —geodésicas— en el espaciotiempo curvo; las pendientes de la lámina no son fuerzas.",
      "El modelo no muestra la dilatación temporal. Dos relojes a distinta profundidad del pozo marcan ritmos distintos en la RG real, y la lámina de goma no puede mostrarte eso.",
    ],
    legendSheet: "Representación ilustrativa del espacio",
    legendHorizon: "Radio de Schwarzschild (escala visual)",
    legendParticle: "Partícula de prueba (órbita ilustrativa)",
    legendCore: "Masa central",
    illustrativeNote: "Órbitas ilustrativas — no son geodésicas reales",
    roMass: "Masa central M",
    roRs: "Radio de Schwarzschild rₛ",
    roDepth: "Profundidad del pozo en rₛ",
    roDepthNote: "unidades visuales",
    roPeriod: "Periodo de la órbita interior",
    roOrbitR: "Radio de la órbita interior",
    wys: [
      "Una cuadrícula representa una porción del espacio. Al añadir una masa se hunde formando un pozo, más profundo y empinado cuanto mayor es el cuerpo. El anillo ámbar marca el radio de Schwarzschild en una escala puramente visual.",
      "Seis partículas de prueba orbitan el pozo. Sus velocidades relativas siguen la ley de Kepler (las órbitas interiores son más rápidas), pero la velocidad absoluta de la animación es ilustrativa, no está a escala.",
      "Arrastra para rotar la vista y usa la rueda para acercar. Cambia entre vista sólida y de alambre para ver cómo la propia cuadrícula se estira por el pozo.",
      "Sube el multiplicador de masa: el pozo se ahonda y los valores físicos crecen, pero la profundidad que ves está exagerada a propósito; compara los números, no solo las imágenes.",
    ],
    phys: [
      "En relatividad general, la masa y la energía curvan el espaciotiempo, y el espaciotiempo curvo guía cómo se mueve la materia. El famoso resumen de John Archibald Wheeler —«La materia le dice al espaciotiempo cómo curvarse; el espaciotiempo curvo le dice a la materia cómo moverse»— es una simplificación conceptual, no las ecuaciones de campo.",
      "El pozo está inspirado en el paraboloide de Flamm —la forma que se obtiene al embeber la sección ecuatorial del espaciotiempo de Schwarzschild en 3D—, pero aquí está simplificado, suavizado y exagerado para que se vea. La geometría real es tetradimensional y no se puede dibujar.",
      "Las partículas describen círculos newtonianos (v = √(GM/r)) dibujados sobre la lámina como ilustración. Las órbitas reales son geodésicas de la métrica del espaciotiempo curvo, que incluyen efectos como la precesión del perihelio que este modelo no puede mostrar.",
    ],
    keyIdea:
      "La gravedad no es una fuerza que tira de las cosas por una pendiente: es la forma del propio espaciotiempo. La lámina de goma ayuda a imaginar esa «forma», pero la física vive en cuatro dimensiones, y sobre todo en el tiempo.",
    eqRsCap:
      "Radio de Schwarzschild: el tamaño al que habría que comprimir una masa para que su velocidad de escape alcance c.",
    eqVisualCap:
      "El modelo visual dibujado arriba (representación ilustrativa: inspirada en el paraboloide de Flamm exacto, pero no igual a él).",
    tryPrompt:
      "Parte del Sol. Ajusta el multiplicador de masa hasta que el radio de Schwarzschild sea de unos 30 km, la escala de un agujero negro estelar.",
    assumptions: [
      "Analogía de representación 2D: una lámina de espacio hundida no es literalmente el espaciotiempo tetradimensional.",
      "Las órbitas de las partículas de prueba son círculos newtonianos sobre la lámina, no geodésicas de la métrica de Schwarzschild.",
      "Instantánea estática: el campo no tiene dinámica propia aquí; no hay ondas gravitatorias ni arrastre del sistema de referencia.",
      "La profundidad del pozo está comprimida logarítmicamente y exagerada para que se vea; el eje vertical no tiene unidades físicas.",
      "El tiempo de la animación es ilustrativo: las velocidades orbitales relativas siguen la ley de Kepler, pero el ritmo absoluto se elige para poder observarlo.",
    ],
  },
};

// ─── Visual model (illustrative embedding — NOT the exact Flamm paraboloid) ──
const SHEET_SIZE = 20; // scene units, half-width 10
const SHEET_SEG = 60;
const SOFT = 1.2; // softening, scene units
const HORIZON_R = 0.9; // visual horizon radius, scene units
const ORBIT_RS = [3, 4.5, 6, 7.5, 9, 10.5]; // orbit radii in Schwarzschild radii
const AMP0 = 3.0;

/** Log-compressed visual depth factor from the physical mass (visual only). */
function depthFactorOf(massKg: number): number {
  if (!isSane(massKg) || massKg <= 0) return 0;
  return Math.log10(1 + massKg / M_EARTH) / 6;
}

/** Visual well depth at scene radius r. `amp` already includes exaggeration. */
function depthAt(r: number, amp: number): number {
  return amp / (r + SOFT);
}

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

type PresetId = "earth" | "sun" | "ns" | "bh";
const PRESET_MASS: Record<PresetId, number> = {
  earth: M_EARTH,
  sun: M_SUN,
  ns: 1.4 * M_SUN,
  bh: 10 * M_SUN,
};

// ─── 3D scene pieces ────────────────────────────────────────────────────────
function Sheet({ amp, wireframe }: { amp: number; wireframe: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SHEET_SIZE, SHEET_SIZE, SHEET_SEG, SHEET_SEG);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const shallow = new THREE.Color(cssVar("--cyan", "#3ee6ff"));
    const deep = new THREE.Color(cssVar("--violet", "#a78bfa"));
    const tmp = new THREE.Color();
    const dMax = Math.max(depthAt(HORIZON_R, amp), 1e-6);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const r = Math.hypot(x, z);
      const d = depthAt(r, amp);
      pos.setY(i, -d);
      const t = Math.min(1, d / dMax);
      tmp.copy(shallow).lerp(deep, Math.pow(t, 0.65));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [amp]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        wireframe={wireframe}
        side={THREE.DoubleSide}
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  );
}

function OrbitPath({ radius, amp }: { radius: number; amp: number }) {
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          radius * Math.cos(a),
          -depthAt(radius, amp) + 0.02,
          radius * Math.sin(a),
        ),
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius, amp]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <lineLoop geometry={geo}>
      <lineBasicMaterial color={cssVar("--cyan", "#3ee6ff")} transparent opacity={0.3} />
    </lineLoop>
  );
}

function Particles({
  amp,
  playing,
}: {
  amp: number;
  playing: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const angles = useRef<number[]>(
    ORBIT_RS.map((_, i) => (i / ORBIT_RS.length) * Math.PI * 2),
  );
  const radii = useMemo(() => ORBIT_RS.map((k) => k * 0.9), []);
  const omegas = useMemo(() => {
    // Relative angular speeds are physical (Kepler: ω ∝ r^-3/2); the absolute
    // animation rate is illustrative, chosen so the innermost orbit takes ~9 s.
    const base = (2 * Math.PI) / 9;
    return radii.map((r) => base * Math.pow(radii[0] / r, 1.5));
  }, [radii]);

  useFrame((_, dt) => {
    if (document.hidden) return; // pause rendering work when the tab is hidden
    const g = group.current;
    if (!g) return;
    const dtc = Math.min(dt, 0.05);
    for (let i = 0; i < ORBIT_RS.length; i++) {
      if (playing) angles.current[i] += omegas[i] * dtc;
      const r = radii[i];
      const a = angles.current[i];
      const m = g.children[i] as THREE.Mesh | undefined;
      if (m) m.position.set(r * Math.cos(a), -depthAt(r, amp) + 0.14, r * Math.sin(a));
    }
  });

  return (
    <group ref={group}>
      {radii.map((r, i) => (
        <mesh key={i} position={[r, -depthAt(r, amp) + 0.14, 0]}>
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial
            color={cssVar("--amber", "#f5a524")}
            emissive={cssVar("--amber", "#f5a524")}
            emissiveIntensity={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function CurvatureScene({
  amp,
  wireframe,
  playing,
}: {
  amp: number;
  wireframe: boolean;
  playing: boolean;
}) {
  const amber = cssVar("--amber", "#f5a524");
  const radii = useMemo(() => ORBIT_RS.map((k) => k * 0.9), []);
  return (
    <Canvas
      dpr={[1, 2]} // cap devicePixelRatio at 2
      camera={{ position: [0, 8.5, 12.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <pointLight position={[0, 1.5, 0]} intensity={6} distance={18} color={amber} />
      <Sheet amp={amp} wireframe={wireframe} />
      {/* central mass */}
      <mesh position={[0, -depthAt(0, amp) + 0.25, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={amber} emissive={amber} emissiveIntensity={1.6} roughness={0.3} />
      </mesh>
      {/* Schwarzschild-radius marker (visual scale) */}
      <mesh
        position={[0, -depthAt(HORIZON_R, amp) + 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[HORIZON_R - 0.035, HORIZON_R + 0.035, 96]} />
        <meshBasicMaterial color={amber} transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {radii.map((r) => (
        <OrbitPath key={r} radius={r} amp={amp} />
      ))}
      <Particles amp={amp} playing={playing} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.55}
      />
    </Canvas>
  );
}

// ─── Honesty panel ──────────────────────────────────────────────────────────
function HonestyPanel({ s }: { s: Strings }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="panel overflow-hidden"
      style={open ? { borderColor: "var(--amber)" } : undefined}
    >
      <button
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <AlertTriangle size={16} style={{ color: "var(--amber)" }} aria-hidden />
        <span className="text-sm font-semibold">{s.honestyTitle}</span>
        <span className="ml-auto text-lg leading-none" style={{ color: "var(--text-faint)" }} aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <ol
          className="space-y-3 border-t px-4 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          {s.honestyItems.map((it, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed">
              <span
                className="font-mono2 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold"
                style={{ background: "var(--amber-dim)", color: "var(--amber)" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <span style={{ color: "var(--text-dim)" }}>{it}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function CurvatureLab() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [presetId, setPresetId] = useState<PresetId>("sun");
  const [logFactor, setLogFactor] = useState(0); // factor = 10^logFactor, −1…3
  const [exagg, setExagg] = useState(1);
  const [wireframe, setWireframe] = useState(false);
  const [playing, setPlaying] = useState(!reduced);

  const factor = Math.pow(10, logFactor);
  const massKg = PRESET_MASS[presetId] * factor;
  const df = depthFactorOf(massKg);
  const amp = exagg * df * AMP0;

  const rs = schwarzschildRadius(massKg);
  const rInner = 3 * rs;
  const period = isSane(rs) && rs > 0
    ? 2 * Math.PI * Math.sqrt(Math.pow(rInner, 3) / (G * massKg))
    : NaN;
  const depthAtRs = depthAt(HORIZON_R, amp);

  const pickPreset = (p: PresetId) => {
    setPresetId(p);
    setLogFactor(0);
  };

  const fmtFactor = (f: number) =>
    `×${f >= 100 ? String(Math.round(f)) : f >= 10 ? f.toFixed(0) : f.toFixed(1)}`;

  return (
    <SimulationShell
      simId="curvature-lab"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div
          className="relative h-[440px] w-full md:h-[540px]"
          role="img"
          aria-label={s.canvasLabel}
        >
          <CurvatureScene amp={amp} wireframe={wireframe} playing={playing && !reduced} />
          <div className="pointer-events-none absolute left-3 top-3 space-y-1.5 text-[0.72rem]">
            <div className="chip" style={{ background: "color-mix(in srgb, var(--bg-panel) 82%, transparent)" }}>
              <span className="inline-block h-2 w-2 rounded-sm" style={{ background: "var(--cyan)" }} aria-hidden />
              {s.legendSheet}
            </div>
            <div className="chip" style={{ background: "color-mix(in srgb, var(--bg-panel) 82%, transparent)" }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--amber)" }} aria-hidden />
              {s.legendHorizon}
            </div>
            <div className="chip" style={{ background: "color-mix(in srgb, var(--bg-panel) 82%, transparent)" }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--amber)" }} aria-hidden />
              {s.legendParticle}
            </div>
          </div>
          <div
            className="pointer-events-none absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[0.72rem] font-medium"
            style={{ background: "color-mix(in srgb, var(--bg-panel) 82%, transparent)", color: "var(--amber)" }}
          >
            ⚠ {s.illustrativeNote}
          </div>
        </div>
      }
      controls={
        <>
          <SegmentedControl<PresetId>
            label={s.presetLabel}
            value={presetId}
            onChange={pickPreset}
            options={[
              { value: "earth", label: s.pEarth },
              { value: "sun", label: s.pSun },
              { value: "ns", label: s.pNeutron },
              { value: "bh", label: s.pBlackHole },
            ]}
          />
          <ParamSlider
            label={s.massFactor}
            value={logFactor}
            min={-1}
            max={3}
            step={0.01}
            onChange={setLogFactor}
            format={(v) => fmtFactor(Math.pow(10, v))}
            accent="amber"
          />
          <p className="-mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
            {s.massFactorHint}
          </p>
          <ParamSlider
            label={s.exagg}
            value={exagg}
            min={0}
            max={3}
            step={0.05}
            onChange={setExagg}
            format={(v) => `${v.toFixed(2)}×`}
            accent="violet"
          />
          <p className="-mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
            {s.exaggHint}
          </p>
          <SegmentedControl<"solid" | "wire">
            label={s.viewLabel}
            value={wireframe ? "wire" : "solid"}
            onChange={(v) => setWireframe(v === "wire")}
            options={[
              { value: "solid", label: s.viewSolid },
              { value: "wire", label: s.viewWire },
            ]}
          />
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.roMass} value={fmtMass(massKg, lang)} accent="cyan" />
            <PhysicsValue label={s.roRs} value={fmtDistance(rs, lang)} accent="amber" title="rₛ = 2GM/c²" />
            <PhysicsValue
              label={s.roDepth}
              value={`${fmt(depthAtRs, lang, 2)}`}
              unit={s.roDepthNote}
              accent="violet"
              title={s.exaggHint}
            />
            <PhysicsValue label={s.roOrbitR} value={fmtDistance(rInner, lang)} accent="cyan" title="3 rₛ" />
            <div className="col-span-2">
              <PhysicsValue label={s.roPeriod} value={formatDuration(period, lang)} accent="green" title="T = 2π√(r³/GM), r = 3 rₛ" />
            </div>
          </div>
          <PlayPauseControls playing={playing} onToggle={() => setPlaying((p) => !p)} />
          <HonestyPanel s={s} />
        </>
      }
      whatYouSee={
        <>
          {s.wys.map((p, i) => (
            <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>
          ))}
        </>
      }
      physics={
        <>
          {s.phys.map((p, i) => (
            <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>
          ))}
          <KeyIdea>{s.keyIdea}</KeyIdea>
        </>
      }
      equation={
        <EquationCard tex="r_s = \frac{2GM}{c^2}" caption={s.eqRsCap} />
      }
      mathEquation={
        <MathOnly>
          <div className="mt-3">
            <EquationCard
              tex="z(r) = -\frac{A\,D}{r + \varepsilon}"
              caption={s.eqVisualCap}
              dark
            />
          </div>
        </MathOnly>
      }
      assumptions={s.assumptions}
      tryThis={
        <TryThis
          prompt={s.tryPrompt}
          check={() =>
            presetId === "sun" &&
            isSane(rs) &&
            Math.abs(rs - 30000) / 30000 < 0.08
          }
        />
      }
    />
  );
}
