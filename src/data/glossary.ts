export interface GlossaryTerm {
  id: string;
  term: { en: string; es: string };
  definition: { en: string; es: string };
  related: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "reference-frame",
    term: { en: "Reference frame", es: "Sistema de referencia" },
    definition: {
      en: "A reference frame is a point of view — a coordinate system tied to some observer — from which positions and times are measured. Describing motion always means describing it relative to a frame: a passenger sits still in the train's frame but moves at 200 km/h in the ground's frame. Much of relativity is about translating measurements between frames in a consistent way.",
      es: "Un sistema de referencia es un punto de vista —un sistema de coordenadas ligado a algún observador— desde el que se miden posiciones y tiempos. Describir un movimiento siempre significa describirlo respecto a un sistema: un pasajero está quieto en el sistema del tren pero se mueve a 200 km/h en el del suelo. Gran parte de la relatividad consiste en traducir mediciones entre sistemas de forma coherente.",
    },
    related: ["inertial-observer", "event", "simultaneity"],
  },
  {
    id: "inertial-observer",
    term: { en: "Inertial observer", es: "Observador inercial" },
    definition: {
      en: "An inertial observer is one moving at constant velocity — not accelerating, not rotating. In an inertial frame, a free object with no forces on it travels in a straight line at constant speed, which is Newton's first law. Einstein's first postulate of special relativity states that the laws of physics are identical for all inertial observers, so no experiment can reveal who is 'truly' at rest.",
      es: "Un observador inercial es aquel que se mueve con velocidad constante: sin acelerar ni rotar. En un sistema inercial, un objeto libre sin fuerzas se mueve en línea recta a velocidad constante, que es la primera ley de Newton. El primer postulado de Einstein afirma que las leyes de la física son idénticas para todos los observadores inerciales, de modo que ningún experimento puede revelar quién está «verdaderamente» en reposo.",
    },
    related: ["reference-frame", "equivalence-principle", "simultaneity"],
  },
  {
    id: "lorentz-factor",
    term: { en: "Lorentz factor", es: "Factor de Lorentz" },
    definition: {
      en: "The Lorentz factor, written γ (gamma), measures how strong relativistic effects are at a given speed: γ = 1/√(1−v²/c²). At everyday speeds it is essentially 1, so nothing seems unusual; at 0.9c it is about 2.29, and it grows without limit as v approaches c. Time dilation, length contraction and relativistic energy all scale with γ.",
      es: "El factor de Lorentz, denotado γ (gamma), mide la intensidad de los efectos relativistas a una velocidad dada: γ = 1/√(1−v²/c²). A velocidades cotidianas es prácticamente 1, por lo que nada parece extraño; a 0,9c vale unos 2,29 y crece sin límite cuando v se acerca a c. La dilatación del tiempo, la contracción de la longitud y la energía relativista escalan todas con γ.",
    },
    related: ["time-dilation", "length-contraction", "rest-energy"],
  },
  {
    id: "proper-time",
    term: { en: "Proper time", es: "Tiempo propio" },
    definition: {
      en: "Proper time is the time measured by a clock that travels along with the object or observer being described — the time someone actually experiences on their own wristwatch. It is the most 'personal' time there is: everyone carries their own. Different paths through spacetime between the same two events can accumulate different amounts of proper time, which is the heart of the twin paradox.",
      es: "El tiempo propio es el tiempo que mide un reloj que viaja junto con el objeto o el observador descrito: el tiempo que alguien experimenta realmente en su propio reloj de pulsera. Es el tiempo más «personal» que existe: cada uno lleva el suyo. Distintos caminos por el espaciotiempo entre los mismos dos eventos pueden acumular cantidades diferentes de tiempo propio, y esa es la esencia de la paradoja de los gemelos.",
    },
    related: ["coordinate-time", "time-dilation", "worldline"],
  },
  {
    id: "coordinate-time",
    term: { en: "Coordinate time", es: "Tiempo coordenado" },
    definition: {
      en: "Coordinate time is the time read from the clocks of a particular reference frame — a network of synchronized clocks at rest in that frame. Unlike proper time, it depends on whose frame you choose: two frames in relative motion assign different coordinate times to the same event. Time dilation relates a clock's proper time to the coordinate time measured in a frame where the clock moves.",
      es: "El tiempo coordenado es el tiempo que leen los relojes de un sistema de referencia concreto: una red de relojes sincronizados en reposo en ese sistema. A diferencia del tiempo propio, depende del sistema elegido: dos sistemas en movimiento relativo asignan tiempos coordenados distintos al mismo evento. La dilatación del tiempo relaciona el tiempo propio de un reloj con el tiempo coordenado medido en un sistema donde el reloj se mueve.",
    },
    related: ["proper-time", "time-dilation", "simultaneity"],
  },
  {
    id: "worldline",
    term: { en: "Worldline", es: "Línea de universo" },
    definition: {
      en: "A worldline is the path of an object traced through spacetime — its entire history drawn as a curve on a spacetime diagram. A stationary object has a vertical worldline (moving only through time); a moving object tilts; a light ray always travels at 45° (when time is measured in the same units as distance, ct). Reading worldlines is reading the story of what happened, where, and when.",
      es: "Una línea de universo es la trayectoria de un objeto trazada a través del espaciotiempo: toda su historia dibujada como una curva en un diagrama de espaciotiempo. Un objeto en reposo tiene una línea vertical (solo avanza en el tiempo); uno en movimiento se inclina; un rayo de luz viaja siempre a 45° (cuando el tiempo se mide en las mismas unidades que la distancia, ct). Leer líneas de universo es leer la historia de qué ocurrió, dónde y cuándo.",
    },
    related: ["spacetime", "event", "light-cone", "geodesic"],
  },
  {
    id: "light-cone",
    term: { en: "Light cone", es: "Cono de luz" },
    definition: {
      en: "The light cone of an event is the set of all paths that light could take outward from (or inward toward) that event — two cones touching at their tips, one opening into the future and one into the past. Everything inside the future cone can be influenced by the event; everything inside the past cone could have influenced it; events outside can never be causally connected to it. The light cone is the geometry of cause and effect.",
      es: "El cono de luz de un evento es el conjunto de todos los caminos que la luz podría seguir desde (o hacia) ese evento: dos conos que se tocan por la punta, uno abierto hacia el futuro y otro hacia el pasado. Todo lo que está dentro del cono futuro puede ser influido por el evento; todo lo que está dentro del pasado pudo haberlo influido; los eventos de fuera nunca pueden estar conectados causalmente con él. El cono de luz es la geometría de la causa y el efecto.",
    },
    related: ["event", "spacetime-interval", "worldline", "spacetime"],
  },
  {
    id: "event",
    term: { en: "Event", es: "Evento" },
    definition: {
      en: "In relativity, an event is a single point in spacetime: something happening at one specific place and one specific instant, like 'the lightning struck the front of the train at noon'. Events are the atoms of spacetime — worldlines are made of them, and observers in different frames may disagree about their order or simultaneity, but everyone agrees on which events occurred.",
      es: "En relatividad, un evento es un punto del espaciotiempo: algo que ocurre en un lugar y un instante concretos, como «el rayo cayó en la parte delantera del tren al mediodía». Los eventos son los átomos del espaciotiempo: las líneas de universo están hechas de ellos, y aunque los observadores de distintos sistemas pueden discrepar sobre su orden o su simultaneidad, todos coinciden en qué eventos ocurrieron.",
    },
    related: ["spacetime", "worldline", "spacetime-interval", "simultaneity"],
  },
  {
    id: "spacetime-interval",
    term: { en: "Spacetime interval", es: "Intervalo de espaciotiempo" },
    definition: {
      en: "The spacetime interval is a combined measure of separation between two events that all observers agree on, even though they disagree about the spatial distance and the time difference separately. In flat spacetime it is s² = (cΔt)² − (Δx)² (in one space dimension). Its sign classifies the separation: positive means timelike (causally connectable), zero means lightlike, negative means spacelike (no causal link possible).",
      es: "El intervalo de espaciotiempo es una medida combinada de la separación entre dos eventos sobre la que todos los observadores coinciden, aunque discrepen sobre la distancia espacial y la diferencia temporal por separado. En espaciotiempo plano es s² = (cΔt)² − (Δx)² (en una dimensión espacial). Su signo clasifica la separación: positivo significa temporal (conectable causalmente), cero significa luminoso, negativo significa espacial (sin vínculo causal posible).",
    },
    related: ["spacetime", "event", "light-cone", "metric"],
  },
  {
    id: "geodesic",
    term: { en: "Geodesic", es: "Geodésica" },
    definition: {
      en: "A geodesic is the straightest possible path through a curved spacetime — the trajectory followed by any freely falling object. Planets orbit the Sun not because a force pulls them, but because they follow geodesics in the spacetime curved by the Sun's mass. In flat spacetime, geodesics are just straight lines at constant velocity.",
      es: "Una geodésica es el camino más recto posible a través de un espaciotiempo curvo: la trayectoria que sigue cualquier objeto en caída libre. Los planetas orbitan el Sol no porque una fuerza los atraiga, sino porque siguen geodésicas en el espaciotiempo curvado por la masa del Sol. En espaciotiempo plano, las geodésicas son simplemente líneas rectas a velocidad constante.",
    },
    related: ["curvature", "spacetime", "worldline", "metric"],
  },
  {
    id: "metric",
    term: { en: "Metric", es: "Métrica" },
    definition: {
      en: "The metric is the mathematical object that defines distances and times in spacetime — the rulebook that turns coordinates into measurable separations. In special relativity the metric is the flat Minkowski metric; in general relativity it varies from place to place, encoding curvature, and it is what Einstein's field equations solve for. You do not need tensor calculus to grasp the idea: the metric tells geometry how to behave.",
      es: "La métrica es el objeto matemático que define distancias y tiempos en el espaciotiempo: el reglamento que convierte coordenadas en separaciones medibles. En relatividad especial la métrica es la métrica plana de Minkowski; en relatividad general varía de un lugar a otro, codificando la curvatura, y es lo que resuelven las ecuaciones de campo de Einstein. No hace falta cálculo tensorial para captar la idea: la métrica dice a la geometría cómo comportarse.",
    },
    related: ["spacetime-interval", "curvature", "tensor", "geodesic"],
  },
  {
    id: "spacetime",
    term: { en: "Spacetime", es: "Espaciotiempo" },
    definition: {
      en: "Spacetime is the unified four-dimensional arena — three dimensions of space plus one of time — in which all events occur. Special relativity showed that space and time are not independent backdrops but interwoven aspects of a single fabric, and general relativity showed that this fabric can curve. Thinking in terms of spacetime, rather than space plus time, is the single biggest conceptual shift relativity asks of you.",
      es: "El espaciotiempo es el escenario unificado de cuatro dimensiones —tres de espacio más una de tiempo— en el que ocurren todos los eventos. La relatividad especial mostró que el espacio y el tiempo no son telones de fondo independientes, sino aspectos entrelazados de un único tejido, y la relatividad general mostró que ese tejido puede curvarse. Pensar en términos de espaciotiempo, en lugar de espacio más tiempo, es el mayor cambio conceptual que pide la relatividad.",
    },
    related: ["event", "worldline", "metric", "curvature"],
  },
  {
    id: "event-horizon",
    term: { en: "Event horizon", es: "Horizonte de sucesos" },
    definition: {
      en: "The event horizon is the boundary around a black hole beyond which nothing — not even light — can escape to the outside universe. It is not a physical surface you could touch; locally, a falling observer notices nothing special when crossing it. Once inside, all paths lead toward the center, which is why the horizon marks a point of no return for distant observers.",
      es: "El horizonte de sucesos es la frontera alrededor de un agujero negro más allá de la cual nada —ni siquiera la luz— puede escapar al universo exterior. No es una superficie física que se pueda tocar; localmente, un observador en caída libre no nota nada especial al cruzarlo. Una vez dentro, todos los caminos conducen hacia el centro, por eso el horizonte marca un punto de no retorno para los observadores lejanos.",
    },
    related: ["schwarzschild-radius", "curvature", "gravitational-redshift"],
  },
  {
    id: "schwarzschild-radius",
    term: { en: "Schwarzschild radius", es: "Radio de Schwarzschild" },
    definition: {
      en: "The Schwarzschild radius is the radius of the event horizon of a non-rotating black hole, given by rs = 2GM/c². It grows in direct proportion to mass: about 3 km for the Sun's mass, about 9 mm for Earth's mass. If any mass is compressed inside its Schwarzschild radius, general relativity predicts it becomes a black hole.",
      es: "El radio de Schwarzschild es el radio del horizonte de sucesos de un agujero negro sin rotación, dado por rs = 2GM/c². Crece en proporción directa a la masa: unos 3 km para la masa del Sol, unos 9 mm para la masa de la Tierra. Si una masa se comprime dentro de su radio de Schwarzschild, la relatividad general predice que se convierte en un agujero negro.",
    },
    related: ["event-horizon", "curvature", "rest-energy"],
  },
  {
    id: "gravitational-redshift",
    term: { en: "Gravitational redshift", es: "Corrimiento al rojo gravitatorio" },
    definition: {
      en: "Gravitational redshift is the loss of energy — the stretching to longer, redder wavelengths — suffered by light climbing out of a gravitational field. It is a direct consequence of gravitational time dilation: a clock deeper in a gravitational field ticks slower, so the light it emits arrives with a lower frequency. The effect is tiny on Earth but extreme near a black hole's horizon, where escaping light is redshifted almost to nothing.",
      es: "El corrimiento al rojo gravitatorio es la pérdida de energía —el estiramiento hacia longitudes de onda más largas y rojas— que sufre la luz al escapar de un campo gravitatorio. Es consecuencia directa de la dilatación gravitatoria del tiempo: un reloj más profundo en un campo gravitatorio avanza más lento, así que la luz que emite llega con menor frecuencia. El efecto es minúsculo en la Tierra, pero extremo cerca del horizonte de un agujero negro, donde la luz que escapa se corre al rojo casi hasta desaparecer.",
    },
    related: ["event-horizon", "time-dilation", "curvature"],
  },
  {
    id: "equivalence-principle",
    term: { en: "Equivalence principle", es: "Principio de equivalencia" },
    definition: {
      en: "The equivalence principle states that the effects of gravity are locally indistinguishable from the effects of acceleration. Einstein's famous image: an observer sealed inside an elevator cannot tell whether the elevator is resting on Earth or accelerating through empty space at 9.8 m/s². This insight — which Einstein called his 'happiest thought' — was the seed from which general relativity grew.",
      es: "El principio de equivalencia afirma que los efectos de la gravedad son localmente indistinguibles de los efectos de la aceleración. La imagen famosa de Einstein: un observador encerrado en un ascensor no puede saber si el ascensor reposa sobre la Tierra o acelera por el espacio vacío a 9,8 m/s². Esta idea —que Einstein llamó su «pensamiento más feliz»— fue la semilla de la que creció la relatividad general.",
    },
    related: ["inertial-observer", "curvature", "geodesic"],
  },
  {
    id: "tensor",
    term: { en: "Tensor", es: "Tensor" },
    definition: {
      en: "A tensor is a mathematical object that generalizes scalars (single numbers) and vectors (arrows with direction): it packages several numbers together in a way that stays consistent when you change coordinates. General relativity is written in tensors — the metric and Einstein's curvature tensor are examples — precisely so that the laws look the same in every reference frame. For this course, it is enough to know that tensors are the language in which 'the same physics for everyone' is expressed.",
      es: "Un tensor es un objeto matemático que generaliza los escalares (números sueltos) y los vectores (flechas con dirección): empaqueta varios números de forma que sigue siendo coherente al cambiar de coordenadas. La relatividad general se escribe con tensores —la métrica y el tensor de curvatura de Einstein son ejemplos— precisamente para que las leyes tengan la misma forma en todos los sistemas de referencia. Para este curso basta saber que los tensores son el lenguaje en el que se expresa «la misma física para todos».",
    },
    related: ["metric", "curvature", "spacetime"],
  },
  {
    id: "curvature",
    term: { en: "Curvature", es: "Curvatura" },
    definition: {
      en: "Curvature, in general relativity, is the bending of spacetime itself caused by mass and energy. Where spacetime is curved, the straightest paths (geodesics) bend too, and we perceive that bending as gravity: the famous summary is 'matter tells spacetime how to curve; curved spacetime tells matter how to move'. Curvature is not a metaphor here — it is measurable, for instance in the precession of Mercury's orbit and the bending of starlight.",
      es: "La curvatura, en relatividad general, es el doblamiento del propio espaciotiempo causado por la masa y la energía. Donde el espaciotiempo está curvo, los caminos más rectos (las geodésicas) también se doblan, y percibimos ese doblamiento como gravedad: el resumen famoso es «la materia dice al espaciotiempo cómo curvarse; el espaciotiempo curvo dice a la materia cómo moverse». La curvatura no es aquí una metáfora: es medible, por ejemplo en la precesión de la órbita de Mercurio y en la desviación de la luz de las estrellas.",
    },
    related: ["geodesic", "metric", "tensor", "event-horizon"],
  },
  {
    id: "time-dilation",
    term: { en: "Time dilation", es: "Dilatación del tiempo" },
    definition: {
      en: "Time dilation is the slowing of a clock as seen from a frame in which the clock moves: a moving clock ticks slower by the Lorentz factor, Δt = γ·Δτ, where Δτ is the proper time. It is symmetric — each of two inertial observers sees the other's clock running slow — because each judges the other to be moving. It is also real and measured: muons from cosmic rays survive to Earth's surface only because their internal 'clocks' run slow at near-light speeds.",
      es: "La dilatación del tiempo es el enlentecimiento de un reloj visto desde un sistema en el que el reloj se mueve: un reloj en movimiento avanza más lento según el factor de Lorentz, Δt = γ·Δτ, donde Δτ es el tiempo propio. Es simétrica —cada uno de dos observadores inerciales ve el reloj del otro avanzar lento— porque cada uno juzga que es el otro quien se mueve. También es real y medida: los muones de los rayos cósmicos solo llegan a la superficie terrestre porque sus «relojes» internos avanzan lento a velocidades cercanas a la de la luz.",
    },
    related: ["lorentz-factor", "proper-time", "coordinate-time", "length-contraction"],
  },
  {
    id: "length-contraction",
    term: { en: "Length contraction", es: "Contracción de la longitud" },
    definition: {
      en: "Length contraction is the shortening of an object along its direction of motion, as measured in a frame where the object moves: L = L₀/γ, where L₀ is the rest length. Like time dilation it is a consequence of how different frames slice spacetime into 'space' and 'time', not a physical squeezing of the object. A spacecraft flying past Earth at 0.99c would be measured from Earth as only about 14% of its rest length.",
      es: "La contracción de la longitud es el acortamiento de un objeto en su dirección de movimiento, medido en un sistema donde el objeto se mueve: L = L₀/γ, donde L₀ es la longitud en reposo. Como la dilatación del tiempo, es consecuencia de cómo los distintos sistemas dividen el espaciotiempo en «espacio» y «tiempo», no un aplastamiento físico del objeto. Una nave que pasara junto a la Tierra a 0,99c se mediría desde la Tierra con solo un 14 % de su longitud en reposo.",
    },
    related: ["lorentz-factor", "time-dilation", "simultaneity", "reference-frame"],
  },
  {
    id: "simultaneity",
    term: { en: "Simultaneity", es: "Simultaneidad" },
    definition: {
      en: "Simultaneity is the question of whether two distant events happen 'at the same time' — and relativity's answer is that it depends on the observer's frame. Einstein's train thought experiment shows two lightning strikes simultaneous for a platform observer but not for a passenger on the moving train. There is no universal 'now' stretching across the universe; each frame has its own way of slicing spacetime into moments.",
      es: "La simultaneidad es la pregunta de si dos eventos distantes ocurren «al mismo tiempo», y la respuesta de la relatividad es que depende del sistema del observador. El experimento mental del tren de Einstein muestra dos rayos simultáneos para un observador en el andén pero no para un pasajero del tren en movimiento. No existe un «ahora» universal que abarque el universo; cada sistema tiene su propia forma de dividir el espaciotiempo en instantes.",
    },
    related: ["reference-frame", "event", "spacetime-interval", "inertial-observer"],
  },
  {
    id: "rest-energy",
    term: { en: "Rest energy", es: "Energía en reposo" },
    definition: {
      en: "Rest energy is the energy a mass possesses simply by existing, even when perfectly still: E₀ = mc². It is what the famous equation really says — mass is a concentrated form of energy, which is why a tiny amount of matter can release enormous energy in nuclear reactions. The full relativistic energy of a moving object is larger: E² = (pc)² + (mc²)², where the extra part is kinetic.",
      es: "La energía en reposo es la energía que una masa posee por el mero hecho de existir, aun estando perfectamente quieta: E₀ = mc². Eso es lo que realmente dice la famosa ecuación: la masa es una forma concentrada de energía, por eso una cantidad minúscula de materia puede liberar una energía enorme en reacciones nucleares. La energía relativista total de un objeto en movimiento es mayor: E² = (pc)² + (mc²)², donde la parte extra es cinética.",
    },
    related: ["lorentz-factor", "schwarzschild-radius", "time-dilation"],
  },
];
