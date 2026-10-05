import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "Mass is frozen energy — and setting it in motion costs more than Newton imagined. This module goes beyond the famous E = mc² to the full relationship between energy, momentum and mass, and shows why no spaceship, however powerful, can ever push matter to the speed of light.",
    es: "La masa es energía congelada, y ponerla en movimiento cuesta más de lo que Newton imaginó. Este módulo va más allá del famoso E = mc² hasta la relación completa entre energía, momento y masa, y muestra por qué ninguna nave, por potente que sea, puede impulsar la materia hasta la velocidad de la luz.",
  },
  sections: [
    {
      heading: {
        en: "A famous equation, half-remembered",
        es: "Una ecuación famosa, a medio recordar",
      },
      paragraphs: [
        {
          en: "Almost everyone has seen E = mc², but few meet it on its own terms. The equation does not say that mass 'turns into' energy only in exotic explosions. It says something deeper: **mass is a form of energy**, present even when nothing moves.",
          es: "Casi todo el mundo ha visto E = mc², pero pocos la conocen en sus propios términos. La ecuación no dice que la masa 'se convierta' en energía solo en explosiones exóticas. Dice algo más profundo: **la masa es una forma de energía**, presente incluso cuando nada se mueve.",
        },
        {
          en: "The 'm' here is the object's **rest mass** — the mass measured when the object sits still — and E is its **rest energy**, the energy it carries simply by existing. A single gram of matter holds about 9 × 10¹³ joules: roughly the energy of a small nuclear weapon. The catch is that this energy is locked away; releasing it requires transforming mass itself, which is why it took nuclear reactions and particle annihilations to make it obvious.",
          es: "La 'm' es la **masa en reposo** del objeto —la masa medida cuando el objeto está quieto— y E es su **energía en reposo**, la energía que posee por el simple hecho de existir. Un solo gramo de materia contiene unos 9 × 10¹³ julios: más o menos la energía de una pequeña arma nuclear. El problema es que esta energía está encerrada; liberarla exige transformar la propia masa, y por eso hicieron falta reacciones nucleares y aniquilaciones de partículas para que resultara evidente.",
        },
        {
          en: "Try it in the particle accelerator lab: add energy to a particle and watch how its mass stays fixed while its total energy climbs.",
          es: "Pruébalo en el laboratorio del acelerador: añade energía a una partícula y observa cómo su masa permanece fija mientras su energía total aumenta.",
        },
      ],
      keyIdea: {
        en: "E = mc² is not the whole story — it is the energy of an object at rest. Mass is energy that happens to be standing still.",
        es: "E = mc² no es toda la historia: es la energía de un objeto en reposo. La masa es energía que, por casualidad, está quieta.",
      },
      equation: "E = mc^2",
      equationCaption: {
        en: "Rest energy: the energy an object carries simply by having mass.",
        es: "Energía en reposo: la energía que un objeto posee por el simple hecho de tener masa.",
      },
    },
    {
      heading: {
        en: "What happens when it moves?",
        es: "¿Qué ocurre cuando se mueve?",
      },
      paragraphs: [
        {
          en: "Set the object in motion and its total energy grows. Newton would say the extra energy is just kinetic energy, ½mv², added on top. Relativity disagrees: the full energy blends motion and rest mass into a single quantity, and the blend is governed by the same Lorentz factor γ you met in the light clock.",
          es: "Pon el objeto en movimiento y su energía total crece. Newton diría que la energía extra es solo energía cinética, ½mv², sumada encima. La relatividad no está de acuerdo: la energía total combina movimiento y masa en reposo en una sola cantidad, y la mezcla la gobierna el mismo factor de Lorentz γ que conociste en el reloj de luz.",
        },
        {
          en: "The total energy of a moving object is **E = γmc²**. At everyday speeds γ is essentially 1, so the formula quietly reduces to rest energy plus Newtonian kinetic energy — which is why nobody noticed the difference for two centuries. But push toward c and γ explodes, and with it the energy.",
          es: "La energía total de un objeto en movimiento es **E = γmc²**. A velocidades cotidianas γ es prácticamente 1, así que la fórmula se reduce en silencio a la energía en reposo más la energía cinética newtoniana; por eso nadie notó la diferencia durante dos siglos. Pero al acercarse a c, γ se dispara, y con él la energía.",
        },
        {
          en: "Momentum changes too. The relativistic momentum is **p = γmv**, which means that near light speed, doubling your momentum barely changes your velocity — the extra push goes into γ instead. Open the accelerator simulator and feel this directly: each extra gigavolt buys less and less speed.",
          es: "El momento también cambia. El momento relativista es **p = γmv**, lo que significa que cerca de la velocidad de la luz, duplicar el momento apenas cambia la velocidad: el impulso extra se va a γ. Abre el simulador del acelerador y compruébalo: cada gigavoltio adicional compra cada vez menos velocidad.",
        },
      ],
      equation: "E = \\gamma mc^2 \\qquad p = \\gamma mv",
      equationCaption: {
        en: "Total energy and momentum of a moving object. As v → c, γ → ∞.",
        es: "Energía total y momento de un objeto en movimiento. Cuando v → c, γ → ∞.",
      },
      mathExtra: "E^2 = (pc)^2 + (mc^2)^2",
      mathExtraCaption: {
        en: "The complete energy–momentum relation. Setting p = 0 recovers E = mc²; setting m = 0 gives E = pc — the energy of light itself.",
        es: "La relación completa entre energía y momento. Con p = 0 se recupera E = mc²; con m = 0 se obtiene E = pc: la energía de la propia luz.",
      },
    },
    {
      heading: {
        en: "Why c is unreachable",
        es: "Por qué c es inalcanzable",
      },
      paragraphs: [
        {
          en: "Here is the decisive experiment, performed daily at CERN. Electrons in a particle accelerator are pushed with electric fields carrying thousands of times their rest energy. Their speed creeps from 0.99c to 0.999c to 0.99999999c — and never arrives. Every joule goes into γ, into momentum, into energy — but the velocity flattens toward c like a curve approaching a line it never touches.",
          es: "Aquí está el experimento decisivo, realizado a diario en el CERN. Los electrones de un acelerador reciben campos eléctricos con miles de veces su energía en reposo. Su velocidad avanza de 0,99c a 0,999c y a 0,99999999c… y nunca llega. Cada julio se va a γ, al momento, a la energía, pero la velocidad se aplana hacia c como una curva que se acerca a una recta que nunca toca.",
        },
        {
          en: "The reason is in the formula: reaching exactly c would require γ = ∞, that is, infinite energy. It is not an engineering limit that a better rocket could overcome; it is baked into the geometry of spacetime. Light gets away with it only because photons have no rest mass — the one loophole the universe allows.",
          es: "La razón está en la fórmula: alcanzar exactamente c exigiría γ = ∞, es decir, energía infinita. No es un límite de ingeniería que un cohete mejor pudiera superar; está grabado en la geometría del espaciotiempo. La luz se libra solo porque los fotones no tienen masa en reposo: la única excepción que permite el universo.",
        },
      ],
      keyIdea: {
        en: "Massive objects can approach c arbitrarily closely but never reach it — because the energy required grows without bound.",
        es: "Los objetos con masa pueden acercarse a c tanto como quieran, pero nunca alcanzarla, porque la energía necesaria crece sin límite.",
      },
    },
    {
      heading: {
        en: "\u201CRelativistic mass\u201D: a retired idea",
        es: "La \u201Cmasa relativista\u201D: una idea jubilada",
      },
      paragraphs: [
        {
          en: "Older textbooks sometimes say that mass itself increases with speed, calling γm the 'relativistic mass'. It was a well-meant shortcut: writing p = m_rel·v makes the old Newtonian formulas look unchanged. But modern physics has retired the term, and the reason is instructive.",
          es: "Los libros antiguos a veces dicen que la propia masa aumenta con la velocidad, llamando γm 'masa relativista'. Era un atajo bienintencionado: escribir p = m_rel·v hace que las fórmulas newtonianas parezcan intactas. Pero la física moderna ha jubilado el término, y la razón es instructiva.",
        },
        {
          en: "In relativity, **mass means invariant rest mass** — the same for every observer, a fixed property of the particle like its charge. What grows with speed is energy and momentum, not mass. Keeping mass invariant makes the laws cleaner: E² = (pc)² + (mc²)² works for every observer with the same m. When you meet 'relativistic mass' in old books, translate it mentally as 'total energy divided by c²'.",
          es: "En relatividad, **masa significa masa invariante en reposo**: la misma para todo observador, una propiedad fija de la partícula como su carga. Lo que crece con la velocidad es la energía y el momento, no la masa. Mantener la masa invariante hace las leyes más limpias: E² = (pc)² + (mc²)² vale para todo observador con la misma m. Cuando encuentres 'masa relativista' en libros antiguos, tradúcela mentalmente como 'energía total dividida por c²'.",
        },
      ],
      keyIdea: {
        en: "Mass does not grow with speed — energy does. Physicists keep mass invariant and let γ carry the speed dependence.",
        es: "La masa no crece con la velocidad; la energía sí. Los físicos mantienen la masa invariante y dejan que γ cargue con la dependencia de la velocidad.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Objects physically get heavier the faster they move.",
        es: "Los objetos se vuelven físicamente más pesados cuanto más rápido se mueven.",
      },
      reality: {
        en: "Their invariant mass never changes. What increases is their energy and momentum, via the factor γ. 'Relativistic mass' is outdated language for total energy ÷ c².",
        es: "Su masa invariante nunca cambia. Lo que aumenta es su energía y su momento, a través del factor γ. La 'masa relativista' es un lenguaje anticuado para decir energía total ÷ c².",
      },
    },
    {
      myth: {
        en: "E = mc² is only about nuclear bombs.",
        es: "E = mc² solo tiene que ver con bombas nucleares.",
      },
      reality: {
        en: "It applies to everything with mass, always. A warm cup of tea carries very slightly more mass-energy than a cold one; nuclear reactions just make the effect large enough to measure.",
        es: "Se aplica a todo lo que tiene masa, siempre. Una taza de té caliente posee una pizca más de masa-energía que una fría; las reacciones nucleares solo hacen el efecto lo bastante grande como para medirlo.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "A proton is accelerated to 0.999c in a particle accelerator. Which statement is correct in modern physics?",
        es: "Un protón se acelera hasta 0,999c en un acelerador de partículas. ¿Qué afirmación es correcta en la física moderna?",
      },
      options: [
        {
          en: "Its rest mass stays the same; its total energy and momentum grow enormously",
          es: "Su masa en reposo no cambia; su energía total y su momento crecen enormemente",
        },
        {
          en: "Its mass grows until it becomes a different particle",
          es: "Su masa crece hasta convertirse en otra partícula",
        },
        {
          en: "Its rest energy E = mc² decreases to compensate",
          es: "Su energía en reposo E = mc² disminuye para compensar",
        },
        {
          en: "It must slow down because γ cannot exceed 1",
          es: "Debe frenar porque γ no puede superar 1",
        },
      ],
      answer: 0,
      why: {
        en: "Invariant mass is fixed; γ carries all the speed dependence into energy (E = γmc²) and momentum.",
        es: "La masa invariante es fija; γ carga con toda la dependencia de la velocidad en la energía (E = γmc²) y el momento.",
      },
    },
    {
      q: {
        en: "Why can no finite amount of energy accelerate a massive particle to exactly c?",
        es: "¿Por qué ninguna cantidad finita de energía puede acelerar una partícula con masa hasta exactamente c?",
      },
      options: [
        {
          en: "Because reaching c would require γ = ∞, i.e. infinite energy",
          es: "Porque alcanzar c exigiría γ = ∞, es decir, energía infinita",
        },
        {
          en: "Because friction with the vacuum stops it",
          es: "Porque la fricción con el vacío la detiene",
        },
        {
          en: "Because mass becomes negative beyond c",
          es: "Porque la masa se vuelve negativa más allá de c",
        },
        {
          en: "Because accelerators are not powerful enough yet",
          es: "Porque los aceleradores aún no son bastante potentes",
        },
      ],
      answer: 0,
      why: {
        en: "Energy grows as γmc² without bound; c is an asymptote, not an engineering hurdle.",
        es: "La energía crece como γmc² sin límite; c es una asíntota, no un obstáculo de ingeniería.",
      },
    },
    {
      q: {
        en: "What does E = mc² actually describe?",
        es: "¿Qué describe realmente E = mc²?",
      },
      options: [
        {
          en: "The rest energy of an object with mass m",
          es: "La energía en reposo de un objeto con masa m",
        },
        {
          en: "The kinetic energy of any moving object",
          es: "La energía cinética de cualquier objeto en movimiento",
        },
        {
          en: "The energy carried by a photon",
          es: "La energía que transporta un fotón",
        },
        {
          en: "The total energy including gravitational effects",
          es: "La energía total incluyendo efectos gravitatorios",
        },
      ],
      answer: 0,
      why: {
        en: "It is the p = 0 special case of E² = (pc)² + (mc²)² — the energy of simply existing with mass m.",
        es: "Es el caso especial p = 0 de E² = (pc)² + (mc²)²: la energía de existir sin más con masa m.",
      },
    },
    {
      q: {
        en: "Two observers watch the same speeding electron. What do they agree on?",
        es: "Dos observadores miran el mismo electrón veloz. ¿En qué coinciden?",
      },
      options: [
        { en: "Its rest mass", es: "En su masa en reposo" },
        { en: "Its velocity", es: "En su velocidad" },
        { en: "Its kinetic energy", es: "En su energía cinética" },
        { en: "Its momentum", es: "En su momento" },
      ],
      answer: 0,
      why: {
        en: "Rest mass is Lorentz invariant — all observers measure the same m. Velocity, energy and momentum are frame-dependent.",
        es: "La masa en reposo es invariante de Lorentz: todos los observadores miden la misma m. Velocidad, energía y momento dependen del sistema de referencia.",
      },
    },
  ],
};
