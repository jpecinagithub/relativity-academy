import { useEffect, useRef, useState } from "react";
import { lorentzFactor, contractedLength } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { fmt } from "../physics/units";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  PlayPauseControls,
  SegmentedControl,
  PresetBar,
  TryThis,
  EquationCard,
  KeyIdea,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";

// ─── Bilingual strings ──────────────────────────────────────────────────────
interface Strings {
  title: string; subtitle: string; concept: string;
  frame: string; earthFrame: string; earthSub: string; shipFrame: string; shipSub: string;
  velocity: string; observer: string; ghostLabel: string; shipRestLabel: string;
  postsNote: string; bow: string; stern: string;
  roRest: string; roObs: string; roRel: string; roGamma: string; roVelPct: string; roVelKms: string;
  wys: string[]; phys: string[]; keyIdea: string;
  eqCap: string; eqMathCap: string;
  tryPrompt: string; assumptions: string[]; canvasLabel: string;
}

const STRINGS: Record<"en" | "es", Strings> = {
  en: {
    title: "Length Contraction",
    subtitle:
      "A 100-metre spacecraft flies past Earth at near-light speed. In the Earth frame it is measured shorter — watch it shrink, then switch frames to see why.",
    concept: "Lorentz contraction",
    frame: "Reference frame",
    earthFrame: "Earth frame",
    earthSub: "the ship is measured shorter as it flies past",
    shipFrame: "Ship frame",
    shipSub: "aboard the ship — Earth rushes past",
    velocity: "Spacecraft velocity",
    observer: "Earth observer",
    ghostLabel: "rest length L₀ = 100 m",
    shipRestLabel: "L₀ = 100 m · ship at rest",
    postsNote: "measuring posts · 50 m apart (Earth rest spacing)",
    bow: "bow",
    stern: "stern",
    roRest: "Rest length L₀",
    roObs: "Observed length L",
    roRel: "Relative length",
    roGamma: "Lorentz factor γ",
    roVelPct: "Velocity",
    roVelKms: "Velocity",
    wys: [
      "In the Earth frame the ship flies left to right past a stationary observer. Its drawn length is the contracted length L = L₀/γ — the dashed outline shows the 100 m rest length for comparison. Drag the velocity slider and watch the ship shrink.",
      "The vertical amber ticks mark the bow and stern positions measured at the same instant in Earth time. As γ grows, those two marks move closer together — that is the contraction you are seeing.",
      "Switch to the ship frame: now the ship sits still at its full 100 m while the Earth — with its row of measuring posts spaced 50 m apart — rushes past. The posts' spacing is itself contracted to 50 m/γ. There is no contradiction: each frame measures the other's lengths as shorter.",
    ],
    phys: [
      "A moving object's length is measured by marking where its two ends are at the same time in the observer's frame. In the Earth frame, the bow and stern positions are marked simultaneously (in Earth time) — and those marks end up closer than 100 m apart.",
      "This is the relativity of simultaneity in action. Two events that are simultaneous in the Earth frame — 'the bow is here now' and 'the stern is here now' — are not simultaneous in the ship's frame. The crew insists the Earth observers marked the ends at different instants, which is why Earth measures a shorter ship.",
      "Nothing is physically squashed. The atoms of the ship feel no force; the crew measures their own ship as exactly 100 m and notices nothing. Length contraction is a measurement effect — a consequence of the fact that 'now' differs between frames, not a compression of matter.",
    ],
    keyIdea:
      "Contraction is not a squishing. It is how a moving object measures out when its ends are marked simultaneously — the ship itself feels nothing.",
    eqCap: "Observed length of an object moving at velocity v, given its rest (proper) length L₀.",
    eqMathCap:
      "The Lorentz transformation behind it: space and time coordinates mix when changing frames.",
    tryPrompt:
      "Find the velocity at which the ship measures exactly half its rest length (γ = 2). Hint: you have already seen it among the presets…",
    assumptions: [
      "Both frames are inertial: the ship cruises at constant velocity and acceleration phases are neglected.",
      "The ship is a rigid body in its own rest frame: L₀ = 100 m is its proper length.",
      "Length is defined by simultaneous position marks in the observer's frame — both ends at the same instant.",
      "The flight animation is purely schematic: position and pacing are exaggerated for visibility, but every numerical readout comes from the exact relativistic formulas.",
    ],
    canvasLabel:
      "Animation of length contraction: a 100 m spacecraft flies past an Earth observer",
  },
  es: {
    title: "Contracción de la longitud",
    subtitle:
      "Una nave de 100 metros pasa junto a la Tierra a velocidad cercana a la de la luz. En el sistema terrestre se mide más corta: obsérvala encogerse y cambia de sistema para entender por qué.",
    concept: "Contracción de Lorentz",
    frame: "Sistema de referencia",
    earthFrame: "Sistema de la Tierra",
    earthSub: "la nave se mide más corta al pasar",
    shipFrame: "Sistema de la nave",
    shipSub: "a bordo de la nave: la Tierra pasa a toda velocidad",
    velocity: "Velocidad de la nave",
    observer: "Observador terrestre",
    ghostLabel: "longitud en reposo L₀ = 100 m",
    shipRestLabel: "L₀ = 100 m · la nave en reposo",
    postsNote: "postes de medida · 50 m entre sí (en reposo terrestre)",
    bow: "proa",
    stern: "popa",
    roRest: "Longitud en reposo L₀",
    roObs: "Longitud observada L",
    roRel: "Longitud relativa",
    roGamma: "Factor de Lorentz γ",
    roVelPct: "Velocidad",
    roVelKms: "Velocidad",
    wys: [
      "En el sistema de la Tierra, la nave vuela de izquierda a derecha ante un observador fijo. Su longitud dibujada es la longitud contraída L = L₀/γ; el contorno discontinuo muestra los 100 m de la longitud en reposo para comparar. Mueve el deslizador de velocidad y observa cómo se encoge.",
      "Las marcas verticales ámbar señalan las posiciones de proa y popa medidas en el mismo instante del tiempo terrestre. Al crecer γ, esas dos marcas se acercan: esa es la contracción que estás viendo.",
      "Cambia al sistema de la nave: ahora la nave está quieta con sus 100 m completos y es la Tierra —con su fila de postes separados 50 m— la que pasa a toda velocidad. La separación de los postes también aparece contraída: 50 m/γ. No hay contradicción: cada sistema mide más cortas las longitudes del otro.",
    ],
    phys: [
      "La longitud de un objeto en movimiento se mide marcando dónde están sus dos extremos al mismo tiempo en el sistema del observador. En el sistema terrestre, las posiciones de proa y popa se marcan simultáneamente (en tiempo terrestre), y esas marcas quedan a menos de 100 m.",
      "Es la relatividad de la simultaneidad en acción. Dos sucesos simultáneos en el sistema terrestre —«la proa está aquí ahora» y «la popa está aquí ahora»— no son simultáneos en el sistema de la nave. La tripulación insiste en que los observadores terrestres marcaron los extremos en instantes distintos, y por eso la Tierra mide una nave más corta.",
      "Nada se aplasta físicamente. Los átomos de la nave no sienten ninguna fuerza; la tripulación mide su propia nave como exactamente 100 m y no nota nada. La contracción de la longitud es un efecto de medida —consecuencia de que el «ahora» difiere entre sistemas—, no una compresión de la materia.",
    ],
    keyIdea:
      "La contracción no es un aplastamiento. Es el resultado de medir un objeto en movimiento marcando sus extremos simultáneamente: la nave no siente nada.",
    eqCap: "Longitud observada de un objeto que se mueve a velocidad v, dada su longitud en reposo (propia) L₀.",
    eqMathCap:
      "La transformación de Lorentz que hay detrás: las coordenadas de espacio y tiempo se mezclan al cambiar de sistema.",
    tryPrompt:
      "Encuentra la velocidad a la que la nave mide exactamente la mitad de su longitud en reposo (γ = 2). Pista: ya la has visto entre los preajustes…",
    assumptions: [
      "Ambos sistemas son inerciales: la nave viaja a velocidad constante y se desprecian las fases de aceleración.",
      "La nave es un cuerpo rígido en su propio sistema en reposo: L₀ = 100 m es su longitud propia.",
      "La longitud se define mediante marcas de posición simultáneas en el sistema del observador: ambos extremos en el mismo instante.",
      "La animación del vuelo es puramente esquemática: la posición y el ritmo están exagerados para que se vean, pero todos los valores numéricos provienen de las fórmulas relativistas exactas.",
    ],
    canvasLabel:
      "Animación de la contracción de la longitud: una nave de 100 m pasa ante un observador terrestre",
  },
};

// ─── Slider mapping (nonlinear: fine control at low speeds) ──────────────────
const sliderToBeta = (x: number) => Math.min(0.999, Math.pow(x, 2.2) * 0.999);
const betaToSlider = (b: number) =>
  Math.pow(Math.min(Math.max(b, 0), 0.999) / 0.999, 1 / 2.2);

const PRESET_B = [0.1, 0.5, 0.87, 0.99];
const L0 = 100; // m, proper (rest) length of the spacecraft
const POST_SPACING = 50; // m, Earth-frame rest spacing of the measuring posts

type Frame = "earth" | "ship";

// ─── Canvas drawing helpers ─────────────────────────────────────────────────
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

/** Spacecraft side view: rounded body + nose cone + portholes. Total width w. */
function drawShip(
  ctx: CanvasRenderingContext2D,
  cx: number,
  yTop: number,
  w: number,
  cyan: string,
) {
  const h = 42;
  const x = cx - w / 2;
  const nose = Math.min(26, Math.max(8, w * 0.2));
  const bodyW = Math.max(2, w - nose);
  ctx.fillStyle = "rgba(34,211,238,0.16)";
  ctx.strokeStyle = cyan;
  ctx.lineWidth = 2;
  rr(ctx, x, yTop, bodyW, h, 12);
  ctx.fill();
  ctx.stroke();
  // nose cone pointing in the direction of travel (+x)
  ctx.beginPath();
  ctx.moveTo(x + bodyW, yTop);
  ctx.lineTo(x + w, yTop + h / 2);
  ctx.lineTo(x + bodyW, yTop + h);
  ctx.closePath();
  ctx.fillStyle = "rgba(34,211,238,0.35)";
  ctx.fill();
  ctx.stroke();
  // portholes
  const n = Math.floor(bodyW / 26);
  ctx.fillStyle = cyan;
  for (let i = 0; i < n; i++) {
    const wx = x + 16 + i * 26;
    if (wx > x + bodyW - 10) break;
    ctx.beginPath();
    ctx.arc(wx, yTop + h / 2, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Simultaneous position marks at the two ends (bow/stern ticks). */
function drawTicks(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  yTop: number,
  yBot: number,
  amber: string,
  textDim: string,
  label1: string,
  label2: string,
) {
  ctx.strokeStyle = amber;
  ctx.lineWidth = 2;
  ctx.fillStyle = amber;
  for (const [x, lab] of [[x1, label1], [x2, label2]] as Array<[number, string]>) {
    ctx.beginPath();
    ctx.moveTo(x, yTop - 12);
    ctx.lineTo(x, yBot + 12);
    ctx.stroke();
    for (const y of [yTop - 12, yBot + 12]) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = textDim;
    ctx.fillText(lab, x, yTop - 18);
  }
}

/** Dimension line with arrowheads and a centred label. */
function dimLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  y: number,
  label: string,
  textDim: string,
) {
  ctx.strokeStyle = textDim;
  ctx.fillStyle = textDim;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  for (const [x, dir] of [[x1, 1], [x2, -1]] as Array<[number, number]>) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dir * 7, y - 3.5);
    ctx.lineTo(x + dir * 7, y + 3.5);
    ctx.closePath();
    ctx.fill();
  }
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, (x1 + x2) / 2, y + 18);
}

/** Simple Earth observer figure. */
function drawObserver(
  ctx: CanvasRenderingContext2D,
  x: number,
  yG: number,
  text: string,
  textDim: string,
  label: string,
) {
  ctx.strokeStyle = text;
  ctx.fillStyle = text;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x, yG - 48, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, yG - 40);
  ctx.lineTo(x, yG - 16);
  ctx.moveTo(x, yG - 16);
  ctx.lineTo(x - 7, yG);
  ctx.moveTo(x, yG - 16);
  ctx.lineTo(x + 7, yG);
  ctx.stroke();
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = textDim;
  ctx.fillText(label, x, yG + 16);
}

// ─── Canvas visualization ───────────────────────────────────────────────────
interface CanvasProps {
  beta: number;
  frame: Frame;
  gamma: number;
  L: number;
  pos: { current: { t: number } };
  lang: "en" | "es";
  s: Strings;
}

function LengthCanvas(props: CanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });
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
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const p = live.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w: W, h: H, dpr } = sizeRef.current;
      if (W < 8 || H < 8) return;
      const t = p.pos.current.t;
      const key = `${t.toFixed(3)}|${p.beta.toFixed(5)}|${p.frame}|${Math.round(W)}x${Math.round(H)}`;
      if (key === lastKey) return;
      lastKey = key;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Theme colors
      const cs = getComputedStyle(document.documentElement);
      const cssVar = (n: string, fb: string) => cs.getPropertyValue(n).trim() || fb;
      const cyan = cssVar("--cyan", "#22d3ee");
      const amber = cssVar("--amber", "#fbbf24");
      const text = cssVar("--text", "#f5f1e8");
      const textDim = cssVar("--text-dim", "#a8a29e");
      const textFaint = cssVar("--text-faint", "#78716c");
      const border = cssVar("--border", "#292524");
      const inset = cssVar("--bg-inset", "#0c0a09");

      ctx.fillStyle = inset;
      ctx.fillRect(0, 0, W, H);

      const yG = H - 78; // ground line
      const pxPerM = Math.min(6.2, (W - 120) / L0);
      const ghostW = pxPerM * L0;
      const shipY = yG - 118; // ship body top
      const shipH = 42;

      // Ground line
      ctx.strokeStyle = border;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, yG);
      ctx.lineTo(W, yG);
      ctx.stroke();

      if (p.frame === "earth") {
        // Faint Earth-fixed metre grid
        const gridPx = pxPerM * 10;
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for (let x = gridPx / 2; x < W; x += gridPx) {
          ctx.beginPath();
          ctx.moveTo(x, 8);
          ctx.lineTo(x, yG);
          ctx.stroke();
        }

        // Stationary observer
        const xObs = 78;
        drawObserver(ctx, xObs, yG, text, textDim, p.s.observer);

        // Ship flight path: one crossing every ~14 s at top speed.
        // Speed scales with β (schematic) so the ship parks when v = 0.
        const margin = ghostW + 70;
        const span = W + 2 * margin;
        const screenSpeed = (span / 14) * Math.pow(p.beta, 0.35);
        const cx = screenSpeed > 0 ? ((t * screenSpeed) % span) - margin : W / 2;
        const shipW = pxPerM * p.L;

        // Rest-length ghost (dashed)
        ctx.save();
        ctx.setLineDash([7, 6]);
        ctx.strokeStyle = textFaint;
        ctx.lineWidth = 1.5;
        rr(ctx, cx - ghostW / 2, shipY, ghostW, shipH, 12);
        ctx.stroke();
        ctx.restore();
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = textFaint;
        ctx.fillText(p.s.ghostLabel, cx, shipY - 34);

        // Contracted ship
        drawShip(ctx, cx, shipY, shipW, cyan);
        drawTicks(
          ctx, cx - shipW / 2, cx + shipW / 2, shipY, shipY + shipH,
          amber, textDim, p.s.stern, p.s.bow,
        );
        dimLine(
          ctx, cx - shipW / 2, cx + shipW / 2, shipY + shipH + 30,
          `${fmt(p.L, p.lang, 2)} m`, textDim,
        );
      } else {
        // Ship frame: the ship is at rest at full length; Earth rushes past.
        const gamma = p.gamma;
        const postPx = pxPerM * POST_SPACING / gamma;
        const margin = 140;
        const span = W + 2 * margin;
        const screenSpeed = (span / 14) * Math.pow(p.beta, 0.35);
        const off = postPx - (screenSpeed > 0 ? (t * screenSpeed) % postPx : 0);

        // Contracted Earth metre grid (scrolls with the posts)
        const gridPx = pxPerM * 10 / gamma;
        const gOff = gridPx - ((t * screenSpeed) % gridPx);
        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        for (let x = -gridPx + gOff; x < W + gridPx; x += gridPx) {
          ctx.beginPath();
          ctx.moveTo(x, 8);
          ctx.lineTo(x, yG);
          ctx.stroke();
        }

        // Measuring posts rushing past (right → left)
        for (let x = -postPx + off; x < W + postPx; x += postPx) {
          ctx.strokeStyle = textDim;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(x, yG);
          ctx.lineTo(x, yG - 56);
          ctx.stroke();
          ctx.fillStyle = amber;
          ctx.beginPath();
          ctx.arc(x, yG - 60, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // The Earth observer, riding past periodically (parked when v = 0)
        const xObs =
          screenSpeed > 0 ? W + margin - ((t * screenSpeed) % span) : W * 0.75;
        drawObserver(ctx, xObs, yG, text, textDim, p.s.observer);

        // Contracted post spacing: dimension between the two posts straddling centre
        const xA = W / 2 - (((W / 2 - (-postPx + off)) % postPx) + postPx) % postPx;
        const xB = xA + postPx;
        dimLine(
          ctx, xA, xB, yG + 30,
          `${fmt(POST_SPACING / gamma, p.lang, 1)} m`, textDim,
        );
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = textFaint;
        ctx.fillText(p.s.postsNote, 12, yG + 62);

        // Ship at rest, full length
        const cx = W / 2;
        drawShip(ctx, cx, shipY, ghostW, cyan);
        drawTicks(
          ctx, cx - ghostW / 2, cx + ghostW / 2, shipY, shipY + shipH,
          amber, textDim, p.s.stern, p.s.bow,
        );
        ctx.font = "12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = text;
        ctx.fillText(p.s.shipRestLabel, cx, shipY - 34);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[400px] select-none md:h-[460px]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
        role="img"
        aria-label={props.s.canvasLabel}
      />
      <div className="pointer-events-none absolute left-4 top-3">
        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {props.frame === "earth" ? props.s.earthFrame : props.s.shipFrame}
        </div>
        <div className="text-xs" style={{ color: "var(--text-faint)" }}>
          {props.frame === "earth" ? props.s.earthSub : props.s.shipSub}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-4">
        <span className="chip font-mono2">
          {props.frame === "earth"
            ? `L = L₀/γ = ${fmt(props.L, props.lang, 2)} m`
            : `50 m/γ = ${fmt(POST_SPACING / props.gamma, props.lang, 1)} m`}
        </span>
      </div>
    </div>
  );
}

// ─── Main simulator component ───────────────────────────────────────────────
export default function LengthContraction() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!reduced);
  const [frame, setFrame] = useState<Frame>("earth");
  const [sliderX, setSliderX] = useState(() => betaToSlider(0.6));
  const posRef = useRef({ t: 0 });

  // Flight clock: advances while playing; the canvas reads it each frame.
  useRaf(
    (dt) => {
      posRef.current.t += dt;
    },
    playing,
  );

  const beta = sliderToBeta(sliderX);
  const v = beta * C;
  const gamma = lorentzFactor(v);
  const L = contractedLength(L0, v);

  const reset = () => {
    posRef.current.t = 0;
  };

  const presets = PRESET_B.map((b) => ({
    label: b === 0.87 ? "0.87c · γ = 2" : `${b}c`,
    hint: `γ = ${fmt(lorentzFactor(b * C), lang, 3)}`,
  }));

  return (
    <SimulationShell
      simId="length-contraction"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={1}
      concept={s.concept}
      visualization={
        <LengthCanvas
          beta={beta}
          frame={frame}
          gamma={gamma}
          L={L}
          pos={posRef}
          lang={lang}
          s={s}
        />
      }
      controls={
        <div className="space-y-5">
          <SegmentedControl<Frame>
            label={s.frame}
            options={[
              { value: "earth", label: s.earthFrame },
              { value: "ship", label: s.shipFrame },
            ]}
            value={frame}
            onChange={setFrame}
          />
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
            onPick={(i) => setSliderX(betaToSlider(PRESET_B[i]))}
          />
          <PlayPauseControls
            playing={playing}
            onToggle={() => setPlaying((p) => !p)}
            onReset={reset}
          />
          <div className="grid grid-cols-2 gap-2">
            <PhysicsValue label={s.roRest} value="100" unit="m" />
            <PhysicsValue
              label={s.roObs}
              value={fmt(L, lang, 2)}
              unit="m"
              accent="amber"
            />
            <PhysicsValue
              label={s.roRel}
              value={(100 / gamma).toFixed(1)}
              unit="%"
              accent="amber"
            />
            <PhysicsValue
              label={s.roGamma}
              value={fmt(gamma, lang, 3)}
              accent="violet"
            />
            <PhysicsValue
              label={s.roVelPct}
              value={(beta * 100).toFixed(1)}
              unit="% c"
              accent="cyan"
            />
            <PhysicsValue
              label={s.roVelKms}
              value={fmt(v / 1000, lang, 0)}
              unit="km/s"
              accent="cyan"
            />
          </div>
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
        <EquationCard tex="L = \\frac{L_0}{\\gamma}" caption={s.eqCap} />
      }
      mathEquation={
        <div className="mt-4">
          <EquationCard
            tex="\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}} \\qquad x' = \\gamma\\,(x - vt)\\;\\;\\; t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)"
            caption={s.eqMathCap}
          />
        </div>
      }
      tryThis={
        <TryThis
          prompt={s.tryPrompt}
          check={() => Math.abs(gamma - 2) < 0.03}
        />
      }
      assumptions={s.assumptions}
    />
  );
}
