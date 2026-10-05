export interface ChallengeQuestion {
  id: string;
  category: "sr" | "spacetime" | "energy" | "gr" | "blackholes";
  question: { en: string; es: string };
  options: { en: string[]; es: string[] };
  answer: number;
  explanation: { en: string; es: string };
}

export const challengeQuestions: ChallengeQuestion[] = [
  // ── Special Relativity (4) ──────────────────────────────────────────────
  {
    id: "sr-light-speed",
    category: "sr",
    question: {
      en: "A spacecraft flies past Earth at 0.9c and fires a light beam forward. What speed does an Earth observer measure for that light?",
      es: "Una nave pasa junto a la Tierra a 0,9c y dispara un haz de luz hacia adelante. ¿Qué velocidad mide un observador en la Tierra para esa luz?",
    },
    options: {
      en: [
        "c — the speed of light in vacuum, exactly",
        "1.9c — the ship's speed plus the light's speed",
        "0.1c — the light's speed minus the ship's speed",
        "It depends on the colour of the light",
      ],
      es: [
        "c — la velocidad de la luz en el vacío, exactamente",
        "1,9c — la velocidad de la nave más la de la luz",
        "0,1c — la velocidad de la luz menos la de la nave",
        "Depende del color de la luz",
      ],
    },
    answer: 0,
    explanation: {
      en: "The second postulate: light in vacuum always travels at c for every inertial observer, no matter how fast the source moves. Classical velocity addition simply does not apply to light — that failure is what forced Einstein to rebuild our ideas of space and time.",
      es: "El segundo postulado: la luz en el vacío siempre viaja a c para todo observador inercial, sin importar lo rápido que se mueva la fuente. La suma clásica de velocidades simplemente no se aplica a la luz, y ese fracaso es lo que obligó a Einstein a reconstruir nuestras ideas de espacio y tiempo.",
    },
  },
  {
    id: "sr-mutual-dilation",
    category: "sr",
    question: {
      en: "Two astronauts, Ana and Bruno, drift past each other at constant high speed. Each carries a clock. What does each one observe?",
      es: "Dos astronautas, Ana y Bruno, se cruzan a velocidad alta y constante. Cada uno lleva un reloj. ¿Qué observa cada uno?",
    },
    options: {
      en: [
        "Each sees the other's clock ticking slower than their own",
        "Each sees the other's clock ticking faster than their own",
        "Only the one who is 'really moving' sees the other's clock slow down",
        "Both clocks tick at exactly the same rate for both observers",
      ],
      es: [
        "Cada uno ve el reloj del otro avanzar más lento que el propio",
        "Cada uno ve el reloj del otro avanzar más rápido que el propio",
        "Solo quien se está «moviendo de verdad» ve el reloj del otro ir más lento",
        "Ambos relojes avanzan exactamente al mismo ritmo para los dos observadores",
      ],
    },
    answer: 0,
    explanation: {
      en: "Time dilation is symmetric between inertial observers: each one legitimately judges the other to be moving, so each sees the other's clock run slow. There is no contradiction, because comparing the clocks side by side requires someone to turn around — and that breaks the symmetry, as the twin paradox shows.",
      es: "La dilatación del tiempo es simétrica entre observadores inerciales: cada uno juzga legítimamente que es el otro quien se mueve, así que cada uno ve el reloj del otro ir más lento. No hay contradicción, porque comparar los relojes cara a cara exige que alguien dé la vuelta, y eso rompe la simetría, como muestra la paradoja de los gemelos.",
    },
  },
  {
    id: "sr-velocity-addition",
    category: "sr",
    question: {
      en: "A rocket moving at 0.9c relative to Earth launches a probe forward at 0.9c relative to the rocket. What speed does Earth measure for the probe?",
      es: "Un cohete que se mueve a 0,9c respecto a la Tierra lanza una sonda hacia adelante a 0,9c respecto al cohete. ¿Qué velocidad mide la Tierra para la sonda?",
    },
    options: {
      en: [
        "About 0.994c — still below the speed of light",
        "1.8c — velocities simply add",
        "Exactly c — anything moving fast becomes light",
        "0.9c — the probe cannot go faster than the rocket",
      ],
      es: [
        "Unos 0,994c — todavía por debajo de la velocidad de la luz",
        "1,8c — las velocidades simplemente se suman",
        "Exactamente c — todo lo que se mueve rápido se convierte en luz",
        "0,9c — la sonda no puede ir más rápido que el cohete",
      ],
    },
    answer: 0,
    explanation: {
      en: "Relativistic velocity addition is (u + v) / (1 + uv/c²), which gives roughly 0.994c here — always below c. The formula guarantees that combining any two sub-light speeds never reaches or exceeds light speed, which is why c is an unreachable limit for anything with mass.",
      es: "La suma relativista de velocidades es (u + v) / (1 + uv/c²), lo que da unos 0,994c en este caso: siempre por debajo de c. La fórmula garantiza que combinar dos velocidades subluz nunca alcanza ni supera la velocidad de la luz, y por eso c es un límite inalcanzable para todo lo que tiene masa.",
    },
  },
  {
    id: "sr-simultaneity",
    category: "sr",
    question: {
      en: "Lightning strikes the front and the rear of a fast-moving train. A platform observer sees both strikes as simultaneous. What does a passenger sitting in the middle of the train conclude?",
      es: "Dos rayos caen en la parte delantera y trasera de un tren rápido. Un observador en el andén los ve simultáneos. ¿Qué concluye un pasajero sentado en el centro del tren?",
    },
    options: {
      en: [
        "The front strike happened first",
        "The rear strike happened first",
        "Both strikes were simultaneous, same as the platform observer",
        "The strikes never happened in the train's frame",
      ],
      es: [
        "El rayo delantero ocurrió primero",
        "El rayo trasero ocurrió primero",
        "Ambos rayos fueron simultáneos, igual que para el observador del andén",
        "Los rayos nunca ocurrieron en el sistema del tren",
      ],
    },
    answer: 0,
    explanation: {
      en: "Light from the front strike has less distance to cover to reach the moving passenger — the passenger is rushing toward the front flash and away from the rear one. Since light speed is the same in all frames, the passenger receives the front light first and correctly concludes the front strike occurred earlier in the train's frame. Simultaneity is frame-dependent.",
      es: "La luz del rayo delantero tiene menos distancia que recorrer hasta el pasajero en movimiento: el pasajero se acerca al destello delantero y se aleja del trasero. Como la velocidad de la luz es la misma en todos los sistemas, el pasajero recibe primero la luz delantera y concluye correctamente que el rayo delantero ocurrió antes en el sistema del tren. La simultaneidad depende del sistema de referencia.",
    },
  },

  // ── Spacetime (4) ───────────────────────────────────────────────────────
  {
    id: "sp-worldline",
    category: "spacetime",
    question: {
      en: "On a spacetime diagram (position x horizontal, time ct vertical), what does a worldline represent?",
      es: "En un diagrama de espaciotiempo (posición x horizontal, tiempo ct vertical), ¿qué representa una línea de universo?",
    },
    options: {
      en: [
        "The complete history of an object — where it was at every moment",
        "The trajectory light would take if the object were transparent",
        "A line dividing the past from the future",
        "The path of shortest distance between two places",
      ],
      es: [
        "La historia completa de un objeto: dónde estuvo en cada momento",
        "La trayectoria que seguiría la luz si el objeto fuera transparente",
        "Una línea que divide el pasado del futuro",
        "El camino de menor distancia entre dos lugares",
      ],
    },
    answer: 0,
    explanation: {
      en: "A worldline traces an object's position through time — it is the object's entire history drawn as one curve. A vertical worldline means 'staying put'; a tilted one means moving; and nothing with mass can tilt beyond 45°, because that would mean exceeding light speed.",
      es: "Una línea de universo traza la posición de un objeto a lo largo del tiempo: es toda su historia dibujada como una curva. Una línea vertical significa «quedarse quieto»; una inclinada significa moverse; y nada con masa puede inclinarse más de 45°, porque eso significaría superar la velocidad de la luz.",
    },
  },
  {
    id: "sp-light-cone",
    category: "spacetime",
    question: {
      en: "What does the light cone of an event tell you?",
      es: "¿Qué te dice el cono de luz de un evento?",
    },
    options: {
      en: [
        "Which other events it can causally influence or be influenced by",
        "How bright the event appeared to distant observers",
        "The exact time at which the event occurred everywhere",
        "Whether the event happened in the past or the future",
      ],
      es: [
        "A qué otros eventos puede influir causalmente o por cuáles puede ser influido",
        "Cómo de brillante pareció el evento a observadores lejanos",
        "El instante exacto en que ocurrió el evento en todas partes",
        "Si el evento ocurrió en el pasado o en el futuro",
      ],
    },
    answer: 0,
    explanation: {
      en: "The light cone marks the boundary of causality: events inside your future cone can be affected by you (signals have time to reach them), and events inside your past cone could have affected you. Events outside the cone are causally disconnected — no signal, however fast, can connect them.",
      es: "El cono de luz marca la frontera de la causalidad: los eventos dentro de tu cono futuro pueden ser afectados por ti (las señales tienen tiempo de llegar), y los de tu cono pasado pudieron haberte afectado. Los eventos fuera del cono están causalmente desconectados: ninguna señal, por rápida que sea, puede conectarlos.",
    },
  },
  {
    id: "sp-timelike-spacelike",
    category: "spacetime",
    question: {
      en: "Two events are 'spacelike separated'. What does that imply?",
      es: "Dos eventos están «separados espacialmente». ¿Qué implica eso?",
    },
    options: {
      en: [
        "Neither event can cause the other — no signal could travel between them in time",
        "One of them must have caused the other",
        "They happened at the same place",
        "They are simultaneous for every possible observer",
      ],
      es: [
        "Ningún evento puede causar al otro: ninguna señal podría viajar entre ellos a tiempo",
        "Uno de ellos tuvo que causar al otro",
        "Ocurrieron en el mismo lugar",
        "Son simultáneos para todo observador posible",
      ],
    },
    answer: 0,
    explanation: {
      en: "Spacelike separation means the events are too far apart in space relative to their time difference — even light could not get from one to the other. Causality is impossible between them, and remarkably, different observers can even disagree about which happened first.",
      es: "La separación espacial significa que los eventos están demasiado lejos en el espacio en relación con su diferencia temporal: ni siquiera la luz podría ir de uno a otro. La causalidad entre ellos es imposible y, curiosamente, distintos observadores pueden incluso discrepar sobre cuál ocurrió primero.",
    },
  },
  {
    id: "sp-interval",
    category: "spacetime",
    question: {
      en: "Two observers in relative motion disagree about the distance and the time between the same two events. What do they agree on?",
      es: "Dos observadores en movimiento relativo discrepan sobre la distancia y el tiempo entre los mismos dos eventos. ¿En qué coinciden?",
    },
    options: {
      en: [
        "The spacetime interval between the events",
        "The spatial distance between the events",
        "The time elapsed between the events",
        "The order in which the events occurred",
      ],
      es: [
        "El intervalo de espaciotiempo entre los eventos",
        "La distancia espacial entre los eventos",
        "El tiempo transcurrido entre los eventos",
        "El orden en que ocurrieron los eventos",
      ],
    },
    answer: 0,
    explanation: {
      en: "The spacetime interval, s² = (cΔt)² − (Δx)², is invariant: every inertial observer computes the same value even though each measures different Δt and Δx. This shared quantity is the objective reality underneath the frame-dependent appearances — it is why spacetime, not space or time alone, is the fundamental concept.",
      es: "El intervalo de espaciotiempo, s² = (cΔt)² − (Δx)², es invariante: todo observador inercial calcula el mismo valor aunque cada uno mida Δt y Δx distintos. Esta cantidad compartida es la realidad objetiva bajo las apariencias que dependen del sistema: por eso el espaciotiempo, y no el espacio o el tiempo por separado, es el concepto fundamental.",
    },
  },

  // ── Energy (3) ──────────────────────────────────────────────────────────
  {
    id: "en-cannot-reach-c",
    category: "energy",
    question: {
      en: "Why can a spaceship with mass never be accelerated to the speed of light?",
      es: "¿Por qué una nave con masa nunca puede acelerarse hasta la velocidad de la luz?",
    },
    options: {
      en: [
        "Each extra bit of speed demands ever more energy, diverging to infinity as v approaches c",
        "Engines simply are not powerful enough yet — future technology will manage it",
        "Air resistance in space becomes infinite near light speed",
        "Relativity forbids it by law, but there is no physical mechanism behind the ban",
      ],
      es: [
        "Cada pizca extra de velocidad exige cada vez más energía, divergiendo al infinito cuando v se acerca a c",
        "Los motores simplemente aún no son lo bastante potentes; la tecnología futura lo logrará",
        "La resistencia del aire en el espacio se vuelve infinita cerca de la velocidad de la luz",
        "La relatividad lo prohíbe por ley, pero no hay ningún mecanismo físico detrás de la prohibición",
      ],
    },
    answer: 0,
    explanation: {
      en: "Relativistic kinetic energy is (γ − 1)mc², and γ blows up without limit as v → c. Accelerating a massive particle from 0.99c to 0.999c takes far more energy than from 0 to 0.99c did — the energy cost diverges, so reaching c would require infinite energy.",
      es: "La energía cinética relativista es (γ − 1)mc², y γ crece sin límite cuando v → c. Acelerar una partícula con masa de 0,99c a 0,999c cuesta muchísima más energía que de 0 a 0,99c: el coste energético diverge, así que alcanzar c exigiría energía infinita.",
    },
  },
  {
    id: "en-emc2-meaning",
    category: "energy",
    question: {
      en: "What does E = mc² actually say?",
      es: "¿Qué dice realmente E = mc²?",
    },
    options: {
      en: [
        "Mass itself is a form of energy — a body at rest carries energy mc²",
        "Mass turns into energy only when something moves at light speed",
        "It is a recipe for building nuclear weapons",
        "Energy and mass are unrelated; the equation converts units",
      ],
      es: [
        "La masa misma es una forma de energía: un cuerpo en reposo porta la energía mc²",
        "La masa se convierte en energía solo cuando algo se mueve a la velocidad de la luz",
        "Es una receta para construir armas nucleares",
        "Energía y masa no están relacionadas; la ecuación solo convierte unidades",
      ],
    },
    answer: 0,
    explanation: {
      en: "E₀ = mc² is the rest energy: mass is frozen energy, present even in a motionless object. That is why tiny amounts of matter release colossal energy in nuclear reactions — the 'c²' is an enormous conversion factor, about 9×10¹⁶ joules per kilogram.",
      es: "E₀ = mc² es la energía en reposo: la masa es energía congelada, presente incluso en un objeto inmóvil. Por eso cantidades minúsculas de materia liberan una energía colosal en reacciones nucleares: el «c²» es un factor de conversión enorme, unos 9×10¹⁶ julios por kilogramo.",
    },
  },
  {
    id: "en-kinetic-growth",
    category: "energy",
    question: {
      en: "In a particle accelerator, doubling a proton's kinetic energy again and again produces smaller and smaller speed gains near c. What happens to the extra energy?",
      es: "En un acelerador de partículas, duplicar la energía cinética de un protón una y otra vez produce ganancias de velocidad cada vez menores cerca de c. ¿Qué ocurre con la energía extra?",
    },
    options: {
      en: [
        "It goes into the proton's relativistic energy and momentum, not into much extra speed",
        "It is radiated away as heat and lost from the machine",
        "It accumulates as additional rest mass inside the proton",
        "It disappears, violating energy conservation",
      ],
      es: [
        "Se convierte en energía y momento relativistas del protón, no en mucha más velocidad",
        "Se irradia como calor y se pierde fuera de la máquina",
        "Se acumula como masa en reposo adicional dentro del protón",
        "Desaparece, violando la conservación de la energía",
      ],
    },
    answer: 0,
    explanation: {
      en: "Energy is always conserved: the full relation is E² = (pc)² + (mc²)², so injected energy keeps raising the total energy E and momentum p even when velocity barely changes. Near c, pushing harder mostly increases momentum — the particle gets 'heavier to deflect', not much faster.",
      es: "La energía siempre se conserva: la relación completa es E² = (pc)² + (mc²)², así que la energía inyectada sigue aumentando la energía total E y el momento p aunque la velocidad apenas cambie. Cerca de c, empujar más fuerte aumenta sobre todo el momento: la partícula se vuelve «más difícil de desviar», no mucho más rápida.",
    },
  },

  // ── General Relativity (4) ───────────────────────────────────────────────
  {
    id: "gr-elevator",
    category: "gr",
    question: {
      en: "You wake up inside a sealed elevator. A ball you drop falls to the floor exactly as on Earth. What can you conclude?",
      es: "Despiertas dentro de un ascensor sellado. Una pelota que sueltas cae al suelo exactamente como en la Tierra. ¿Qué puedes concluir?",
    },
    options: {
      en: [
        "Nothing certain — the elevator could be on Earth or accelerating through empty space",
        "You must be on the surface of the Earth",
        "You must be accelerating through empty space",
        "Gravity has been switched off inside the elevator",
      ],
      es: [
        "Nada seguro: el ascensor podría estar en la Tierra o acelerando por el espacio vacío",
        "Tienes que estar en la superficie de la Tierra",
        "Tienes que estar acelerando por el espacio vacío",
        "La gravedad se ha apagado dentro del ascensor",
      ],
    },
    answer: 0,
    explanation: {
      en: "This is the equivalence principle: locally, gravity and acceleration are indistinguishable. No experiment performed entirely inside the sealed cabin can tell the two situations apart — the insight that led Einstein from special to general relativity.",
      es: "Este es el principio de equivalencia: localmente, la gravedad y la aceleración son indistinguibles. Ningún experimento realizado por completo dentro de la cabina sellada puede distinguir ambas situaciones: la idea que llevó a Einstein de la relatividad especial a la general.",
    },
  },
  {
    id: "gr-gps",
    category: "gr",
    question: {
      en: "Why do GPS satellites need relativistic corrections?",
      es: "¿Por qué los satélites GPS necesitan correcciones relativistas?",
    },
    options: {
      en: [
        "Both: weaker gravity makes their clocks tick faster (GR) while orbital speed makes them tick slower (SR)",
        "Only their high speed matters — gravity plays no role at that altitude",
        "Only gravity matters — their speed is far too low for special relativity",
        "They don't; the corrections are a theoretical curiosity with no practical effect",
      ],
      es: [
        "Ambos efectos: la gravedad más débil adelanta sus relojes (RG) mientras la velocidad orbital los atrasa (RE)",
        "Solo importa su alta velocidad; la gravedad no juega ningún papel a esa altitud",
        "Solo importa la gravedad; su velocidad es demasiado baja para la relatividad especial",
        "No las necesitan; las correcciones son una curiosidad teórica sin efecto práctico",
      ],
    },
    answer: 0,
    explanation: {
      en: "GPS clocks feel two competing effects: general relativity (weaker gravity → faster ticking, about +45 microseconds/day) and special relativity (orbital speed → slower ticking, about −7 microseconds/day). The net +38 microseconds/day would misplace you by kilometres within a day if ignored — relativity as everyday engineering.",
      es: "Los relojes GPS sienten dos efectos contrapuestos: relatividad general (gravedad más débil → tictac más rápido, unos +45 microsegundos/día) y relatividad especial (velocidad orbital → tictac más lento, unos −7 microsegundos/día). Los +38 microsegundos/día netos te desubicarían kilómetros en un día si se ignoraran: la relatividad como ingeniería cotidiana.",
    },
  },
  {
    id: "gr-mercury",
    category: "gr",
    question: {
      en: "Mercury's orbit slowly rotates (its perihelion precesses) by a tiny extra amount that Newton's gravity cannot explain. What does general relativity say about this?",
      es: "La órbita de Mercurio rota lentamente (su perihelio precesa) una cantidad extra minúscula que la gravedad de Newton no explica. ¿Qué dice la relatividad general?",
    },
    options: {
      en: [
        "Curved spacetime near the Sun adds exactly the observed extra precession — about 43 arcseconds per century",
        "It is caused by an undiscovered planet pulling on Mercury",
        "It is a measurement error that better telescopes eventually removed",
        "Relativity predicts no precession at all for Mercury",
      ],
      es: [
        "El espaciotiempo curvo cerca del Sol añade exactamente la precesión extra observada: unos 43 segundos de arco por siglo",
        "La causa es un planeta sin descubrir que tira de Mercurio",
        "Es un error de medición que los mejores telescopios acabaron eliminando",
        "La relatividad no predice ninguna precesión para Mercurio",
      ],
    },
    answer: 0,
    explanation: {
      en: "The 43 arcseconds-per-century anomaly had puzzled astronomers for decades (some even proposed a hidden planet, 'Vulcan'). Einstein computed Mercury's orbit with his new theory in 1915 and the extra precession fell out exactly — his first triumphant confirmation that spacetime curvature describes gravity better than Newton.",
      es: "La anomalía de 43 segundos de arco por siglo desconcertó a los astrónomos durante décadas (algunos propusieron incluso un planeta oculto, «Vulcano»). Einstein calculó la órbita de Mercurio con su nueva teoría en 1915 y la precesión extra surgió exactamente: su primera confirmación triunfal de que la curvatura del espaciotiempo describe la gravedad mejor que Newton.",
    },
  },
  {
    id: "gr-curvature-not-force",
    category: "gr",
    question: {
      en: "In general relativity, why does the Earth orbit the Sun?",
      es: "En relatividad general, ¿por qué la Tierra orbita el Sol?",
    },
    options: {
      en: [
        "It follows the straightest possible path (a geodesic) through spacetime curved by the Sun's mass",
        "The Sun's gravity pulls it inward while its motion flings it outward, balancing into an orbit",
        "Invisible gravitational waves push it around the Sun",
        "The curvature of space alone bends its trajectory into a circle",
      ],
      es: [
        "Sigue el camino más recto posible (una geodésica) a través del espaciotiempo curvado por la masa del Sol",
        "La gravedad del Sol tira de ella hacia dentro mientras su movimiento la lanza hacia fuera, equilibrándose en órbita",
        "Ondas gravitatorias invisibles la empujan alrededor del Sol",
        "Solo la curvatura del espacio dobla su trayectoria en un círculo",
      ],
    },
    answer: 0,
    explanation: {
      en: "General relativity replaces gravitational force with geometry: the Sun curves spacetime, and Earth simply moves 'straight ahead' along a geodesic in that curved geometry. It is the curvature of spacetime — space and time together — not of space alone, that produces orbits.",
      es: "La relatividad general sustituye la fuerza gravitatoria por geometría: el Sol curva el espaciotiempo y la Tierra simplemente avanza «en línea recta» por una geodésica de esa geometría curva. Es la curvatura del espaciotiempo —espacio y tiempo juntos—, no solo del espacio, lo que produce las órbitas.",
    },
  },

  // ── Black Holes (3) ─────────────────────────────────────────────────────
  {
    id: "bh-horizon",
    category: "blackholes",
    question: {
      en: "What is the event horizon of a black hole?",
      es: "¿Qué es el horizonte de sucesos de un agujero negro?",
    },
    options: {
      en: [
        "A boundary beyond which nothing can escape — not a solid surface",
        "The glowing surface of the collapsed star",
        "The edge of the accretion disk of hot gas",
        "A wall of infinite gravity that crushes everything touching it",
      ],
      es: [
        "Una frontera más allá de la cual nada puede escapar; no una superficie sólida",
        "La superficie brillante de la estrella colapsada",
        "El borde del disco de acreción de gas caliente",
        "Un muro de gravedad infinita que aplasta todo lo que lo toca",
      ],
    },
    answer: 0,
    explanation: {
      en: "The horizon is a point of no return defined by geometry, not a material shell — an infalling astronaut would feel nothing special crossing it. Its size, the Schwarzschild radius rs = 2GM/c², is simply where the escape velocity reaches the speed of light.",
      es: "El horizonte es un punto de no retorno definido por la geometría, no una cáscara material: un astronauta en caída libre no sentiría nada especial al cruzarlo. Su tamaño, el radio de Schwarzschild rs = 2GM/c², es simplemente donde la velocidad de escape alcanza la velocidad de la luz.",
    },
  },
  {
    id: "bh-frozen-star",
    category: "blackholes",
    question: {
      en: "A distant observer watches an astronaut fall toward a black hole. The astronaut's clock appears to slow and freeze at the horizon. What does the astronaut experience?",
      es: "Un observador lejano ve a un astronauta caer hacia un agujero negro. El reloj del astronauta parece ralentizarse y congelarse en el horizonte. ¿Qué experimenta el astronauta?",
    },
    options: {
      en: [
        "Nothing special at the horizon — they fall straight through in finite proper time",
        "They freeze in time forever exactly at the horizon",
        "They are incinerated by a wall of fire at the horizon",
        "Time runs backwards for them once they get close",
      ],
      es: [
        "Nada especial en el horizonte: lo atraviesa en un tiempo propio finito",
        "Se congela en el tiempo para siempre justo en el horizonte",
        "Es incinerado por un muro de fuego en el horizonte",
        "El tiempo retrocede para él una vez que se acerca",
      ],
    },
    answer: 0,
    explanation: {
      en: "The 'freezing' is an effect of the distant observer's coordinates: light from the infalling astronaut is ever more redshifted and delayed. In the astronaut's own proper time, the horizon is crossed uneventfully and the fall continues — the two descriptions disagree because simultaneity and time are observer-dependent.",
      es: "La «congelación» es un efecto de las coordenadas del observador lejano: la luz del astronauta en caída llega cada vez más corrida al rojo y retrasada. En el tiempo propio del astronauta, el horizonte se cruza sin incidentes y la caída continúa: ambas descripciones discrepan porque la simultaneidad y el tiempo dependen del observador.",
    },
  },
  {
    id: "bh-not-vacuum",
    category: "blackholes",
    question: {
      en: "A common image says black holes 'suck everything in like cosmic vacuum cleaners'. What is wrong with it?",
      es: "Una imagen común dice que los agujeros negros «absorben todo como aspiradoras cósmicas». ¿Qué tiene de erróneo?",
    },
    options: {
      en: [
        "Far away, a black hole's gravity is ordinary — stable orbits exist, and only crossing the horizon is fatal",
        "Nothing is wrong; black holes really do suck in everything around them",
        "Black holes only attract light, not matter",
        "Black holes repel matter and only trap light",
      ],
      es: [
        "Lejos, la gravedad de un agujero negro es ordinaria: existen órbitas estables y solo cruzar el horizonte es fatal",
        "Nada es erróneo; los agujeros negros realmente absorben todo lo que los rodea",
        "Los agujeros negros solo atraen la luz, no la materia",
        "Los agujeros negros repelen la materia y solo atrapan la luz",
      ],
    },
    answer: 0,
    explanation: {
      en: "If the Sun were replaced by a black hole of the same mass, Earth's orbit would not change at all. A black hole pulls exactly like any mass at a distance — the danger zone is only near the horizon. Many stars orbit the Milky Way's central black hole safely, just as planets orbit stars.",
      es: "Si el Sol se sustituyera por un agujero negro de la misma masa, la órbita de la Tierra no cambiaría en absoluto. Un agujero negro atrae exactamente igual que cualquier masa a distancia: la zona de peligro está solo cerca del horizonte. Muchas estrellas orbitan con seguridad el agujero negro central de la Vía Láctea, igual que los planetas orbitan estrellas.",
    },
  },
];
