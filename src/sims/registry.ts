import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export type SimCategory =
  | "time" | "space" | "light" | "spacetime" | "gravity" | "blackholes" | "cosmos";

export interface SimMeta {
  id: string;
  title: { en: string; es: string };
  concept: { en: string; es: string };
  difficulty: 1 | 2 | 3;
  category: SimCategory;
  component: LazyExoticComponent<ComponentType>;
}

const L = (p: () => Promise<{ default: ComponentType }>) => lazy(p);

export const sims: SimMeta[] = [
  { id: "light-clock", title: { en: "Light Clock", es: "Reloj de luz" }, concept: { en: "Time dilation", es: "Dilatación del tiempo" }, difficulty: 2, category: "time", component: L(() => import("./LightClock")) },
  { id: "journey", title: { en: "Relativistic Journey", es: "Viaje relativista" }, concept: { en: "Proper time", es: "Tiempo propio" }, difficulty: 1, category: "time", component: L(() => import("./Journey")) },
  { id: "twin-paradox", title: { en: "Twin Paradox Lab", es: "Paradoja de los gemelos" }, concept: { en: "Non-inertial frames", es: "Sistemas no inerciales" }, difficulty: 2, category: "time", component: L(() => import("./TwinParadox")) },
  { id: "chasing-light", title: { en: "Chasing a Light Beam", es: "Persiguiendo un rayo de luz" }, concept: { en: "Invariance of c", es: "Invariancia de c" }, difficulty: 1, category: "light", component: L(() => import("./ChasingLight")) },
  { id: "einstein-train", title: { en: "Einstein's Train", es: "El tren de Einstein" }, concept: { en: "Simultaneity", es: "Simultaneidad" }, difficulty: 2, category: "space", component: L(() => import("./EinsteinTrain")) },
  { id: "length-contraction", title: { en: "Length Contraction", es: "Contracción de la longitud" }, concept: { en: "Lorentz contraction", es: "Contracción de Lorentz" }, difficulty: 1, category: "space", component: L(() => import("./LengthContraction")) },
  { id: "minkowski", title: { en: "Spacetime Diagram Lab", es: "Diagramas de espaciotiempo" }, concept: { en: "Minkowski diagrams", es: "Diagramas de Minkowski" }, difficulty: 3, category: "spacetime", component: L(() => import("./Minkowski")) },
  { id: "causality", title: { en: "Causality Explorer", es: "Explorador de causalidad" }, concept: { en: "Light cones", es: "Conos de luz" }, difficulty: 2, category: "spacetime", component: L(() => import("./Causality")) },
  { id: "particle-accelerator", title: { en: "Particle Accelerator", es: "Acelerador de partículas" }, concept: { en: "Relativistic energy", es: "Energía relativista" }, difficulty: 2, category: "light", component: L(() => import("./ParticleAccelerator")) },
  { id: "elevator", title: { en: "Einstein's Elevator", es: "El ascensor de Einstein" }, concept: { en: "Equivalence principle", es: "Principio de equivalencia" }, difficulty: 1, category: "gravity", component: L(() => import("./Elevator")) },
  { id: "bending-light", title: { en: "Bending Light", es: "Luz que se curva" }, concept: { en: "Light in gravity", es: "Luz en gravedad" }, difficulty: 2, category: "gravity", component: L(() => import("./BendingLight")) },
  { id: "curvature-lab", title: { en: "Spacetime Curvature Lab", es: "Curvatura del espaciotiempo" }, concept: { en: "Curved spacetime", es: "Espaciotiempo curvo" }, difficulty: 2, category: "gravity", component: L(() => import("./CurvatureLab")) },
  { id: "orbits", title: { en: "Orbit Lab", es: "Laboratorio orbital" }, concept: { en: "Geodesics & precession", es: "Geodésicas y precesión" }, difficulty: 3, category: "gravity", component: L(() => import("./OrbitLab")) },
  { id: "gravity-clock", title: { en: "Gravity Clock", es: "Reloj gravitatorio" }, concept: { en: "Gravitational time dilation", es: "Dilatación gravitatoria" }, difficulty: 2, category: "gravity", component: L(() => import("./GravityClock")) },
  { id: "gps", title: { en: "GPS Relativity Lab", es: "GPS y relatividad" }, concept: { en: "Real-world relativity", es: "Relatividad real" }, difficulty: 2, category: "gravity", component: L(() => import("./GpsLab")) },
  { id: "black-hole", title: { en: "Black Hole Lab", es: "Agujeros negros" }, concept: { en: "Event horizon", es: "Horizonte de sucesos" }, difficulty: 2, category: "blackholes", component: L(() => import("./BlackHoleLab")) },
  { id: "lensing", title: { en: "Gravitational Lensing", es: "Lente gravitatoria" }, concept: { en: "Light bending", es: "Deflexión de la luz" }, difficulty: 3, category: "blackholes", component: L(() => import("./Lensing")) },
  { id: "gravitational-waves", title: { en: "Gravitational Waves", es: "Ondas gravitatorias" }, concept: { en: "Ripples in spacetime", es: "Ondas del espaciotiempo" }, difficulty: 2, category: "cosmos", component: L(() => import("./GravWaves")) },
];

export const simById = (id: string): SimMeta | undefined =>
  sims.find((s) => s.id === id);

export const categoryLabel: Record<SimCategory, { en: string; es: string }> = {
  time: { en: "Time", es: "Tiempo" },
  space: { en: "Space", es: "Espacio" },
  light: { en: "Light", es: "Luz" },
  spacetime: { en: "Spacetime", es: "Espaciotiempo" },
  gravity: { en: "Gravity", es: "Gravedad" },
  blackholes: { en: "Black holes", es: "Agujeros negros" },
  cosmos: { en: "Cosmos", es: "Cosmos" },
};
