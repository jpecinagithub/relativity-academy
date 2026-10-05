export interface ModuleMeta {
  id: string;
  index: number;
  title: { en: string; es: string };
  tagline: { en: string; es: string };
  description: { en: string; es: string };
  difficulty: 1 | 2 | 3;
  /** sim ids featured inside the module */
  simIds: string[];
  /** lucide icon name key used by LearnHub */
  icon: string;
}

export const modules: ModuleMeta[] = [
  {
    id: "classical-world",
    index: 0,
    title: { en: "Before Einstein", es: "Antes de Einstein" },
    tagline: {
      en: "Why did classical physics break?",
      es: "¿Por qué se rompió la física clásica?",
    },
    description: {
      en: "Newton's clockwork universe, Galilean relativity, and the experiment with light that refused to behave.",
      es: "El universo mecánico de Newton, la relatividad de Galileo y el experimento con la luz que se negó a comportarse.",
    },
    difficulty: 1,
    simIds: ["chasing-light"],
    icon: "Train",
  },
  {
    id: "special-relativity",
    index: 1,
    title: { en: "The Two Postulates", es: "Los dos postulados" },
    tagline: {
      en: "Two simple rules that rewrote physics.",
      es: "Dos reglas simples que reescribieron la física.",
    },
    description: {
      en: "Einstein's 1905 starting point: the laws of physics are the same for all inertial observers, and light always travels at c.",
      es: "El punto de partida de Einstein en 1905: las leyes de la física son las mismas para todo observador inercial, y la luz siempre viaja a c.",
    },
    difficulty: 1,
    simIds: ["chasing-light"],
    icon: "Zap",
  },
  {
    id: "time-dilation",
    index: 2,
    title: { en: "Time Is Relative", es: "El tiempo es relativo" },
    tagline: {
      en: "Moving clocks run slow. See it happen.",
      es: "Los relojes en movimiento atrasan. Míralo ocurrir.",
    },
    description: {
      en: "Proper time, the light clock, the Lorentz factor γ — and a journey to the stars where astronauts age less.",
      es: "Tiempo propio, el reloj de luz, el factor de Lorentz γ — y un viaje a las estrellas donde los astronautas envejecen menos.",
    },
    difficulty: 1,
    simIds: ["light-clock", "journey", "twin-paradox"],
    icon: "Clock",
  },
  {
    id: "space",
    index: 3,
    title: { en: "Length & Simultaneity", es: "Longitud y simultaneidad" },
    tagline: {
      en: "Space shrinks and 'now' depends on you.",
      es: "El espacio se encoge y el 'ahora' depende de ti.",
    },
    description: {
      en: "Length contraction, the relativity of simultaneity, and Einstein's train with its lightning bolts.",
      es: "Contracción de la longitud, relatividad de la simultaneidad y el tren de Einstein con sus rayos.",
    },
    difficulty: 2,
    simIds: ["einstein-train", "length-contraction"],
    icon: "Ruler",
  },
  {
    id: "spacetime",
    index: 4,
    title: { en: "Spacetime", es: "El espaciotiempo" },
    tagline: {
      en: "Space and time are one fabric. Draw it.",
      es: "Espacio y tiempo son un solo tejido. Dibújalo.",
    },
    description: {
      en: "Events, worldlines, light cones and Minkowski diagrams — the geometry where causality lives.",
      es: "Sucesos, líneas de universo, conos de luz y diagramas de Minkowski: la geometría donde vive la causalidad.",
    },
    difficulty: 2,
    simIds: ["minkowski", "causality"],
    icon: "Boxes",
  },
  {
    id: "energy",
    index: 5,
    title: { en: "Energy, Mass & Momentum", es: "Energía, masa y momento" },
    tagline: {
      en: "Why nothing with mass can reach c.",
      es: "Por qué nada con masa puede alcanzar c.",
    },
    description: {
      en: "Beyond E = mc²: rest energy, relativistic momentum, and the particle accelerator that proves c is unreachable.",
      es: "Más allá de E = mc²: energía en reposo, momento relativista y el acelerador que demuestra que c es inalcanzable.",
    },
    difficulty: 2,
    simIds: ["particle-accelerator"],
    icon: "Atom",
  },
  {
    id: "equivalence",
    index: 6,
    title: { en: "The Equivalence Principle", es: "El principio de equivalencia" },
    tagline: {
      en: "Gravity and acceleration feel identical.",
      es: "Gravedad y aceleración se sienten igual.",
    },
    description: {
      en: "Einstein's happiest thought: the elevator experiment, bending light, and the bridge from special to general relativity.",
      es: "El pensamiento más feliz de Einstein: el experimento del ascensor, la luz que se curva y el puente hacia la relatividad general.",
    },
    difficulty: 2,
    simIds: ["elevator", "bending-light"],
    icon: "ArrowDownUp",
  },
  {
    id: "general-relativity",
    index: 7,
    title: { en: "Curved Spacetime", es: "Espaciotiempo curvo" },
    tagline: {
      en: "Matter curves spacetime; spacetime guides matter.",
      es: "La materia curva el espaciotiempo; el espaciotiempo guía la materia.",
    },
    description: {
      en: "Geodesics, gravitational time dilation, GPS corrections, and the orbits that proved Einstein right.",
      es: "Geodésicas, dilatación gravitatoria del tiempo, correcciones del GPS y las órbitas que dieron la razón a Einstein.",
    },
    difficulty: 3,
    simIds: ["curvature-lab", "orbits", "gravity-clock", "gps"],
    icon: "Orbit",
  },
  {
    id: "black-holes",
    index: 8,
    title: { en: "Black Holes", es: "Agujeros negros" },
    tagline: {
      en: "Where spacetime ends — almost.",
      es: "Donde el espaciotiempo termina… casi.",
    },
    description: {
      en: "Event horizons, Schwarzschild radius, gravitational lensing — without the myths.",
      es: "Horizontes de sucesos, radio de Schwarzschild, lentes gravitatorias — sin mitos.",
    },
    difficulty: 3,
    simIds: ["black-hole", "lensing"],
    icon: "CircleDot",
  },
  {
    id: "cosmos",
    index: 9,
    title: { en: "Relativity & the Universe", es: "Relatividad y universo" },
    tagline: {
      en: "From gravitational waves to the Big Bang.",
      es: "De las ondas gravitatorias al Big Bang.",
    },
    description: {
      en: "Expanding universe, gravitational waves you can hear, and where general relativity leads next.",
      es: "Universo en expansión, ondas gravitatorias que puedes oír y hacia dónde nos lleva la relatividad general.",
    },
    difficulty: 2,
    simIds: ["gravitational-waves"],
    icon: "Telescope",
  },
];

export const moduleById = (id: string): ModuleMeta | undefined =>
  modules.find((m) => m.id === id);
