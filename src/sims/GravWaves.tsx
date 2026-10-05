import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  IM,
  PlayPauseControls,
  SegmentedControl,
  TryThis,
  useG,
  type Lang,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";
import { G, C, M_SUN, PARSEC } from "../physics/constants";
import { fmt } from "../physics/units";

// ─── Leading-order quadrupole inspiral (circular, non-spinning) ───────────────
const TAU0 = 8; // animation starts 8 s before merger
const DIST = 400e6 * PARSEC; // strain evaluated at a fixed 400 Mpc
const WIN = 3.5; // seconds of simulated time shown in the strip chart
const RING_T = 1.6; // seconds of schematic ringdown after merger

function chirpMass(m1: number, m2: number): number {
  return Math.pow(m1 * m2, 0.6) / Math.pow(m1 + m2, 0.2);
}
/** GW frequency at time-to-merger τ (seconds). */
function fGW(tau: number, mc: number): number {
  return (
    (1 / Math.PI) *
    Math.pow(5 / (256 * tau), 3 / 8) *
    Math.pow((G * mc) / C ** 3, -5 / 8)
  );
}
/** Time-to-merger at which the inspiral reaches a given GW frequency. */
function tauForFreq(f: number, mc: number): number {
  const k = f * Math.PI * Math.pow(256 / 5, 3 / 8) * Math.pow((G * mc) / C ** 3, 5 / 8);
  return Math.pow(k, -8 / 3);
}
/** Relative GW phase Φ(τ) − Φ(TAU0); orbital phase is half of this. */
function gwPhaseRel(tau: number, mc: number): number {
  const x = (t: number) => Math.pow((C ** 3 * t) / (5 * G * mc), 5 / 8);
  return -2 * (x(tau) - x(TAU0));
}
/** Orbital separation from Kepler's law, given GW frequency. */
function separation(fgw: number, mTot: number): number {
  return Math.cbrt((G * mTot) / (Math.PI ** 2 * fgw ** 2));
}
function schwarzschild(m: number): number {
  return (2 * G * m) / C ** 2;
}
/** Order-of-magnitude strain at the fixed distance DIST. */
function strain(mc: number, fgw: number): number {
  return (
    ((G * mc) / C ** 2 / DIST) *
    Math.pow((Math.PI * G * mc * fgw) / C ** 3, 2 / 3)
  );
}

type SysId = "bhbh" | "nsns" | "bhns";
type Phase = "inspiral" | "ringdown" | "done";

interface Strings {
  title: string;
  subtitle: string;
  concept: string;
  system: string;
  sysName: Record<SysId, string>;
  sysDesc: Record<SysId, string>;
  m1: string;
  m2: string;
  speed: string;
  hearChirp: string;
  mute: string;
  audioNote: string;
  chirpMass: string;
  timeToMerger: string;
  gwFreq: string;
  separation: string;
  strain: string;
  strainSub: string;
  distance: string;
  orbitView: string;
  waveform: string;
  windowLabel: string;
  now: string;
  mergerBanner: string;
  ringdownBanner: string;
  mergedBanner: string;
  tryPrompt: string;
  tryWrong: string;
  tryCorrect: (f: string) => string;
  whatYouSee: React.ReactNode;
  physics: React.ReactNode;
  assumptions: string[];
  equationCaption: string;
  mathCaption: string;
}

const STRINGS: Record<Lang, Strings> = {
  en: {
    title: "Gravitational Waves",
    subtitle:
      "Two dead stars spiral inward, shaking spacetime itself. Watch the orbit tighten and the waveform chirp ever faster — and listen to the universe ring.",
    concept: "Ripples in spacetime",
    system: "Binary system",
    sysName: { bhbh: "BH + BH", nsns: "NS + NS", bhns: "BH + NS" },
    sysDesc: {
      bhbh: "30 + 30 solar masses — similar to GW150914, the first merger ever detected.",
      nsns: "1.4 + 1.4 solar masses — like GW170817, the neutron-star merger seen in both gravitational waves and light.",
      bhns: "10 + 1.4 solar masses — a black hole swallowing a neutron star.",
    },
    m1: "Mass m₁",
    m2: "Mass m₂",
    speed: "Animation speed",
    hearChirp: "Hear the chirp",
    mute: "Mute chirp",
    audioNote:
      "Pitch and loudness are synthesized live from the simulated waveform — not a recording.",
    chirpMass: "Chirp mass ℳ",
    timeToMerger: "Time to merger",
    gwFreq: "Wave frequency",
    separation: "Orbital separation",
    strain: "Strain h",
    strainSub: "order of magnitude",
    distance: "Source distance",
    orbitView: "Binary inspiral viewed from above",
    waveform: "Strain measured at Earth (schematic scrolling chart)",
    windowLabel: "last 3.5 s of simulated time",
    now: "now",
    mergerBanner: "Merger!",
    ringdownBanner: "Ringdown — schematic",
    mergedBanner: "Merged — single remnant · press Reset to replay",
    tryPrompt:
      "For the 30 + 30 M☉ system: what is the gravitational-wave frequency 1 second before merger?",
    tryWrong:
      "Not quite. Plug τ = 1 s and the chirp mass of a 30 + 30 M☉ binary into the frequency formula below, then pick the closest value.",
    tryCorrect: (f) =>
      `Correct. The leading-order formula gives ≈ ${f} Hz one second before merger — closest to ≈ 30 Hz. The famous "chirp" climbs from tens of hertz to hundreds in the final second.`,
    whatYouSee: (
      <>
        <p>
          A top-down view of the binary: the two bodies spiral inward, leaving{" "}
          <strong>trails</strong> behind them. The expanding rings are the
          gravitational waves themselves, racing outward at the speed of light —
          each ring is emitted once per half orbit, so they bunch up as the
          binary tightens.
        </p>
        <p className="mt-2">
          Below, the <strong>strip chart</strong> shows the strain{" "}
          <IM tex="h(t)" /> a detector on Earth would feel. As the orbit
          shrinks, the oscillation gets faster and taller — the{" "}
          <em>chirp</em>. Near merger it oscillates faster than the chart can
          sample, so the chart honestly switches to the amplitude envelope
          instead of drawing aliased wiggles.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          Accelerating masses radiate gravitational waves, carrying orbital
          energy away — so the orbit <strong>shrinks</strong>, the bodies speed
          up, and the radiation grows even stronger. Runaway feedback: the{" "}
          <em>chirp</em>.
        </p>
        <p className="mt-2">
          For a circular binary the whole inspiral tempo is set by a single
          number, the <strong>chirp mass</strong> <IM tex="\mathcal{M}" />. The
          wave frequency is twice the orbital frequency,{" "}
          <IM tex="f_{GW} = 2\,f_{orb}" />, and grows as{" "}
          <IM tex="\tau^{-3/8}" /> where <IM tex="\tau" /> is the time remaining
          until merger.
        </p>
        <p className="mt-2">
          When the horizons touch, the objects plunge and merge; the newborn
          remnant rings down like a struck bell. The merger and ringdown shown
          here are <strong>schematic</strong> — real waveform templates come
          from supercomputer simulations of Einstein's equations.
        </p>
      </>
    ),
    assumptions: [
      "Leading-order quadrupole formula for circular, non-spinning binaries — a well-tested approximation for the inspiral, not full numerical relativity.",
      "The merger and ringdown are schematic illustrations, not numerical-relativity waveforms.",
      "Strain h is an order-of-magnitude estimate for a source at a fixed distance of 400 Mpc.",
      "The audio is synthesized live from the simulated frequency and amplitude — it is not a recording of a real event.",
      "Near merger the strip chart switches to the amplitude envelope because the oscillation exceeds the chart's sampling rate.",
    ],
    equationCaption: "Chirp mass — the mass combination that sets the inspiral tempo",
    mathCaption: "Leading-order evolution: the frequency diverges as τ⁻³⸍⁸",
  },
  es: {
    title: "Ondas gravitatorias",
    subtitle:
      "Dos estrellas muertas giran en espiral, sacudiendo el propio espaciotiempo. Observa cómo la órbita se estrecha y la señal acelera su chirp… y escucha cómo vibra el universo.",
    concept: "Ondas en el espaciotiempo",
    system: "Sistema binario",
    sysName: { bhbh: "BH + BH", nsns: "NS + NS", bhns: "BH + NS" },
    sysDesc: {
      bhbh: "30 + 30 masas solares — similar a GW150914, la primera fusión jamás detectada.",
      nsns: "1,4 + 1,4 masas solares — como GW170817, la fusión de estrellas de neutrones vista tanto en ondas gravitatorias como en luz.",
      bhns: "10 + 1,4 masas solares — un agujero negro devorando una estrella de neutrones.",
    },
    m1: "Masa m₁",
    m2: "Masa m₂",
    speed: "Velocidad de animación",
    hearChirp: "Escuchar el chirp",
    mute: "Silenciar",
    audioNote:
      "El tono y el volumen se sintetizan en directo a partir de la onda simulada — no es una grabación.",
    chirpMass: "Masa chirp ℳ",
    timeToMerger: "Tiempo hasta la fusión",
    gwFreq: "Frecuencia de la onda",
    separation: "Separación orbital",
    strain: "Deformación h",
    strainSub: "orden de magnitud",
    distance: "Distancia a la fuente",
    orbitView: "Inspiral binaria vista desde arriba",
    waveform: "Deformación medida en la Tierra (gráfico esquemático)",
    windowLabel: "últimos 3,5 s de tiempo simulado",
    now: "ahora",
    mergerBanner: "¡Fusión!",
    ringdownBanner: "Ringdown — esquemático",
    mergedBanner: "Fusionado — un único remanente · pulsa Reiniciar para repetir",
    tryPrompt:
      "Para el sistema de 30 + 30 M☉: ¿cuál es la frecuencia de la onda gravitatoria 1 segundo antes de la fusión?",
    tryWrong:
      "No exactamente. Sustituye τ = 1 s y la masa chirp de una binaria de 30 + 30 M☉ en la fórmula de la frecuencia, y elige el valor más cercano.",
    tryCorrect: (f) =>
      `Correcto. La fórmula de orden principal da ≈ ${f} Hz un segundo antes de la fusión — lo más cercano a ≈ 30 Hz. El famoso «chirp» sube de decenas a cientos de hercios en el último segundo.`,
    whatYouSee: (
      <>
        <p>
          Vista cenital de la binaria: los dos cuerpos giran en espiral hacia
          dentro dejando <strong>estelas</strong>. Los anillos en expansión son
          las propias ondas gravitatorias, que viajan a la velocidad de la luz:
          cada anillo se emite una vez por media órbita, así que se apelotonan
          a medida que la binaria se estrecha.
        </p>
        <p className="mt-2">
          Debajo, el <strong>gráfico</strong> muestra la deformación{" "}
          <IM tex="h(t)" /> que sentiría un detector en la Tierra. Al
          encogerse la órbita, la oscilación se hace más rápida y más alta: el{" "}
          <em>chirp</em>. Cerca de la fusión oscila más rápido de lo que el
          gráfico puede muestrear, así que este muestra honestamente la
          envolvente de amplitud en lugar de dibujar oscilaciones falsas.
        </p>
      </>
    ),
    physics: (
      <>
        <p>
          Las masas aceleradas radian ondas gravitatorias, que se llevan
          energía orbital: la órbita <strong>se encoge</strong>, los cuerpos
          aceleran y la radiación se hace aún más intensa. Realimentación
          desbocada: el <em>chirp</em>.
        </p>
        <p className="mt-2">
          Para una binaria circular, todo el ritmo del inspiral lo fija un solo
          número, la <strong>masa chirp</strong> <IM tex="\mathcal{M}" />. La
          frecuencia de la onda es el doble de la frecuencia orbital,{" "}
          <IM tex="f_{GW} = 2\,f_{orb}" />, y crece como{" "}
          <IM tex="\tau^{-3/8}" />, donde <IM tex="\tau" /> es el tiempo que
          queda hasta la fusión.
        </p>
        <p className="mt-2">
          Cuando los horizontes se tocan, los objetos se precipitan y se
          fusionan; el remanente recién nacido vibra como una campana golpeada.
          La fusión y el ringdown aquí son <strong>esquemáticos</strong>: las
          plantillas reales de onda provienen de simulaciones en
          supercomputadores de las ecuaciones de Einstein.
        </p>
      </>
    ),
    assumptions: [
      "Fórmula cuadrupolar de orden principal para binarias circulares sin espín: una aproximación bien probada para el inspiral, no relatividad numérica completa.",
      "La fusión y el ringdown son ilustraciones esquemáticas, no formas de onda de relatividad numérica.",
      "La deformación h es una estimación de orden de magnitud para una fuente a una distancia fija de 400 Mpc.",
      "El audio se sintetiza en directo a partir de la frecuencia y la amplitud simuladas — no es una grabación de un evento real.",
      "Cerca de la fusión, el gráfico muestra la envolvente de amplitud porque la oscilación supera la frecuencia de muestreo del gráfico.",
    ],
    equationCaption: "Masa chirp — la combinación de masas que marca el ritmo del inspiral",
    mathCaption: "Evolución de orden principal: la frecuencia diverge como τ⁻³⸍⁸",
  },
};

const PRESET_MASS: Record<SysId, [number, number]> = {
  bhbh: [30, 30],
  nsns: [1.4, 1.4],
  bhns: [10, 1.4],
};

const TRY_OPTS = ["a", "b", "c"] as const;
const TRY_LABEL = ["≈ 30 Hz", "≈ 135 Hz", "≈ 900 Hz"];
const TRY_FREQ = [30, 135, 900];

interface Sample {
  s: number;
  v: number;
  e: number;
}
interface Ripple {
  r: number;
}

export default function GravWaves() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [sys, setSys] = useState<SysId>("bhbh");
  const [m1, setM1] = useState(30);
  const [m2, setM2] = useState(30);
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const [audioOn, setAudioOn] = useState(false);
  const [phaseUi, setPhaseUi] = useState<Phase>("inspiral");
  const [, setTick] = useState(0);
  const [pick, setPick] = useState<string | null>(null);

  // ─── Derived physics (recomputed when masses change) ──────────────────────
  const phys = useMemo(() => {
    const m1kg = m1 * M_SUN;
    const m2kg = m2 * M_SUN;
    const mTot = m1kg + m2kg;
    const mc = chirpMass(m1kg, m2kg);
    const rs1 = schwarzschild(m1kg);
    const rs2 = schwarzschild(m2kg);
    const tauA = tauForFreq(1000, mc);
    const fB = (1 / Math.PI) * Math.sqrt((G * mTot) / (rs1 + rs2) ** 3);
    const tauB = tauForFreq(fB, mc);
    const tauMerge = Math.max(tauA, tauB);
    const fMerge = fGW(tauMerge, mc);
    return {
      m1kg,
      m2kg,
      mTot,
      mc,
      rs1,
      rs2,
      tauMerge,
      fMerge,
      hMax: strain(mc, fMerge),
      aMax: separation(fGW(TAU0, mc), mTot),
    };
  }, [m1, m2]);

  // ─── Mutable simulation state (refs; mirrored to React at ~10 Hz) ─────────
  const sRef = useRef(0);
  const tauRef = useRef(TAU0);
  const phaseRef = useRef<Phase>("inspiral");
  const ringTRef = useRef(0);
  const mergeSRef = useRef<number | null>(null);
  const waveRef = useRef<Sample[]>([]);
  const trailsRef = useRef<{ x: number; y: number }[][]>([[], []]);
  const ripplesRef = useRef<Ripple[]>([]);
  const emitIdxRef = useRef(0);
  const framesRef = useRef(0);
  const audioRef = useRef<{ ctx: AudioContext; osc: OscillatorNode; gain: GainNode } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const envPathRef = useRef<SVGPathElement>(null);
  const mergeLineRef = useRef<SVGLineElement>(null);

  /** Instantaneous values at the current time-to-merger. */
  const snapshot = () => {
    const tau = Math.max(tauRef.current, phys.tauMerge);
    const fgw = fGW(tau, phys.mc);
    return {
      tau,
      fgw,
      a: separation(fgw, phys.mTot),
      h: strain(phys.mc, fgw),
      phiOrb: gwPhaseRel(tau, phys.mc) / 2,
    };
  };

  const stopAudio = () => {
    const a = audioRef.current;
    if (a) {
      try {
        a.gain.gain.setTargetAtTime(0, a.ctx.currentTime, 0.02);
        a.osc.stop(a.ctx.currentTime + 0.1);
        window.setTimeout(() => a.ctx.close().catch(() => undefined), 150);
      } catch {
        /* ignore */
      }
      audioRef.current = null;
    }
    setAudioOn(false);
  };

  const resetSim = () => {
    sRef.current = 0;
    tauRef.current = TAU0;
    phaseRef.current = "inspiral";
    ringTRef.current = 0;
    mergeSRef.current = null;
    waveRef.current = [];
    trailsRef.current = [[], []];
    ripplesRef.current = [];
    emitIdxRef.current = 0;
    stopAudio();
    setPhaseUi("inspiral");
    setTick((t) => t + 1);
  };

  const applySys = (id: SysId) => {
    const [a, b] = PRESET_MASS[id];
    setSys(id);
    setM1(a);
    setM2(b);
    resetSim(); // restart the inspiral even if the masses are unchanged
  };

  // ─── Canvas: top-down inspiral view ───────────────────────────────────────
  const drawAll = (ds: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    ctx.clearRect(0, 0, W, H);

    const snap = snapshot();
    const scale = ((Math.min(W, H) / 2) * 0.86) / phys.aMax;
    const merged = phaseRef.current !== "inspiral";
    const bh1 = sys !== "nsns";
    const bh2 = sys === "bhbh";

    // Wavefront ripples: one ring per half orbit, expanding outward
    if (!merged) {
      const idx = Math.floor(snap.phiOrb / Math.PI);
      if (idx !== emitIdxRef.current) {
        emitIdxRef.current = idx;
        ripplesRef.current.push({ r: 10 });
        if (ripplesRef.current.length > 40) ripplesRef.current.shift();
      }
    }
    for (const rp of ripplesRef.current) rp.r += 130 * ds;
    ripplesRef.current = ripplesRef.current.filter((rp) => rp.r < Math.min(W, H));
    for (const rp of ripplesRef.current) {
      const alpha = Math.max(0, 0.32 * (1 - rp.r / Math.min(W, H)));
      ctx.beginPath();
      ctx.arc(cx, cy, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(103,232,249,${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const drawBH = (x: number, y: number, rPx: number) => {
      const glow = ctx.createRadialGradient(x, y, rPx * 0.4, x, y, rPx * 2.2);
      glow.addColorStop(0, "rgba(251,191,36,0.25)");
      glow.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, rPx * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, rPx, 0, Math.PI * 2);
      ctx.fillStyle = "#050508";
      ctx.fill();
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    const drawNS = (x: number, y: number) => {
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 16);
      glow.addColorStop(0, "rgba(196,181,253,0.95)");
      glow.addColorStop(0.35, "rgba(167,139,250,0.55)");
      glow.addColorStop(1, "rgba(167,139,250,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ede9fe";
      ctx.fill();
    };

    if (!merged) {
      const r1 = snap.a * (phys.m2kg / phys.mTot);
      const r2 = snap.a * (phys.m1kg / phys.mTot);
      const x1 = cx - r1 * scale * Math.cos(snap.phiOrb);
      const y1 = cy - r1 * scale * Math.sin(snap.phiOrb);
      const x2 = cx + r2 * scale * Math.cos(snap.phiOrb);
      const y2 = cy + r2 * scale * Math.sin(snap.phiOrb);

      // Trails
      const tr = trailsRef.current;
      tr[0].push({ x: x1, y: y1 });
      tr[1].push({ x: x2, y: y2 });
      if (tr[0].length > 140) {
        tr[0].shift();
        tr[1].shift();
      }
      const trailCols = ["rgba(251,191,36,0.55)", "rgba(167,139,250,0.55)"];
      tr.forEach((pts, bi) => {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.strokeStyle = trailCols[bi];
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      const rPx1 = Math.max(5, phys.rs1 * scale);
      const rPx2 = Math.max(5, phys.rs2 * scale);
      if (bh1) drawBH(x1, y1, rPx1);
      else drawNS(x1, y1);
      if (bh2) drawBH(x2, y2, rPx2);
      else drawNS(x2, y2);
    } else {
      // Remnant (schematic): single black hole with amber ring
      drawBH(cx, cy, 15);
      // Merger flash
      const rt = ringTRef.current;
      if (rt < 0.6) {
        const fr = 20 + rt * 520;
        ctx.beginPath();
        ctx.arc(cx, cy, fr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${(0.8 * (1 - rt / 0.6)).toFixed(3)})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
  };

  // ─── SVG strip chart (updated via refs, no React re-render) ───────────────
  const updateStrip = (sNow: number, fgw: number) => {
    const W = 600;
    const H = 130;
    const mid = H / 2;
    const amp = H / 2 - 8;
    const xOf = (st: number) => ((st - (sNow - WIN)) / WIN) * W;
    const samples = waveRef.current;
    let d = "";
    samples.forEach((p, i) => {
      const x = Math.max(0, Math.min(W, xOf(p.s)));
      const y = mid - (p.v / phys.hMax) * amp;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
    });
    wavePathRef.current?.setAttribute("d", d);

    // Envelope mode: oscillation exceeds the chart's sampling rate
    let e = "";
    if (fgw > 30 && samples.length > 1) {
      let up = "";
      let lo = "";
      samples.forEach((p, i) => {
        const x = Math.max(0, Math.min(W, xOf(p.s))).toFixed(1);
        const ye = (mid - (p.e / phys.hMax) * amp).toFixed(1);
        const yb = (mid + (p.e / phys.hMax) * amp).toFixed(1);
        up += `${i === 0 ? "M" : "L"}${x} ${ye} `;
        lo = `L${x} ${yb} ` + lo;
      });
      e = up + lo + "Z";
    }
    envPathRef.current?.setAttribute("d", e);

    const ml = mergeLineRef.current;
    if (ml) {
      const ms = mergeSRef.current;
      if (ms != null && ms > sNow - WIN) {
        const x = xOf(ms);
        ml.setAttribute("x1", String(x));
        ml.setAttribute("x2", String(x));
        ml.setAttribute("visibility", "visible");
      } else {
        ml.setAttribute("visibility", "hidden");
      }
    }
  };

  // ─── Audio: oscillator follows the simulated waveform ─────────────────────
  const updateAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    const t = a.ctx.currentTime;
    if (phaseRef.current === "done" || !playing) {
      a.gain.gain.setTargetAtTime(0, t, 0.08);
      return;
    }
    const snap = snapshot();
    const freq =
      phaseRef.current === "ringdown"
        ? Math.min(phys.fMerge, 1500)
        : Math.min(Math.max(snap.fgw, 15), 1500);
    const target =
      phaseRef.current === "ringdown"
        ? 0.22 * Math.exp(-ringTRef.current / (2 / phys.fMerge))
        : 0.22 * Math.min(1, Math.max(0, snap.h / phys.hMax));
    a.osc.frequency.setTargetAtTime(freq, t, 0.04);
    a.gain.gain.setTargetAtTime(target, t, 0.06);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      stopAudio();
      return;
    }
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 40;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audioRef.current = { ctx, osc, gain };
      setAudioOn(true);
    } catch {
      /* Web Audio unavailable */
    }
  };

  // ─── Main loop ────────────────────────────────────────────────────────────
  useRaf(
    (dt) => {
      const ds = dt * speed;
      if (phaseRef.current === "inspiral") {
        sRef.current += ds;
        tauRef.current = TAU0 - sRef.current;
        if (tauRef.current <= phys.tauMerge) {
          tauRef.current = phys.tauMerge;
          phaseRef.current = "ringdown";
          ringTRef.current = 0;
          mergeSRef.current = sRef.current;
          setPhaseUi("ringdown");
        }
      } else if (phaseRef.current === "ringdown") {
        sRef.current += ds;
        ringTRef.current += ds;
        if (ringTRef.current > RING_T) {
          phaseRef.current = "done";
          setPhaseUi("done");
          setPlaying(false);
        }
      }

      // Sample the waveform
      const snap = snapshot();
      let v: number;
      let e: number;
      if (phaseRef.current === "inspiral") {
        e = snap.h;
        v = e * Math.cos(2 * snap.phiOrb);
      } else if (phaseRef.current === "ringdown") {
        const rt = ringTRef.current;
        const tauD = 2 / phys.fMerge;
        e = phys.hMax * Math.exp(-rt / tauD);
        v = e * Math.cos(2 * Math.PI * phys.fMerge * rt);
      } else {
        v = 0;
        e = 0;
      }
      const sNow = sRef.current;
      waveRef.current.push({ s: sNow, v, e });
      while (
        waveRef.current.length > 0 &&
        waveRef.current[0].s < sNow - WIN - 0.1
      ) {
        waveRef.current.shift();
      }

      drawAll(ds);
      updateStrip(sNow, snap.fgw);
      updateAudio();

      framesRef.current += 1;
      if (framesRef.current % 6 === 0) setTick((t) => t + 1);
    },
    playing,
  );

  // Redraw a static frame when masses change (and restart the inspiral)
  useEffect(() => {
    sRef.current = 0;
    tauRef.current = TAU0;
    phaseRef.current = "inspiral";
    ringTRef.current = 0;
    mergeSRef.current = null;
    waveRef.current = [];
    trailsRef.current = [[], []];
    ripplesRef.current = [];
    emitIdxRef.current = 0;
    setPhaseUi("inspiral");
    if (!playing) {
      drawAll(0);
      updateStrip(0, fGW(TAU0, phys.mc));
    }
    setTick((t) => t + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m1, m2]);

  // Initial static frame + cleanup audio on unmount
  useEffect(() => {
    drawAll(0);
    updateStrip(0, fGW(TAU0, chirpMass(30 * M_SUN, 30 * M_SUN)));
    return () => {
      const a = audioRef.current;
      if (a) {
        try {
          a.osc.stop();
          a.ctx.close().catch(() => undefined);
        } catch {
          /* ignore */
        }
        audioRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── TryThis: runtime-computed answer for the 30+30 M☉ system ──────────────
  const fAt1s = useMemo(
    () => fGW(1, chirpMass(30 * M_SUN, 30 * M_SUN)),
    [],
  );
  const correctId = useMemo(() => {
    let best = 0;
    let bestD = Infinity;
    TRY_FREQ.forEach((f, i) => {
      const d = Math.abs(f - fAt1s);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return TRY_OPTS[best];
  }, [fAt1s]);

  const snap = snapshot();

  return (
    <SimulationShell
      simId="gravitational-waves"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <div>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={640}
              height={560}
              className="block w-full"
              style={{ aspectRatio: "8 / 7" }}
              role="img"
              aria-label={s.orbitView}
            />
            {phaseUi !== "inspiral" && (
              <div
                className="pointer-events-none absolute inset-x-0 top-4 flex justify-center"
                role="status"
              >
                <span
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    color: "var(--amber)",
                    border: "1px solid var(--amber)",
                  }}
                >
                  {phaseUi === "ringdown" ? `${s.mergerBanner} · ${s.ringdownBanner}` : s.mergedBanner}
                </span>
              </div>
            )}
          </div>

          <div
            className="border-t px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="mb-1 text-xs font-semibold uppercase tracking-[0.08em]"
              style={{ color: "var(--text-faint)" }}
            >
              {s.waveform}
            </div>
            <svg
              viewBox="0 0 600 130"
              preserveAspectRatio="none"
              className="block w-full"
              style={{ height: 130 }}
              role="img"
              aria-label={s.waveform}
            >
              <line x1="0" x2="600" y1="65" y2="65" stroke="var(--border)" strokeWidth="1" />
              <path ref={envPathRef} d="" fill="rgba(103,232,249,0.18)" />
              <path
                ref={wavePathRef}
                d=""
                fill="none"
                stroke="var(--cyan)"
                strokeWidth="2"
              />
              <line
                ref={mergeLineRef}
                y1="0"
                y2="130"
                stroke="var(--amber)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                visibility="hidden"
              />
            </svg>
            <div
              className="mt-1 flex justify-between text-[0.68rem]"
              style={{ color: "var(--text-faint)" }}
            >
              <span>{s.windowLabel}</span>
              <span>{s.now} →</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3">
            <PhysicsValue
              label={s.chirpMass}
              value={fmt(phys.mc / M_SUN, lang, 2)}
              unit="M☉"
              accent="violet"
            />
            <PhysicsValue
              label={s.timeToMerger}
              value={phaseUi === "inspiral" ? fmt(Math.max(0, snap.tau), lang, 2) : "0"}
              unit="s"
              accent="amber"
            />
            <PhysicsValue
              label={s.gwFreq}
              value={fmt(phaseUi === "inspiral" ? snap.fgw : phys.fMerge, lang, 1)}
              unit="Hz"
              accent="cyan"
            />
            <PhysicsValue
              label={s.separation}
              value={fmt(snap.a / 1000, lang, 1)}
              unit="km"
            />
            <PhysicsValue
              label={`${s.strain} (${s.strainSub})`}
              value={fmt(phaseUi === "inspiral" ? snap.h : phys.hMax, lang)}
              accent="green"
            />
            <PhysicsValue label={s.distance} value="400" unit="Mpc" />
          </div>
        </div>
      }
      controls={
        <>
          <PlayPauseControls
            playing={playing}
            onToggle={() => {
              if (phaseUi === "done") resetSim();
              setPlaying((p) => !p);
            }}
            onReset={resetSim}
          />
          <SegmentedControl<SysId>
            label={s.system}
            value={sys}
            onChange={applySys}
            options={(Object.keys(PRESET_MASS) as SysId[]).map((id) => ({
              value: id,
              label: s.sysName[id],
            }))}
          />
          <p className="-mt-3 text-xs" style={{ color: "var(--text-dim)" }}>
            {s.sysDesc[sys]}
          </p>
          <ParamSlider
            label={s.m1}
            value={Math.log10(m1)}
            min={0}
            max={2}
            step={0.005}
            onChange={(v) => setM1(Math.pow(10, v))}
            format={(v) => `${fmt(Math.pow(10, v), lang, 2)} M☉`}
            accent="amber"
          />
          <ParamSlider
            label={s.m2}
            value={Math.log10(m2)}
            min={0}
            max={2}
            step={0.005}
            onChange={(v) => setM2(Math.pow(10, v))}
            format={(v) => `${fmt(Math.pow(10, v), lang, 2)} M☉`}
            accent="violet"
          />
          <ParamSlider
            label={s.speed}
            value={speed}
            min={0.25}
            max={2}
            step={0.25}
            onChange={setSpeed}
            format={(v) => `${v}×`}
          />
          <div>
            <button
              className={audioOn ? "btn-primary !px-4 !py-2 text-sm" : "btn-ghost !px-4 !py-2 text-sm"}
              onClick={toggleAudio}
              aria-pressed={audioOn}
            >
              {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {audioOn ? s.mute : s.hearChirp}
            </button>
            <p className="mt-1.5 text-xs" style={{ color: "var(--text-faint)" }}>
              {s.audioNote}
            </p>
          </div>
        </>
      }
      whatYouSee={s.whatYouSee}
      physics={s.physics}
      equation={
        <EquationCard
          tex="\mathcal{M} = \frac{(m_1 m_2)^{3/5}}{(m_1+m_2)^{1/5}}"
          caption={s.equationCaption}
        />
      }
      mathEquation={
        <div className="mt-3">
          <EquationCard
            tex="f_{GW}(\tau) = \frac{1}{\pi}\left(\frac{5}{256\,\tau}\right)^{3/8}\left(\frac{G\,\mathcal{M}}{c^3}\right)^{-5/8}"
            caption={s.mathCaption}
          />
        </div>
      }
      tryThis={
        <>
          <TryThis prompt={s.tryPrompt} check={() => pick === correctId}>
            <div className="mt-3 flex flex-wrap gap-2">
              {TRY_OPTS.map((id, i) => (
                <button
                  key={id}
                  onClick={() => setPick(id)}
                  aria-pressed={pick === id}
                  className="chip"
                  style={
                    pick === id
                      ? {
                          cursor: "pointer",
                          borderColor: "var(--cyan)",
                          color: "var(--cyan)",
                        }
                      : { cursor: "pointer" }
                  }
                >
                  ({id}) {TRY_LABEL[i]}
                </button>
              ))}
            </div>
          </TryThis>
          {pick != null && (
            <p
              className="mt-2 text-sm"
              style={{
                color: pick === correctId ? "var(--green)" : "var(--amber)",
              }}
              role="status"
            >
              {pick === correctId
                ? s.tryCorrect(fmt(fAt1s, lang, 1))
                : s.tryWrong}
            </p>
          )}
        </>
      }
      assumptions={s.assumptions}
    />
  );
}
