import { useEffect, useMemo, useState } from "react";
import {
  SimulationShell,
  ParamSlider,
  PhysicsValue,
  EquationCard,
  IM,
  MathOnly,
  SegmentedControl,
  PresetBar,
  TryThis,
  KeyIdea,
  MisconceptionCard,
  PlayPauseControls,
  useG,
} from "../components/ui";
import { useRaf, usePrefersReducedMotion } from "../hooks/useAnimation";
import {
  schwarzschildRadius,
  photonSphereRadius,
  gravitationalRedshift,
  formatDuration,
} from "../physics/generalRelativity";
import { G, C, M_SUN, R_EARTH } from "../physics/constants";
import { fmt, fmtMass, fmtDistance, sizeComparison } from "../physics/units";

// ─── i18n ────────────────────────────────────────────────────────────────────

const STRINGS = {
  en: {
    title: "Black Hole Lab",
    subtitle:
      "Build a black hole of any mass — then drop a clock into it and watch what two different observers see.",
    concept: "Event horizon",
    tabBuild: "Build",
    tabFall: "Fall in",
    mass: "Black hole mass",
    scaleLabel: "Diagram scale",
    scaleLinear: "Linear",
    scaleLog: "Logarithmic",
    scaleLinearNote:
      "Linear scale — true proportions. Bodies that vanish are simply too small to see next to the black hole.",
    scaleLogNote:
      "Logarithmic scale — circle sizes are illustrative only, NOT proportional. Numbers below each body are exact.",
    rsLabel: "Schwarzschild radius rₛ",
    photonLabel: "Photon sphere",
    sizeLabel: "Size comparison",
    bhName: "Black hole",
    earthName: "Earth",
    sunName: "Sun",
    tooSmall: "too small to see",
    presetStellar: "Stellar · 10 M☉",
    presetInter: "Intermediate · 10⁴ M☉",
    presetM87: "M87* · 6.5×10⁹ M☉",
    presetTon: "TON 618 · 6.6×10¹⁰ M☉",
    tryBuildPrompt:
      "Challenge: move the mass slider until the Schwarzschild radius equals Earth's radius (6,371 km). What mass does it take?",
    tryBuildHint:
      "Hint: the answer is a few thousand solar masses — an intermediate-mass black hole.",
    buildWhat: (
      <>
        <p>
          The black disc is the event horizon — the surface of no return. The
          amber ring marks the <strong>photon sphere</strong> at{" "}
          <IM tex="1.5\,r_s" />, where light itself can orbit. Earth and the Sun
          are drawn for scale.
        </p>
        <p className="mt-2">
          Drag the mass slider: the horizon grows in direct proportion to mass —
          double the mass, double the radius. A stellar black hole would fit
          inside a city; the largest ones swallow whole solar systems.
        </p>
      </>
    ),
    buildPhysics: (
      <>
        <p>
          For a non-rotating (Schwarzschild) black hole, the horizon sits at{" "}
          <IM tex="r_s = 2GM/c^2" />. Because gravity at the horizon weakens as
          mass grows, a supermassive black hole's horizon is a gentle place —
          while a stellar one's tides would tear you apart far outside it.
        </p>
        <p className="mt-2">
          The photon sphere is unstable: light can circle there, but the
          slightest nudge sends it spiralling in or escaping out.
        </p>
      </>
    ),
    buildAssumptions: [
      "Schwarzschild (non-rotating, uncharged) black hole — the simplest exact solution of general relativity.",
      "The 'disc' drawing is a 2D cross-section; the real horizon is a sphere (a 2-sphere in 3D space).",
      "Size comparisons use mean radii; real stars vary.",
    ],
    rsCaption: "The Schwarzschild radius — the size of the event horizon",
    // — fall tab —
    fallMass: "Black hole",
    preset10: "Stellar · 10 M☉",
    preset1e6: "10⁶ M☉",
    presetSgr: "Sgr A* · 4×10⁶ M☉",
    fallingTitle: "Falling observer — you",
    distantTitle: "Distant observer",
    properTime: "Proper time τ (your clock)",
    radiusNow: "Radius r",
    coordTime: "Coordinate time t",
    redshiftLabel: "Redshift z (hovering-clock approx.)",
    horizonCrossed: "Horizon crossed — in finite proper time",
    outsideHorizon: "outside the horizon",
    singularityHit: "Singularity reached",
    startLabel: "release point r₀ = 10 rₛ",
    lastPulse: "Signals received",
    gapLabel: "Gap between arrivals",
    gapGrows: "growing without bound",
    neverSee: "t → ∞ : the crossing is never seen",
    noEscape: "Nothing emitted after the crossing can reach infinity.",
    fallWhat: (
      <>
        <p>
          <strong style={{ color: "var(--amber)" }}>Left:</strong> you fall feet-first
          from rest at <IM tex="r_0 = 10\,r_s" />. Your own clock{" "}
          <IM tex="\tau" /> ticks normally — nothing dramatic happens at the
          horizon, and you reach the singularity in a finite, short proper time.
        </p>
        <p className="mt-2">
          <strong style={{ color: "var(--cyan)" }}>Right:</strong> a distant
          observer watching you. Your clock's light pulses arrive ever later,
          ever redder, ever fainter. The worldline bends toward the horizon but
          never crosses it in the distant observer's time <IM tex="t" />.
        </p>
      </>
    ),
    fallPhysics: (
      <>
        <p>
          Radial free fall from rest has an exact solution in general relativity
          — the cycloid: <IM tex="r(\eta) = \tfrac{r_0}{2}(1+\cos\eta)" />. The
          faller's proper time stays finite all the way to the singularity.
        </p>
        <p className="mt-2">
          The distant observer uses Schwarzschild coordinate time{" "}
          <IM tex="t" />, which diverges as <IM tex="r \to r_s" />. That
          divergence is a property of the <em>coordinates</em>, not of the
          faller. Confusing the map for the territory is exactly what creates
          the "frozen at the horizon" myth.
        </p>
      </>
    ),
    fallAssumptions: [
      "Schwarzschild (non-rotating) black hole; radial free fall from rest at r₀ = 10 rₛ.",
      "The infaller is a test particle: their own mass and the radiation they emit do not disturb the spacetime.",
      "The redshift shown is the gravitational redshift of a *hovering* clock at the faller's radius — an approximation. A truly falling emitter also has a Doppler shift.",
      "Light travel time to infinity is approximated as r/c (flat-space estimate).",
      "Tidal forces are ignored in the animation; for stellar-mass holes they would be lethal long before the horizon.",
    ],
    fallCaption: "The exact radial free-fall solution (Schwarzschild, from rest)",
    myth: "A falling observer freezes at the event horizon, stuck there forever.",
    reality:
      "Only the distant observer's description looks frozen: their coordinate time t stretches to infinity as the faller approaches the horizon. The faller's own clock — their proper time τ — ticks on normally, crosses the horizon, and reaches the singularity in a finite time. 'Frozen at the horizon' confuses one observer's coordinates with what actually happens.",
    keyIdea:
      "The horizon is not a physical barrier you crash into — it is a one-way causal boundary. Crossing it feels like nothing special (for a big black hole); not being able to send signals back out is what makes it a horizon.",
  },
  es: {
    title: "Laboratorio de agujeros negros",
    subtitle:
      "Construye un agujero negro de cualquier masa… y luego deja caer un reloj en él para ver lo que observan dos observadores distintos.",
    concept: "Horizonte de sucesos",
    tabBuild: "Construir",
    tabFall: "Caer",
    mass: "Masa del agujero negro",
    scaleLabel: "Escala del diagrama",
    scaleLinear: "Lineal",
    scaleLog: "Logarítmica",
    scaleLinearNote:
      "Escala lineal — proporciones reales. Los cuerpos que desaparecen son simplemente demasiado pequeños junto al agujero negro.",
    scaleLogNote:
      "Escala logarítmica — los tamaños de los círculos son solo ilustrativos, NO proporcionales. Los números bajo cada cuerpo son exactos.",
    rsLabel: "Radio de Schwarzschild rₛ",
    photonLabel: "Esfera de fotones",
    sizeLabel: "Comparación de tamaño",
    bhName: "Agujero negro",
    earthName: "Tierra",
    sunName: "Sol",
    tooSmall: "demasiado pequeño para verse",
    presetStellar: "Estelar · 10 M☉",
    presetInter: "Intermedio · 10⁴ M☉",
    presetM87: "M87* · 6,5×10⁹ M☉",
    presetTon: "TON 618 · 6,6×10¹⁰ M☉",
    tryBuildPrompt:
      "Reto: mueve el deslizador de masa hasta que el radio de Schwarzschild sea igual al radio de la Tierra (6.371 km). ¿Qué masa hace falta?",
    tryBuildHint:
      "Pista: la respuesta es unos pocos miles de masas solares — un agujero negro de masa intermedia.",
    buildWhat: (
      <>
        <p>
          El disco negro es el horizonte de sucesos — la superficie sin retorno.
          El anillo ámbar marca la <strong>esfera de fotones</strong> en{" "}
          <IM tex="1{,}5\,r_s" />, donde la propia luz puede orbitar. La Tierra
          y el Sol se dibujan a escala como referencia.
        </p>
        <p className="mt-2">
          Arrastra el deslizador de masa: el horizonte crece en proporción
          directa a la masa — doble masa, doble radio. Un agujero negro estelar
          cabría en una ciudad; los más grandes se tragan sistemas solares
          enteros.
        </p>
      </>
    ),
    buildPhysics: (
      <>
        <p>
          Para un agujero negro sin rotación (Schwarzschild), el horizonte está
          en <IM tex="r_s = 2GM/c^2" />. Como la gravedad en el horizonte
          disminuye al crecer la masa, el horizonte de un agujero supermasivo es
          un lugar apacible, mientras que las mareas de uno estelar te
          despedazarían mucho antes de llegar a él.
        </p>
        <p className="mt-2">
          La esfera de fotones es inestable: la luz puede circular allí, pero el
          más mínimo empujón la hace caer en espiral o escapar.
        </p>
      </>
    ),
    buildAssumptions: [
      "Agujero negro de Schwarzschild (sin rotación ni carga) — la solución exacta más simple de la relatividad general.",
      "El dibujo del «disco» es una sección transversal 2D; el horizonte real es una esfera.",
      "Las comparaciones usan radios medios; las estrellas reales varían.",
    ],
    rsCaption: "El radio de Schwarzschild — el tamaño del horizonte de sucesos",
    fallMass: "Agujero negro",
    preset10: "Estelar · 10 M☉",
    preset1e6: "10⁶ M☉",
    presetSgr: "Sgr A* · 4×10⁶ M☉",
    fallingTitle: "Observador en caída — tú",
    distantTitle: "Observador lejano",
    properTime: "Tiempo propio τ (tu reloj)",
    radiusNow: "Radio r",
    coordTime: "Tiempo coordenado t",
    redshiftLabel: "Corrimiento al rojo z (aprox. reloj estático)",
    horizonCrossed: "Horizonte cruzado — en tiempo propio finito",
    outsideHorizon: "fuera del horizonte",
    singularityHit: "Singularidad alcanzada",
    startLabel: "punto de partida r₀ = 10 rₛ",
    lastPulse: "Señales recibidas",
    gapLabel: "Intervalo entre llegadas",
    gapGrows: "creciendo sin límite",
    neverSee: "t → ∞ : el cruce nunca se ve",
    noEscape: "Nada emitido tras el cruce puede llegar al infinito.",
    fallWhat: (
      <>
        <p>
          <strong style={{ color: "var(--amber)" }}>Izquierda:</strong> caes de
          cabeza desde el reposo en <IM tex="r_0 = 10\,r_s" />. Tu propio reloj{" "}
          <IM tex="\tau" /> avanza con normalidad — no ocurre nada dramático en
          el horizonte, y llegas a la singularidad en un tiempo propio finito y
          corto.
        </p>
        <p className="mt-2">
          <strong style={{ color: "var(--cyan)" }}>Derecha:</strong> un
          observador lejano que te mira. Los pulsos de luz de tu reloj llegan
          cada vez más tarde, más rojos y más débiles. La línea de universo se
          curva hacia el horizonte pero nunca lo cruza en el tiempo{" "}
          <IM tex="t" /> del observador lejano.
        </p>
      </>
    ),
    fallPhysics: (
      <>
        <p>
          La caída libre radial desde el reposo tiene solución exacta en
          relatividad general — la cicloide:{" "}
          <IM tex="r(\eta) = \tfrac{r_0}{2}(1+\cos\eta)" />. El tiempo propio
          del observador en caída sigue siendo finito hasta la singularidad.
        </p>
        <p className="mt-2">
          El observador lejano usa el tiempo coordenado de Schwarzschild{" "}
          <IM tex="t" />, que diverge cuando <IM tex="r \to r_s" />. Esa
          divergencia es una propiedad de las <em>coordenadas</em>, no del
          observador en caída. Confundir el mapa con el territorio es
          exactamente lo que crea el mito de «congelado en el horizonte».
        </p>
      </>
    ),
    fallAssumptions: [
      "Agujero negro de Schwarzschild (sin rotación); caída libre radial desde el reposo en r₀ = 10 rₛ.",
      "El observador es una partícula de prueba: su propia masa y la radiación que emite no perturban el espaciotiempo.",
      "El corrimiento al rojo mostrado es el de un reloj *estático* en el radio del observador — una aproximación. Un emisor en caída real también tiene corrimiento Doppler.",
      "El tiempo de viaje de la luz al infinito se aproxima como r/c (estimación en espacio plano).",
      "En la animación se ignoran las fuerzas de marea; en agujeros de masa estelar serían letales mucho antes del horizonte.",
    ],
    fallCaption: "La solución exacta de caída libre radial (Schwarzschild, desde el reposo)",
    myth: "Un observador en caída se congela en el horizonte de sucesos, atrapado allí para siempre.",
    reality:
      "Solo la descripción del observador lejano parece congelada: su tiempo coordenado t se estira hasta el infinito cuando el observador se acerca al horizonte. El propio reloj del observador en caída — su tiempo propio τ — sigue avanzando con normalidad, cruza el horizonte y llega a la singularidad en un tiempo finito. «Congelado en el horizonte» confunde las coordenadas de un observador con lo que ocurre realmente.",
    keyIdea:
      "El horizonte no es una barrera física contra la que chocas — es una frontera causal de un solo sentido. Cruzarlo no se siente como nada especial (en un agujero negro grande); lo que lo convierte en horizonte es que ninguna señal puede volver a salir.",
  },
} as const;

type S = (typeof STRINGS)[keyof typeof STRINGS];

type TabId = "build" | "fall";

// ─── Build tab: scale comparison diagram ─────────────────────────────────────

const R_SUN = 6.96e8; // m

function ScaleDiagram({
  rs,
  mode,
  lang,
  s,
}: {
  rs: number;
  mode: "linear" | "log";
  lang: "en" | "es";
  s: S;
}) {
  const bodies = [
    { id: "bh", name: s.bhName, r: rs, kind: "bh" },
    { id: "earth", name: s.earthName, r: R_EARTH, kind: "earth" },
    { id: "sun", name: s.sunName, r: R_SUN, kind: "sun" },
  ] as const;
  const W = 640;
  const H = 250;
  const baseY = 200;
  const xs = [110, 320, 530];
  const maxR = Math.max(rs, R_EARTH, R_SUN);
  const RMAX = 78;

  const radiusPx = (r: number): number => {
    if (mode === "linear") return Math.max(1.5, (RMAX * r) / maxR);
    const logs = bodies.map((b) => Math.log10(b.r));
    const lo = Math.min(...logs);
    const hi = Math.max(...logs);
    const t = hi === lo ? 1 : (Math.log10(r) - lo) / (hi - lo);
    return 14 + t * (RMAX - 14);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={s.sizeLabel}
    >
      {bodies.map((b, i) => {
        const rp = radiusPx(b.r);
        const x = xs[i];
        const tiny = mode === "linear" && rp < 4;
        return (
          <g key={b.id}>
            {b.kind === "bh" ? (
              <>
                <circle
                  cx={x}
                  cy={baseY - rp}
                  r={rp}
                  fill="#000"
                  stroke="var(--amber)"
                  strokeWidth={2.5}
                />
                <circle
                  cx={x}
                  cy={baseY - rp}
                  r={rp * 1.5}
                  fill="none"
                  stroke="var(--amber)"
                  strokeWidth={1.5}
                  strokeDasharray="5 4"
                  opacity={0.85}
                />
              </>
            ) : (
              <circle
                cx={x}
                cy={baseY - rp}
                r={rp}
                fill="none"
                stroke={b.kind === "earth" ? "var(--cyan)" : "var(--amber)"}
                strokeWidth={2.5}
              />
            )}
            <line
              x1={x - rp - 14}
              y1={baseY + 2}
              x2={x + rp + 14}
              y2={baseY + 2}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={x}
              y={baseY + 22}
              textAnchor="middle"
              fontSize={13}
              fontWeight={600}
              fill="var(--text)"
            >
              {b.name}
            </text>
            <text
              x={x}
              y={baseY + 40}
              textAnchor="middle"
              fontSize={11.5}
              fill="var(--text-dim)"
              fontFamily="monospace"
            >
              {tiny ? s.tooSmall : fmtDistance(b.r, lang)}
            </text>
          </g>
        );
      })}
      <text x={12} y={20} fontSize={11.5} fill="var(--text-faint)">
        {mode === "linear" ? s.scaleLinearNote : s.scaleLogNote}
      </text>
    </svg>
  );
}

// ─── Fall tab: exact radial free-fall (cycloid) ──────────────────────────────

interface Pulse {
  tau: number;
  r: number;
  z: number;
  tEmit: number;
  tArr: number;
}

interface FallData {
  rs: number;
  r0: number;
  K: number;
  etaH: number;
  tauH: number;
  tauTotal: number;
  tMax: number;
  gridN: number;
  etaOfTau: (tau: number) => number;
  rOfEta: (eta: number) => number;
  tOfEta: (eta: number) => number;
  pulses: Pulse[];
}

function buildFallData(massKg: number): FallData {
  const rs = schwarzschildRadius(massKg);
  const r0 = 10 * rs;
  const K = Math.sqrt(r0 ** 3 / (8 * G * massKg));
  const etaH = Math.acos((2 * rs) / r0 - 1); // = acos(-0.8)
  const tauH = K * (etaH + Math.sin(etaH));
  const tauTotal = K * Math.PI;
  const E = Math.sqrt(1 - rs / r0);

  const rOfEta = (eta: number) => (r0 / 2) * (1 + Math.cos(eta));
  const tauOfEta = (eta: number) => K * (eta + Math.sin(eta));

  // Coordinate time t(η): dt/dη = E/(1 − rs/r(η)) · K(1 − cos η), integrated
  // numerically up to just below the horizon (t diverges at r = rs).
  const N = 1500;
  const etaMax = etaH * (1 - 1e-7);
  const dEta = etaMax / N;
  const tGrid = new Float64Array(N + 1);
  const deriv = (eta: number) => {
    const r = rOfEta(eta);
    const f = 1 - rs / r;
    return (E / Math.max(f, 1e-12)) * K * (1 - Math.cos(eta));
  };
  for (let i = 1; i <= N; i++) {
    const a = (i - 1) * dEta;
    const b = i * dEta;
    tGrid[i] = tGrid[i - 1] + ((deriv(a) + deriv(b)) / 2) * dEta;
  }
  const tOfEta = (eta: number) => {
    const x = Math.min(Math.max(eta, 0), etaMax) / dEta;
    const i = Math.min(Math.floor(x), N - 1);
    const frac = x - i;
    return tGrid[i] * (1 - frac) + tGrid[i + 1] * frac;
  };
  const etaOfTau = (tau: number) => {
    let lo = 0;
    let hi = Math.PI;
    for (let i = 0; i < 48; i++) {
      const mid = (lo + hi) / 2;
      if (tauOfEta(mid) < tau) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };

  // Light pulses emitted at regular proper-time intervals (before the horizon).
  const PULSES = 14;
  const pulses: Pulse[] = [];
  for (let k = 0; k < PULSES; k++) {
    const tau = ((k + 0.5) / PULSES) * tauH;
    const eta = etaOfTau(tau);
    const r = rOfEta(eta);
    const z = gravitationalRedshift(massKg, r, Infinity);
    const tEmit = tOfEta(eta);
    pulses.push({ tau, r, z, tEmit, tArr: tEmit + r / C });
  }

  return {
    rs, r0, K, etaH, tauH, tauTotal,
    tMax: tGrid[N], gridN: N, etaOfTau, rOfEta, tOfEta, pulses,
  };
}

function pulseColor(z: number): string {
  const zc = Math.min(Math.max(z, 0), 40);
  const hue = 38 * Math.exp(-zc / 6);
  const light = 8 + 47 * Math.exp(-zc / 8);
  return `hsl(${hue.toFixed(1)} 95% ${light.toFixed(1)}%)`;
}

// Falling-observer cross-section: concentric r₀ / photon sphere / horizon.
function FallingView({
  data, tau, s, lang,
}: {
  data: FallData;
  tau: number;
  s: S;
  lang: "en" | "es";
}) {
  const eta = data.etaOfTau(Math.min(tau, data.tauTotal));
  const r = data.rOfEta(eta);
  const crossed = eta >= data.etaH;
  const done = tau >= data.tauTotal - 1e-12;
  const zr = r > data.rs ? gravitationalRedshift((data.rs * C * C) / (2 * G), r, Infinity) : Infinity;
  const W = 340;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2;
  const R0 = 128;
  const rp = (R0 * r) / data.r0;
  const rHor = (R0 * data.rs) / data.r0;
  const rPhot = (R0 * 1.5 * data.rs) / data.r0;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--amber)" }}>
        {s.fallingTitle}
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={s.fallingTitle}>
        <circle cx={cx} cy={cy} r={R0} fill="none" stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 4" />
        <text x={cx + R0 - 4} y={cy - R0 - 6} textAnchor="end" fontSize={10.5} fill="var(--text-faint)">
          {s.startLabel}
        </text>
        <circle cx={cx} cy={cy} r={rPhot} fill="none" stroke="var(--violet)" strokeWidth={1.2} strokeDasharray="3 3" opacity={0.8} />
        <circle cx={cx} cy={cy} r={rHor} fill="#000" stroke="var(--amber)" strokeWidth={2.5} />
        <text x={cx} y={cy - rHor - 8} textAnchor="middle" fontSize={10.5} fill="var(--amber)">
          rₛ
        </text>
        {/* singularity */}
        <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke="var(--text-faint)" strokeWidth={2} />
        <line x1={cx} y1={cy - 7} x2={cx} y2={cy + 7} stroke="var(--text-faint)" strokeWidth={2} />
        {/* faller */}
        {!done && (
          <>
            <line x1={cx} y1={cy} x2={cx + rp} y2={cy} stroke="var(--border)" strokeWidth={1} />
            <circle cx={cx + rp} cy={cy} r={7} fill={pulseColor(zr)} stroke="var(--text)" strokeWidth={1} />
          </>
        )}
        {crossed && !done && (
          <text x={cx} y={H - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--amber)">
            ✓ {s.horizonCrossed}
          </text>
        )}
        {!crossed && (
          <text x={cx} y={H - 14} textAnchor="middle" fontSize={12} fill="var(--text-dim)">
            {s.outsideHorizon}
          </text>
        )}
        {done && (
          <text x={cx} y={H - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--amber)">
            ✕ {s.singularityHit}
          </text>
        )}
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <PhysicsValue label={s.properTime} value={formatDuration(tau, lang)} accent="amber" />
        <PhysicsValue
          label={s.radiusNow}
          value={done ? "0" : `${fmt(r / data.rs, lang, 2)} rₛ`}
          accent="cyan"
          title={fmtDistance(r, lang)}
        />
        <PhysicsValue
          label={s.redshiftLabel}
          value={done || !Number.isFinite(zr) ? "∞" : fmt(zr, lang, 2)}
          accent="violet"
        />
      </div>
    </div>
  );
}

// Distant-observer view: worldline in (t, r) + received pulse strip.
function DistantView({
  data, tau, s, lang,
}: {
  data: FallData;
  tau: number;
  s: S;
  lang: "en" | "es";
}) {
  const eta = data.etaOfTau(Math.min(tau, data.tauTotal));
  const crossed = eta >= data.etaH;
  const tNow = crossed ? Infinity : data.tOfEta(Math.min(eta, data.etaH * (1 - 1e-7)));

  const W = 340;
  const H = 300;
  const padL = 44;
  const padB = 34;
  const padT = 14;
  const plotW = W - padL - 14;
  const plotH = H - padT - padB;
  const xOf = (t: number) => padL + (Math.asinh(t / data.tauH) / Math.asinh(data.tMax / data.tauH)) * plotW;
  const yOf = (r: number) => padT + plotH * (1 - r / data.r0);

  // worldline polyline (sampled)
  const NS = 120;
  const pts: string[] = [];
  for (let i = 0; i <= NS; i++) {
    const e = (i / NS) * data.etaH * (1 - 1e-7);
    pts.push(`${xOf(data.tOfEta(e)).toFixed(1)},${yOf(data.rOfEta(e)).toFixed(1)}`);
  }
  const maxArr = Math.max(...data.pulses.map((p) => p.tArr));
  const xArr = (t: number) => padL + (Math.asinh(t / data.tauH) / Math.asinh(maxArr / data.tauH)) * plotW;
  const seen = data.pulses.filter((p) => p.tArr <= (Number.isFinite(tNow) ? tNow : Infinity));
  const gaps = data.pulses.slice(1).map((p, i) => p.tArr - data.pulses[i].tArr);
  const lastGap = gaps.length ? gaps[gaps.length - 1] : 0;

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
        {s.distantTitle}
      </h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={s.distantTitle}>
        {/* interior shading */}
        <rect x={padL} y={yOf(data.rs)} width={plotW} height={padT + plotH - yOf(data.rs)} fill="#000" opacity={0.55} />
        {/* horizon + photon sphere */}
        <line x1={padL} y1={yOf(data.rs)} x2={W - 14} y2={yOf(data.rs)} stroke="var(--amber)" strokeWidth={1.5} strokeDasharray="6 4" />
        <text x={W - 16} y={yOf(data.rs) - 5} textAnchor="end" fontSize={10.5} fill="var(--amber)">rₛ</text>
        <line x1={padL} y1={yOf(1.5 * data.rs)} x2={W - 14} y2={yOf(1.5 * data.rs)} stroke="var(--violet)" strokeWidth={1} strokeDasharray="3 3" opacity={0.8} />
        {/* worldline */}
        <polyline points={pts.join(" ")} fill="none" stroke="var(--cyan)" strokeWidth={2} />
        {/* emission pulses */}
        {data.pulses.map((p, i) => (
          <circle
            key={i}
            cx={xOf(p.tEmit)}
            cy={yOf(p.r)}
            r={4.5}
            fill={pulseColor(p.z)}
            opacity={p.tEmit <= (Number.isFinite(tNow) ? tNow : Infinity) ? 1 : 0.25}
          />
        ))}
        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
        <line x1={padL} y1={padT + plotH} x2={W - 14} y2={padT + plotH} stroke="var(--border)" strokeWidth={1} />
        <text x={padL - 8} y={padT + 10} textAnchor="end" fontSize={10.5} fill="var(--text-faint)">r</text>
        <text x={W - 16} y={padT + plotH + 20} textAnchor="end" fontSize={10.5} fill="var(--text-faint)">
          t ({lang === "es" ? "escala asinh" : "asinh scale"})
        </text>
        <text x={W - 16} y={padT + 12} textAnchor="end" fontSize={11} fontWeight={600} fill="var(--amber)">
          {s.neverSee}
        </text>
      </svg>
      {/* received-signal strip */}
      <svg viewBox={`0 0 ${W} 64`} className="mt-1 h-auto w-full" role="img" aria-label={s.lastPulse}>
        <line x1={padL} y1={30} x2={W - 14} y2={30} stroke="var(--border)" strokeWidth={2} />
        {data.pulses.map((p, i) => {
          const arrived = p.tArr <= (Number.isFinite(tNow) ? tNow : Infinity);
          return (
            <circle
              key={i}
              cx={xArr(p.tArr)}
              cy={30}
              r={arrived ? 6 : 3.5}
              fill={pulseColor(p.z)}
              opacity={arrived ? Math.max(0.25, 1 / (1 + p.z * 0.25)) : 0.18}
            />
          );
        })}
        <text x={padL} y={56} fontSize={10.5} fill="var(--text-faint)">
          {s.lastPulse}: {seen.length}/{data.pulses.length}
        </text>
        <text x={W - 14} y={56} textAnchor="end" fontSize={10.5} fill="var(--text-faint)">
          {s.gapLabel}: {formatDuration(lastGap, lang)} ({s.gapGrows})
        </text>
      </svg>
      <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>
        {s.noEscape}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <PhysicsValue
          label={s.coordTime}
          value={Number.isFinite(tNow) ? formatDuration(tNow, lang) : "∞"}
          accent="cyan"
        />
        <PhysicsValue
          label={s.properTime}
          value={formatDuration(Math.min(tau, data.tauH), lang)}
          accent="amber"
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const BUILD_PRESETS = [
  { x: 1, key: "presetStellar" },
  { x: 4, key: "presetInter" },
  { x: Math.log10(6.5e9), key: "presetM87" },
  { x: Math.log10(6.6e10), key: "presetTon" },
] as const;

const FALL_PRESETS = [
  { m: 10 * M_SUN, key: "preset10" },
  { m: 1e6 * M_SUN, key: "preset1e6" },
  { m: 4e6 * M_SUN, key: "presetSgr" },
] as const;

export default function BlackHoleLab() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  const [tab, setTab] = useState<TabId>("build");
  // build tab state
  const [logMass, setLogMass] = useState(1); // mass = 10^x M☉, x ∈ [0, 11]
  const [scaleMode, setScaleMode] = useState<"linear" | "log">("log");
  // fall tab state
  const [fallMass, setFallMass] = useState<number>(10 * M_SUN);
  const [tau, setTau] = useState(0);
  const [playing, setPlaying] = useState(!reduced);

  const massKg = 10 ** logMass * M_SUN;
  const rs = schwarzschildRadius(massKg);
  const rPhot = photonSphereRadius(massKg);

  const data = useMemo(() => buildFallData(fallMass), [fallMass]);
  const PLAY_SECONDS = 14;
  const timeScale = data.tauTotal / PLAY_SECONDS;

  useRaf(
    (dt) => {
      setTau((t) => Math.min(t + dt * timeScale, data.tauTotal));
    },
    playing && tab === "fall",
  );

  useEffect(() => {
    if (tau >= data.tauTotal) setPlaying(false);
  }, [tau, data.tauTotal]);

  const resetFall = () => {
    setTau(0);
    setPlaying(!reduced);
  };

  const buildShell = {
    visualization: (
      <div className="p-4">
        <ScaleDiagram rs={rs} mode={scaleMode} lang={lang} s={s} />
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <PhysicsValue label={s.rsLabel} value={fmtDistance(rs, lang)} accent="amber" />
          <PhysicsValue label={s.photonLabel} value={fmtDistance(rPhot, lang)} accent="violet" />
          <PhysicsValue label={s.sizeLabel} value={`≈ ${sizeComparison(rs, lang)}`} accent="cyan" />
        </div>
      </div>
    ),
    controls: (
      <>
        <ParamSlider
          label={s.mass}
          value={logMass}
          min={0}
          max={11}
          step={0.01}
          onChange={setLogMass}
          format={(x) => fmtMass(10 ** x * M_SUN, lang)}
          accent="amber"
        />
        <PresetBar
          presets={BUILD_PRESETS.map((p) => ({
            label: s[p.key],
            hint: fmtMass(10 ** p.x * M_SUN, lang),
          }))}
          onPick={(i) => setLogMass(BUILD_PRESETS[i].x)}
        />
        <SegmentedControl
          label={s.scaleLabel}
          options={[
            { value: "linear" as const, label: s.scaleLinear },
            { value: "log" as const, label: s.scaleLog },
          ]}
          value={scaleMode}
          onChange={setScaleMode}
        />
        <PhysicsValue label={s.mass} value={fmtMass(massKg, lang)} accent="amber" />
      </>
    ),
    whatYouSee: s.buildWhat,
    physics: s.buildPhysics,
    equation: (
      <EquationCard tex="r_s = \frac{2GM}{c^2}" caption={s.rsCaption} />
    ),
    mathEquation: (
      <MathOnly>
        <EquationCard
          tex="r_{\mathrm{photon}} = \frac{3GM}{c^2} = 1.5\,r_s"
          caption={lang === "es" ? "Esfera de fotones (órbita circular inestable de la luz)" : "Photon sphere (unstable circular light orbit)"}
        />
      </MathOnly>
    ),
    assumptions: [...s.buildAssumptions],
    tryThis: (
      <TryThis
        prompt={s.tryBuildPrompt}
        check={() => Math.abs(schwarzschildRadius(10 ** logMass * M_SUN) - R_EARTH) / R_EARTH < 0.05}
      >
        <p className="mt-1 text-xs" style={{ color: "var(--text-faint)" }}>{s.tryBuildHint}</p>
      </TryThis>
    ),
  };

  const fallShell = {
    visualization: (
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <FallingView data={data} tau={tau} s={s} lang={lang} />
        <DistantView data={data} tau={tau} s={s} lang={lang} />
      </div>
    ),
    controls: (
      <>
        <PlayPauseControls
          playing={playing}
          onToggle={() => {
            if (!playing && tau >= data.tauTotal - 1e-12) setTau(0);
            setPlaying((p) => !p);
          }}
          onReset={resetFall}
        />
        <PresetBar
          presets={FALL_PRESETS.map((p) => ({
            label: s[p.key],
            hint: fmtMass(p.m, lang),
          }))}
          onPick={(i) => {
            setFallMass(FALL_PRESETS[i].m);
            setTau(0);
          }}
        />
        <PhysicsValue label={s.fallMass} value={fmtMass(fallMass, lang)} accent="amber" />
        <PhysicsValue
          label={lang === "es" ? "Tiempo propio hasta la singularidad" : "Proper time to the singularity"}
          value={formatDuration(data.tauTotal, lang)}
          accent="cyan"
        />
      </>
    ),
    whatYouSee: s.fallWhat,
    physics: (
      <>
        {s.fallPhysics}
        <KeyIdea>{s.keyIdea}</KeyIdea>
        <MisconceptionCard myth={s.myth} reality={s.reality} />
      </>
    ),
    equation: (
      <EquationCard tex="r_s = \frac{2GM}{c^2}" caption={s.rsCaption} />
    ),
    mathEquation: (
      <MathOnly>
        <EquationCard
          tex="r(\eta) = \frac{r_0}{2}\left(1+\cos\eta\right),\quad \tau(\eta) = \sqrt{\frac{r_0^3}{8GM}}\,\left(\eta+\sin\eta\right)"
          caption={s.fallCaption}
        />
      </MathOnly>
    ),
    assumptions: [...s.fallAssumptions],
    tryThis: undefined,
  };

  const active = tab === "build" ? buildShell : fallShell;

  return (
    <SimulationShell
      simId="black-hole"
      title={s.title}
      subtitle={s.subtitle}
      difficulty={2}
      concept={s.concept}
      visualization={
        <>
          <div className="border-b px-4 pt-3" style={{ borderColor: "var(--border)" }}>
            <SegmentedControl<TabId>
              options={[
                { value: "build", label: s.tabBuild },
                { value: "fall", label: s.tabFall },
              ]}
              value={tab}
              onChange={setTab}
            />
          </div>
          {active.visualization}
        </>
      }
      controls={active.controls}
      whatYouSee={active.whatYouSee}
      physics={active.physics}
      equation={active.equation}
      mathEquation={active.mathEquation}
      assumptions={active.assumptions}
      tryThis={active.tryThis}
    />
  );
}
