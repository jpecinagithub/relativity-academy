import { useEffect, useRef, useState, type ReactNode } from "react";
import { Globe, Rocket } from "lucide-react";
import { velocityAddition } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { fmtDistance, fmtVelocity, type Lang } from "../physics/units";
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
  IM,
  useG,
} from "../components/ui";
import { usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  frame: string; groundFrame: string; shipFrame: string;
  velocity: string; animSpeed: string; trail: string; on: string; off: string;
  roShip: string; roLightGround: string; roLightShip: string;
  roClassical: string; roRel: string; roGapGround: string; roGapShip: string;
  classicalWrong: string; tickUnit: string; canvasLabel: string;
  legendShip: string; legendPhoton: string; legendGap: string;
  wys: string[]; phys: ReactNode[]; keyIdea: string;
  eqCap: string; eqSubCap: string; eqLimCap: string;
  tryPrompt: string; tryOptC: string; tryOptSlow: string; tryWrong: string;
  assumptions: string[];
}

const STRINGS: Record<Lang, Strings> = {
  en: {
    title: "Chasing a Light Beam",
    subtitle:
      "Can you catch up with light? Push a spacecraft toward 99.9% of light speed and watch what the photon does.",
    concept: "Invariance of c",
    frame: "Reference frame",
    groundFrame: "Ground frame",
    shipFrame: "Spacecraft frame",
    velocity: "Spacecraft velocity",
    animSpeed: "Animation speed",
    trail: "Photon trail",
    on: "On",
    off: "Off",
    roShip: "Spacecraft velocity v",
    roLightGround: "Light speed · ground",
    roLightShip: "Light speed · ship",
    roClassical: "Classical prediction c + v",
    roRel: "Relativistic prediction",
    roGapGround: "Gap after 10 s · ground",
    roGapShip: "Gap after 10 s · ship",
    classicalWrong: "wrong for light",
    tickUnit: "light-s",
    canvasLabel:
      "Animation of a spacecraft racing a photon, seen from the ground and from the spacecraft",
    legendShip: "Spacecraft",
    legendPhoton: "Photon · speed c",
    legendGap: "Ship–photon gap",
    wys: [
      "Ground frame: the spacecraft cruises to the right at velocity v, and its nose periodically fires a photon pulse. Every pulse leaves at exactly c — watch it streak ahead of the ship, drawing a cyan trail behind it.",
      "Now switch to the spacecraft frame. The ship sits at the center while the star field streams past it — but the photon still leaves the nose at the full speed of light and pulls away just as quickly. Nothing about the light changed; only your point of view did.",
      "The amber dashed arrow follows a single pulse and measures the ship–photon gap. In the ground frame it grows at (c − v) each second; in the ship frame it grows at c each second — because, measured with the ship's own rulers and clocks, light always travels at c.",
      "Keep an eye on the readouts while you drag the velocity slider: the measured speed of light stays pinned at 1.000c in both frames. The classical prediction c + v is what Galilean physics would expect — struck through, because for light it is simply wrong.",
    ],
    phys: [
      "Einstein's second postulate states that the speed of light in vacuum is the same for every inertial observer. Light does not inherit its source's velocity the way a thrown ball does: shine a headlight from a ship moving at 0.99c and the beam still travels at c — never at 1.99c — for every observer.",
      <>
        The correct combination rule is Einstein's velocity-addition formula,{" "}
        <IM tex="u' = \frac{u+v}{1+uv/c^2}" />. For everyday speeds the term{" "}
        <IM tex="uv/c^2" /> is essentially zero, so the formula reduces to the
        familiar <IM tex="u + v" /> — which is why three centuries of mechanics
        never noticed the difference. Set <IM tex="u = c" /> and the{" "}
        <IM tex="v" />-dependence cancels exactly, leaving{" "}
        <IM tex="c" />.
      </>,
      "This single fact forces the whole of special relativity: because light's speed cannot change, space and time themselves must flex — time dilation and length contraction — to keep the laws of physics identical for all observers.",
    ],
    keyIdea:
      "You cannot chase a light beam. However fast you move, light recedes from you at exactly c — the universe's ultimate speed limit, enforced identically for every observer.",
    eqCap:
      "Einstein's velocity-addition formula. At everyday speeds uv/c² ≈ 0, so it reduces to the familiar Galilean rule u + v.",
    eqSubCap:
      "Set u = c for the photon: the factor (1 + v/c) cancels between numerator and denominator — the result is c for every v.",
    eqLimCap:
      "Low-speed limit: when uv ≪ c² the denominator is ≈ 1 and Einstein's formula becomes the old rule u + v.",
    tryPrompt:
      "Set the spacecraft to 0.99c and switch to the spacecraft frame. A photon leaves the ship's nose — how fast does it recede from the ship: at c, or at c − v = 0.01c?",
    tryOptC: "c — light always recedes at c",
    tryOptSlow: "0.01c — it barely pulls ahead",
    tryWrong:
      "Not quite — watch the photon in the spacecraft frame: it streaks away at the full speed of light, not at c − v.",
    assumptions: [
      "Both frames are inertial: the ship cruises at constant velocity v and all acceleration phases are neglected.",
      "Photons travel in perfect vacuum — no air, no medium, no gravitational fields to disturb them.",
      "The spacecraft is an idealized test observer: its mass, and the energy of the pulses, are assumed not to curve spacetime.",
      "Emission is idealized: each pulse leaves the ship's nose instantaneously, already travelling at c.",
      "The animation is schematic, not to scale: light-seconds are compressed so the race fits on screen.",
    ],
  },
  es: {
    title: "Persiguiendo un rayo de luz",
    subtitle:
      "¿Puedes alcanzar a la luz? Acelera una nave hasta el 99,9 % de la velocidad de la luz y observa qué hace el fotón.",
    concept: "Invariancia de c",
    frame: "Sistema de referencia",
    groundFrame: "Sistema de tierra",
    shipFrame: "Sistema de la nave",
    velocity: "Velocidad de la nave",
    animSpeed: "Velocidad de animación",
    trail: "Estela del fotón",
    on: "Sí",
    off: "No",
    roShip: "Velocidad de la nave v",
    roLightGround: "Velocidad luz · tierra",
    roLightShip: "Velocidad luz · nave",
    roClassical: "Predicción clásica c + v",
    roRel: "Predicción relativista",
    roGapGround: "Distancia tras 10 s · tierra",
    roGapShip: "Distancia tras 10 s · nave",
    classicalWrong: "incorrecta para la luz",
    tickUnit: "s-luz",
    canvasLabel:
      "Animación de una nave compitiendo con un fotón, vista desde tierra y desde la nave",
    legendShip: "Nave",
    legendPhoton: "Fotón · velocidad c",
    legendGap: "Distancia nave–fotón",
    wys: [
      "Sistema de tierra: la nave avanza hacia la derecha a velocidad v y su morro emite periódicamente un pulso de fotones. Cada pulso sale exactamente a c: observa cómo se adelanta a la nave dejando una estela cian.",
      "Cambia ahora al sistema de la nave. La nave queda fija en el centro mientras el campo de estrellas pasa a su lado, pero el fotón sigue saliendo del morro a la velocidad completa de la luz y se aleja igual de rápido. La luz no ha cambiado en nada; solo ha cambiado tu punto de vista.",
      "La flecha ámbar discontinua sigue a un único pulso y mide la distancia nave–fotón. En el sistema de tierra crece a (c − v) cada segundo; en el sistema de la nave crece a c cada segundo, porque medida con las reglas y relojes de la propia nave, la luz siempre viaja a c.",
      "Vigila los indicadores mientras mueves el deslizador de velocidad: la velocidad medida de la luz permanece clavada en 1,000c en ambos sistemas. La predicción clásica c + v es lo que esperaría la física de Galileo; aparece tachada porque para la luz es simplemente incorrecta.",
    ],
    phys: [
      "El segundo postulado de Einstein afirma que la velocidad de la luz en el vacío es la misma para todo observador inercial. La luz no hereda la velocidad de su fuente como una pelota lanzada: enciende un faro desde una nave que viaja a 0,99c y el haz seguirá viajando a c — nunca a 1,99c — para cualquier observador.",
      <>
        La regla correcta de composición es la fórmula de adición de velocidades
        de Einstein, <IM tex="u' = \frac{u+v}{1+uv/c^2}" />. A velocidades
        cotidianas el término <IM tex="uv/c^2" /> es prácticamente cero, así que
        la fórmula se reduce a la conocida <IM tex="u + v" />; por eso tres
        siglos de mecánica nunca notaron la diferencia. Con{" "}
        <IM tex="u = c" /> la dependencia de <IM tex="v" /> se cancela
        exactamente y queda <IM tex="c" />.
      </>,
      "Este único hecho obliga a toda la relatividad especial: como la velocidad de la luz no puede cambiar, el espacio y el tiempo mismos deben flexionarse — dilatación del tiempo y contracción de la longitud — para que las leyes de la física sean idénticas para todos los observadores.",
    ],
    keyIdea:
      "No puedes perseguir un rayo de luz. Por rápido que te muevas, la luz se aleja de ti exactamente a c: el límite último de velocidad del universo, igual para todo observador.",
    eqCap:
      "Fórmula de adición de velocidades de Einstein. A velocidades cotidianas uv/c² ≈ 0, así que se reduce a la conocida regla de Galileo u + v.",
    eqSubCap:
      "Con u = c para el fotón: el factor (1 + v/c) se cancela entre numerador y denominador; el resultado es c para cualquier v.",
    eqLimCap:
      "Límite de baja velocidad: cuando uv ≪ c² el denominador es ≈ 1 y la fórmula de Einstein se convierte en la antigua regla u + v.",
    tryPrompt:
      "Pon la nave a 0,99c y cambia al sistema de la nave. Un fotón sale del morro: ¿a qué velocidad se aleja de la nave, a c o a c − v = 0,01c?",
    tryOptC: "c: la luz siempre se aleja a c",
    tryOptSlow: "0,01c: apenas se adelanta",
    tryWrong:
      "Casi: observa el fotón en el sistema de la nave, se aleja a la velocidad completa de la luz, no a c − v.",
    assumptions: [
      "Ambos sistemas son inerciales: la nave viaja a velocidad v constante y se desprecian las fases de aceleración.",
      "Los fotones viajan en el vacío perfecto: sin aire, sin medio material y sin campos gravitatorios que los perturben.",
      "La nave es un observador de prueba idealizado: se supone que su masa, y la energía de los pulsos, no curvan el espaciotiempo.",
      "La emisión está idealizada: cada pulso sale del morro instantáneamente, viajando ya a c.",
      "La animación es esquemática, no está a escala: los segundos luz se comprimen para que la carrera quepa en pantalla.",
    ],
  },
};

// ─── Animation model ────────────────────────────────────────────────────────
type FrameMode = "ground" | "ship";

interface Pulse {
  x: number;      // px position (moves at light speed in both frames)
  age: number;    // sim-seconds since emission (for the gap measurement)
  trail: number[]; // recent x positions, drawn as a fading streak
}

const EMIT_EVERY = 1.4; // sim-seconds between photon pulses

/** Deterministic star field. */
function makeStars(n: number) {
  let seed = 987654321;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: n }, () => ({
    x: rnd(),
    y: rnd(),
    r: 0.6 + rnd() * 1.4,
    a: 0.18 + rnd() * 0.5,
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

// ─── Canvas: the race, in two reference frames ──────────────────────────────
interface CanvasProps {
  beta: number;
  frame: FrameMode;
  showTrail: boolean;
  playing: boolean;
  speed: number;
  clock: { current: { t: number } };
  resetKey: number;
  s: Strings;
  lang: Lang;
}

function ChaseCanvas(props: CanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const live = useRef(props);
  live.current = props;

  const pulsesRef = useRef<Pulse[]>([]);
  const shipXRef = useRef(60);
  const emitTimerRef = useRef(EMIT_EVERY);
  const lastFrameRef = useRef<FrameMode>(props.frame);
  const lastResetRef = useRef(props.resetKey);
  const transRef = useRef<{ from: FrameMode; to: FrameMode; t0: number } | null>(null);
  const starsRef = useRef(makeStars(70));

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
    let last = performance.now();

    const cssVar = (n: string, fb: string) => {
      const val = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      return val || fb;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const p = live.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w: W, h: H, dpr } = sizeRef.current;
      if (W < 4 || H < 4) {
        last = now;
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dtReal = Math.min((now - last) / 1000, 0.1);
      last = now;

      // ── reset ──
      if (p.resetKey !== lastResetRef.current) {
        lastResetRef.current = p.resetKey;
        pulsesRef.current = [];
        shipXRef.current = 60;
        emitTimerRef.current = EMIT_EVERY;
        p.clock.current.t = 0;
      }
      // ── reference-frame switch: crossfade transition ──
      if (p.frame !== lastFrameRef.current) {
        transRef.current = { from: lastFrameRef.current, to: p.frame, t0: now };
        lastFrameRef.current = p.frame;
        for (const pu of pulsesRef.current) pu.trail = [];
      }

      // ── physics update ──
      const simDt = p.playing ? dtReal * p.speed : 0;
      const S = W / 2.2; // px per sim-second at light speed (photon crosses in 2.2 s)
      const beta = p.beta;
      const v = beta * C;
      const shipY = H * 0.52;
      const noseX = (m: FrameMode) => (m === "ground" ? shipXRef.current : W * 0.36);

      if (simDt > 0) {
        p.clock.current.t += simDt;
        emitTimerRef.current += simDt;
        if (emitTimerRef.current >= EMIT_EVERY) {
          emitTimerRef.current = 0;
          pulsesRef.current.push({ x: noseX(p.frame) + 24, age: 0, trail: [] });
          if (pulsesRef.current.length > 10) pulsesRef.current.shift();
        }
        shipXRef.current += beta * S * simDt;
        if (shipXRef.current > W + 160) shipXRef.current = -160;
        for (const pu of pulsesRef.current) {
          pu.x += S * simDt;
          pu.age += simDt;
          pu.trail.push(pu.x);
          if (pu.trail.length > 18) pu.trail.shift();
        }
        pulsesRef.current = pulsesRef.current.filter((pu) => pu.x < W + 90);
      }
      if (!p.showTrail) for (const pu of pulsesRef.current) pu.trail = [];

      const tt = p.clock.current.t;

      // ── theme ──
      const cyan = cssVar("--cyan", "#22d3ee");
      const amber = cssVar("--amber", "#fbbf24");
      const violet = cssVar("--violet", "#a78bfa");
      const text = cssVar("--text", "#f5f1e8");
      const textDim = cssVar("--text-dim", "#a8a29e");
      const textFaint = cssVar("--text-faint", "#78716c");
      const border = cssVar("--border", "#292524");
      const panel = cssVar("--bg-panel", "#1c1917");
      const inset = cssVar("--bg-inset", "#0c0a09");

      const drawShip = (nx: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        // exhaust flame, length grows with beta
        if (beta > 0.004) {
          const tail = nx - 84;
          const flick = 0.8 + 0.2 * Math.sin(tt * 43 + 1);
          const fl = (10 + beta * 46) * flick;
          const grd = ctx.createLinearGradient(tail, 0, tail - fl, 0);
          grd.addColorStop(0, amber);
          grd.addColorStop(1, "rgba(251,191,36,0)");
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.moveTo(tail, shipY - 8);
          ctx.lineTo(tail - fl, shipY);
          ctx.lineTo(tail, shipY + 8);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = alpha;
        }
        // fins
        ctx.fillStyle = textFaint;
        ctx.beginPath();
        ctx.moveTo(nx - 78, shipY - 11);
        ctx.lineTo(nx - 94, shipY - 26);
        ctx.lineTo(nx - 60, shipY - 11);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(nx - 78, shipY + 11);
        ctx.lineTo(nx - 94, shipY + 26);
        ctx.lineTo(nx - 60, shipY + 11);
        ctx.closePath();
        ctx.fill();
        // hull
        ctx.fillStyle = panel;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1.5;
        rr(ctx, nx - 84, shipY - 13, 84, 26, 12);
        ctx.fill();
        ctx.stroke();
        // nose cone
        ctx.fillStyle = violet;
        ctx.beginPath();
        ctx.moveTo(nx, shipY - 13);
        ctx.lineTo(nx + 22, shipY);
        ctx.lineTo(nx, shipY + 13);
        ctx.closePath();
        ctx.fill();
        // window
        ctx.save();
        ctx.shadowColor = cyan;
        ctx.shadowBlur = 8;
        ctx.fillStyle = cyan;
        ctx.beginPath();
        ctx.arc(nx - 30, shipY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        ctx.restore();
      };

      const drawScene = (mode: FrameMode, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;

        // ── star field ──
        if (mode === "ground") {
          for (const st of starsRef.current) {
            ctx.globalAlpha = alpha * st.a;
            ctx.fillStyle = textDim;
            ctx.beginPath();
            ctx.arc(st.x * W, st.y * H, st.r, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // spacecraft frame: stars stream past at v
          const off = (beta * S * tt) % (W + 40);
          for (const st of starsRef.current) {
            let x = (st.x * (W + 40) - off) % (W + 40);
            if (x < 0) x += W + 40;
            x -= 20;
            const y = st.y * H;
            ctx.globalAlpha = alpha * st.a;
            ctx.fillStyle = text;
            ctx.beginPath();
            ctx.arc(x, y, st.r, 0, Math.PI * 2);
            ctx.fill();
            if (beta > 0.02) {
              ctx.globalAlpha = alpha * st.a * 0.55;
              ctx.strokeStyle = textDim;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(x + beta * 46, y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = alpha;

        // ── ground ruler: 1 tick = 1 light-second ──
        if (mode === "ground") {
          const y0 = shipY + 68;
          ctx.strokeStyle = border;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, y0);
          ctx.lineTo(W, y0);
          ctx.stroke();
          ctx.textAlign = "center";
          ctx.font = "9px system-ui, sans-serif";
          for (let k = 1; k * S < W; k++) {
            const x = k * S;
            ctx.strokeStyle = textFaint;
            ctx.beginPath();
            ctx.moveTo(x, y0 - 6);
            ctx.lineTo(x, y0 + 6);
            ctx.stroke();
            ctx.fillStyle = textFaint;
            ctx.fillText(`${k} ${p.s.tickUnit}`, x, y0 + 20);
          }
        }

        // ── ship ──
        const nx = noseX(mode);
        drawShip(nx, alpha);

        // ── photon pulses ──
        for (const pu of pulsesRef.current) {
          if (pu.x < -30) continue;
          if (p.showTrail && pu.trail.length > 1) {
            ctx.save();
            ctx.strokeStyle = cyan;
            ctx.lineWidth = 2.5;
            ctx.lineCap = "round";
            for (let i = 1; i < pu.trail.length; i++) {
              ctx.globalAlpha = alpha * 0.35 * (i / pu.trail.length);
              ctx.beginPath();
              ctx.moveTo(pu.trail[i - 1], shipY);
              ctx.lineTo(pu.trail[i], shipY);
              ctx.stroke();
            }
            ctx.restore();
          }
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.shadowColor = cyan;
          ctx.shadowBlur = 16;
          const g2 = ctx.createRadialGradient(pu.x, shipY, 0, pu.x, shipY, 13);
          g2.addColorStop(0, "rgba(255,255,255,0.95)");
          g2.addColorStop(0.35, cyan);
          g2.addColorStop(1, "rgba(34,211,238,0)");
          ctx.fillStyle = g2;
          ctx.beginPath();
          ctx.arc(pu.x, shipY, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(pu.x, shipY, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = "600 10px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = cyan;
          ctx.fillText("c", pu.x, shipY - 18);
        }

        // ── ship–photon gap arrow (oldest pulse) ──
        const oldest = pulsesRef.current[0];
        if (
          oldest &&
          oldest.age > 0.25 &&
          oldest.x > nx + 40 &&
          oldest.x - nx < W * 0.85
        ) {
          const gx0 = nx + 26;
          const gx1 = oldest.x;
          const gy = shipY - 42;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = amber;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(gx0, gy);
          ctx.lineTo(gx1, gy);
          ctx.stroke();
          ctx.setLineDash([]);
          for (const gx of [gx0, gx1]) {
            ctx.beginPath();
            ctx.moveTo(gx, gy - 5);
            ctx.lineTo(gx, gy + 5);
            ctx.stroke();
          }
          const gap = mode === "ground" ? (C - v) * oldest.age : C * oldest.age;
          ctx.font = "600 11px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillStyle = amber;
          ctx.fillText(fmtDistance(gap, p.lang), (gx0 + gx1) / 2, gy - 9);
          ctx.restore();
        }

        ctx.restore();
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = inset;
      ctx.fillRect(0, 0, W, H);

      const tr = transRef.current;
      if (tr) {
        const k = Math.min(1, (now - tr.t0) / 450);
        drawScene(tr.from, 1 - k);
        drawScene(tr.to, k);
        if (k >= 1) transRef.current = null;
      } else {
        drawScene(p.frame, 1);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div>
      <div ref={wrapRef} className="relative h-[440px] w-full md:h-[480px]">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          role="img"
          aria-label={props.s.canvasLabel}
        />
        <div className="pointer-events-none absolute left-3 top-3">
          <span className="chip">
            {props.frame === "ground" ? props.s.groundFrame : props.s.shipFrame}
            <span aria-hidden> · </span>
            <span className="font-mono2">v = {props.beta.toFixed(3)}c</span>
          </span>
        </div>
      </div>
      <div
        className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-4 py-2.5 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--violet)" }}
            aria-hidden
          />
          {props.s.legendShip}
        </span>
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
            className="inline-block h-[2px] w-4"
            style={{ background: "var(--amber)" }}
            aria-hidden
          />
          {props.s.legendGap}
        </span>
      </div>
    </div>
  );
}

// ─── Readouts: pure functions of beta (parent re-renders on slider change) ───
function Readouts({
  beta,
  s,
  lang,
}: {
  beta: number;
  s: Strings;
  lang: Lang;
}) {
  const v = beta * C;
  const lightTxt = fmtVelocity(C, lang); // always "1.000c" — the discovery
  const classicalTxt = `${(1 + beta).toFixed(3)}c`;
  const relTxt = fmtVelocity(velocityAddition(C, v), lang);
  const gapGround = fmtDistance((C - v) * 10, lang);
  const gapShip = fmtDistance(C * 10, lang);
  const wrong = beta > 0.0005;

  return (
    <div className="grid grid-cols-2 gap-2">
      <PhysicsValue label={s.roShip} value={fmtVelocity(v, lang)} accent="cyan" />
      <PhysicsValue label={s.roLightGround} value={lightTxt} accent="green" />
      <PhysicsValue label={s.roLightShip} value={lightTxt} accent="green" />
      <div className="inset px-3 py-2.5">
        <div
          className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "var(--text-faint)" }}
        >
          {s.roClassical}
        </div>
        <div
          className="font-mono2 text-lg font-semibold leading-tight"
          style={{
            color: wrong ? "var(--text-faint)" : "var(--amber)",
            textDecoration: wrong ? "line-through" : "none",
            textDecorationThickness: "2px",
          }}
        >
          {classicalTxt}
        </div>
        {wrong && (
          <div className="text-xs font-medium" style={{ color: "var(--amber)" }}>
            ✗ {s.classicalWrong}
          </div>
        )}
      </div>
      <PhysicsValue label={s.roRel} value={relTxt} accent="violet" />
      <PhysicsValue label={s.roGapGround} value={gapGround} accent="amber" />
      <PhysicsValue label={s.roGapShip} value={gapShip} accent="cyan" />
    </div>
  );
}

// ─── Main simulator component ───────────────────────────────────────────────
const sliderToBeta = (x: number) => Math.min(0.999, Math.pow(x, 2.2) * 0.999);
const betaToSlider = (b: number) =>
  Math.pow(Math.min(Math.max(b, 0), 0.999) / 0.999, 1 / 2.2);

const PRESET_BETAS = [0.1, 0.5, 0.9, 0.99, 0.999];

export default function ChasingLight() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const [sliderX, setSliderX] = useState(() => betaToSlider(0.9));
  const [frame, setFrame] = useState<FrameMode>("ground");
  const [showTrail, setShowTrail] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<"c" | "slow" | null>(null);
  const clockRef = useRef({ t: 0 });

  const beta = sliderToBeta(sliderX);

  const reset = () => {
    clockRef.current.t = 0;
    setResetKey((k) => k + 1);
  };

  const answerBtn = (key: "c" | "slow", label: string) => (
    <button
      onClick={() => setSelected(key)}
      aria-pressed={selected === key}
      className="chip"
      style={{
        cursor: "pointer",
        borderColor: selected === key ? "var(--cyan)" : undefined,
        color: selected === key ? "var(--cyan)" : undefined,
      }}
    >
      {label}
    </button>
  );

  return (
    <SimulationShell
      simId="chasing-light"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={1}
      concept={s.concept}
      visualization={
        <ChaseCanvas
          beta={beta}
          frame={frame}
          showTrail={showTrail}
          playing={playing}
          speed={speed}
          clock={clockRef}
          resetKey={resetKey}
          s={s}
          lang={lang}
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
            presets={PRESET_BETAS.map((b) => ({
              label: `${b}c`,
              hint: fmtVelocity(b * C, lang),
            }))}
            onPick={(i) => setSliderX(betaToSlider(PRESET_BETAS[i]))}
          />
          <SegmentedControl
            label={s.frame}
            value={frame}
            onChange={(v) => setFrame(v)}
            options={[
              { value: "ground", label: s.groundFrame, icon: <Globe size={14} /> },
              { value: "ship", label: s.shipFrame, icon: <Rocket size={14} /> },
            ]}
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
              { value: "0.5", label: "0.5×" },
              { value: "1", label: "1×" },
              { value: "2", label: "2×" },
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
          <Readouts beta={beta} s={s} lang={lang} />
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
          <EquationCard tex="u' = \frac{u+v}{1+uv/c^2}" caption={s.eqCap} />
          <EquationCard tex="u' = \frac{c+v}{1+cv/c^2} = c" caption={s.eqSubCap} />
        </div>
      }
      mathEquation={
        <div className="mt-4">
          <EquationCard tex="\lim_{uv \ll c^2} u' = u + v" caption={s.eqLimCap} />
        </div>
      }
      tryThis={
        <TryThis prompt={s.tryPrompt} check={() => selected === "c"}>
          <div className="mt-3 flex flex-wrap gap-2">
            {answerBtn("c", s.tryOptC)}
            {answerBtn("slow", s.tryOptSlow)}
          </div>
          {selected === "slow" && (
            <p className="mt-2 text-sm" style={{ color: "var(--amber)" }}>
              {s.tryWrong}
            </p>
          )}
        </TryThis>
      }
      assumptions={s.assumptions}
    />
  );
}
