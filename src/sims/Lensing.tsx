import { useEffect, useMemo, useRef, useState } from "react";
import {
  SimulationShell, ParamSlider, PhysicsValue, EquationCard, IM, MathOnly,
  SegmentedControl, TryThis, PresetBar, useG,
} from "../components/ui";
import { lightBendingAngle, schwarzschildRadius } from "../physics/generalRelativity";
import { M_SUN, PARSEC } from "../physics/constants";
import { fmtMass, fmtDistance } from "../physics/units";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    title: "Gravitational Lensing Lab",
    subtitle:
      "Bend light with gravity: drag a galaxy across the sky, trace the rays, and watch one background source split into several images — or merge into a perfect Einstein ring.",
    concept: "Light bending",
    mass: "Lens mass",
    sourceOffset: "Source offset from lens",
    lensOffset: "Lens offset from optical axis",
    viewLabel: "Ray display",
    viewRays: "Rays + images",
    viewImages: "Images only",
    align: "Perfect alignment",
    reset: "Reset",
    distances: "D_l = 1 Gpc · D_s = 2 Gpc (fixed)",
    presetStar: "Star",
    presetStarHint: "1 solar mass — microlensing scale",
    presetGalaxy: "Galaxy",
    presetGalaxyHint: "10¹² solar masses — strong-lensing scale",
    presetCluster: "Galaxy cluster",
    presetClusterHint: "10¹⁴ solar masses — giant arcs scale",
    readMass: "Lens mass",
    readThetaE: "Einstein radius θ_E",
    readImages: "Images",
    readSep: "Image separation",
    readAlpha: "Max. deflection",
    readRs: "Schwarzschild radius",
    readMag: "Magnifications",
    ringWord: "Ring",
    legRays: "Traced rays",
    legImages: "Lensed images",
    legLens: "Lens",
    legSource: "Background source",
    legUnlensed: "Unlensed path",
    dragHint: "Drag the lens and the source ↕ · sliders are keyboard-accessible",
    skyTitle: "Observer's sky",
    planeLens: "Lens plane",
    planeSource: "Source plane",
    axisLabel: "Optical axis",
    observer: "Observer",
    lensLabel: "Lens",
    sourceLabel: "Source",
    canvasLabel: "Side-view ray diagram of gravitational lensing. Draggable lens and source.",
    skyCanvasLabel: "Observer's sky view showing the lensed images and the Einstein ring.",
    schematic: "Schematic side view — real angles are arcseconds stretched over gigaparsecs.",
    thetaELabel: "θ_E",
    ringLabel: "Einstein ring",
    whatYouSee: [
      "Light from a distant galaxy travels for billions of years — then passes near a massive galaxy. Gravity bends every ray's path, so rays that left the source in different directions can reconverge at your telescope.",
      "The faint cyan lines are a sample of traced rays, each bent at the lens plane toward the amber lens galaxy. The bright violet rays are the ones that actually land on the source — their arrival directions at the observer are the images you see, shown in the “Observer's sky” panel.",
      "Drag the lens or the source up and down. Off-axis you get two images, one on each side of the lens; the fainter one hugs the lens. Slide the source exactly behind the lens and the images merge into a perfect Einstein ring.",
      "This is real observational astronomy: lensing is how we weigh galaxies, detect exoplanets by microlensing, and see magnified galaxies from the early universe.",
    ],
    physics: [
      "In general relativity, mass curves spacetime and light follows the curved paths. For a weak field the bending angle is α = 4GM/(c²b) — exactly twice the Newtonian prediction, confirmed during the 1919 solar eclipse.",
      "The lens equation β = θ − (D_ls/D_s)·α(θ) connects the true source position β with the image positions θ. Images form where deflected rays reconverge at the source. For a point mass there are always two images — or a full ring when the alignment is perfect (β = 0).",
      "The Einstein radius θ_E sets the characteristic angular scale of the lens: roughly the radius of the ring. More mass, or a better-aligned geometry, means a larger θ_E.",
      "The magnification μ says how much brighter each image is than the unlensed source; its sign is the image parity — whether the image is mirror-flipped. Images near the lens are strongly demagnified, which is why the second image is often hard to spot.",
    ],
    eqCaption: "Light deflection by a point mass — twice the Newtonian value (weak-field GR).",
    eqThetaCaption: "The Einstein radius: the characteristic angular scale of the lens.",
    eqLensCaption: "The lens equation — images form where deflected rays reconverge on the source.",
    symbols:
      "θ_E is the Einstein radius; M the lens mass; b the impact parameter of a ray; β the true (unlensed) source position; θ an image position; D_l, D_s and D_ls the observer–lens, observer–source and lens–source distances.",
    assumptions: [
      "Thin-lens approximation: all deflection happens instantaneously at the lens plane.",
      "Weak field: α = 4GM/(c²b) breaks down very close to the lens — rays passing too near are shown as captured by the lens.",
      "Point-mass lens. Real galaxies and clusters need extended mass models.",
      "Small angles, and D_ls = D_s − D_l (flat-universe approximation).",
      "Distances are fixed (D_l = 1 Gpc, D_s = 2 Gpc) for clarity. The side view is schematic: real angles are arcseconds stretched over gigaparsecs.",
      "The 2D slice is exact for this axisymmetric setup; the sky view reconstructs the full circular symmetry around the lens.",
    ],
    tryPrompt: "Create a perfect Einstein ring.",
    tryHint: "Press “Perfect alignment”, or drag the source until it sits exactly behind the lens (|offset| < 0.02 θ_E).",
  },
  es: {
    title: "Laboratorio de lentes gravitatorias",
    subtitle:
      "Dobla la luz con la gravedad: arrastra una galaxia por el cielo, traza los rayos y observa cómo una fuente lejana se divide en varias imágenes — o se fusiona en un anillo de Einstein perfecto.",
    concept: "Deflexión de la luz",
    mass: "Masa de la lente",
    sourceOffset: "Desplazamiento de la fuente respecto a la lente",
    lensOffset: "Desplazamiento de la lente respecto al eje óptico",
    viewLabel: "Mostrar rayos",
    viewRays: "Rayos + imágenes",
    viewImages: "Solo imágenes",
    align: "Alineación perfecta",
    reset: "Restablecer",
    distances: "D_l = 1 Gpc · D_s = 2 Gpc (fijas)",
    presetStar: "Estrella",
    presetStarHint: "1 masa solar — escala de microlente",
    presetGalaxy: "Galaxia",
    presetGalaxyHint: "10¹² masas solares — escala de lente fuerte",
    presetCluster: "Cúmulo de galaxias",
    presetClusterHint: "10¹⁴ masas solares — escala de arcos gigantes",
    readMass: "Masa de la lente",
    readThetaE: "Radio de Einstein θ_E",
    readImages: "Imágenes",
    readSep: "Separación de imágenes",
    readAlpha: "Deflexión máx.",
    readRs: "Radio de Schwarzschild",
    readMag: "Ampliaciones",
    ringWord: "Anillo",
    legRays: "Rayos trazados",
    legImages: "Imágenes (lente)",
    legLens: "Lente",
    legSource: "Fuente de fondo",
    legUnlensed: "Trayectoria sin lente",
    dragHint: "Arrastra la lente y la fuente ↕ · los deslizadores son accesibles por teclado",
    skyTitle: "Cielo del observador",
    planeLens: "Plano de la lente",
    planeSource: "Plano de la fuente",
    axisLabel: "Eje óptico",
    observer: "Observador",
    lensLabel: "Lente",
    sourceLabel: "Fuente",
    canvasLabel: "Diagrama lateral de rayos de una lente gravitatoria. Lente y fuente arrastrables.",
    skyCanvasLabel: "Vista del cielo del observador con las imágenes lensadas y el anillo de Einstein.",
    schematic: "Vista lateral esquemática — los ángulos reales son segundos de arco a lo largo de gigapársecs.",
    thetaELabel: "θ_E",
    ringLabel: "Anillo de Einstein",
    whatYouSee: [
      "La luz de una galaxia lejana viaja durante miles de millones de años — y entonces pasa cerca de una galaxia masiva. La gravedad curva la trayectoria de cada rayo, así que rayos que salieron de la fuente en distintas direcciones pueden volver a converger en tu telescopio.",
      "Las líneas cian tenues son una muestra de rayos trazados, cada uno doblado en el plano de la lente hacia la galaxia lente ámbar. Los rayos violeta brillantes son los que realmente alcanzan la fuente — sus direcciones de llegada al observador son las imágenes que ves, mostradas en el panel «Cielo del observador».",
      "Arrastra la lente o la fuente hacia arriba y abajo. Fuera del eje obtienes dos imágenes, una a cada lado de la lente; la más débil se pega a la lente. Desliza la fuente justo detrás de la lente y las imágenes se fusionan en un anillo de Einstein perfecto.",
      "Esto es astronomía observacional real: con lentes gravitatorias pesamos galaxias, detectamos exoplanetas por microlente y vemos galaxias ampliadas del universo primitivo.",
    ],
    physics: [
      "En relatividad general, la masa curva el espaciotiempo y la luz sigue esas trayectorias curvas. Para un campo débil el ángulo de deflexión es α = 4GM/(c²b) — exactamente el doble de la predicción newtoniana, confirmado durante el eclipse solar de 1919.",
      "La ecuación de la lente β = θ − (D_ls/D_s)·α(θ) conecta la posición real de la fuente β con las posiciones de las imágenes θ. Las imágenes se forman donde los rayos deflectados vuelven a converger en la fuente. Para una masa puntual siempre hay dos imágenes — o un anillo completo cuando la alineación es perfecta (β = 0).",
      "El radio de Einstein θ_E fija la escala angular característica de la lente: aproximadamente el radio del anillo. Más masa, o una geometría mejor alineada, significa un θ_E mayor.",
      "La ampliación μ indica cuánto más brillante es cada imagen que la fuente sin lente; su signo es la paridad de la imagen — si aparece invertida como en un espejo. Las imágenes cercanas a la lente están muy atenuadas, por eso la segunda imagen suele costar verla.",
    ],
    eqCaption: "Deflexión de la luz por una masa puntual — el doble del valor newtoniano (RG de campo débil).",
    eqThetaCaption: "El radio de Einstein: la escala angular característica de la lente.",
    eqLensCaption: "La ecuación de la lente — las imágenes se forman donde los rayos deflectados convergen en la fuente.",
    symbols:
      "θ_E es el radio de Einstein; M la masa de la lente; b el parámetro de impacto de un rayo; β la posición real (sin lente) de la fuente; θ la posición de una imagen; D_l, D_s y D_ls las distancias observador–lente, observador–fuente y lente–fuente.",
    assumptions: [
      "Aproximación de lente delgada: toda la deflexión ocurre instantáneamente en el plano de la lente.",
      "Campo débil: α = 4GM/(c²b) deja de valer muy cerca de la lente — los rayos que pasan demasiado cerca se muestran como capturados por la lente.",
      "Lente de masa puntual. Las galaxias y cúmulos reales requieren modelos de masa extendida.",
      "Ángulos pequeños, y D_ls = D_s − D_l (aproximación de universo plano).",
      "Las distancias son fijas (D_l = 1 Gpc, D_s = 2 Gpc) por claridad. La vista lateral es esquemática: los ángulos reales son segundos de arco a lo largo de gigapársecs.",
      "El corte 2D es exacto para esta configuración axisimétrica; la vista del cielo reconstruye la simetría circular completa alrededor de la lente.",
    ],
    tryPrompt: "Crea un anillo de Einstein perfecto.",
    tryHint: "Pulsa «Alineación perfecta», o arrastra la fuente hasta que quede exactamente detrás de la lente (|desplazamiento| < 0,02 θ_E).",
  },
} as const;

type View = "rays" | "images";

// ─── Geometry constants (fixed for clarity) ───────────────────────────────────
const D_L = 1e9 * PARSEC; // observer–lens distance (m)
const D_S = 2e9 * PARSEC; // observer–source distance (m)
const D_LS = D_S - D_L; // lens–source distance (m), flat-universe approximation
const ARCSEC_PER_RAD = (180 / Math.PI) * 3600;
const BLOCK_R = 0.06; // rays with |θ − u_lens| < this (θ_E units) are captured

interface LensImage {
  theta: number; // image angle as seen by observer, θ_E units rel. optical axis
  mu: number; // signed magnification (sign = parity)
}

interface LensPhys {
  thetaE: number; // Einstein radius, radians
  thetaEArcsec: number;
  rs: number; // Schwarzschild radius of the lens, m
  images: LensImage[];
  separationArcsec: number;
  maxAlphaArcsec: number;
  isRing: boolean;
  span: number; // vertical half-range for drawing, θ_E units
  viewSpan: number; // sky-view half-angle, θ_E units
  betaLand: (theta: number) => number; // source-plane landing angle, θ_E units (NaN if captured)
  betaSrc: number; // true source angle, θ_E units rel. optical axis
}

function computeLensing(massKg: number, uLens: number, uSrc: number): LensPhys {
  const rs = schwarzschildRadius(massKg);
  const thetaE = Math.sqrt((2 * rs * D_LS) / (D_L * D_S));
  const betaSrc = uLens + uSrc;
  const betaLand = (theta: number): number => {
    const b = theta - uLens;
    if (Math.abs(b) < BLOCK_R) return NaN;
    const bM = Math.abs(b) * thetaE * D_L;
    const alpha = lightBendingAngle(massKg, bM); // radians, toward the lens
    return theta - Math.sign(b) * (alpha / thetaE) * (D_LS / D_S);
  };
  // find images: roots of betaLand(θ) = betaSrc
  const span = Math.max(7, Math.abs(uSrc) + 3);
  const N = 600;
  const lo = uLens - span;
  const step = (2 * span) / N;
  const roots: number[] = [];
  let prevT = lo;
  let prevR = betaLand(prevT) - betaSrc;
  for (let i = 1; i <= N; i++) {
    const t = lo + i * step;
    const r = betaLand(t) - betaSrc;
    if (Number.isFinite(prevR) && Number.isFinite(r) && prevR * r < 0) {
      let a = prevT;
      let b2 = t;
      let ra = prevR;
      for (let k = 0; k < 60; k++) {
        const m = (a + b2) / 2;
        const rm = betaLand(m) - betaSrc;
        if (!Number.isFinite(rm)) break;
        if (ra * rm <= 0) b2 = m;
        else {
          a = m;
          ra = rm;
        }
      }
      roots.push((a + b2) / 2);
    }
    prevT = t;
    prevR = r;
  }
  roots.sort((x, y) => x - y);
  const uniq = roots.filter((r, i) => i === 0 || r - roots[i - 1] > 1e-3);
  const images: LensImage[] = [];
  for (const th of uniq) {
    const v = th - uLens;
    if (Math.abs(v) < BLOCK_R) continue;
    images.push({ theta: th, mu: 1 / (1 - 1 / v ** 4) });
  }
  const thetas = images.map((im) => im.theta);
  const separationArcsec =
    thetas.length >= 2 ? (Math.max(...thetas) - Math.min(...thetas)) * thetaE * ARCSEC_PER_RAD : 0;
  let maxAlpha = 0;
  for (const im of images) {
    const a = lightBendingAngle(massKg, Math.abs(im.theta - uLens) * thetaE * D_L);
    if (Number.isFinite(a)) maxAlpha = Math.max(maxAlpha, a);
  }
  const maxV = thetas.length > 0 ? Math.max(...thetas.map((t) => Math.abs(t - uLens))) : 0;
  const viewSpan = Math.min(16, Math.max(4.5, Math.abs(uSrc) + 2, maxV + 1.2));
  return {
    thetaE,
    thetaEArcsec: thetaE * ARCSEC_PER_RAD,
    rs,
    images,
    separationArcsec,
    maxAlphaArcsec: maxAlpha * ARCSEC_PER_RAD,
    isRing: Math.abs(uSrc) < 0.02,
    span,
    viewSpan,
    betaLand,
    betaSrc,
  };
}

interface Star {
  x: number;
  y: number;
  r: number;
  ph: number;
  sp: number;
  a: number;
}

function makeStars(n: number, seed: number): Star[] {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({ length: n }, () => ({
    x: rnd(),
    y: rnd(),
    r: 0.6 + rnd() * 1.5,
    ph: rnd() * Math.PI * 2,
    sp: 0.5 + rnd() * 2.0,
    a: 0.22 + rnd() * 0.5,
  }));
}

interface Geom {
  xL: number;
  yLens: number;
  xS: number;
  ySrc: number;
  k: number;
  y0: number;
  half: number;
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export default function Lensing() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [logMass, setLogMass] = useState(12); // log10(M / M☉)
  const [uSrc, setUSrc] = useState(1.6); // source offset from lens, θ_E units
  const [uLens, setULens] = useState(0); // lens offset from optical axis, θ_E units
  const [view, setView] = useState<View>("rays");

  const massKg = 10 ** logMass * M_SUN;
  const phys = useMemo(() => computeLensing(massKg, uLens, uSrc), [massKg, uLens, uSrc]);
  const starsSide = useMemo(() => makeStars(170, 1234567), []);
  const starsSky = useMemo(() => makeStars(130, 7654321), []);

  const mainRef = useRef<HTMLCanvasElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const geomRef = useRef<Geom | null>(null);
  const dragRef = useRef<null | { kind: "lens" | "source"; startU: number; startClientY: number }>(null);
  const timeRef = useRef(0);
  const [, setSizeTick] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSizeTick((t) => t + 1));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── side-view ray diagram ──────────────────────────────────────────────────
  const drawSide = (t: number) => {
    const canvas = mainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cyan = cssVar("--cyan", "#3ee6ff");
    const amber = cssVar("--amber", "#f5a524");
    const violet = cssVar("--violet", "#a78bfa");
    const textDim = cssVar("--text-dim", "#a9b2c5");
    const textFaint = cssVar("--text-faint", "#6b7590");
    const border = cssVar("--border", "#2a3350");
    const bg = cssVar("--bg-inset", "#05080f");

    const half = phys.span;
    const k = (h / 2 - 44) / half;
    const y0 = h / 2;
    const Y = (u: number) => y0 - u * k;
    const xO = 0.075 * w;
    const xL = 0.42 * w;
    const xS = 0.9 * w;
    const yLens = Y(uLens);
    const ySrc = Y(phys.betaSrc);
    geomRef.current = { xL, yLens, xS, ySrc, k, y0, half };

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    // star field
    for (const st of starsSide) {
      const tw = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * st.sp + st.ph);
      ctx.globalAlpha = st.a * tw;
      ctx.fillStyle = "#dfe8ff";
      ctx.beginPath();
      ctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // optical axis
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    ctx.lineTo(w, y0);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = textFaint;
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(s.axisLabel, 10, y0 - 8);

    // lens + source planes
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    for (const xp of [xL, xS]) {
      ctx.beginPath();
      ctx.moveTo(xp, 10);
      ctx.lineTo(xp, h - 34);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle = textDim;
    ctx.font = "600 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.planeLens, xL, 20);
    ctx.fillText(s.planeSource, xS, 20);
    ctx.textAlign = "left";

    // unlensed path (dashed grey)
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = "rgba(160,170,190,0.5)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xO, y0);
    ctx.lineTo(xS, ySrc);
    ctx.stroke();
    ctx.setLineDash([]);

    // traced rays
    if (view === "rays") {
      const RAYS = 56;
      ctx.lineWidth = 1;
      for (let j = 0; j < RAYS; j++) {
        const th = uLens - half + (2 * half * j) / (RAYS - 1);
        const yLp = Y(th);
        const bl = phys.betaLand(th);
        if (!Number.isFinite(bl)) {
          // captured by the lens: ray dies at the lens plane
          ctx.strokeStyle = "rgba(62,230,255,0.10)";
          ctx.beginPath();
          ctx.moveTo(xO, y0);
          ctx.lineTo(xL, yLp);
          ctx.stroke();
          continue;
        }
        ctx.strokeStyle = "rgba(62,230,255,0.15)";
        ctx.beginPath();
        ctx.moveTo(xO, y0);
        ctx.lineTo(xL, yLp);
        ctx.lineTo(xS, Y(bl));
        ctx.stroke();
        // landing dot on the source plane
        const yl = Y(bl);
        if (yl > -20 && yl < h + 20) {
          ctx.fillStyle = "rgba(62,230,255,0.30)";
          ctx.beginPath();
          ctx.arc(xS, yl, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // image rays (bright): observer → lens plane → source (they reconverge there)
    for (const im of phys.images) {
      const yLp = Y(im.theta);
      ctx.strokeStyle = violet;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 2;
      ctx.shadowColor = violet;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(xO, y0);
      ctx.lineTo(xL, yLp);
      ctx.lineTo(xS, ySrc);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = violet;
      ctx.beginPath();
      ctx.arc(xL, yLp, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // convergence marker at the source
    if (phys.images.length > 0) {
      ctx.strokeStyle = violet;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(xS, ySrc, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // lens galaxy (amber glow ellipse)
    const lg = ctx.createRadialGradient(xL, yLens, 2, xL, yLens, 30);
    lg.addColorStop(0, "rgba(245,165,36,0.95)");
    lg.addColorStop(0.45, "rgba(245,165,36,0.45)");
    lg.addColorStop(1, "rgba(245,165,36,0)");
    ctx.fillStyle = lg;
    ctx.save();
    ctx.translate(xL, yLens);
    ctx.scale(1.5, 1);
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#fff3d6";
    ctx.beginPath();
    ctx.arc(xL, yLens, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = amber;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText(s.lensLabel, xL + 34, yLens + 4);

    // background source (bright galaxy)
    const sg = ctx.createRadialGradient(xS, ySrc, 1, xS, ySrc, 22);
    sg.addColorStop(0, "rgba(255,255,255,0.95)");
    sg.addColorStop(0.4, "rgba(167,139,250,0.55)");
    sg.addColorStop(1, "rgba(167,139,250,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(xS, ySrc, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xS - 14, ySrc);
    ctx.lineTo(xS + 14, ySrc);
    ctx.moveTo(xS, ySrc - 14);
    ctx.lineTo(xS, ySrc + 14);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(xS, ySrc, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = textDim;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText(s.sourceLabel, xS + 18, ySrc - 12);

    // observer glyph
    ctx.strokeStyle = cyan;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(xO, y0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = cyan;
    ctx.beginPath();
    ctx.arc(xO, y0, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = textDim;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.fillText(s.observer, xO - 24, y0 + 30);

    ctx.restore();

    // captions
    ctx.fillStyle = textFaint;
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(s.distances, 10, h - 22);
    const sch = s.schematic;
    const schW = ctx.measureText(sch).width;
    ctx.fillText(sch, Math.max(10, w - schW - 10), h - 8);
  };

  // ── observer's sky view ────────────────────────────────────────────────────
  const drawSky = (t: number) => {
    const canvas = skyRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const violet = cssVar("--violet", "#a78bfa");
    const textDim = cssVar("--text-dim", "#a9b2c5");
    const textFaint = cssVar("--text-faint", "#6b7590");
    const border = cssVar("--border", "#2a3350");
    const bg = cssVar("--bg-inset", "#05080f");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = textDim;
    ctx.font = "600 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(s.skyTitle, w / 2, 20);
    ctx.textAlign = "left";

    const cx = w / 2;
    const cy = h / 2 + 8;
    const R = Math.min(w, h) / 2 - 26;
    const VS = phys.viewSpan;
    const toPx = (v: number) => (v / VS) * R; // θ_E units rel. lens → px

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#04060c";
    ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    for (const st of starsSky) {
      const tw = reduced ? 1 : 0.7 + 0.3 * Math.sin(t * st.sp + st.ph);
      ctx.globalAlpha = st.a * tw;
      ctx.fillStyle = "#dfe8ff";
      ctx.beginPath();
      ctx.arc(cx - R + st.x * 2 * R, cy - R + st.y * 2 * R, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // crosshair
    ctx.strokeStyle = border;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - R, cy);
    ctx.lineTo(cx + R, cy);
    ctx.moveTo(cx, cy - R);
    ctx.lineTo(cx, cy + R);
    ctx.stroke();
    ctx.globalAlpha = 1;

    const rE = toPx(1);

    // Einstein ring reference (dashed) or the real ring when aligned
    if (phys.isRing) {
      ctx.strokeStyle = violet;
      ctx.lineWidth = 3;
      ctx.shadowColor = violet;
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(cx, cy, rE, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = violet;
      ctx.font = "600 12px system-ui, sans-serif";
      ctx.fillText(s.ringLabel, cx + rE * 0.72, cy - rE * 0.72);
    } else {
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = violet;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, rE, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = violet;
      ctx.font = "11px system-ui, sans-serif";
      ctx.fillText(s.thetaELabel, cx + rE * 0.74, cy - rE * 0.66);
    }

    // unlensed (true) source position
    const sy = cy - toPx(uSrc);
    if (Math.abs(toPx(uSrc)) < R - 4) {
      ctx.fillStyle = "rgba(170,180,200,0.85)";
      ctx.beginPath();
      ctx.arc(cx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // lensed images: arcs on the ring + dots at their sky positions
    const letters = ["A", "B", "C", "D"];
    phys.images.forEach((im, i) => {
      const v = im.theta - uLens;
      const py = cy - toPx(v);
      const phi = v > 0 ? -Math.PI / 2 : Math.PI / 2;
      const halfArc = Math.min(1.25, Math.max(0.22, 0.45 * Math.cbrt(Math.abs(im.mu))));
      if (!phys.isRing) {
        ctx.strokeStyle = violet;
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.shadowColor = violet;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(cx, cy, rE, phi - halfArc, phi + halfArc);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
      if (Math.abs(py - cy) < R - 4) {
        ctx.fillStyle = "#efe9ff";
        ctx.shadowColor = violet;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = violet;
        ctx.font = "600 12px system-ui, sans-serif";
        ctx.fillText(letters[i] ?? "·", cx + 10, py + 4);
      }
    });

    // lens at the centre
    const lg = ctx.createRadialGradient(cx, cy, 1, cx, cy, 16);
    lg.addColorStop(0, "rgba(245,165,36,0.95)");
    lg.addColorStop(1, "rgba(245,165,36,0)");
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff3d6";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    // rim
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = textFaint;
    ctx.font = "10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`±${VS.toFixed(1)} θ_E`, cx, cy + R + 16);
    ctx.textAlign = "left";
  };

  const drawAll = () => {
    drawSide(timeRef.current);
    drawSky(timeRef.current);
  };
  const drawAllRef = useRef(drawAll);
  drawAllRef.current = drawAll;

  useEffect(() => {
    drawAllRef.current();
  });
  useRaf((_, elapsed) => {
    timeRef.current = elapsed;
    drawAllRef.current();
  }, !reduced);

  // ── drag the lens / source vertically ──────────────────────────────────────
  const handleOf = (clientX: number, clientY: number): "lens" | "source" | null => {
    const canvas = mainRef.current;
    const g = geomRef.current;
    if (!canvas || !g) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (Math.hypot(x - g.xL, y - g.yLens) < 30) return "lens";
    if (Math.hypot(x - g.xS, y - g.ySrc) < 30) return "source";
    return null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const kind = handleOf(e.clientX, e.clientY);
    if (!kind || !geomRef.current) return;
    mainRef.current?.setPointerCapture(e.pointerId);
    dragRef.current = {
      kind,
      startU: kind === "lens" ? uLens : uSrc,
      startClientY: e.clientY,
    };
    (e.target as HTMLElement).style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = geomRef.current;
    if (!g) return;
    const d = dragRef.current;
    if (!d) {
      (e.target as HTMLElement).style.cursor = handleOf(e.clientX, e.clientY) ? "grab" : "default";
      return;
    }
    const du = (d.startClientY - e.clientY) / g.k;
    const lim = g.half - 1;
    if (d.kind === "lens") {
      setULens(Math.max(-lim, Math.min(lim, d.startU + du)));
    } else {
      const raw = d.startU + du;
      // keep the source on screen and inside the slider range
      const lo = Math.max(-8, -lim - uLens);
      const hi = Math.min(8, lim - uLens);
      setUSrc(Math.max(lo, Math.min(hi, raw)));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.target as HTMLElement).style.cursor = "default";
  };

  const resetAll = () => {
    setLogMass(12);
    setUSrc(1.6);
    setULens(0);
    setView("rays");
  };

  const magText =
    phys.images.length > 0
      ? phys.images.map((im) => `${im.mu >= 0 ? "+" : ""}${im.mu.toFixed(2)}`).join(" · ")
      : "—";

  return (
    <SimulationShell
      simId="lensing"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={3}
      concept={s.concept}
      visualization={
        <div ref={wrapRef}>
          <div className="flex flex-col gap-4 p-4 lg:flex-row">
            <div className="min-w-0 flex-1">
              <canvas
                ref={mainRef}
                className="h-[440px] w-full sm:h-[520px]"
                style={{ touchAction: "none", display: "block" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                role="img"
                aria-label={s.canvasLabel}
              />
            </div>
            <div className="mx-auto w-full max-w-[300px] shrink-0 lg:mx-0">
              <canvas
                ref={skyRef}
                className="aspect-square w-full"
                style={{ display: "block" }}
                role="img"
                aria-label={s.skyCanvasLabel}
              />
            </div>
          </div>
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-2.5 text-xs"
            style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
          >
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[3px] w-5" style={{ background: "var(--cyan)", opacity: 0.6 }} />
              {s.legRays}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-[3px] w-5" style={{ background: "var(--violet)" }} />
              {s.legImages}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--amber)" }} />
              {s.legLens}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#ffffff" }} />
              {s.legSource}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-0 w-5 border-t-2 border-dashed"
                style={{ borderColor: "rgba(160,170,190,0.7)" }}
              />
              {s.legUnlensed}
            </span>
            <span className="ml-auto">{s.dragHint}</span>
          </div>
        </div>
      }
      controls={
        <>
          <PresetBar
            presets={[
              { label: s.presetStar, hint: s.presetStarHint },
              { label: s.presetGalaxy, hint: s.presetGalaxyHint },
              { label: s.presetCluster, hint: s.presetClusterHint },
            ]}
            onPick={(i) => setLogMass([0, 12, 14][i] ?? 12)}
          />
          <ParamSlider
            label={s.mass}
            value={logMass}
            min={10}
            max={14}
            step={0.01}
            onChange={setLogMass}
            format={(v) => fmtMass(10 ** v * M_SUN, lang)}
            accent="amber"
          />
          <ParamSlider
            label={s.sourceOffset}
            value={uSrc}
            min={-8}
            max={8}
            step={0.05}
            onChange={setUSrc}
            format={(v) => `${v.toFixed(2)} θ_E`}
            accent="violet"
          />
          <ParamSlider
            label={s.lensOffset}
            value={uLens}
            min={-5}
            max={5}
            step={0.05}
            onChange={setULens}
            format={(v) => `${v.toFixed(2)} θ_E`}
            accent="cyan"
          />
          <SegmentedControl<View>
            label={s.viewLabel}
            options={[
              { value: "rays", label: s.viewRays },
              { value: "images", label: s.viewImages },
            ]}
            value={view}
            onChange={setView}
          />
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => setUSrc(0)}>
              {s.align}
            </button>
            <button className="btn-ghost !px-3 !py-2 text-sm" onClick={resetAll}>
              {s.reset}
            </button>
          </div>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>
            {s.distances}
          </p>
          <div className="grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <PhysicsValue label={s.readMass} value={fmtMass(massKg, lang)} accent="amber" />
            <PhysicsValue
              label={s.readThetaE}
              value={phys.thetaEArcsec.toFixed(3)}
              unit="″"
              accent="cyan"
            />
            <PhysicsValue
              label={s.readImages}
              value={phys.isRing ? s.ringWord : String(phys.images.length)}
              accent="violet"
            />
            <PhysicsValue
              label={s.readSep}
              value={phys.images.length >= 2 ? phys.separationArcsec.toFixed(3) : "—"}
              unit="″"
            />
            <PhysicsValue
              label={s.readAlpha}
              value={phys.maxAlphaArcsec.toFixed(2)}
              unit="″"
              accent="amber"
            />
            <PhysicsValue label={s.readRs} value={fmtDistance(phys.rs, lang)} />
            <div className="inset col-span-2 px-3 py-2.5">
              <div
                className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]"
                style={{ color: "var(--text-faint)" }}
              >
                {s.readMag}
              </div>
              <div className="font-mono2 text-lg font-semibold leading-tight" style={{ color: "var(--violet)" }}>
                {magText}
              </div>
            </div>
          </div>
        </>
      }
      whatYouSee={<>{s.whatYouSee.map((p, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>)}</>}
      physics={<>{s.physics.map((p, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>)}</>}
      equation={<EquationCard tex="\alpha = \frac{4GM}{c^2 b}" caption={s.eqCaption} />}
      mathEquation={
        <MathOnly>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <EquationCard
              tex="\theta_E = \sqrt{\frac{4GM}{c^2}\frac{D_{ls}}{D_l D_s}}"
              caption={s.eqThetaCaption}
            />
            <EquationCard
              tex="\beta = \theta - \frac{D_{ls}}{D_s}\,\alpha(\theta)"
              caption={s.eqLensCaption}
            />
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--text-dim)" }}>
            <IM tex="\theta_E" /> {s.symbols}
          </p>
        </MathOnly>
      }
      tryThis={
        <TryThis prompt={s.tryPrompt} check={() => Math.abs(uSrc) < 0.02}>
          <p className="mt-2 text-xs" style={{ color: "var(--text-faint)" }}>
            {s.tryHint}
          </p>
        </TryThis>
      }
      assumptions={[...s.assumptions]}
    />
  );
}
