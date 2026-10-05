import { useEffect, useReducer, useRef, useState } from "react";
import { lorentzFactor, dilatedTime, betaOf } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { fmt, fmtVelocity } from "../physics/units";
import { formatDuration } from "../physics/generalRelativity";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  PlayPauseControls,
  PresetBar,
  TryThis,
  SegmentedControl,
  KeyIdea,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  shipFrame: string; shipSub: string; earthFrame: string; earthSub: string;
  ticks: string;
  velocity: string; animSpeed: string; trail: string; on: string; off: string;
  pWalk: string; pAir: string; pIss: string;
  roShip: string; roEarth: string; roGamma: string; roTicks: string;
  roKms: string; roPct: string;
  graphTitle: string; graphCaption: string;
  legendPhoton: string; legendTick: string; canvasLabel: string;
  wys: string[]; phys: string[]; keyIdea: string;
  eqGammaCap: string; eqTickCap: string; eqDerivCap: string;
  tryPrompt: string; assumptions: string[];
}

const STRINGS: Record<"en" | "es", Strings> = {
  en: {
    title: "Light Clock",
    subtitle:
      "Einstein's famous thought experiment: a single photon bouncing between two mirrors — watched from the ship and from Earth.",
    concept: "Time dilation",
    shipFrame: "Ship frame",
    shipSub: "riding with the clock",
    earthFrame: "Earth frame",
    earthSub: "watching the clock fly past",
    ticks: "ticks",
    velocity: "Clock velocity",
    animSpeed: "Animation speed",
    trail: "Photon trail",
    on: "On",
    off: "Off",
    pWalk: "Walking",
    pAir: "Airplane",
    pIss: "ISS",
    roShip: "Ship time τ · proper time",
    roEarth: "Earth time t",
    roGamma: "Lorentz factor γ",
    roTicks: "Ticks · ship : Earth",
    roKms: "Velocity",
    roPct: "Velocity",
    graphTitle: "Velocity vs. time dilation",
    graphCaption:
      "γ grows without bound as v approaches c — the curve steepens dramatically past 0.9c.",
    legendPhoton: "Photon speed = c in both frames",
    legendTick: "1 tick = one photon round trip",
    canvasLabel: "Animation of a light clock seen from the ship and from Earth",
    wys: [
      "Left: the astronaut's view, riding with the clock. The photon bounces straight up and down between the mirrors — each round trip is one tick.",
      "Right: the view from Earth. The whole clock rushes past at velocity v, so between bounces the photon must also travel sideways: its path becomes a zigzag.",
      "In both frames the photon moves at exactly c — Einstein's second postulate, built into the animation. The diagonal zigzag is longer than the vertical path, so at the same speed each tick needs more Earth time.",
      "Watch the tick counters start together and diverge. The ratio between Earth ticks and ship ticks is exactly the Lorentz factor γ.",
    ],
    phys: [
      "A tick is defined by the photon's round trip. Aboard the ship the photon travels the distance 2L (up and down) at speed c, so one tick lasts Δτ = 2L/c. This is the proper time: the time measured by a clock present at both events.",
      "From Earth the clock moves at v. During one tick the photon traces a longer diagonal path — but light still travels at c for every inertial observer. A longer path at the same speed means more time elapses: Δt = γ·Δτ.",
      "This is not an optical illusion or a defect of this particular clock. Time itself passes more slowly in the moving frame: any clock travelling with the ship — mechanical, atomic or biological — would show the same dilation.",
    ],
    keyIdea:
      "Moving clocks run slow — by exactly the factor γ. Both observers agree on the laws of physics; they disagree on whose seconds are whose.",
    eqGammaCap: "The Lorentz factor: how strongly time (and space) distort at velocity v.",
    eqTickCap: "Coordinate time vs. proper time: Earth measures γ times more seconds per tick.",
    eqDerivCap:
      "Why? In Earth time Δt the photon travels the diagonal 2·√(L² + (vΔt/2)²) at speed c. Solving c·Δt = 2·√(L² + (vΔt/2)²) gives Δt = γ·(2L/c). L is the mirror separation.",
    tryPrompt:
      "Find the velocity at which 1 year aboard the ship corresponds to 10 years on Earth. (Hint: you need γ = 10.)",
    assumptions: [
      "Both frames are inertial: the clock cruises at constant velocity v, and acceleration phases are neglected.",
      "Reflections are idealized as instantaneous; the mirrors are perfect.",
      "The animation is slowed down enormously so you can see it: a real light clock with mirrors 1 m apart would tick every ~6.7 nanoseconds.",
      "The ship's own length contraction is not drawn — only the timing of the clock is visualized.",
    ],
  },
  es: {
    title: "Reloj de luz",
    subtitle:
      "El famoso experimento mental de Einstein: un único fotón rebotando entre dos espejos, visto desde la nave y desde la Tierra.",
    concept: "Dilatación del tiempo",
    shipFrame: "Sistema de la nave",
    shipSub: "viajando con el reloj",
    earthFrame: "Sistema de la Tierra",
    earthSub: "viendo pasar el reloj",
    ticks: "tics",
    velocity: "Velocidad del reloj",
    animSpeed: "Velocidad de animación",
    trail: "Estela del fotón",
    on: "Sí",
    off: "No",
    pWalk: "Caminando",
    pAir: "Avión",
    pIss: "EEI",
    roShip: "Tiempo nave τ · tiempo propio",
    roEarth: "Tiempo Tierra t",
    roGamma: "Factor de Lorentz γ",
    roTicks: "Tics · nave : Tierra",
    roKms: "Velocidad",
    roPct: "Velocidad",
    graphTitle: "Velocidad frente a dilatación temporal",
    graphCaption:
      "γ crece sin límite cuando v se acerca a c: la curva se empina drásticamente más allá de 0,9c.",
    legendPhoton: "Velocidad del fotón = c en ambos sistemas",
    legendTick: "1 tic = un viaje de ida y vuelta del fotón",
    canvasLabel: "Animación de un reloj de luz visto desde la nave y desde la Tierra",
    wys: [
      "Izquierda: la vista del astronauta, que viaja con el reloj. El fotón rebota en vertical entre los espejos; cada viaje de ida y vuelta es un tic.",
      "Derecha: la vista desde la Tierra. Todo el reloj pasa a gran velocidad, así que entre rebotes el fotón también debe avanzar lateralmente: su trayectoria se convierte en zigzag.",
      "En ambos sistemas el fotón se mueve exactamente a c: es el segundo postulado de Einstein, integrado en la animación. El zigzag diagonal es más largo que el camino vertical, así que a la misma velocidad cada tic necesita más tiempo terrestre.",
      "Observa cómo los contadores de tics empiezan juntos y divergen. El cociente entre los tics terrestres y los de la nave es exactamente el factor de Lorentz γ.",
    ],
    phys: [
      "Un tic se define por el viaje de ida y vuelta del fotón. A bordo, el fotón recorre la distancia 2L (subida y bajada) a velocidad c, así que cada tic dura Δτ = 2L/c. Es el tiempo propio: el que mide un reloj presente en ambos eventos.",
      "Desde la Tierra el reloj se mueve a velocidad v. Durante un tic el fotón traza un camino diagonal más largo, pero la luz sigue viajando a c para todo observador inercial. Más camino a la misma velocidad significa más tiempo: Δt = γ·Δτ.",
      "No es una ilusión óptica ni un defecto de este reloj. El tiempo mismo transcurre más despacio en el sistema en movimiento: cualquier reloj que viaje con la nave — mecánico, atómico o biológico — mostraría la misma dilatación.",
    ],
    keyIdea:
      "Los relojes en movimiento avanzan más despacio, exactamente en el factor γ. Ambos observadores están de acuerdo en las leyes de la física; discrepan sobre de quién es cada segundo.",
    eqGammaCap: "El factor de Lorentz: cuánto se distorsionan el tiempo (y el espacio) a velocidad v.",
    eqTickCap: "Tiempo coordenado frente a tiempo propio: la Tierra mide γ veces más segundos por tic.",
    eqDerivCap:
      "¿Por qué? En el tiempo terrestre Δt el fotón recorre la diagonal 2·√(L² + (vΔt/2)²) a velocidad c. Al resolver c·Δt = 2·√(L² + (vΔt/2)²) se obtiene Δt = γ·(2L/c). L es la separación entre espejos.",
    tryPrompt:
      "Encuentra la velocidad a la que 1 año a bordo de la nave corresponde a 10 años en la Tierra. (Pista: necesitas γ = 10.)",
    assumptions: [
      "Ambos sistemas son inerciales: el reloj viaja a velocidad v constante y se desprecian las fases de aceleración.",
      "Las reflexiones se idealizan como instantáneas; los espejos son perfectos.",
      "La animación está enormemente ralentizada para poder verla: un reloj de luz real con espejos separados 1 m haría tic cada ~6,7 nanosegundos.",
      "No se dibuja la contracción de la longitud de la propia nave; solo se visualiza el ritmo del reloj.",
    ],
  },
};

// ─── Animation model ────────────────────────────────────────────────────────
// One master clock: tau = ship proper time in *visual* seconds.
// Everything in both views derives from tau, so the photon phase is shared.
// HALF_TICK = visual seconds for the photon to travel mirror → mirror.
const HALF_TICK = 0.8;
const ROUND_TRIP = 2 * HALF_TICK;

/** Photon vertical position: 0 = top mirror, 1 = bottom mirror. */
function photonRel(tau: number): number {
  const q = (tau / HALF_TICK) % 2;
  const qq = q < 0 ? q + 2 : q;
  return qq < 1 ? qq : 2 - qq;
}

/** Deterministic star field for the Earth view. */
function makeStars(n: number) {
  let seed = 1234567;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: n }, () => ({
    x: rnd(),
    y: rnd(),
    r: 0.6 + rnd() * 1.3,
    a: 0.2 + rnd() * 0.45,
  }));
}

function rr(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const q = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + q, y);
  ctx.arcTo(x + w, y, x + w, y + h, q);
  ctx.arcTo(x + w, y + h, x, y + h, q);
  ctx.arcTo(x, y + h, x, y, q);
  ctx.arcTo(x, y, x + w, y, q);
  ctx.closePath();
}

// ─── Canvas: two synchronized views ─────────────────────────────────────────
interface CanvasProps {
  beta: number;
  showTrail: boolean;
  playing: boolean;
  clock: { current: { tau: number } };
  resetKey: number;
  s: Strings;
}

function ClockCanvas(props: CanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const trailRef = useRef<Array<{ x: number; y: number }>>([]);
  const prevShipX = useRef(0);
  const lastBeta = useRef(props.beta);
  const lastReset = useRef(props.resetKey);
  const starsRef = useRef(makeStars(46));
  const live = useRef(props);
  live.current = props;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      sizeRef.current = { w: r.width, h: r.height, dpr };
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastKey = "";
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const p = live.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w: W, h: H, dpr } = sizeRef.current;
      if (W < 4 || H < 4) return;
      const tau = p.clock.current.tau;

      if (p.beta !== lastBeta.current) {
        trailRef.current = [];
        lastBeta.current = p.beta;
      }
      if (p.resetKey !== lastReset.current) {
        trailRef.current = [];
        prevShipX.current = 0;
        lastReset.current = p.resetKey;
      }
      if (!p.showTrail && trailRef.current.length > 0) trailRef.current = [];

      const key = `${tau.toFixed(3)}|${p.beta.toFixed(5)}|${Math.round(W)}|${Math.round(H)}|${p.showTrail}|${p.s.ticks}`;
      if (key === lastKey) return;
      lastKey = key;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Theme colors
      const cs = getComputedStyle(document.documentElement);
      const cssVar = (n: string, fb: string) => {
        const val = cs.getPropertyValue(n).trim();
        return val || fb;
      };
      const cyan = cssVar("--cyan", "#22d3ee");
      const amber = cssVar("--amber", "#fbbf24");
      const violet = cssVar("--violet", "#a78bfa");
      const text = cssVar("--text", "#f5f1e8");
      const textDim = cssVar("--text-dim", "#a8a29e");
      const textFaint = cssVar("--text-faint", "#78716c");
      const border = cssVar("--border", "#292524");
      const panel = cssVar("--bg-panel", "#1c1917");
      const inset = cssVar("--bg-inset", "#0c0a09");

      const v = p.beta * C;
      const earthTime = dilatedTime(tau, v);

      ctx.fillStyle = inset;
      ctx.fillRect(0, 0, W, H);

      const stacked = W < 620;
      const views = stacked
        ? [
            { x: 0, y: 0, w: W, h: H / 2 },
            { x: 0, y: H / 2, w: W, h: H / 2 },
          ]
        : [
            { x: 0, y: 0, w: W / 2, h: H },
            { x: W / 2, y: 0, w: W / 2, h: H },
          ];

      const TITLE_H = 46;
      const PAD = 14;

      const geom = (vx: number, vy: number, vw: number, vh: number) => {
        const cx = vx + vw / 2;
        const yTop = vy + TITLE_H + 22;
        const yBot = vy + vh - 54;
        const Hm = Math.max(56, yBot - yTop);
        return { cx, yTop, yBot: yTop + Hm, Hm, cy: yTop + Hm / 2 };
      };

      const drawTitle = (
        vx: number, vy: number, title: string, sub: string,
      ) => {
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.font = "600 13px system-ui, sans-serif";
        ctx.fillStyle = text;
        ctx.fillText(title, vx + PAD, vy + 19);
        ctx.font = "11px system-ui, sans-serif";
        ctx.fillStyle = textFaint;
        ctx.fillText(sub, vx + PAD, vy + 34);
      };

      const drawMirrors = (cx: number, yTop: number, yBot: number, mw: number) => {
        ctx.fillStyle = textDim;
        rr(ctx, cx - mw / 2, yTop - 3, mw, 6, 3);
        ctx.fill();
        rr(ctx, cx - mw / 2, yBot - 3, mw, 6, 3);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fillRect(cx - mw / 2 + 5, yTop - 1.6, mw - 10, 1.4);
        ctx.fillRect(cx - mw / 2 + 5, yBot - 1.6, mw - 10, 1.4);
      };

      const drawPhoton = (x: number, y: number) => {
        ctx.save();
        ctx.shadowColor = cyan;
        ctx.shadowBlur = 14;
        ctx.fillStyle = cyan;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      };

      // ── View 1: ship frame ─────────────────────────────────────────────
      {
        const { x: vx, y: vy, w: vw, h: vh } = views[0];
        const g = geom(vx, vy, vw, vh);
        drawTitle(vx, vy, p.s.shipFrame, p.s.shipSub);
        const mirrorW = Math.min(vw * 0.55, 190);
        drawMirrors(g.cx, g.yTop, g.yBot, mirrorW);

        const rel = photonRel(tau);
        const py = g.yTop + rel * g.Hm;

        if (p.showTrail) {
          for (let k = 1; k <= 12; k++) {
            const tt = tau - k * 0.04;
            if (tt < 0) break;
            const yy = g.yTop + photonRel(tt) * g.Hm;
            ctx.globalAlpha = 0.45 * (1 - k / 13);
            ctx.fillStyle = cyan;
            ctx.beginPath();
            ctx.arc(g.cx, yy, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        drawPhoton(g.cx, py);

        ctx.textAlign = "left";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillStyle = textDim;
        ctx.fillText(
          `${p.s.ticks}: ${Math.floor(tau / ROUND_TRIP)}`,
          vx + PAD,
          vy + vh - 30,
        );
        ctx.font = "600 13px ui-monospace, monospace";
        ctx.fillStyle = cyan;
        ctx.fillText(`τ = ${tau.toFixed(1)} s`, vx + PAD, vy + vh - 12);
      }

      // ── View 2: Earth frame ────────────────────────────────────────────
      {
        const { x: vx, y: vy, w: vw, h: vh } = views[1];
        const g = geom(vx, vy, vw, vh);
        drawTitle(vx, vy, p.s.earthFrame, p.s.earthSub);

        // stars
        for (const st of starsRef.current) {
          ctx.globalAlpha = st.a;
          ctx.fillStyle = textDim;
          ctx.beginPath();
          ctx.arc(vx + st.x * vw, vy + TITLE_H + st.y * (vh - TITLE_H - 8), st.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Visual light speed: px per ship-second (from the ship view geometry),
        // so the photon moves at exactly the same visual speed in both views.
        const Cv = g.Hm / HALF_TICK;
        const rel = photonRel(tau);
        const py = g.yTop + rel * g.Hm;

        const shipW = 108;
        const shipH = g.Hm + 48;
        const span = vw + 2 * shipW;
        const raw = (vw * 0.22 + p.beta * Cv * earthTime) % span;
        const shipCX = vx - shipW + (raw < 0 ? raw + span : raw);

        if (shipCX < prevShipX.current - 1) trailRef.current = [];
        prevShipX.current = shipCX;

        // zigzag trail (cleared on wrap / beta change / reset)
        if (p.playing && p.showTrail && tau > 0) {
          const tr = trailRef.current;
          const last = tr[tr.length - 1];
          if (!last || Math.hypot(shipCX - last.x, py - last.y) > 2) {
            tr.push({ x: shipCX, y: py });
            if (tr.length > 600) tr.shift();
          }
        }
        const tr = trailRef.current;
        if (p.showTrail && tr.length > 1) {
          ctx.save();
          ctx.strokeStyle = cyan;
          ctx.globalAlpha = 0.45;
          ctx.lineWidth = 2;
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(tr[0].x, tr[0].y);
          for (let i = 1; i < tr.length; i++) ctx.lineTo(tr[i].x, tr[i].y);
          ctx.stroke();
          ctx.restore();
        }

        // ship body
        const sx = shipCX - shipW / 2;
        const sy = g.cy - shipH / 2;
        if (p.beta > 0.005) {
          const flame = 6 + p.beta * 26;
          ctx.fillStyle = amber;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.moveTo(sx + 2, g.cy - 7);
          ctx.lineTo(sx + 2 - flame, g.cy);
          ctx.lineTo(sx + 2, g.cy + 7);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = panel;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        rr(ctx, sx, sy, shipW, shipH, 14);
        ctx.fill();
        ctx.stroke();
        // nose cone (direction of motion)
        ctx.fillStyle = violet;
        ctx.beginPath();
        ctx.moveTo(sx + shipW - 1, g.cy - 15);
        ctx.lineTo(sx + shipW + 17, g.cy);
        ctx.lineTo(sx + shipW - 1, g.cy + 15);
        ctx.closePath();
        ctx.fill();
        // window
        ctx.fillStyle = cyan;
        ctx.globalAlpha = 0.9;
        rr(ctx, shipCX - 15, sy + 9, 30, 11, 5);
        ctx.fill();
        ctx.globalAlpha = 1;

        drawMirrors(shipCX, g.yTop, g.yBot, shipW - 30);
        drawPhoton(shipCX, py);

        ctx.textAlign = "left";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillStyle = textDim;
        ctx.fillText(
          `${p.s.ticks}: ${Math.floor(earthTime / ROUND_TRIP)}`,
          vx + PAD,
          vy + vh - 30,
        );
        ctx.font = "600 13px ui-monospace, monospace";
        ctx.fillStyle = amber;
        ctx.fillText(`t = ${earthTime.toFixed(1)} s`, vx + PAD, vy + vh - 12);
        ctx.textAlign = "right";
        ctx.font = "12px system-ui, sans-serif";
        ctx.fillStyle = textFaint;
        ctx.fillText(
          `v = ${(p.beta * 100).toFixed(1)}% c`,
          vx + vw - PAD,
          vy + 19,
        );
        ctx.textAlign = "left";
      }

      // divider
      ctx.strokeStyle = border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (stacked) {
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
      } else {
        ctx.moveTo(W / 2, 0);
        ctx.lineTo(W / 2, H);
      }
      ctx.stroke();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div>
      <div ref={wrapRef} className="h-[440px] w-full md:h-[480px]">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          role="img"
          aria-label={props.s.canvasLabel}
        />
      </div>
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-2.5 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--cyan)" }}
            aria-hidden
          />
          {props.s.legendPhoton}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--amber)" }}
            aria-hidden
          />
          {props.s.legendTick}
        </span>
      </div>
    </div>
  );
}

// ─── Live readouts (throttled — canvas runs at full frame rate) ─────────────
function Readouts({
  clock,
  beta,
  s,
  lang,
}: {
  clock: { current: { tau: number } };
  beta: number;
  s: Strings;
  lang: "en" | "es";
}) {
  const [, bump] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const id = window.setInterval(bump, 200);
    return () => window.clearInterval(id);
  }, []);
  const tau = clock.current.tau;
  const v = beta * C;
  const gamma = lorentzFactor(v);
  const tEarth = dilatedTime(tau, v);
  const shipTicks = Math.floor(tau / ROUND_TRIP);
  const earthTicks = Math.floor(tEarth / ROUND_TRIP);
  const fmtT = (t: number) => (t === 0 ? "0 s" : formatDuration(t, lang));
  return (
    <div className="grid grid-cols-2 gap-2">
      <PhysicsValue label={s.roShip} value={fmtT(tau)} accent="cyan" />
      <PhysicsValue label={s.roEarth} value={fmtT(tEarth)} accent="amber" />
      <PhysicsValue label={s.roGamma} value={fmt(gamma, lang)} accent="violet" />
      <PhysicsValue
        label={s.roTicks}
        value={`${shipTicks} : ${earthTicks}`}
        accent="green"
      />
      <PhysicsValue
        label={s.roKms}
        value={fmt(v / 1000, lang)}
        unit="km/s"
        accent="cyan"
      />
      <PhysicsValue
        label={s.roPct}
        value={(beta * 100).toFixed(2)}
        unit="% c"
        accent="cyan"
      />
    </div>
  );
}

// ─── γ(β) chart ─────────────────────────────────────────────────────────────
function GammaChart({
  beta,
  title,
  caption,
}: {
  beta: number;
  title: string;
  caption: string;
}) {
  const W = 320;
  const HH = 190;
  const pl = 38;
  const pr = 12;
  const pt = 12;
  const pb = 26;
  const bMax = 0.999;
  const gMax = lorentzFactor(bMax * C);
  const x = (b: number) => pl + (b / bMax) * (W - pl - pr);
  const y = (g: number) => {
    const t = Math.log(Math.max(g, 1)) / Math.log(gMax);
    return pt + (1 - t) * (HH - pt - pb);
  };
  const pts: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const b = (i / 160) * bMax;
    pts.push(`${x(b).toFixed(1)},${y(lorentzFactor(b * C)).toFixed(1)}`);
  };
  const g = lorentzFactor(beta * C);
  const gridVals = [1, 2, 5, 10, 20];
  return (
    <div>
      <div
        className="mb-1.5 text-sm font-medium"
        style={{ color: "var(--text-dim)" }}
      >
        {title}
      </div>
      <svg
        viewBox={`0 0 ${W} ${HH}`}
        className="w-full"
        role="img"
        aria-label={title}
      >
        {gridVals.map((gv) => (
          <g key={gv}>
            <line
              x1={pl}
              x2={W - pr}
              y1={y(gv)}
              y2={y(gv)}
              stroke="var(--border)"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <text
              x={pl - 6}
              y={y(gv) + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--text-faint)"
            >
              {gv}
            </text>
          </g>
        ))}
        {[0, 0.5, 0.999].map((b) => (
          <text
            key={b}
            x={x(b)}
            y={HH - 8}
            textAnchor="middle"
            fontSize={10}
            fill="var(--text-faint)"
          >
            {b === 0.999 ? "0.999" : b.toFixed(1)}
          </text>
        ))}
        <text
          x={W - pr}
          y={HH - 8}
          textAnchor="end"
          fontSize={10}
          fill="var(--text-faint)"
        >
          β = v/c
        </text>
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke="var(--violet)"
          strokeWidth={2}
        />
        <line
          x1={x(beta)}
          x2={x(beta)}
          y1={y(g)}
          y2={HH - pb}
          stroke="var(--cyan)"
          strokeDasharray="2 3"
          opacity={0.6}
        />
        <circle cx={x(beta)} cy={y(g)} r={9} fill="var(--cyan)" opacity={0.25} />
        <circle cx={x(beta)} cy={y(g)} r={4} fill="var(--cyan)" />
      </svg>
      <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
        {caption}
      </p>
    </div>
  );
}

// ─── Main simulator component ───────────────────────────────────────────────
const sliderToBeta = (x: number) => Math.min(0.999, Math.pow(x, 2.2) * 0.999);
const betaToSlider = (b: number) =>
  Math.pow(Math.min(Math.max(b, 0), 0.999) / 0.999, 1 / 2.2);

const PRESET_V = [1.4, 250, 7660, 0.1 * C, 0.5 * C, 0.8 * C, 0.95 * C, 0.99 * C];

export default function LightClock() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const [sliderX, setSliderX] = useState(() => betaToSlider(0.8));
  const [showTrail, setShowTrail] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const clockRef = useRef({ tau: 0 });

  // Master clock: ship proper time advances in real (× speed) seconds.
  useRaf(
    (dt) => {
      clockRef.current.tau += dt * speed;
    },
    playing,
  );

  const beta = sliderToBeta(sliderX);
  const v = beta * C;
  const gamma = lorentzFactor(v);

  const reset = () => {
    clockRef.current.tau = 0;
    setResetKey((k) => k + 1);
  };

  const presets = [
    { label: s.pWalk, hint: fmtVelocity(PRESET_V[0], lang) },
    { label: s.pAir, hint: fmtVelocity(PRESET_V[1], lang) },
    { label: s.pIss, hint: fmtVelocity(PRESET_V[2], lang) },
    { label: "0.1c", hint: fmtVelocity(PRESET_V[3], lang) },
    { label: "0.5c", hint: fmtVelocity(PRESET_V[4], lang) },
    { label: "0.8c", hint: fmtVelocity(PRESET_V[5], lang) },
    { label: "0.95c", hint: fmtVelocity(PRESET_V[6], lang) },
    { label: "0.99c", hint: fmtVelocity(PRESET_V[7], lang) },
  ];

  return (
    <SimulationShell
      simId="light-clock"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <ClockCanvas
          beta={beta}
          showTrail={showTrail}
          playing={playing}
          clock={clockRef}
          resetKey={resetKey}
          s={s}
        />
      }
      controls={
        <div className="space-y-5">
          <ParamSlider
            label={s.velocity}
            value={sliderX}
            min={0}
            max={1}
            step={0.001}
            onChange={setSliderX}
            format={(x) => `β = ${sliderToBeta(x).toFixed(3)}`}
            accent="cyan"
          />
          <PresetBar
            presets={presets}
            onPick={(i) => setSliderX(betaToSlider(betaOf(PRESET_V[i])))}
          />
          <PlayPauseControls
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onReset={reset}
          />
          <SegmentedControl
            label={s.animSpeed}
            value={String(speed)}
            onChange={(val) => setSpeed(Number(val))}
            options={[
              { value: "0.25", label: "0.25×" },
              { value: "1", label: "1×" },
              { value: "4", label: "4×" },
            ]}
          />
          <SegmentedControl
            label={s.trail}
            value={showTrail ? "on" : "off"}
            onChange={(val) => setShowTrail(val === "on")}
            options={[
              { value: "on", label: s.on },
              { value: "off", label: s.off },
            ]}
          />
          <Readouts clock={clockRef} beta={beta} s={s} lang={lang} />
          <GammaChart beta={beta} title={s.graphTitle} caption={s.graphCaption} />
        </div>
      }
      whatYouSee={
        <div className="space-y-3">
          {s.wys.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      }
      physics={
        <div className="space-y-3">
          {s.phys.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
          <KeyIdea>{s.keyIdea}</KeyIdea>
        </div>
      }
      equation={
        <div className="grid gap-4 md:grid-cols-2">
          <EquationCard
            tex="\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}"
            caption={s.eqGammaCap}
          />
          <EquationCard
            tex="\\Delta t = \\gamma\\,\\Delta\\tau"
            caption={s.eqTickCap}
          />
        </div>
      }
      mathEquation={
        <div className="mt-4">
          <EquationCard
            tex="\\Delta t = \\frac{2L/c}{\\sqrt{1-v^2/c^2}}"
            caption={s.eqDerivCap}
          />
        </div>
      }
      tryThis={
        <TryThis
          prompt={s.tryPrompt}
          check={() => Math.abs(gamma - 10) < 0.2}
        />
      }
      assumptions={s.assumptions}
    />
  );
}
