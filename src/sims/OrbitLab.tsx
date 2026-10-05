import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  perihelionPrecessionPerOrbit,
  precessionArcsecPerCentury,
  schwarzschildRadius,
  formatDuration,
} from "../physics/generalRelativity";
import { G, M_SUN, M_EARTH, R_EARTH, AU, YEAR, C } from "../physics/constants";
import { fmt, fmtDistance, fmtMass } from "../physics/units";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Bilingual strings ────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    title: "Orbit Lab",
    subtitle:
      "Launch a test particle around a star, a neutron star or a black hole. Compare Newton's gravity with Einstein's first relativistic correction — and watch Mercury's orbit slowly rotate.",
    concept: "Geodesics & precession",
    body: "Central body",
    r0: "Initial distance r₀",
    vfrac: "Initial velocity (× circular)",
    vcircNote: "circular-orbit velocity",
    mode: "Gravity model",
    newton: "Newtonian",
    gr: "Relativistic correction",
    speed: "Time-lapse",
    speedUnit: "orbits/s",
    trail: "Trail length",
    trailUnit: "orbits",
    mass: "Central mass",
    rs: "Schwarzschild radius",
    ecc: "Eccentricity",
    sma: "Semi-major axis",
    period: "Orbital period",
    precTheory: "Precession · theory",
    precMeasured: "Precession · measured",
    nOrbits: "Orbits completed",
    arcsecCentury: "″/century",
    arcsecOrbit: "″/orbit",
    captured: "Captured! The particle fell inside the central body.",
    escaped: "Escape trajectory — the particle is leaving the system.",
    unbound: "unbound",
    willCapture: "These initial conditions plunge inside the central body.",
    exact0: "0 (exact)",
    notYet: "needs ≥ 3 orbits",
    scaleBar: "scale",
    mercury: "Mercury",
    earthLike: "Earth-like",
    nsClose: "Close neutron-star orbit",
    plunge: "Plunging orbit (black hole)",
    whatYouSee:
      "The amber disc is the central body (for a black hole, the dashed ring marks the event horizon and the amber ring the photon sphere). The cyan trail is the particle's path; violet dots mark each perihelion passage — the point of closest approach. In Newtonian mode the dots stack on top of each other forever: the ellipse never rotates. Switch to the relativistic correction and the dots march around the centre: the orbit precesses. Near a neutron star or black hole the effect is dramatic; for Mercury it is tiny but measurable — exactly the 43 arcseconds per century that confirmed Einstein's theory.",
    physicsTitle: "Why does the orbit rotate?",
    physics:
      "In Newton's theory a lone planet around a lone star traces a perfect, unchanging ellipse. General relativity adds a small correction to gravity that is strongest close to the mass: roughly speaking, the particle feels slightly more attraction near perihelion than Newton predicts, so the ellipse fails to close and its long axis rotates a little with every orbit. For Mercury this rotation is 43 arcseconds per century — measured by astronomers and unexplained until Einstein. This lab uses the standard weak-field, first-order correction to Newton's law, which reproduces that famous number without the full machinery of curved spacetime.",
    eqNewton: "Newton's law of gravity (exact in “Newtonian” mode)",
    eqGR: "Perihelion precession per orbit (general relativity)",
    eqForce: "First-order GR correction actually integrated here",
    tryPrompt:
      "With the Mercury preset in Relativistic mode, confirm the measured precession is close to 43 arcseconds per century.",
    tryHint:
      "Let it run for a few orbits — the measured value needs at least 3 perihelion passages to appear, and it gets steadier the longer it runs.",
    assumptions: [
      "Test-particle limit: the orbiting particle has negligible mass and the central body stays fixed.",
      "“Relativistic correction” mode adds only the weak-field first-order GR term to Newton's law — an approximation, not full numerical relativity.",
      "Orbits are planar (2D); gravitational-wave emission is ignored, so orbits never decay.",
      "“Newtonian” mode is exactly inverse-square gravity: no precession is physically expected there.",
      "Other perturbations are ignored. Mercury's observed total precession is ~574 ″/century (mostly from other planets); only 43 ″/century is the general-relativistic part.",
    ],
  },
  es: {
    title: "Laboratorio orbital",
    subtitle:
      "Lanza una partícula de prueba alrededor de una estrella, una estrella de neutrones o un agujero negro. Compara la gravedad de Newton con la primera corrección relativista de Einstein, y observa cómo la órbita de Mercurio rota lentamente.",
    concept: "Geodésicas y precesión",
    body: "Cuerpo central",
    r0: "Distancia inicial r₀",
    vfrac: "Velocidad inicial (× circular)",
    vcircNote: "velocidad de órbita circular",
    mode: "Modelo de gravedad",
    newton: "Newtoniano",
    gr: "Corrección relativista",
    speed: "Lapso de tiempo",
    speedUnit: "órbitas/s",
    trail: "Longitud de la estela",
    trailUnit: "órbitas",
    mass: "Masa central",
    rs: "Radio de Schwarzschild",
    ecc: "Excentricidad",
    sma: "Semieje mayor",
    period: "Periodo orbital",
    precTheory: "Precesión · teoría",
    precMeasured: "Precesión · medida",
    nOrbits: "Órbitas completadas",
    arcsecCentury: "″/siglo",
    arcsecOrbit: "″/órbita",
    captured: "¡Capturada! La partícula cayó dentro del cuerpo central.",
    escaped: "Trayectoria de escape: la partícula abandona el sistema.",
    unbound: "no ligada",
    willCapture: "Estas condiciones iniciales caen dentro del cuerpo central.",
    exact0: "0 (exacto)",
    notYet: "necesita ≥ 3 órbitas",
    scaleBar: "escala",
    mercury: "Mercurio",
    earthLike: "Tipo terrestre",
    nsClose: "Órbita cercana a estrella de neutrones",
    plunge: "Órbita de caída (agujero negro)",
    whatYouSee:
      "El disco ámbar es el cuerpo central (para un agujero negro, el anillo discontinuo marca el horizonte de sucesos y el anillo ámbar la esfera de fotones). La estela cian es la trayectoria de la partícula; los puntos violetas marcan cada paso por el perihelio, el punto de máximo acercamiento. En modo newtoniano los puntos se apilan unos sobre otros para siempre: la elipse nunca rota. Cambia a la corrección relativista y los puntos avanzan alrededor del centro: la órbita precesa. Cerca de una estrella de neutrones o un agujero negro el efecto es espectacular; para Mercurio es minúsculo pero medible: exactamente los 43 segundos de arco por siglo que confirmaron la teoría de Einstein.",
    physicsTitle: "¿Por qué rota la órbita?",
    physics:
      "En la teoría de Newton, un planeta solitario alrededor de una estrella solitaria describe una elipse perfecta e inmutable. La relatividad general añade una pequeña corrección a la gravedad que es más intensa cerca de la masa: en términos simples, la partícula siente algo más de atracción cerca del perihelio de lo que predice Newton, así que la elipse no se cierra y su eje mayor rota un poco en cada órbita. Para Mercurio esa rotación es de 43 segundos de arco por siglo, medida por los astrónomos e inexplicable hasta Einstein. Este laboratorio usa la corrección estándar de primer orden en campo débil sobre la ley de Newton, que reproduce ese famoso número sin toda la maquinaria del espaciotiempo curvo.",
    eqNewton: "Ley de la gravedad de Newton (exacta en modo «Newtoniano»)",
    eqGR: "Precesión del perihelio por órbita (relatividad general)",
    eqForce: "Corrección GR de primer orden que se integra aquí",
    tryPrompt:
      "Con el ajuste rápido de Mercurio en modo relativista, confirma que la precesión medida está cerca de 43 segundos de arco por siglo.",
    tryHint:
      "Déjalo correr unas órbitas: el valor medido necesita al menos 3 pasos por el perihelio para aparecer, y se estabiliza cuanto más tiempo corre.",
    assumptions: [
      "Límite de partícula de prueba: la partícula orbitante tiene masa despreciable y el cuerpo central permanece fijo.",
      "El modo «corrección relativista» añade solo el término GR de primer orden en campo débil a la ley de Newton: una aproximación, no relatividad numérica completa.",
      "Las órbitas son planas (2D); se ignora la emisión de ondas gravitatorias, así que las órbitas nunca decaen.",
      "El modo «Newtoniano» es gravedad exactamente inverso-cuadrática: ahí no se espera físicamente ninguna precesión.",
      "Se ignoran otras perturbaciones. La precesión total observada de Mercurio es ~574 ″/siglo (casi toda por otros planetas); solo 43 ″/siglo son la parte relativista.",
    ],
  },
} as const;

// ─── Central bodies ───────────────────────────────────────────────────────────
interface Body {
  id: string;
  mass: number;
  radius: number; // metres (for BH: 0 → use rs)
  isBH: boolean;
  name: { en: string; es: string };
}
const BODIES: Body[] = [
  { id: "sun", mass: M_SUN, radius: 6.96e8, isBH: false, name: { en: "Sun", es: "Sol" } },
  { id: "earth", mass: M_EARTH, radius: R_EARTH, isBH: false, name: { en: "Earth", es: "Tierra" } },
  { id: "wd", mass: M_SUN, radius: 7.0e6, isBH: false, name: { en: "White dwarf", es: "Enana blanca" } },
  { id: "ns", mass: 1.4 * M_SUN, radius: 1.2e4, isBH: false, name: { en: "Neutron star", es: "Estrella de neutrones" } },
  { id: "bh", mass: 10 * M_SUN, radius: 0, isBH: true, name: { en: "Black hole", es: "Agujero negro" } },
];
const LOG_SPAN = 3.2; // r₀ slider spans 10^3.2 above the capture radius

type Mode = "newton" | "gr";
type Status = "ok" | "captured" | "escaped";

interface Peri {
  x: number;
  y: number;
  angle: number; // unwrapped, radians
}
interface SimState {
  x: number; y: number; vx: number; vy: number;
  t: number;
  h: number;
  mu: number;
  capR: number;
  trail: Array<{ x: number; y: number }>;
  peri: Peri[];
  prevR: number; prevX: number; prevY: number; drPrev: number;
  rMinObs: number; rMaxObs: number;
  tPrevPeri: number;
  periodSum: number; periodN: number;
  status: Status;
}

const STEPS_PER_ORBIT = 2400;

function createSim(body: Body, r0: number, vfrac: number): SimState {
  const mu = G * body.mass;
  const rs = schwarzschildRadius(body.mass);
  const capR = body.isBH ? rs : body.radius;
  const vcirc = Math.sqrt(mu / r0);
  const v0 = vfrac * vcirc;
  return {
    x: r0, y: 0, vx: 0, vy: v0,
    t: 0,
    h: r0 * v0,
    mu,
    capR,
    trail: [{ x: r0, y: 0 }],
    peri: [],
    prevR: r0, prevX: r0, prevY: 0, drPrev: 0,
    rMinObs: r0, rMaxObs: r0,
    tPrevPeri: 0,
    periodSum: 0, periodN: 0,
    status: "ok",
  };
}

/** Least-squares slope of perihelion angle vs passage index (rad/orbit). */
function fitPrecession(peri: Peri[]): number | null {
  const n = peri.length;
  if (n < 3) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += i; sy += peri[i].angle; sxx += i * i; sxy += i * peri[i].angle;
  }
  const den = n * sxx - sx * sx;
  if (den === 0) return null;
  return (n * sxy - sx * sy) / den;
}

export default function OrbitLab() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [bodyId, setBodyId] = useState("sun");
  const body = BODIES.find((b) => b.id === bodyId) ?? BODIES[0];
  const rs = schwarzschildRadius(body.mass);
  const capR = body.isBH ? rs : body.radius;
  const logMin = Math.log10(capR * 1.15);
  const logMax = logMin + LOG_SPAN;

  const [logR0, setLogR0] = useState(Math.log10(0.387 * AU * (1 + 0.2056)));
  const [vfrac, setVfrac] = useState(Math.sqrt((1 - 0.2056) / (1 + 0.2056)));
  const [mode, setMode] = useState<Mode>("gr");
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(0.25); // orbits per real second
  const [trailOrbits, setTrailOrbits] = useState(6);
  const [uiTick, setUiTick] = useState(0);

  const r0 = Math.pow(10, Math.min(Math.max(logR0, logMin), logMax));
  const mu = G * body.mass;
  const vcirc = Math.sqrt(mu / r0);
  const v0 = vfrac * vcirc;

  // ── Theory from initial conditions (Newtonian osculating elements) ─────────
  const theory = useMemo(() => {
    const energy = (v0 * v0) / 2 - mu / r0;
    const h = r0 * v0;
    const bound = energy < 0;
    let a = NaN, e = NaN, T = NaN;
    if (bound) {
      a = -mu / (2 * energy);
      e = Math.sqrt(Math.max(0, 1 + (2 * energy * h * h) / (mu * mu)));
      T = 2 * Math.PI * Math.sqrt((a * a * a) / mu);
    } else {
      e = Math.sqrt(Math.max(0, 1 + (2 * energy * h * h) / (mu * mu)));
    }
    const rp = bound ? a * (1 - e) : NaN;
    const precRad = bound ? perihelionPrecessionPerOrbit(body.mass, a, e) : NaN;
    const precArcsecC = bound ? precessionArcsecPerCentury(precRad, T / YEAR) : NaN;
    return { bound, a, e, T, rp, precRad, precArcsecC };
  }, [v0, mu, r0, body.mass]);

  // ── Simulator state (refs; mutated by the rAF loop) ────────────────────────
  const simRef = useRef<SimState>(createSim(body, r0, vfrac));
  const resetSim = (b = body, rr = r0, vf = vfrac) => {
    simRef.current = createSim(b, rr, vf);
    scaleRef.current = 0;
  };
  useEffect(() => {
    resetSim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyId, logR0, vfrac, mode]);

  // ── Canvas ─────────────────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef(0); // px per metre
  const palRef = useRef<Record<string, string>>({});

  const readPalette = () => {
    const css = getComputedStyle(document.documentElement);
    const p: Record<string, string> = {};
    for (const k of ["cyan", "amber", "violet", "green", "red", "text", "text-dim", "text-faint", "border"]) {
      p[k] = css.getPropertyValue(`--${k}`).trim() || "#fff";
    }
    palRef.current = p;
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = wrap.clientWidth;
    const H = Math.max(360, Math.min(560, Math.round(W * 0.62)));
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = `${H}px`;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const pal = palRef.current;
    const sim = simRef.current;

    // Target scale: fit the orbit (measured extent, or theory apoapsis)
    const extent = Math.max(
      sim.rMaxObs,
      theory.bound ? theory.a * (1 + theory.e) : r0 * 2,
      r0,
    );
    const target = (Math.min(W, H) / 2 - 44) / Math.max(extent, 1e-9);
    if (scaleRef.current === 0) scaleRef.current = target;
    scaleRef.current += (target - scaleRef.current) * 0.08;
    const k = scaleRef.current;
    const cx = W / 2;
    const cy = H / 2;
    const X = (x: number) => cx + x * k;
    const Y = (y: number) => cy - y * k;

    // faint reference grid
    ctx.strokeStyle = pal["border"];
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    const viewR = Math.min(W, H) / 2 - 30;
    for (const f of [0.25, 0.5, 0.75]) {
      ctx.beginPath();
      ctx.arc(cx, cy, viewR * f, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const bodyRpx = Math.max(capR * k, body.isBH ? 10 : 7);

    // event horizon / photon sphere for black hole
    if (body.isBH) {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal["red"];
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rs * k, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = pal["amber"];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5 * rs * k, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // central body disc
    const grad = ctx.createRadialGradient(cx - bodyRpx * 0.3, cy - bodyRpx * 0.3, bodyRpx * 0.1, cx, cy, bodyRpx);
    if (body.isBH) {
      grad.addColorStop(0, "#1a1a22");
      grad.addColorStop(1, "#000000");
    } else {
      grad.addColorStop(0, "#ffd9a0");
      grad.addColorStop(0.6, pal["amber"]);
      grad.addColorStop(1, "#8a4d0f");
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, bodyRpx, 0, Math.PI * 2);
    ctx.fill();
    if (!body.isBH) {
      ctx.strokeStyle = pal["amber"];
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // orbit trail
    const tr = sim.trail;
    if (tr.length > 1) {
      const split = Math.floor(tr.length * 0.75);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = pal["cyan"];
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(X(tr[0].x), Y(tr[0].y));
      for (let i = 1; i < split; i++) ctx.lineTo(X(tr[i].x), Y(tr[i].y));
      ctx.stroke();
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(X(tr[split].x), Y(tr[split].y));
      for (let i = split + 1; i < tr.length; i++) ctx.lineTo(X(tr[i].x), Y(tr[i].y));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // perihelion markers
    for (const p of sim.peri) {
      ctx.fillStyle = pal["violet"];
      ctx.beginPath();
      ctx.arc(X(p.x), Y(p.y), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(X(p.x), Y(p.y), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // particle + velocity vector
    if (sim.status === "ok") {
      const px = X(sim.x);
      const py = Y(sim.y);
      const vmag = Math.hypot(sim.vx, sim.vy);
      const vlen = Math.min(64, Math.max(18, (vmag / vcirc) * 30));
      const ang = Math.atan2(-sim.vy, sim.vx);
      ctx.strokeStyle = pal["amber"];
      ctx.fillStyle = pal["amber"];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + Math.cos(ang) * vlen, py + Math.sin(ang) * vlen);
      ctx.stroke();
      const hx = px + Math.cos(ang) * vlen;
      const hy = py + Math.sin(ang) * vlen;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx - Math.cos(ang - 0.42) * 9, hy - Math.sin(ang - 0.42) * 9);
      ctx.lineTo(hx - Math.cos(ang + 0.42) * 9, hy - Math.sin(ang + 0.42) * 9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = pal["amber"];
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // scale bar
    const barLen = viewR * 0.5;
    const barMetres = barLen / k;
    const pow = Math.pow(10, Math.floor(Math.log10(barMetres)));
    const nice = barMetres / pow >= 5 ? 5 * pow : barMetres / pow >= 2 ? 2 * pow : pow;
    const nicePx = nice * k;
    ctx.strokeStyle = pal["text-dim"];
    ctx.fillStyle = pal["text-dim"];
    ctx.lineWidth = 2;
    const bx = 18;
    const by = H - 22;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + nicePx, by);
    ctx.stroke();
    ctx.font = "11px system-ui, sans-serif";
    ctx.fillText(`${fmtDistance(nice, lang)}`, bx, by - 6);

    // status overlay
    if (sim.status !== "ok") {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = sim.status === "captured" ? pal["red"] : pal["amber"];
      ctx.font = "600 17px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(sim.status === "captured" ? s.captured : s.escaped, W / 2, H / 2 - 8);
      ctx.textAlign = "left";
    }
  };

  // ── Integration (RK4, fixed steps per orbit) ───────────────────────────────
  const integrate = (dtReal: number) => {
    const sim = simRef.current;
    if (sim.status !== "ok") return;
    const Tref = theory.bound ? theory.T : (4 * r0) / Math.max(v0, 1e-9);
    const orbitsPerSec = speed;
    const advance = orbitsPerSec * Tref * dtReal;
    const n = Math.max(8, Math.min(40000, Math.ceil((advance / Tref) * STEPS_PER_ORBIT)));
    const dt = advance / n;
    const h2 = sim.h * sim.h;
    const c2 = C * C;
    const gr = mode === "gr";

    const acc = (x: number, y: number, out: { ax: number; ay: number }) => {
      const r2 = x * x + y * y;
      const r = Math.sqrt(r2);
      let f = sim.mu / (r2 * r);
      if (gr) f *= 1 + (3 * h2) / (c2 * r2);
      out.ax = (-f * x);
      out.ay = (-f * y);
      return r;
    };

    const tmp = { ax: 0, ay: 0 };
    const maxTrail = Math.max(600, Math.round(trailOrbits * 600));
    const rEsc = Math.max(60 * r0, theory.bound ? 30 * theory.a * (1 + theory.e) : 1e18);

    for (let i = 0; i < n; i++) {
      const { x, y, vx, vy } = sim;
      // k1
      acc(x, y, tmp);
      const k1x = vx, k1y = vy, k1vx = tmp.ax, k1vy = tmp.ay;
      // k2
      acc(x + k1x * dt / 2, y + k1y * dt / 2, tmp);
      const k2x = vx + k1vx * dt / 2, k2y = vy + k1vy * dt / 2, k2vx = tmp.ax, k2vy = tmp.ay;
      // k3
      acc(x + k2x * dt / 2, y + k2y * dt / 2, tmp);
      const k3x = vx + k2vx * dt / 2, k3y = vy + k2vy * dt / 2, k3vx = tmp.ax, k3vy = tmp.ay;
      // k4
      acc(x + k3x * dt, y + k3y * dt, tmp);
      const k4x = vx + k3vx * dt, k4y = vy + k3vy * dt, k4vx = tmp.ax, k4vy = tmp.ay;

      sim.x = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
      sim.y = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
      sim.vx = vx + (dt / 6) * (k1vx + 2 * k2vx + 2 * k3vx + k4vx);
      sim.vy = vy + (dt / 6) * (k1vy + 2 * k2vy + 2 * k3vy + k4vy);
      sim.t += dt;

      const r = Math.hypot(sim.x, sim.y);
      if (r < sim.capR) { sim.status = "captured"; break; }
      if (r > rEsc || !Number.isFinite(r)) { sim.status = "escaped"; break; }
      if (r < sim.rMinObs) sim.rMinObs = r;
      if (r > sim.rMaxObs) sim.rMaxObs = r;

      // perihelion: radial distance stops decreasing and starts increasing
      const dr = r - sim.prevR;
      if (sim.drPrev < 0 && dr > 0 && sim.t > 1e-9) {
        let ang = Math.atan2(sim.prevY, sim.prevX);
        const prev = sim.peri[sim.peri.length - 1];
        if (prev) {
          while (ang - prev.angle > Math.PI) ang -= 2 * Math.PI;
          while (ang - prev.angle < -Math.PI) ang += 2 * Math.PI;
        }
        sim.peri.push({ x: sim.prevX, y: sim.prevY, angle: ang });
        if (sim.tPrevPeri > 0) {
          sim.periodSum += sim.t - sim.tPrevPeri;
          sim.periodN += 1;
        }
        sim.tPrevPeri = sim.t;
      }
      sim.drPrev = dr;
      sim.prevR = r;
      sim.prevX = sim.x;
      sim.prevY = sim.y;

      if (i % 4 === 0) {
        sim.trail.push({ x: sim.x, y: sim.y });
        if (sim.trail.length > maxTrail) sim.trail.splice(0, sim.trail.length - maxTrail);
      }
    }
  };

  const lastUi = useRef(0);
  useRaf(
    (dt) => {
      integrate(dt);
      draw();
      const now = performance.now();
      if (now - lastUi.current > 250) {
        lastUi.current = now;
        readPalette();
        setUiTick((t) => t + 1);
      }
    },
    playing,
  );
  useEffect(() => {
    readPalette();
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiTick === 0]);

  // ── Measured quantities from live state ────────────────────────────────────
  const sim = simRef.current;
  const nPeri = sim.peri.length;
  const slope = fitPrecession(sim.peri);
  const Tmeas = sim.periodN > 0 ? sim.periodSum / sim.periodN : NaN;
  const measArcsecC =
    slope !== null && Number.isFinite(Tmeas) && Tmeas > 0
      ? precessionArcsecPerCentury(slope, Tmeas / YEAR)
      : NaN;
  const measE =
    nPeri >= 1 && sim.rMaxObs > sim.rMinObs
      ? (sim.rMaxObs - sim.rMinObs) / (sim.rMaxObs + sim.rMinObs)
      : NaN;

  // ── Presets ────────────────────────────────────────────────────────────────
  const pickPreset = (i: number) => {
    if (i === 0) {
      // Mercury: r₀ = a(1+e) at apoapsis, v₀/vcirc = √((1−e)/(1+e))
      setBodyId("sun");
      const e = 0.2056;
      const b = BODIES[0];
      const rr = 0.387 * AU * (1 + e);
      setLogR0(Math.log10(rr));
      setVfrac(Math.sqrt((1 - e) / (1 + e)));
      setMode("gr");
      void b;
    } else if (i === 1) {
      setBodyId("sun");
      setLogR0(Math.log10(AU));
      setVfrac(1);
      setMode("newton");
    } else if (i === 2) {
      setBodyId("ns");
      setLogR0(Math.log10(1e5));
      setVfrac(1);
      setMode("gr");
    } else {
      setBodyId("bh");
      const b = BODIES[4];
      const rsb = schwarzschildRadius(b.mass);
      setLogR0(Math.log10(3 * rsb));
      setVfrac(0.55);
      setMode("gr");
    }
  };

  const isMercuryCfg =
    bodyId === "sun" &&
    Math.abs(r0 - 0.387 * AU * 1.2056) / (0.387 * AU * 1.2056) < 0.02 &&
    Math.abs(vfrac - Math.sqrt(0.7944 / 1.2056)) < 0.02;
  const checkSolved = () =>
    isMercuryCfg &&
    mode === "gr" &&
    nPeri >= 3 &&
    Number.isFinite(measArcsecC) &&
    measArcsecC >= 35 &&
    measArcsecC <= 51;

  // ── Visualization / controls ─────────────────────────────────────────────
  const visualization = (
    <div className="p-3 md:p-4">
      <div ref={wrapRef} className="relative w-full">
        <canvas ref={canvasRef} className="block w-full" role="img" aria-label={s.title} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <PhysicsValue label={s.mass} value={fmtMass(body.mass, lang)} accent="amber" />
        <PhysicsValue label={s.rs} value={fmtDistance(rs, lang)} accent="amber" />
        <PhysicsValue
          label={s.ecc}
          value={Number.isFinite(measE) ? fmt(measE, lang, 4) : theory.bound ? fmt(theory.e, lang, 4) : s.unbound}
          accent="cyan"
        />
        <PhysicsValue
          label={s.sma}
          value={theory.bound ? fmtDistance(theory.a, lang) : s.unbound}
          accent="cyan"
        />
        <PhysicsValue
          label={s.period}
          value={sim.periodN > 0 ? formatDuration(Tmeas, lang) : theory.bound ? formatDuration(theory.T, lang) : s.unbound}
          accent="green"
        />
        <PhysicsValue
          label={s.nOrbits}
          value={String(nPeri)}
          accent="green"
        />
        <PhysicsValue
          label={s.precTheory}
          value={
            mode === "newton"
              ? s.exact0
              : theory.bound
                ? `${fmt(theory.precArcsecC, lang, 2)}`
                : "—"
          }
          unit={mode === "newton" || !theory.bound ? undefined : s.arcsecCentury}
          accent="violet"
          title={theory.bound && mode === "gr" ? `${fmt(theory.precRad * 206265, lang, 4)} ${s.arcsecOrbit}` : undefined}
        />
        <PhysicsValue
          label={s.precMeasured}
          value={Number.isFinite(measArcsecC) ? fmt(measArcsecC, lang, 2) : s.notYet}
          unit={Number.isFinite(measArcsecC) ? s.arcsecCentury : undefined}
          accent="violet"
        />
      </div>
      {theory.bound && theory.rp < capR && sim.status === "ok" && (
        <p className="mt-2 text-sm font-medium" style={{ color: "var(--red)" }}>
          ⚠ {s.willCapture}
        </p>
      )}
    </div>
  );

  const controls = (
    <>
      <PlayPauseControls
        playing={playing}
        onToggle={() => {
          if (simRef.current.status !== "ok") resetSim();
          setPlaying((p) => !p);
        }}
        onReset={() => {
          resetSim();
          setPlaying(false);
          setUiTick((t) => t + 1);
        }}
      />
      <PresetBar
        presets={[
          { label: s.mercury },
          { label: s.earthLike },
          { label: s.nsClose },
          { label: s.plunge },
        ]}
        onPick={pickPreset}
      />
      <SegmentedControl
        label={s.body}
        value={bodyId}
        onChange={(v) => {
          setBodyId(v);
          const b = BODIES.find((x) => x.id === v) ?? BODIES[0];
          const cR = b.isBH ? schwarzschildRadius(b.mass) : b.radius;
          const lo = Math.log10(cR * 1.15);
          setLogR0((cur) => Math.min(Math.max(cur, lo), lo + LOG_SPAN));
        }}
        options={BODIES.map((b) => ({ value: b.id, label: b.name[lang] }))}
      />
      <ParamSlider
        label={s.r0}
        value={logR0}
        min={logMin}
        max={logMax}
        step={0.005}
        onChange={setLogR0}
        format={() => fmtDistance(r0, lang)}
        accent="cyan"
      />
      <ParamSlider
        label={s.vfrac}
        value={vfrac}
        min={0.3}
        max={1.5}
        step={0.005}
        onChange={setVfrac}
        format={(v) => `${v.toFixed(3)} × v_circ`}
        accent="amber"
      />
      <div className="-mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
        <IM tex="v_{\mathrm{circ}} = \sqrt{GM/r_0}" /> · {s.vcircNote} = {fmt(vcirc, lang, 3)} m/s
      </div>
      <SegmentedControl<Mode>
        label={s.mode}
        value={mode}
        onChange={setMode}
        options={[
          { value: "newton", label: s.newton },
          { value: "gr", label: s.gr },
        ]}
      />
      <ParamSlider
        label={s.speed}
        value={Math.log10(speed)}
        min={Math.log10(0.02)}
        max={Math.log10(3)}
        step={0.01}
        onChange={(v) => setSpeed(Math.pow(10, v))}
        format={() => `${fmt(speed, lang, 2)} ${s.speedUnit}`}
        accent="violet"
      />
      <ParamSlider
        label={s.trail}
        value={trailOrbits}
        min={1}
        max={20}
        step={1}
        onChange={setTrailOrbits}
        format={(v) => `${v} ${s.trailUnit}`}
        accent="violet"
      />
    </>
  );

  return (
    <SimulationShell
      simId="orbits"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={3}
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
          <EquationCard tex="F = \dfrac{GMm}{r^2}" caption={s.eqNewton} />
          <div className="mt-3">
            <EquationCard
              tex="\Delta\phi = \frac{6\pi GM}{a(1-e^2)c^2}"
              caption={`${s.eqGR} · ${s.arcsecCentury.replace("″", "")}`}
            />
          </div>
        </>
      }
      mathEquation={
        <EquationCard
          tex="a = -\frac{GM}{r^2}\left(1 + \frac{3h^2}{c^2 r^2}\right)\hat{r}\qquad h = r_0 v_0"
          caption={s.eqForce}
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
