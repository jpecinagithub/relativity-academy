import { useCallback, useEffect, useRef, useState } from "react";
import {
  SimulationShell, ParamSlider, PhysicsValue, EquationCard, IM, MathOnly,
  SegmentedControl, TryThis, PlayPauseControls, useG,
} from "../components/ui";
import {
  lorentzFactor, lorentzTransform, classifySeparation, spacetimeInterval,
} from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── i18n ─────────────────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    title: "Minkowski Diagram Lab",
    subtitle: "Draw spacetime itself: worldlines, light cones and the tilting axes of moving observers. Units: c = 1 (x and ct in light-seconds).",
    concept: "Spacetime",
    velocity: "Observer O′ velocity β = v/c",
    zoom: "Zoom",
    model: "Physics model",
    rel: "Relativistic",
    newt: "Newtonian",
    emitFrom: "Emit photon from",
    origin: "Origin",
    emitDir: "Photon direction",
    emit: "Emit photon",
    clear: "Clear photons",
    resetEvents: "Reset events",
    cone: "Light cone of A",
    simLines: "S′ simultaneity lines",
    axisLabels: "Grid labels",
    newtNote: "Newtonian mode: simultaneity is absolute, so the x′ axis stays horizontal. Real physics needs the relativistic tilt — switch back to see it.",
    readBeta: "β = v/c",
    readGamma: "γ",
    evA_S: "A (ct, x) in S",
    evA_Sp: "A (ct′, x′) in S′",
    evB_S: "B (ct, x) in S",
    evB_Sp: "B (ct′, x′) in S′",
    dT: "Δt (S)",
    dX: "Δx (S)",
    ds2: "Δs²",
    sep: "Separation",
    timelike: "Timelike — A can cause B",
    spacelike: "Spacelike — no causal link",
    lightlike: "Lightlike — only light connects them",
    dragHint: "Drag A and B · drag empty space to pan",
    legO: "You (O)",
    legOp: "Moving observer (O′)",
    legPhoton: "Photon",
    whatYouSee: [
      "This is a spacetime diagram: time (ct) runs upward, space (x) runs sideways. Every point is an event — a where and a when. A line through it is a worldline: the complete history of an object.",
      "Light always travels at 45°, because we measure time in the same units as space (c = 1). The vertical cyan line is you, observer O, at rest. The amber line is observer O′ moving at velocity β.",
      "Watch the dashed amber axes as you move the velocity slider: ct′ runs along O′'s worldline, while x′ — O′'s line of simultaneity — tilts the opposite way, like scissors closing as β grows. That tilt is the relativity of simultaneity made visible: events simultaneous for O are not simultaneous for O′.",
      "Drag events A and B anywhere. The readouts show their coordinates in both frames and the invariant interval Δs² — the one quantity every observer agrees on.",
    ],
    physics: [
      "A worldline steeper than 45° is timelike: the object moves slower than light. Exactly 45° is lightlike; shallower is spacelike — faster-than-light motion, impossible for matter and for signals.",
      "The Lorentz transformation rotates the moving observer's axes toward the light cone while keeping every photon line at 45°. That is the geometric reason the speed of light is the same for everyone.",
      "The interval Δs² = Δx² − c²Δt² is invariant: observers disagree about Δt and Δx separately, but never about Δs². Timelike (Δs² < 0): A can cause B. Spacelike (Δs² > 0): no causal connection is possible. Lightlike (Δs² = 0): only a light signal connects them.",
    ],
    eqCaption: "The spacetime interval — invariant for all inertial observers.",
    assumptions: [
      "One spatial dimension: this is a 1+1D slice of the full 4D spacetime.",
      "Natural units with c = 1: one unit of ct equals one unit of x (light-seconds).",
      "O and O′ are inertial observers moving at constant velocity; acceleration is not modelled.",
      "Unlike the rubber-sheet picture of gravity, this diagram is exact special relativity — not an analogy.",
      "In Newtonian mode the photon speed is frame-dependent, as classical physics predicts; nature chose otherwise.",
    ],
    tryPrompt: "Place events A and B so they are lightlike separated (Δs² = 0). Only a light signal can connect them.",
    tryHint: "Drag B until it sits exactly on one of the 45° diagonals through A — that is the edge of A's light cone.",
  },
  es: {
    title: "Laboratorio de diagramas de Minkowski",
    subtitle: "Dibuja el espaciotiempo: líneas de universo, conos de luz y los ejes inclinados de observadores en movimiento. Unidades: c = 1 (x y ct en segundos-luz).",
    concept: "Espaciotiempo",
    velocity: "Velocidad del observador O′ β = v/c",
    zoom: "Zoom",
    model: "Modelo físico",
    rel: "Relativista",
    newt: "Newtoniano",
    emitFrom: "Emitir fotón desde",
    origin: "Origen",
    emitDir: "Dirección del fotón",
    emit: "Emitir fotón",
    clear: "Borrar fotones",
    resetEvents: "Restablecer eventos",
    cone: "Cono de luz de A",
    simLines: "Líneas de simultaneidad de S′",
    axisLabels: "Etiquetas de la rejilla",
    newtNote: "Modo newtoniano: la simultaneidad es absoluta, así que el eje x′ permanece horizontal. La física real necesita la inclinación relativista — vuelve al modo relativista para verla.",
    readBeta: "β = v/c",
    readGamma: "γ",
    evA_S: "A (ct, x) en S",
    evA_Sp: "A (ct′, x′) en S′",
    evB_S: "B (ct, x) en S",
    evB_Sp: "B (ct′, x′) en S′",
    dT: "Δt (S)",
    dX: "Δx (S)",
    ds2: "Δs²",
    sep: "Separación",
    timelike: "Temporal — A puede causar B",
    spacelike: "Espacial — sin vínculo causal",
    lightlike: "Lumínica — solo la luz los conecta",
    dragHint: "Arrastra A y B · arrastra el fondo para mover la vista",
    legO: "Tú (O)",
    legOp: "Observador en movimiento (O′)",
    legPhoton: "Fotón",
    whatYouSee: [
      "Esto es un diagrama de espaciotiempo: el tiempo (ct) avanza hacia arriba y el espacio (x) hacia los lados. Cada punto es un evento — un dónde y un cuándo. Una línea que lo atraviesa es una línea de universo: la historia completa de un objeto.",
      "La luz siempre viaja a 45°, porque medimos el tiempo en las mismas unidades que el espacio (c = 1). La línea cian vertical eres tú, el observador O, en reposo. La línea ámbar es el observador O′ moviéndose a velocidad β.",
      "Observa los ejes ámbar discontinuos al mover el deslizador de velocidad: ct′ sigue la línea de universo de O′, mientras que x′ — la línea de simultaneidad de O′ — se inclina en sentido opuesto, como unas tijeras que se cierran al crecer β. Esa inclinación es la relatividad de la simultaneidad hecha visible: eventos simultáneos para O no lo son para O′.",
      "Arrastra los eventos A y B a cualquier lugar. Los indicadores muestran sus coordenadas en ambos sistemas y el intervalo invariante Δs² — la única cantidad en la que todos los observadores coinciden.",
    ],
    physics: [
      "Una línea de universo más empinada que 45° es temporal: el objeto se mueve más despacio que la luz. Exactamente 45° es lumínica; más tendida es espacial — movimiento superlumínico, imposible para la materia y para las señales.",
      "La transformación de Lorentz gira los ejes del observador en movimiento hacia el cono de luz manteniendo cada línea de fotón a 45°. Esa es la razón geométrica por la que la velocidad de la luz es la misma para todos.",
      "El intervalo Δs² = Δx² − c²Δt² es invariante: los observadores discrepan sobre Δt y Δx por separado, pero nunca sobre Δs². Temporal (Δs² < 0): A puede causar B. Espacial (Δs² > 0): ninguna conexión causal es posible. Lumínica (Δs² = 0): solo una señal de luz los conecta.",
    ],
    eqCaption: "El intervalo de espaciotiempo — invariante para todos los observadores inerciales.",
    assumptions: [
      "Una dimensión espacial: esto es un corte 1+1D del espaciotiempo completo 4D.",
      "Unidades naturales con c = 1: una unidad de ct equivale a una unidad de x (segundos-luz).",
      "O y O′ son observadores inerciales con velocidad constante; la aceleración no se modela.",
      "A diferencia de la lámina de goma de la gravedad, este diagrama es relatividad especial exacta — no una analogía.",
      "En modo newtoniano la velocidad del fotón depende del sistema, como predice la física clásica; la naturaleza eligió otra cosa.",
    ],
    tryPrompt: "Coloca los eventos A y B de forma que su separación sea lumínica (Δs² = 0). Solo una señal de luz puede conectarlos.",
    tryHint: "Arrastra B hasta que quede exactamente sobre una de las diagonales de 45° que pasan por A — ese es el borde del cono de luz de A.",
  },
} as const;

type Mode = "rel" | "newt";
type EmitFrom = "origin" | "A" | "B";
interface Ev { t: number; x: number }
interface Photon { id: number; t0: number; x0: number; dir: 1 | -1; birth: number }

const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : "—");
const CLAMP = 30;

export default function Minkowski() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [beta, setBeta] = useState(0.5);
  const [mode, setMode] = useState<Mode>("rel");
  const [zoom, setZoom] = useState(1);
  const [ox, setOx] = useState(0); // world x at canvas centre
  const [ot, setOt] = useState(1); // world ct at canvas centre
  const [evA, setEvA] = useState<Ev>({ t: 2, x: -2 });
  const [evB, setEvB] = useState<Ev>({ t: 5, x: 1.5 });
  const [photons, setPhotons] = useState<Photon[]>([]);
  const [playing, setPlaying] = useState(!reduced);
  const [showCone, setShowCone] = useState(true);
  const [showSimLines, setShowSimLines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [emitFrom, setEmitFrom] = useState<EmitFrom>("A");
  const [emitDir, setEmitDir] = useState<1 | -1>(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simTime = useRef(0);
  const hover = useRef<Ev | null>(null);
  const drag = useRef<null | { kind: "A" | "B" | "pan"; px: number; py: number; ox: number; ot: number }>(null);
  const idRef = useRef(1);

  // ── derived physics (c = 1 units; physics fns take SI) ─────────────────────
  const v = beta * C;
  const gamma = lorentzFactor(v);
  const toPrime = useCallback((t: number, x: number): Ev => {
    if (mode === "rel") {
      const r = lorentzTransform(t, x * C, v);
      return { t: r.t, x: r.x / C };
    }
    return { t, x: x - beta * t }; // Galilean
  }, [mode, v, beta]);
  const Ap = toPrime(evA.t, evA.x);
  const Bp = toPrime(evB.t, evB.x);
  const dt = evB.t - evA.t;
  const dx = evB.x - evA.x;
  const ds2 = spacetimeInterval(dt, dx * C) / (C * C); // light-second²
  const sep = classifySeparation(dt, dx * C);
  const sepLabel = sep === "timelike" ? s.timelike : sep === "spacelike" ? s.spacelike : s.lightlike;
  const sepColor = sep === "timelike" ? "var(--green)" : sep === "spacelike" ? "var(--amber)" : "var(--violet)";

  // ── canvas drawing ─────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(document.documentElement);
    const col = (n: string, fb: string) => css.getPropertyValue(n).trim() || fb;
    const cyan = col("--cyan", "#3ee6ff");
    const amber = col("--amber", "#f5a524");
    const violet = col("--violet", "#a78bfa");
    const green = col("--green", "#4ade80");
    const red = col("--red", "#f87171");
    const text = col("--text", "#efe9da");
    const textDim = col("--text-dim", "#a9b2c5");
    const textFaint = col("--text-faint", "#6b7590");
    const border = col("--border", "#2a3350");
    const bg = col("--bg-inset", "#05080f");

    const scale = (Math.min(w, h) / 14) * zoom;
    const cx = w / 2, cy = h / 2;
    const X = (x: number) => cx + (x - ox) * scale;
    const Y = (t: number) => cy - (t - ot) * scale;

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const xMin = ox - cx / scale, xMax = ox + cx / scale;
    const tMin = ot - cy / scale, tMax = ot + cy / scale;

    // long line through (x,t) with direction (dx,dt), clipped to canvas
    const trace = (x: number, t: number, dxn: number, dyn: number) => {
      const L = 60;
      ctx.beginPath();
      ctx.moveTo(X(x - L * dxn), Y(t - L * dyn));
      ctx.lineTo(X(x + L * dxn), Y(t + L * dyn));
      ctx.stroke();
    };
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.clip();

    // grid
    ctx.lineWidth = 1;
    ctx.strokeStyle = border;
    ctx.globalAlpha = 0.55;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i++) {
      ctx.beginPath(); ctx.moveTo(X(i), 0); ctx.lineTo(X(i), h); ctx.stroke();
    }
    for (let i = Math.ceil(tMin); i <= Math.floor(tMax); i++) {
      ctx.beginPath(); ctx.moveTo(0, Y(i)); ctx.lineTo(w, Y(i)); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // 45° photon diagonals through origin
    ctx.strokeStyle = red;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1.2;
    trace(0, 0, 1, 1);
    trace(0, 0, 1, -1);
    ctx.globalAlpha = 1;

    // future light cone of A
    if (showCone) {
      ctx.fillStyle = violet;
      ctx.globalAlpha = 0.08;
      const L = 80;
      ctx.beginPath();
      ctx.moveTo(X(evA.x), Y(evA.t));
      ctx.lineTo(X(evA.x + L), Y(evA.t + L));
      ctx.lineTo(X(evA.x - L), Y(evA.t + L));
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.8;
      ctx.strokeStyle = violet;
      ctx.lineWidth = 1.5;
      trace(evA.x, evA.t, 1, 1);
      trace(evA.x, evA.t, -1, 1);
      ctx.globalAlpha = 1;
    }

    // simultaneity lines through A and B (slope β in rel, flat in newt)
    if (showSimLines) {
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = amber;
      ctx.globalAlpha = 0.55;
      if (mode === "rel") {
        trace(evA.x, evA.t, 1, beta);
        trace(evB.x, evB.t, 1, beta);
      } else {
        trace(evA.x, evA.t, 1, 0);
        trace(evB.x, evB.t, 1, 0);
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // x′ axis (line of simultaneity through origin)
    ctx.setLineDash([7, 5]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = amber;
    if (mode === "rel") trace(0, 0, 1, beta);
    else trace(0, 0, 1, 0);
    ctx.setLineDash([]);

    // axes S: x (horizontal) and ct (vertical)
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = textDim;
    ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0), h); ctx.lineTo(X(0), 0); ctx.stroke();
    // arrowheads
    const arrow = (px: number, py: number, ang: number) => {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 9 * Math.cos(ang - 0.42), py - 9 * Math.sin(ang - 0.42));
      ctx.moveTo(px, py);
      ctx.lineTo(px - 9 * Math.cos(ang + 0.42), py - 9 * Math.sin(ang + 0.42));
      ctx.stroke();
    };
    arrow(w - 4, Y(0), 0);
    arrow(X(0), 4, Math.PI / 2);

    // O worldline (cyan, x = 0)
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = cyan;
    ctx.shadowColor = cyan;
    ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(X(0), h); ctx.lineTo(X(0), 0); ctx.stroke();
    ctx.shadowBlur = 0;

    // O′ worldline = ct′ axis (amber, x = βt)
    ctx.lineWidth = 2.6;
    ctx.strokeStyle = amber;
    ctx.shadowColor = amber;
    ctx.shadowBlur = 8;
    trace(0, 0, beta, 1);
    ctx.shadowBlur = 0;

    // photons
    const now = simTime.current;
    for (const p of photons) {
      const age = now - p.birth;
      if (age < 0) continue;
      const hx = p.x0 + p.dir * age, ht = p.t0 + age;
      const tx = p.x0 + p.dir * Math.max(0, age - 4), tt = p.t0 + Math.max(0, age - 4);
      ctx.strokeStyle = "#ffd166";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(X(tx), Y(tt));
      ctx.lineTo(X(hx), Y(ht));
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffe9a8";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(X(hx), Y(ht), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // events
    const dot = (e: Ev, color: string, label: string) => {
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(X(e.x), Y(e.t), 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = text;
      ctx.font = "600 13px system-ui, sans-serif";
      ctx.fillText(label, X(e.x) + 11, Y(e.t) - 9);
    };
    dot(evA, violet, "A");
    dot(evB, green, "B");
    ctx.restore();

    // labels
    ctx.fillStyle = textDim;
    ctx.font = "600 13px system-ui, sans-serif";
    ctx.fillText("x", w - 22, Y(0) - 8);
    ctx.fillText("ct", X(0) + 8, 18);
    if (showLabels) {
      ctx.fillStyle = cyan;
      ctx.fillText("O", X(0) + 8, h - 10);
      // O′ label near top of its worldline
      const lx = beta * tMax * 0.92, lt = tMax * 0.92;
      ctx.fillStyle = amber;
      ctx.fillText("O′ · ct′", X(lx) + 8, Y(lt));
      // x′ label near right edge
      const xr = mode === "rel" ? (xMax - 0.4) : xMax - 0.4;
      const tr = mode === "rel" ? beta * xr : 0;
      if (tr > tMin && tr < tMax) {
        ctx.fillStyle = amber;
        ctx.fillText("x′", X(xr) - 6, Y(tr) - 8);
      }
      // integer tick labels every 2 units
      ctx.fillStyle = textFaint;
      ctx.font = "10px system-ui, sans-serif";
      for (let i = Math.ceil(xMin / 2) * 2; i <= Math.floor(xMax); i += 2) {
        if (i !== 0) ctx.fillText(String(i), X(i) - 3, Y(0) + 14);
      }
      for (let i = Math.ceil(tMin / 2) * 2; i <= Math.floor(tMax); i += 2) {
        if (i !== 0) ctx.fillText(String(i), X(0) + 5, Y(i) + 3);
      }
    }

    // hover coordinates
    if (hover.current) {
      ctx.fillStyle = textDim;
      ctx.font = "11px ui-monospace, monospace";
      ctx.fillText(`x = ${fmt(hover.current.x)},  ct = ${fmt(hover.current.t)}`, 10, h - 10);
    }
  }, [beta, mode, zoom, ox, ot, evA, evB, photons, showCone, showSimLines, showLabels]);

  // redraw after every render
  useEffect(() => { draw(); });

  // animation clock: advance sim time, cull old photons
  useRaf((dtSec) => {
    simTime.current += dtSec;
    setPhotons((ps) => {
      const now = simTime.current;
      const kept = ps.filter((p) => now - p.birth < 60);
      return kept.length === ps.length ? ps : kept;
    });
  }, playing);

  // ── pointer interaction ────────────────────────────────────────────────────
  const toWorld = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const scale = (Math.min(r.width, r.height) / 14) * zoom;
    return {
      x: ox + (px - r.width / 2) / scale,
      t: ot - (py - r.height / 2) / scale,
      px, py, scale,
    };
  };
  const onPointerDown = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const { x, t, px, py, scale } = toWorld(e);
    const hitR = 16 / scale; // ~16px in world units
    const dA = Math.hypot(x - evA.x, t - evA.t);
    const dB = Math.hypot(x - evB.x, t - evB.t);
    if (dA <= hitR && dA <= dB) drag.current = { kind: "A", px, py, ox, ot };
    else if (dB <= hitR) drag.current = { kind: "B", px, py, ox, ot };
    else drag.current = { kind: "pan", px, py, ox, ot };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const { x, t, px, py, scale } = toWorld(e);
    const d = drag.current;
    if (!d) {
      const hitR = 16 / scale;
      const near =
        Math.hypot(x - evA.x, t - evA.t) <= hitR || Math.hypot(x - evB.x, t - evB.t) <= hitR;
      hover.current = { x, t };
      (e.target as HTMLElement).style.cursor = near ? "grab" : "default";
      draw();
      return;
    }
    if (d.kind === "pan") {
      setOx(d.ox - (px - d.px) / scale);
      setOt(d.ot + (py - d.py) / scale);
    } else {
      const nx = Math.max(-CLAMP, Math.min(CLAMP, x));
      const nt = Math.max(-CLAMP, Math.min(CLAMP, t));
      (d.kind === "A" ? setEvA : setEvB)({ x: nx, t: nt });
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    drag.current = null;
    (e.target as HTMLElement).style.cursor = "default";
  };

  // ── actions ────────────────────────────────────────────────────────────────
  const emitPhoton = () => {
    const src = emitFrom === "origin" ? { t: 0, x: 0 } : emitFrom === "A" ? evA : evB;
    setPhotons((ps) => {
      if (ps.length >= 40) return ps;
      return [...ps, { id: idRef.current++, t0: src.t, x0: src.x, dir: emitDir, birth: simTime.current }];
    });
    if (!playing) setPlaying(true);
  };
  const resetEvents = () => {
    setEvA({ t: 2, x: -2 });
    setEvB({ t: 5, x: 1.5 });
    setOx(0); setOt(1);
  };

  const checkLightlike = useCallback(() => {
    const d = Math.hypot(dx, dt);
    return d > 0.05 && classifySeparation(dt, dx * C) === "lightlike";
  }, [dt, dx]);

  // ── render ─────────────────────────────────────────────────────────────────
  const toggleRow = (label: string, val: boolean, set: (b: boolean) => void) => (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm" style={{ color: "var(--text-dim)" }}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={val}
        onChange={(e) => set(e.target.checked)}
        className="h-4 w-4 accent-current"
        style={{ accentColor: "var(--cyan)" }}
        aria-label={label}
      />
    </label>
  );

  return (
    <SimulationShell
      simId="minkowski"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={3}
      concept={s.concept}
      visualization={
        <div>
          <div className="relative h-[420px] w-full sm:h-[520px]">
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              style={{ touchAction: "none", display: "block" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={() => { hover.current = null; draw(); }}
              role="img"
              aria-label={s.title}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-2.5 text-xs" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--cyan)" }} />{s.legO}</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--amber)" }} />{s.legOp}</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--violet)" }} />A</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "var(--green)" }} />B</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: "#ffd166" }} />{s.legPhoton}</span>
            <span className="ml-auto">{s.dragHint}</span>
          </div>
        </div>
      }
      controls={
        <>
          <ParamSlider label={s.velocity} value={beta} min={-0.95} max={0.95} step={0.01}
            onChange={setBeta} format={(v) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(0)}% c`} accent="amber" />
          <ParamSlider label={s.zoom} value={zoom} min={0.5} max={3} step={0.1}
            onChange={setZoom} format={(v) => `${v.toFixed(1)}×`} />
          <SegmentedControl<Mode>
            label={s.model}
            options={[{ value: "rel", label: s.rel }, { value: "newt", label: s.newt }]}
            value={mode} onChange={setMode}
          />
          {mode === "newt" && (
            <p className="rounded-lg p-3 text-xs leading-relaxed" style={{ background: "var(--amber-dim)", color: "var(--text-dim)" }}>
              {s.newtNote}
            </p>
          )}
          <PlayPauseControls playing={playing} onToggle={() => setPlaying((p) => !p)} onReset={() => setPhotons([])} />
          <div className="space-y-3">
            <SegmentedControl<EmitFrom>
              label={s.emitFrom}
              options={[{ value: "origin", label: s.origin }, { value: "A", label: "A" }, { value: "B", label: "B" }]}
              value={emitFrom} onChange={setEmitFrom}
            />
            <SegmentedControl<1 | -1>
              label={s.emitDir}
              options={[{ value: -1, label: "−x" }, { value: 1, label: "+x" }]}
              value={emitDir} onChange={setEmitDir}
            />
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary !px-4 !py-2 text-sm" onClick={emitPhoton}>{s.emit}</button>
              <button className="btn-ghost !px-3 !py-2 text-sm" onClick={() => setPhotons([])}>{s.clear}</button>
              <button className="btn-ghost !px-3 !py-2 text-sm" onClick={resetEvents}>{s.resetEvents}</button>
            </div>
          </div>
          <div className="space-y-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            {toggleRow(s.cone, showCone, setShowCone)}
            {toggleRow(s.simLines, showSimLines, setShowSimLines)}
            {toggleRow(s.axisLabels, showLabels, setShowLabels)}
          </div>
          <div className="grid grid-cols-2 gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <PhysicsValue label={s.readBeta} value={fmt(beta, 3)} accent="amber" />
            <PhysicsValue label={s.readGamma} value={fmt(gamma)} accent="amber" />
            <PhysicsValue label={s.evA_S} value={`(${fmt(evA.t)}, ${fmt(evA.x)})`} accent="violet" />
            <PhysicsValue label={s.evA_Sp} value={`(${fmt(Ap.t)}, ${fmt(Ap.x)})`} accent="violet" />
            <PhysicsValue label={s.evB_S} value={`(${fmt(evB.t)}, ${fmt(evB.x)})`} accent="green" />
            <PhysicsValue label={s.evB_Sp} value={`(${fmt(Bp.t)}, ${fmt(Bp.x)})`} accent="green" />
            <PhysicsValue label={s.dT} value={fmt(dt)} unit="ls" />
            <PhysicsValue label={s.dX} value={fmt(dx)} unit="ls" />
            <PhysicsValue label={s.ds2} value={fmt(ds2)} unit="ls²" accent="cyan" />
            <div className="inset px-3 py-2.5">
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>{s.sep}</div>
              <div className="mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ color: sepColor, border: `1px solid ${sepColor}` }}>
                {sepLabel}
              </div>
            </div>
          </div>
        </>
      }
      whatYouSee={<>{s.whatYouSee.map((p, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>)}</>}
      physics={<>{s.physics.map((p, i) => <p key={i} className={i > 0 ? "mt-3" : ""}>{p}</p>)}</>}
      equation={
        <EquationCard tex="\Delta s^2 = -c^2\,\Delta t^2 + \Delta x^2" caption={s.eqCaption} />
      }
      mathEquation={
        <MathOnly>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <EquationCard tex="x' = \gamma\,(x - vt) \qquad t' = \gamma\left(t - \frac{vx}{c^2}\right)" />
            <EquationCard tex="\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}" caption={
              mode === "rel"
                ? (lang === "es" ? "Transformación de Lorentz: S → S′." : "Lorentz transformation: S → S′.")
                : (lang === "es" ? "Límite newtoniano: t′ = t, x′ = x − vt." : "Newtonian limit: t′ = t, x′ = x − vt.")
            } />
          </div>
          <p className="mt-3 text-sm" style={{ color: "var(--text-dim)" }}>
            <IM tex="t" /> {lang === "es" ? "y" : "and"} <IM tex="x" />{" "}
            {lang === "es"
              ? "son el tiempo y la posición del evento en S; las primas son las coordenadas medidas por O′, que se mueve a velocidad v respecto a S."
              : "are the event's time and position in S; primed quantities are the coordinates measured by O′, moving at velocity v relative to S."}
          </p>
        </MathOnly>
      }
      tryThis={
        <TryThis prompt={s.tryPrompt} check={checkLightlike}>
          <p className="mt-2 text-xs" style={{ color: "var(--text-faint)" }}>{s.tryHint}</p>
        </TryThis>
      }
      assumptions={[...s.assumptions]}
    />
  );
}
