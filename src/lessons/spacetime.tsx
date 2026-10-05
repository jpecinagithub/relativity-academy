import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "Time dilates, lengths contract, simultaneity shifts — yet beneath all this disagreement something stays perfectly still. That something is spacetime: a single four-dimensional geometry in which every observer's story is just a different view of the same landscape. This module teaches you to draw it.",
    es: "El tiempo se dilata, las longitudes se contraen, la simultaneidad cambia… pero bajo todo ese desacuerdo algo permanece perfectamente quieto. Ese algo es el espaciotiempo: una única geometría de cuatro dimensiones donde la historia de cada observador es solo una vista distinta del mismo paisaje. Este módulo te enseña a dibujarlo.",
  },
  sections: [
    {
      heading: {
        en: "Events: The Atoms of Reality",
        es: "Sucesos: los átomos de la realidad",
      },
      paragraphs: [
        {
          en: "Forget objects for a moment. Physics, at its most fundamental, is about **events**: a firecracker exploding at a street corner at noon; a photon striking a detector; your birth. Each event is a single point with four coordinates — three for where, one for when: (t, x, y, z).",
          es: "Olvida los objetos por un momento. La física, en su nivel más fundamental, trata de **sucesos**: un petardo que explota en una esquina al mediodía, un fotón que golpea un detector, tu nacimiento. Cada suceso es un punto con cuatro coordenadas: tres para el dónde y una para el cuándo: (t, x, y, z).",
        },
        {
          en: "Observers in different frames assign different coordinates to the same event — that is all of time dilation, length contraction, and relative simultaneity. But the events themselves, and the relationships between them, belong to everyone. That shared structure is spacetime.",
          es: "Observadores en distintos sistemas asignan coordenadas diferentes al mismo suceso: eso es toda la dilatación del tiempo, la contracción de la longitud y la simultaneidad relativa. Pero los sucesos mismos, y las relaciones entre ellos, pertenecen a todos. Esa estructura compartida es el espaciotiempo.",
        },
      ],
      keyIdea: {
        en: "Coordinates are observer-dependent labels; events are the shared reality they label. Spacetime is the collection of all events, with their relationships.",
        es: "Las coordenadas son etiquetas que dependen del observador; los sucesos son la realidad compartida que etiquetan. El espaciotiempo es la colección de todos los sucesos, con sus relaciones.",
      },
    },
    {
      heading: {
        en: "Worldlines: Your Life as a Curve",
        es: "Líneas de universo: tu vida como una curva",
      },
      paragraphs: [
        {
          en: "String all of an object's events together — every place it ever was, at every moment — and you get its **worldline**: a curve through spacetime. You are a worldline. Your birth is one endpoint (so far); your “now” is a point sliding along it.",
          es: "Encadena todos los sucesos de un objeto —cada lugar donde estuvo, en cada momento— y obtienes su **línea de universo**: una curva a través del espaciotiempo. Tú eres una línea de universo. Tu nacimiento es un extremo (por ahora); tu «ahora» es un punto que se desliza por ella.",
        },
        {
          en: "A **Minkowski diagram** draws this: time (usually ct, so both axes share units) runs vertically, space horizontally. A stationary object is a vertical line; a moving object tilts — the faster it moves, the more it leans. Light, the fastest possible traveller, traces lines at exactly 45°. Nothing can tilt further than that: it would mean outrunning light.",
          es: "Un **diagrama de Minkowski** lo dibuja: el tiempo (normalmente ct, para que ambos ejes compartan unidades) va en vertical y el espacio en horizontal. Un objeto en reposo es una línea vertical; un objeto en movimiento se inclina: cuanto más rápido, más se tumba. La luz, la viajera más rápida posible, traza líneas a exactamente 45°. Nada puede inclinarse más: significaría superar a la luz.",
        },
      ],
      keyIdea: {
        en: "On a spacetime diagram, motion is tilt. Your speed is literally the slope of your existence.",
        es: "En un diagrama del espaciotiempo, el movimiento es inclinación. Tu velocidad es literalmente la pendiente de tu existencia.",
      },
    },
    {
      heading: {
        en: "Light Cones and Causality",
        es: "Conos de luz y causalidad",
      },
      paragraphs: [
        {
          en: "Pick any event — say, you reading this sentence. Light emitted from that event spreads outward, drawing two cones in spacetime: the **future light cone** (everywhere the light can reach) and the **past light cone** (everywhere light could have come from to reach you).",
          es: "Elige cualquier suceso, por ejemplo tú leyendo esta frase. La luz emitida desde ese suceso se expande dibujando dos conos en el espaciotiempo: el **cono de luz futuro** (todos los lugares que la luz puede alcanzar) y el **cono de luz pasado** (todos los lugares de donde pudo venir luz hasta ti).",
        },
        {
          en: "These cones divide all other events into three kinds. **Timelike** separated events lie inside the cones: one can cause the other (you can travel between them without exceeding c). **Lightlike** events sit exactly on the cone: only light can connect them. **Spacelike** separated events lie outside: no signal, travelling at c or less, can ever connect them — so neither can cause the other.",
          es: "Estos conos dividen todos los demás sucesos en tres tipos. Los sucesos separados de forma **temporal** están dentro de los conos: uno puede causar al otro (puedes viajar entre ellos sin superar c). Los sucesos **lumínicos** están justo sobre el cono: solo la luz puede conectarlos. Los sucesos separados de forma **espacial** están fuera: ninguna señal a velocidad c o menor puede conectarlos jamás, así que ninguno puede causar al otro.",
        },
        {
          en: "This is causality made geometric. And here is the beautiful resolution of an old worry: observers may reorder spacelike-separated events, but those events could never influence each other anyway. Cause always precedes effect for every observer — relativity never lets you kill your own grandfather.",
          es: "Esto es la causalidad hecha geometría. Y aquí la hermosa resolución de una vieja preocupación: los observadores pueden reordenar sucesos separados espacialmente, pero esos sucesos jamás podrían influirse de todos modos. La causa siempre precede al efecto para todo observador: la relatividad nunca te deja matar a tu propio abuelo.",
        },
      ],
      keyIdea: {
        en: "Light cones are the universe's rulebook for cause and effect: inside, influence is possible; outside, it is forever impossible.",
        es: "Los conos de luz son el reglamento del universo para la causa y el efecto: dentro, la influencia es posible; fuera, es imposible para siempre.",
      },
    },
    {
      heading: {
        en: "The Interval Everyone Agrees On",
        es: "El intervalo en el que todos están de acuerdo",
      },
      paragraphs: [
        {
          en: "Observers quarrel about time separations (Δt) and space separations (Δx) between events. But combine them in one particular way — the **spacetime interval** — and every inertial observer computes exactly the same number. It is the absolute quantity hiding beneath the relative ones.",
          es: "Los observadores discuten sobre separaciones temporales (Δt) y espaciales (Δx) entre sucesos. Pero combínalas de una forma particular —el **intervalo del espaciotiempo**— y todo observador inercial calcula exactamente el mismo número. Es la magnitud absoluta escondida bajo las relativas.",
        },
        {
          en: "Notice the minus sign: time enters with the opposite sign to space. That single sign is what makes spacetime *not* just four-dimensional space — it creates light cones, enforces causality, and makes time genuinely different from space.",
          es: "Fíjate en el signo menos: el tiempo entra con signo opuesto al espacio. Ese único signo es lo que hace que el espaciotiempo *no* sea simplemente espacio de cuatro dimensiones: crea los conos de luz, impone la causalidad y hace al tiempo genuinamente distinto del espacio.",
        },
        {
          en: "The interval also classifies separations: negative means timelike (causal contact possible), zero means lightlike, positive means spacelike (no causal contact). One number tells you the causal relationship of any two events — as judged identically by everyone.",
          es: "El intervalo también clasifica las separaciones: negativo significa temporal (contacto causal posible), cero significa lumínico, positivo significa espacial (sin contacto causal). Un solo número te dice la relación causal de dos sucesos cualesquiera, juzgada igual por todos.",
        },
      ],
      equation: "\\Delta s^2 = -c^2\\Delta t^2 + \\Delta x^2 + \\Delta y^2 + \\Delta z^2",
      equationCaption: {
        en: "The spacetime interval: every inertial observer, using their own Δt and Δx, computes the same Δs². It is the invariant at the heart of relativity.",
        es: "El intervalo del espaciotiempo: todo observador inercial, con sus propios Δt y Δx, calcula el mismo Δs². Es el invariante en el corazón de la relatividad.",
      },
      keyIdea: {
        en: "Relativity's deepest lesson: observers disagree about space and time separately, but agree completely about spacetime.",
        es: "La lección más profunda de la relatividad: los observadores discrepan sobre el espacio y el tiempo por separado, pero están totalmente de acuerdo sobre el espaciotiempo.",
      },
    },
    {
      heading: {
        en: "Reading a Minkowski Diagram",
        es: "Cómo leer un diagrama de Minkowski",
      },
      paragraphs: [
        {
          en: "You now own the master tool. Vertical axis: ct (time). Horizontal: x (space). Your worldline goes up; light goes at 45°; everything slower is steeper. An event is a dot; a light cone is the pair of 45° lines through it.",
          es: "Ya posees la herramienta maestra. Eje vertical: ct (tiempo). Horizontal: x (espacio). Tu línea de universo sube; la luz va a 45°; todo lo más lento es más empinado. Un suceso es un punto; un cono de luz es el par de líneas a 45° que pasan por él.",
        },
        {
          en: "Change to a moving observer's frame and something wonderful happens: their time axis (ct′) tilts toward the light cone by the same amount their space axis (x′) does — the axes “scissor” symmetrically around the 45° light lines, which never move. Time dilation, length contraction, and simultaneity shifts are all visible as pure geometry: different slicings of the same diagram.",
          es: "Cambia al sistema de un observador en movimiento y ocurre algo maravilloso: su eje temporal (ct′) se inclina hacia el cono de luz lo mismo que su eje espacial (x′): los ejes se cierran como tijeras simétricamente alrededor de las líneas de luz a 45°, que nunca se mueven. La dilatación del tiempo, la contracción de la longitud y los cambios de simultaneidad se ven como pura geometría: distintos cortes del mismo diagrama.",
        },
        {
          en: "Open the Minkowski Lab and drag the velocity slider: watch the primed axes scissor, the simultaneity lines tilt, and the invariant light cone stand unmoved. You are no longer calculating relativity — you are *seeing* it.",
          es: "Abre el laboratorio de Minkowski y arrastra el deslizador de velocidad: mira cómo los ejes primados se cierran como tijeras, las líneas de simultaneidad se inclinan y el cono de luz invariante permanece inmóvil. Ya no estás calculando la relatividad: la estás *viendo*.",
        },
      ],
      keyIdea: {
        en: "A change of reference frame is a symmetric scissoring of the axes around the light lines. The light cone never moves — it is the fixed skeleton of spacetime.",
        es: "Un cambio de sistema de referencia es un cierre simétrico de los ejes, como tijeras, alrededor de las líneas de luz. El cono de luz nunca se mueve: es el esqueleto fijo del espaciotiempo.",
      },
      mathExtra: "c^2\\Delta\\tau^2 = -\\Delta s^2 \\quad \\text{(timelike)}",
      mathExtraCaption: {
        en: "For timelike separations, the interval measures proper time: the time read by a clock travelling directly between the events. All observers agree on it.",
        es: "Para separaciones temporales, el intervalo mide el tiempo propio: el tiempo que marca un reloj que viaja directamente entre los sucesos. Todos los observadores están de acuerdo en él.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Spacetime is just space plus time glued together.",
        es: "El espaciotiempo es solo espacio más tiempo pegados.",
      },
      reality: {
        en: "It is a unified geometry with its own invariant — the interval — that neither space nor time possesses alone. The minus sign in front of time gives it causal structure (light cones) that mere “glue” could never produce.",
        es: "Es una geometría unificada con su propio invariante —el intervalo— que ni el espacio ni el tiempo poseen por separado. El signo menos delante del tiempo le da una estructura causal (conos de luz) que un mero «pegamento» jamás produciría.",
      },
    },
    {
      myth: {
        en: "Time is exactly the fourth dimension of space — just another direction.",
        es: "El tiempo es exactamente la cuarta dimensión del espacio: solo otra dirección.",
      },
      reality: {
        en: "The minus sign in the interval makes time fundamentally different: you can turn around in space, but the geometry forbids rotating your worldline past the light cone into someone's past. That asymmetry is why causality exists.",
        es: "El signo menos en el intervalo hace al tiempo fundamentalmente distinto: puedes darte la vuelta en el espacio, pero la geometría prohíbe girar tu línea de universo más allá del cono de luz hacia el pasado de alguien. Esa asimetría es la razón de que exista la causalidad.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What is a worldline?",
        es: "¿Qué es una línea de universo?",
      },
      options: [
        {
          en: "The path of an object through spacetime — all its events chained together",
          es: "La trayectoria de un objeto a través del espaciotiempo: todos sus sucesos encadenados",
        },
        {
          en: "The orbit of a planet around a star",
          es: "La órbita de un planeta alrededor de una estrella",
        },
        {
          en: "A line connecting two simultaneous events",
          es: "Una línea que conecta dos sucesos simultáneos",
        },
        {
          en: "The edge of a light cone",
          es: "El borde de un cono de luz",
        },
      ],
      answer: 0,
      why: {
        en: "A worldline strings together every event of an object's history into one curve through spacetime — you are a worldline, sliding along it right now.",
        es: "Una línea de universo encadena cada suceso de la historia de un objeto en una sola curva a través del espaciotiempo: tú eres una línea de universo, deslizándote por ella ahora mismo.",
      },
    },
    {
      q: {
        en: "Two events are spacelike separated. Can one cause the other?",
        es: "Dos sucesos están separados espacialmente. ¿Puede uno causar al otro?",
      },
      options: [
        {
          en: "Yes, if the signal is fast enough",
          es: "Sí, si la señal es lo bastante rápida",
        },
        {
          en: "No — no signal at c or below can connect them",
          es: "No: ninguna señal a velocidad c o menor puede conectarlos",
        },
        {
          en: "Yes, but only for some observers",
          es: "Sí, pero solo para algunos observadores",
        },
        {
          en: "Only if they are also simultaneous",
          es: "Solo si además son simultáneos",
        },
      ],
      answer: 1,
      why: {
        en: "Spacelike separation means the events lie outside each other's light cones. Since nothing outruns light, no causal influence is possible — for any observer.",
        es: "La separación espacial significa que los sucesos están fuera de sus conos de luz mutuos. Como nada supera a la luz, ninguna influencia causal es posible, para ningún observador.",
      },
    },
    {
      q: {
        en: "Why is the spacetime interval Δs² so important?",
        es: "¿Por qué es tan importante el intervalo del espaciotiempo Δs²?",
      },
      options: [
        {
          en: "It measures distances in ordinary space",
          es: "Mide distancias en el espacio ordinario",
        },
        {
          en: "All inertial observers compute the same value from their own measurements",
          es: "Todos los observadores inerciales calculan el mismo valor a partir de sus propias medidas",
        },
        {
          en: "It is always equal to zero",
          es: "Siempre es igual a cero",
        },
        {
          en: "It proves time travel is possible",
          es: "Demuestra que el viaje en el tiempo es posible",
        },
      ],
      answer: 1,
      why: {
        en: "Observers disagree on Δt and Δx, but the combination −c²Δt² + Δx² (+ …) comes out identical for everyone. It is relativity's core invariant.",
        es: "Los observadores discrepan en Δt y Δx, pero la combinación −c²Δt² + Δx² (+ …) resulta idéntica para todos. Es el invariante central de la relatividad.",
      },
    },
    {
      q: {
        en: "On a Minkowski diagram (ct vertical, x horizontal), what does a photon's worldline look like?",
        es: "En un diagrama de Minkowski (ct en vertical, x en horizontal), ¿cómo es la línea de universo de un fotón?",
      },
      options: [
        { en: "A vertical line", es: "Una línea vertical" },
        { en: "A horizontal line", es: "Una línea horizontal" },
        { en: "A line at exactly 45°", es: "Una línea a exactamente 45°" },
        { en: "A circle", es: "Un círculo" },
      ],
      answer: 2,
      why: {
        en: "With ct on the vertical axis, light — covering one unit of space per unit of time — always traces 45° lines. Steeper lines are slower objects; nothing is shallower.",
        es: "Con ct en el eje vertical, la luz —que recorre una unidad de espacio por unidad de tiempo— traza siempre líneas a 45°. Las líneas más empinadas son objetos más lentos; nada es más tendido.",
      },
    },
    {
      q: {
        en: "With the sign convention Δs² = −c²Δt² + Δx², a negative interval between two events means…",
        es: "Con la convención de signos Δs² = −c²Δt² + Δx², un intervalo negativo entre dos sucesos significa…",
      },
      options: [
        {
          en: "The events are timelike separated: causal contact is possible",
          es: "Los sucesos están separados temporalmente: el contacto causal es posible",
        },
        {
          en: "The events are spacelike separated: no causal contact possible",
          es: "Los sucesos están separados espacialmente: ningún contacto causal es posible",
        },
        {
          en: "The measurement was wrong",
          es: "La medida fue errónea",
        },
        {
          en: "The events happened at the same place",
          es: "Los sucesos ocurrieron en el mismo lugar",
        },
      ],
      answer: 0,
      why: {
        en: "Negative Δs² (in this convention) means the time part dominates: the events lie inside each other's light cones, so one could influence the other.",
        es: "Un Δs² negativo (en esta convención) significa que domina la parte temporal: los sucesos están dentro de sus conos de luz mutuos, así que uno podría influir en el otro.",
      },
    },
  ],
};
