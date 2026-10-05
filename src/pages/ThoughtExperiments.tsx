import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FlaskConical,
  Mountain,
  Orbit,
  Rocket,
  TrainFront,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { DifficultyBadge, KeyIdea, useG, type Lang } from "../components/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoryText {
  title: string;
  concept: string;
  steps: string[];
  punchline: string;
}

interface PageStrings {
  pageTitle: string;
  pageSubtitle: string;
  intro: string;
  next: string;
  prev: string;
  stepOf: (i: number, n: number) => string;
  goToStep: (i: number) => string;
  experimentWithIt: string;
  stories: StoryText[];
}

interface StoryMeta {
  id: string;
  icon: LucideIcon;
  accent: "cyan" | "amber" | "violet";
  difficulty: 1 | 2 | 3;
  link: string;
}

const ACCENT: Record<StoryMeta["accent"], string> = {
  cyan: "var(--cyan)",
  amber: "var(--amber)",
  violet: "var(--violet)",
};

// ─── i18n ─────────────────────────────────────────────────────────────────────

const STRINGS: Record<Lang, PageStrings> = {
  en: {
    pageTitle: "Einstein's Thought Experiments",
    pageSubtitle:
      "Before the equations came the imagination. Einstein reasoned with impossible scenarios — trains, elevators, light beams — and followed them to their logical end.",
    intro:
      "Each card is a miniature story. Step through it, watch the little scene change, and discover where the reasoning leads. Then take the idea into the laboratory.",
    next: "Next",
    prev: "Back",
    stepOf: (i, n) => `Step ${i} of ${n}`,
    goToStep: (i) => `Go to step ${i}`,
    experimentWithIt: "Experiment with it",
    stories: [
      {
        title: "Chasing a Light Beam",
        concept: "Constancy of c",
        steps: [
          "Einstein, age sixteen, imagined riding alongside a beam of light at exactly the speed of light, c.",
          "Classical intuition says the light wave should look frozen beside him — a wave standing perfectly still.",
          "But Maxwell's equations forbid frozen light: a stationary electromagnetic wave cannot exist.",
          "So something had to give — either Maxwell was wrong, or our ideas of space and time were.",
        ],
        punchline:
          "Light always moves at c, no matter how fast you chase it. A decade later, this boyhood paradox became Special Relativity.",
      },
      {
        title: "Einstein's Train",
        concept: "Relativity of simultaneity",
        steps: [
          "Lightning strikes both ends of a speeding train. An observer on the platform sees the two flashes at the same instant.",
          "But a passenger sits exactly midway — and the train rushes toward the front flash while fleeing the rear one.",
          "Light from the front strike reaches her eyes first: in her frame, the front bolt struck earlier.",
          "Both observers are right. “At the same time” depends on how you move.",
        ],
        punchline:
          "Simultaneity is not absolute. Two events simultaneous for one observer need not be simultaneous for another.",
      },
      {
        title: "The Light Clock",
        concept: "Time dilation",
        steps: [
          "Build the simplest clock imaginable: a single photon bouncing up and down between two mirrors.",
          "Ride along with the clock and the photon just goes up and down — tick, tock, perfectly regular.",
          "Now watch the same clock zoom past you at nearly the speed of light.",
          "From outside, the photon traces a longer diagonal path — but light always travels at c, so each tick takes longer.",
        ],
        punchline:
          "Moving clocks run slower — not because they break, but because spacetime geometry forces the light to travel farther.",
      },
      {
        title: "Einstein's Elevator",
        concept: "Equivalence principle",
        steps: [
          "You wake inside a sealed elevator. A ball slips from your hand and drops to the floor.",
          "Are you resting on Earth's surface — or accelerating through deep space at 9.8 m/s²?",
          "Drop the ball, swing a pendulum, weigh yourself: every experiment gives identical results in both cases.",
          "Einstein's leap: gravity and acceleration are locally indistinguishable — they are the same phenomenon.",
        ],
        punchline:
          "The equivalence principle — the “happiest thought” of Einstein's life — became the seed of General Relativity.",
      },
      {
        title: "The Twin Paradox",
        concept: "Proper time",
        steps: [
          "Alice stays on Earth. Her twin Bob rockets to a distant star at 0.9c and comes back.",
          "Each twin watches the other's clock run slow — so each expects the other to be younger. Contradiction?",
          "But the situation is not symmetric: Bob must turn around, changing inertial frames. Alice never does.",
          "When they reunite and compare clocks, Bob — the traveler — is genuinely younger.",
        ],
        punchline:
          "No paradox at all: the twin who changes frames ages less. Proper time depends on your path through spacetime.",
      },
      {
        title: "The Accelerating Rocket",
        concept: "Acceleration & gravity",
        steps: [
          "Far from any planet, a rocket fires its engines and accelerates steadily at 1g.",
          "Inside, feet press into the floor, dropped tools fall, coffee pours exactly as on Earth.",
          "No experiment inside can distinguish this from standing on the ground — down feels like down.",
          "Keep accelerating forever and you approach c but never reach it: the limit is set by energy, not willpower.",
        ],
        punchline:
          "Steady acceleration builds a perfect imitation of gravity — and shows why nothing with mass can outrun light.",
      },
      {
        title: "Falling into a Black Hole",
        concept: "Event horizon",
        steps: [
          "You drift toward a black hole. Far away, mission control watches your clock tick ever more slowly.",
          "Your signals arrive redder and redder, stretched thin climbing out of the gravitational well.",
          "To them you seem to freeze at the horizon — but that frozen image is delayed light, not you stopping.",
          "For you, the fall continues: you cross the horizon in finite proper time, feeling nothing special at the boundary.",
        ],
        punchline:
          "The horizon is a point of no return, not a wall. The “frozen” infaller is an illusion of distant clocks.",
      },
      {
        title: "The Clock on the Mountain",
        concept: "Gravitational time dilation",
        steps: [
          "Take two identical atomic clocks. Leave one at sea level; carry the other up a mountain.",
          "No motion, no trickery — just a different height in Earth's gravity.",
          "Wait a year and compare: the mountain clock has ticked slightly faster.",
          "Gravity dilates time itself. GPS satellites correct for this daily — without it, navigation would fail.",
        ],
        punchline:
          "Time runs faster uphill. This is not theory: it is measured, and your phone's GPS depends on it.",
      },
    ],
  },
  es: {
    pageTitle: "Experimentos mentales de Einstein",
    pageSubtitle:
      "Antes que las ecuaciones llegó la imaginación. Einstein razonaba con escenarios imposibles —trenes, ascensores, rayos de luz— y los seguía hasta su conclusión lógica.",
    intro:
      "Cada tarjeta es una mini-historia. Avanza paso a paso, observa cómo cambia la pequeña escena y descubre a dónde lleva el razonamiento. Después, lleva la idea al laboratorio.",
    next: "Siguiente",
    prev: "Atrás",
    stepOf: (i, n) => `Paso ${i} de ${n}`,
    goToStep: (i) => `Ir al paso ${i}`,
    experimentWithIt: "Experiméntalo",
    stories: [
      {
        title: "Persiguiendo un rayo de luz",
        concept: "Constancia de c",
        steps: [
          "Einstein, con dieciséis años, imaginó viajar junto a un rayo de luz a exactamente la velocidad de la luz, c.",
          "La intuición clásica dice que la onda de luz debería verse congelada a su lado: una onda perfectamente quieta.",
          "Pero las ecuaciones de Maxwell prohíben la luz congelada: una onda electromagnética estacionaria no puede existir.",
          "Así que algo tenía que ceder: o Maxwell estaba equivocado, o lo estaban nuestras ideas de espacio y tiempo.",
        ],
        punchline:
          "La luz siempre viaja a c, por más rápido que la persigas. Una década después, esta paradoja juvenil se convirtió en la relatividad especial.",
      },
      {
        title: "El tren de Einstein",
        concept: "Relatividad de la simultaneidad",
        steps: [
          "Un rayo cae en cada extremo de un tren a toda velocidad. Un observador en el andén ve los dos destellos al mismo instante.",
          "Pero una pasajera va justo en el centro, y el tren avanza hacia el destello delantero mientras huye del trasero.",
          "La luz del rayo delantero llega a sus ojos primero: en su sistema, el rayo delantero cayó antes.",
          "Ambos observadores tienen razón. «Al mismo tiempo» depende de cómo te muevas.",
        ],
        punchline:
          "La simultaneidad no es absoluta. Dos sucesos simultáneos para un observador pueden no serlo para otro.",
      },
      {
        title: "El reloj de luz",
        concept: "Dilatación del tiempo",
        steps: [
          "Construye el reloj más simple imaginable: un solo fotón rebotando entre dos espejos.",
          "Viaja con el reloj y el fotón solo sube y baja: tic, tac, con perfecta regularidad.",
          "Ahora observa ese mismo reloj pasar a tu lado a casi la velocidad de la luz.",
          "Desde fuera, el fotón traza una diagonal más larga, pero la luz siempre va a c: cada tic-tac tarda más.",
        ],
        punchline:
          "Los relojes en movimiento van más lentos: no porque se estropeen, sino porque la geometría del espaciotiempo obliga a la luz a recorrer más camino.",
      },
      {
        title: "El ascensor de Einstein",
        concept: "Principio de equivalencia",
        steps: [
          "Despiertas dentro de un ascensor sellado. Una pelota se te escapa de la mano y cae al suelo.",
          "¿Estás en reposo sobre la superficie de la Tierra… o acelerando por el espacio profundo a 9,8 m/s²?",
          "Suelta la pelota, balancea un péndulo, pésate: cada experimento da resultados idénticos en ambos casos.",
          "El salto de Einstein: la gravedad y la aceleración son localmente indistinguibles; son el mismo fenómeno.",
        ],
        punchline:
          "El principio de equivalencia —«el pensamiento más feliz» de la vida de Einstein— fue la semilla de la relatividad general.",
      },
      {
        title: "La paradoja de los gemelos",
        concept: "Tiempo propio",
        steps: [
          "Alice se queda en la Tierra. Su gemelo Bob viaja en cohete a una estrella lejana a 0,9c y regresa.",
          "Cada gemelo ve el reloj del otro ir más lento: cada uno espera que el otro sea más joven. ¿Contradicción?",
          "Pero la situación no es simétrica: Bob debe dar la vuelta y cambiar de sistema inercial. Alice nunca lo hace.",
          "Cuando se reencuentran y comparan relojes, Bob —el viajero— es genuinamente más joven.",
        ],
        punchline:
          "No hay paradoja: el gemelo que cambia de sistema envejece menos. El tiempo propio depende de tu camino en el espaciotiempo.",
      },
      {
        title: "El cohete acelerado",
        concept: "Aceleración y gravedad",
        steps: [
          "Lejos de cualquier planeta, un cohete enciende sus motores y acelera de forma constante a 1g.",
          "Dentro, los pies presionan el suelo, las herramientas caen y el café se sirve igual que en la Tierra.",
          "Ningún experimento interior distingue esto de estar de pie en el suelo: abajo se siente como abajo.",
          "Acelera para siempre y te acercarás a c sin alcanzarla jamás: el límite lo pone la energía, no la voluntad.",
        ],
        punchline:
          "La aceleración constante crea una imitación perfecta de la gravedad, y muestra por qué nada con masa puede superar a la luz.",
      },
      {
        title: "Cayendo en un agujero negro",
        concept: "Horizonte de sucesos",
        steps: [
          "Derivas hacia un agujero negro. A lo lejos, el control de misión ve tu reloj latir cada vez más lento.",
          "Tus señales llegan más y más rojas, estiradas al escapar del pozo gravitatorio.",
          "Para ellos pareces congelarte en el horizonte, pero esa imagen congelada es luz retrasada, no tú detenido.",
          "Para ti, la caída continúa: cruzas el horizonte en un tiempo propio finito, sin notar nada especial en el límite.",
        ],
        punchline:
          "El horizonte es un punto de no retorno, no un muro. El viajero «congelado» es una ilusión de los relojes lejanos.",
      },
      {
        title: "El reloj en la montaña",
        concept: "Dilatación gravitatoria del tiempo",
        steps: [
          "Toma dos relojes atómicos idénticos. Deja uno al nivel del mar y sube el otro a una montaña.",
          "Sin movimiento ni trucos: solo una altura distinta en la gravedad terrestre.",
          "Espera un año y compáralos: el reloj de la montaña ha latido un poco más rápido.",
          "La gravedad dilata el tiempo mismo. Los satélites GPS lo corrigen a diario: sin ello, la navegación fallaría.",
        ],
        punchline:
          "El tiempo corre más rápido cuesta arriba. No es teoría: está medido, y el GPS de tu teléfono depende de ello.",
      },
    ],
  },
};

const STORIES: StoryMeta[] = [
  { id: "chase", icon: Zap, accent: "cyan", difficulty: 1, link: "/lab" },
  { id: "train", icon: TrainFront, accent: "amber", difficulty: 1, link: "/lab/einstein-train" },
  { id: "clock", icon: Clock, accent: "cyan", difficulty: 1, link: "/lab/light-clock" },
  { id: "elevator", icon: ArrowUpDown, accent: "violet", difficulty: 2, link: "/lab" },
  { id: "twins", icon: Users, accent: "amber", difficulty: 2, link: "/lab/twin-paradox" },
  { id: "rocket", icon: Rocket, accent: "cyan", difficulty: 2, link: "/lab" },
  { id: "blackhole", icon: Orbit, accent: "violet", difficulty: 3, link: "/lab" },
  { id: "mountain", icon: Mountain, accent: "amber", difficulty: 2, link: "/lab" },
];

// ─── Inline SVG motifs (one per story, subtly animated by step) ──────────────

interface MotifProps {
  step: number;
  accent: string;
}

const DIM = "var(--text-dim)";
const FAINT = "var(--text-faint)";

function MotifChase({ step, accent }: MotifProps) {
  const fx = 12 + step * 12; // figure chases right
  const wx = 44 + step * 14; // light wave stays ahead
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <circle cx={fx} cy={26} r={5} fill="none" stroke={DIM} strokeWidth={2} />
      <line x1={fx} y1={32} x2={fx} y2={50} stroke={DIM} strokeWidth={2} />
      <line x1={fx} y1={36} x2={fx + 9} y2={42} stroke={DIM} strokeWidth={2} />
      <line x1={fx} y1={50} x2={fx - 7} y2={62} stroke={DIM} strokeWidth={2} />
      <line x1={fx} y1={50} x2={fx + 7} y2={62} stroke={DIM} strokeWidth={2} />
      <path
        d={`M ${wx},40 q 6,-12 12,0 t 12,0 t 12,0`}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path d={`M ${wx + 38},34 l 8,6 l -8,6`} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
      {step === 1 && (
        <text x={wx} y={66} fill={FAINT} fontSize={9} textAnchor="middle">
          frozen?
        </text>
      )}
    </svg>
  );
}

function MotifTrain({ step, accent }: MotifProps) {
  const tx = 14 + step * 10;
  const bolt = (cx: number) => (
    <polygon
      points={`${cx},8 ${cx + 8},8 ${cx + 2},20 ${cx + 10},20 ${cx - 2},36 ${cx + 2},22 ${cx - 4},22`}
      fill={accent}
      opacity={step >= 1 ? 1 : 0}
    />
  );
  const rings = (cx: number) =>
    [1, 2, 3].map(
      (r) =>
        step >= 2 && (
          <circle
            key={r}
            cx={cx}
            cy={40}
            r={(step - 1) * 9 + r * 4}
            fill="none"
            stroke={accent}
            strokeWidth={1.2}
            opacity={0.7 - r * 0.18}
          />
        ),
    );
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <line x1={6} y1={66} x2={114} y2={66} stroke={FAINT} strokeWidth={2} />
      {bolt(tx)}
      {bolt(tx + 62)}
      {rings(tx + 2)}
      {rings(tx + 64)}
      <rect x={tx} y={30} width={66} height={24} rx={3} fill="none" stroke={DIM} strokeWidth={2} />
      <rect x={tx + 6} y={35} width={12} height={9} fill="none" stroke={DIM} strokeWidth={1.4} />
      <rect x={tx + 24} y={35} width={12} height={9} fill="none" stroke={DIM} strokeWidth={1.4} />
      <rect x={tx + 42} y={35} width={12} height={9} fill="none" stroke={DIM} strokeWidth={1.4} />
      <circle cx={tx + 14} cy={58} r={5} fill="none" stroke={DIM} strokeWidth={2} />
      <circle cx={tx + 52} cy={58} r={5} fill="none" stroke={DIM} strokeWidth={2} />
    </svg>
  );
}

function MotifClock({ step, accent }: MotifProps) {
  const diagonal = step >= 2;
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <line x1={24} y1={14} x2={96} y2={14} stroke={DIM} strokeWidth={3} strokeLinecap="round" />
      <line x1={24} y1={66} x2={96} y2={66} stroke={DIM} strokeWidth={3} strokeLinecap="round" />
      {diagonal ? (
        <>
          <line x1={30} y1={66} x2={78} y2={14} stroke={accent} strokeWidth={2.5} strokeDasharray="5 4" />
          <circle cx={30 + step * 12} cy={66 - step * 13} r={4.5} fill={accent} />
        </>
      ) : (
        <>
          <line x1={60} y1={14} x2={60} y2={66} stroke={accent} strokeWidth={2.5} strokeDasharray="5 4" />
          <circle cx={60} cy={step === 0 ? 24 : 56} r={4.5} fill={accent} />
        </>
      )}
      {step === 3 && (
        <text x={104} y={30} fill={FAINT} fontSize={9} textAnchor="middle">
          longer!
        </text>
      )}
    </svg>
  );
}

function MotifElevator({ step, accent }: MotifProps) {
  const ballY = 24 + step * 11;
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <line x1={60} y1={2} x2={60} y2={12} stroke={FAINT} strokeWidth={2} />
      <rect x={34} y={12} width={52} height={56} rx={2} fill="none" stroke={DIM} strokeWidth={2} />
      {step >= 1 &&
        [0, 1, 2].map((i) => (
          <line
            key={i}
            x1={16 + i * 4}
            y1={66 - i * 3}
            x2={16 + i * 4}
            y2={56 - i * 3}
            stroke={accent}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}
      <circle cx={60} cy={ballY} r={5} fill={accent} />
      <line x1={60} y1={ballY - 9} x2={60} y2={ballY - 14} stroke={FAINT} strokeWidth={1.5} strokeDasharray="2 2" />
      {step === 1 && (
        <text x={60} y={78} fill={FAINT} fontSize={8.5} textAnchor="middle">
          Earth or space?
        </text>
      )}
    </svg>
  );
}

function MotifTwins({ step, accent }: MotifProps) {
  const rx = [30, 58, 90, 30][step];
  const ry = [40, 24, 40, 40][step];
  const aliceA = step * 95;
  const bobA = step * 32;
  const hand = (cx: number, cy: number, deg: number, col: string) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return (
      <line
        x1={cx}
        y1={cy}
        x2={cx + 10 * Math.cos(rad)}
        y2={cy + 10 * Math.sin(rad)}
        stroke={col}
        strokeWidth={2}
        strokeLinecap="round"
      />
    );
  };
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <path d="M 30,44 Q 60,10 90,44" fill="none" stroke={FAINT} strokeWidth={1.4} strokeDasharray="4 3" />
      <polygon points="86,10 96,10 91,20" fill={accent} />
      <polygon points={`${rx - 5},${ry - 6} ${rx + 5},${ry - 6} ${rx},${ry + 8}`} fill="none" stroke={DIM} strokeWidth={1.8} />
      <circle cx={30} cy={58} r={13} fill="none" stroke={DIM} strokeWidth={2} />
      {hand(30, 58, aliceA, DIM)}
      <circle cx={90} cy={58} r={13} fill="none" stroke={accent} strokeWidth={2} />
      {hand(90, 58, bobA, accent)}
    </svg>
  );
}

function MotifRocket({ step, accent }: MotifProps) {
  const flame = 6 + step * 7;
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <line x1={100} y1={8} x2={100} y2={72} stroke={FAINT} strokeWidth={1.6} strokeDasharray="5 4" />
      {step >= 3 && (
        <text x={100} y={78} fill={FAINT} fontSize={9} textAnchor="middle">
          c
        </text>
      )}
      <polygon points="56,14 70,30 42,30" fill="none" stroke={DIM} strokeWidth={2} />
      <rect x={42} y={30} width={28} height={22} rx={2} fill="none" stroke={DIM} strokeWidth={2} />
      <polygon points="42,40 30,54 42,54" fill="none" stroke={DIM} strokeWidth={2} />
      <polygon points="70,40 82,54 70,54" fill="none" stroke={DIM} strokeWidth={2} />
      <polygon
        points={`56,${52} 48,${52 + flame} 56,${48 + flame} 64,${52 + flame}`}
        fill={accent}
        opacity={0.85}
      />
      {step >= 2 &&
        [0, 1].map((i) => (
          <line
            key={i}
            x1={24 - i * 9}
            y1={24 + i * 18}
            x2={32 - i * 9}
            y2={28 + i * 18}
            stroke={accent}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        ))}
    </svg>
  );
}

function MotifBlackHole({ step, accent }: MotifProps) {
  const dotY = 10 + step * 8;
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <circle cx={60} cy={42} r={17} fill="var(--bg)" stroke={DIM} strokeWidth={2.5} />
      <circle cx={60} cy={42} r={23} fill="none" stroke={accent} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.6} />
      <circle cx={60} cy={dotY} r={4} fill={step >= 2 ? "var(--amber)" : accent} />
      {step >= 1 && (
        <path
          d={`M 60,${dotY + 7} q 8,${4 + step * 2} 0,${8 + step * 3}`}
          fill="none"
          stroke={step >= 3 ? "#ff6b6b" : "var(--amber)"}
          strokeWidth={1.8}
        />
      )}
      {step >= 2 &&
        [0, 1, 2].map((i) => (
          <circle key={i} cx={60} cy={42} r={27 + i * 6} fill="none" stroke={FAINT} strokeWidth={1} opacity={0.5 - i * 0.12} />
        ))}
    </svg>
  );
}

function MotifMountain({ step, accent }: MotifProps) {
  const summitA = step * 70;
  const baseA = step * 24;
  const hand = (cx: number, cy: number, deg: number, col: string) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return (
      <line
        x1={cx}
        y1={cy}
        x2={cx + 7 * Math.cos(rad)}
        y2={cy + 7 * Math.sin(rad)}
        stroke={col}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    );
  };
  return (
    <svg viewBox="0 0 120 80" className="h-24 w-full" role="img" aria-hidden>
      <polygon points="8,72 58,12 108,72" fill="none" stroke={DIM} strokeWidth={2} strokeLinejoin="round" />
      <polygon points="58,12 48,26 68,26" fill="none" stroke={FAINT} strokeWidth={1.4} />
      <circle cx={58} cy={34} r={10} fill="var(--bg-panel)" stroke={accent} strokeWidth={2} />
      {hand(58, 34, summitA, accent)}
      <circle cx={94} cy={62} r={10} fill="var(--bg-panel)" stroke={DIM} strokeWidth={2} />
      {hand(94, 62, baseA, DIM)}
      {step >= 3 && (
        <text x={58} y={76} fill={FAINT} fontSize={8.5} textAnchor="middle">
          faster up here
        </text>
      )}
    </svg>
  );
}

const MOTIFS: Record<string, (p: MotifProps) => React.JSX.Element> = {
  chase: MotifChase,
  train: MotifTrain,
  clock: MotifClock,
  elevator: MotifElevator,
  twins: MotifTwins,
  rocket: MotifRocket,
  blackhole: MotifBlackHole,
  mountain: MotifMountain,
};

// ─── Story card with inline stepper ──────────────────────────────────────────

function StoryCard({ meta, text, s }: { meta: StoryMeta; text: StoryText; s: PageStrings }) {
  const [step, setStep] = useState(0);
  const n = text.steps.length;
  const last = step === n - 1;
  const reduce = useReducedMotion();
  const accent = ACCENT[meta.accent];
  const Icon = meta.icon;
  const Motif = MOTIFS[meta.id];

  return (
    <article className="panel flex flex-col p-5 md:p-6" aria-label={text.title}>
      <div className="mb-4 flex items-start gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon size={22} aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold leading-tight">{text.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DifficultyBadge level={meta.difficulty} />
            <span className="chip">{text.concept}</span>
          </div>
        </div>
      </div>

      <Motif step={step} accent={accent} />

      <div className="relative mt-3 min-h-[5.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
            transition={{ duration: 0.22 }}
            className="leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            {text.steps[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {last && (
          <motion.div
            key="punchline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <KeyIdea>
              <p className="text-[0.95rem] font-medium">{text.punchline}</p>
            </KeyIdea>
            <Link
              to={meta.link}
              className="btn-primary inline-flex items-center gap-2 !px-4 !py-2 text-sm"
            >
              <FlaskConical size={15} aria-hidden />
              {s.experimentWithIt} →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <button
          className="btn-ghost inline-flex items-center gap-1 !px-3 !py-1.5 text-sm"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          aria-label={s.prev}
        >
          <ChevronLeft size={15} aria-hidden />
          {s.prev}
        </button>

        <div className="flex items-center gap-1.5" role="group" aria-label={s.stepOf(step + 1, n)}>
          {text.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={s.goToStep(i + 1)}
              aria-current={i === step ? "step" : undefined}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === step ? 22 : 8,
                background: i === step ? accent : "var(--border)",
              }}
            />
          ))}
        </div>

        <button
          className="btn-ghost inline-flex items-center gap-1 !px-3 !py-1.5 text-sm"
          onClick={() => setStep((v) => Math.min(n - 1, v + 1))}
          disabled={last}
          aria-label={s.next}
        >
          {s.next}
          <ChevronRight size={15} aria-hidden />
        </button>
      </div>
      <div className="mt-2 text-center text-xs" style={{ color: "var(--text-faint)" }}>
        {s.stepOf(step + 1, n)}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThoughtExperiments() {
  const { lang } = useG();
  const s = STRINGS[lang];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <header className="max-w-3xl pb-8 pt-8">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.pageTitle}</h1>
        <p className="mt-3 text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {s.pageSubtitle}
        </p>
        <p className="mt-2 text-[0.95rem]" style={{ color: "var(--text-faint)" }}>
          {s.intro}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {STORIES.map((meta, i) => (
          <StoryCard key={meta.id} meta={meta} text={s.stories[i]} s={s} />
        ))}
      </div>
    </div>
  );
}
