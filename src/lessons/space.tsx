import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "If time is relative, space cannot stay absolute — the two are too tightly linked. In this module, moving objects are measured shorter, distant clocks refuse to agree on “now,” and Einstein's famous train shows why simultaneity itself depends on the observer.",
    es: "Si el tiempo es relativo, el espacio no puede seguir siendo absoluto: ambos están demasiado entrelazados. En este módulo, los objetos en movimiento se miden más cortos, los relojes distantes se niegan a ponerse de acuerdo sobre el «ahora» y el famoso tren de Einstein muestra por qué la simultaneidad misma depende del observador.",
  },
  sections: [
    {
      heading: {
        en: "How Long Is a Moving Spaceship?",
        es: "¿Cuánto mide una nave en movimiento?",
      },
      paragraphs: [
        {
          en: "How do you measure the length of something rushing past you? You must mark the positions of its front and back **at the same time**, then measure the distance between the marks. That innocent phrase — “at the same time” — is where relativity strikes.",
          es: "¿Cómo mides la longitud de algo que pasa a toda velocidad? Debes marcar las posiciones de su proa y su popa **al mismo tiempo** y luego medir la distancia entre las marcas. Esa frase inocente —«al mismo tiempo»— es donde golpea la relatividad.",
        },
        {
          en: "We already know simultaneity is frame-dependent (the train experiment below shows why). Because different observers disagree about which pairs of events are simultaneous, they also disagree about where the two ends “are” at a given instant — and so they measure different lengths. The result: a moving object is measured **shorter** along its direction of motion, by exactly the Lorentz factor: L = L₀/γ.",
          es: "Ya sabemos que la simultaneidad depende del sistema (el experimento del tren lo muestra abajo). Como distintos observadores discrepan sobre qué pares de sucesos son simultáneos, también discrepan sobre dónde «están» los dos extremos en un instante dado, y por tanto miden longitudes distintas. El resultado: un objeto en movimiento se mide **más corto** en su dirección de movimiento, exactamente por el factor de Lorentz: L = L₀/γ.",
        },
        {
          en: "Note the careful wording: the object's own rest length L₀ never changes — the crew aboard feels nothing unusual. **Length contraction is a measurement effect**, a consequence of how simultaneity works between frames, not a physical squeezing of the object.",
          es: "Fíjate en la redacción cuidadosa: la longitud propia L₀ del objeto nunca cambia; la tripulación a bordo no nota nada raro. **La contracción de la longitud es un efecto de medida**, consecuencia de cómo funciona la simultaneidad entre sistemas, no un aplastamiento físico del objeto.",
        },
      ],
      equation: "L = \\frac{L_0}{\\gamma}",
      equationCaption: {
        en: "Length contraction: the length L measured in a frame where the object moves is shorter than its rest length L₀ by the factor γ.",
        es: "Contracción de la longitud: la longitud L medida en un sistema donde el objeto se mueve es más corta que su longitud en reposo L₀ por el factor γ.",
      },
      keyIdea: {
        en: "Contraction is not squishing — it is what “measuring both ends at once” means when “at once” differs between observers.",
        es: "La contracción no es aplastamiento: es lo que significa «medir ambos extremos a la vez» cuando «a la vez» difiere entre observadores.",
      },
    },
    {
      heading: {
        en: "Einstein's Train: The Lightning Experiment",
        es: "El tren de Einstein: el experimento de los rayos",
      },
      paragraphs: [
        {
          en: "A train speeds past a platform. Lightning strikes the front and the rear of the train. An observer standing on the platform, midway between the two strike marks, sees both flashes reach her at the same instant — and, correcting for light travel time, concludes the strikes were **simultaneous**.",
          es: "Un tren pasa a toda velocidad junto a un andén. Caen rayos en la parte delantera y trasera del tren. Una observadora en el andén, a medio camino entre las dos marcas, ve ambos destellos llegar al mismo instante y, corrigiendo el tiempo de viaje de la luz, concluye que los impactos fueron **simultáneos**.",
        },
        {
          en: "But consider a passenger sitting in the middle of the train. She is rushing *toward* the light coming from the front strike and *away from* the light coming from the rear strike. The front flash reaches her eyes first. Since light travels at c for her too, she concludes — after the same travel-time correction — that the front strike happened **first**.",
          es: "Pero considera a una pasajera sentada en mitad del tren. Ella se precipita *hacia* la luz que viene del impacto delantero y *se aleja* de la luz del impacto trasero. El destello delantero llega a sus ojos primero. Como la luz viaja a c también para ella, concluye —tras la misma corrección de tiempos— que el impacto delantero ocurrió **antes**.",
        },
        {
          en: "Both observers reasoned correctly; both corrected for signal delays. They simply disagree — and both are right in their own frame. **Simultaneity is relative.** There is no universal “now” slicing across distant places.",
          es: "Ambas observadoras razonaron correctamente; ambas corrigieron los retrasos de las señales. Simplemente discrepan, y ambas tienen razón en su propio sistema. **La simultaneidad es relativa.** No existe un «ahora» universal que corte el espacio a lo lejos.",
        },
      ],
      keyIdea: {
        en: "Two events can be simultaneous for one observer and sequential for another. “Now” is not universal — it is drawn differently by every frame.",
        es: "Dos sucesos pueden ser simultáneos para un observador y secuenciales para otro. El «ahora» no es universal: cada sistema lo traza de forma distinta.",
      },
    },
    {
      heading: {
        en: "The Lorentz Transformations",
        es: "Las transformaciones de Lorentz",
      },
      paragraphs: [
        {
          en: "Galileo's old coordinate recipe — x′ = x − vt, t′ = t — quietly assumed absolute time: everyone shares the same clock reading. Einstein replaced it with a new recipe that respects both postulates: the **Lorentz transformations**.",
          es: "La vieja receta de coordenadas de Galileo —x′ = x − vt, t′ = t— asumía en silencio el tiempo absoluto: todos comparten la misma lectura del reloj. Einstein la reemplazó por una receta nueva que respeta ambos postulados: las **transformaciones de Lorentz**.",
        },
        {
          en: "Conceptually, they do two things at once: they mix space and time (the new time t′ depends on position x, which is exactly the relativity of simultaneity), and they guarantee that a light pulse satisfies x = ct in *every* frame. At low speeds they melt back into Galileo's familiar formulas — which is why nobody noticed for 300 years.",
          es: "Conceptualmente hacen dos cosas a la vez: mezclan espacio y tiempo (el nuevo tiempo t′ depende de la posición x, que es justo la relatividad de la simultaneidad) y garantizan que un pulso de luz cumpla x = ct en *todos* los sistemas. A bajas velocidades se funden de nuevo en las fórmulas familiares de Galileo, por eso nadie lo notó durante 300 años.",
        },
      ],
      keyIdea: {
        en: "The Lorentz transformations are the dictionary translating “where and when” between observers — with time and space interwoven on every page.",
        es: "Las transformaciones de Lorentz son el diccionario que traduce «dónde y cuándo» entre observadores, con el tiempo y el espacio entrelazados en cada página.",
      },
      mathExtra: "x' = \\gamma(x - vt), \\qquad t' = \\gamma\\left(t - \\frac{vx}{c^2}\\right)",
      mathExtraCaption: {
        en: "The Lorentz transformations: coordinates (x′, t′) in a frame moving at velocity v. The vx/c² term is the mathematical face of the relativity of simultaneity — distant clocks desynchronize.",
        es: "Las transformaciones de Lorentz: coordenadas (x′, t′) en un sistema que se mueve a velocidad v. El término vx/c² es el rostro matemático de la relatividad de la simultaneidad: los relojes distantes se desincronizan.",
      },
    },
    {
      heading: {
        en: "Events: The Atoms of Spacetime",
        es: "Sucesos: los átomos del espaciotiempo",
      },
      paragraphs: [
        {
          en: "Physicists give a name to “something happening somewhere at some time”: an **event**. A lightning strike at the train's front door at noon is an event; so is a photon hitting your retina. Everything that happens is a collection of events.",
          es: "Los físicos dan un nombre a «algo que ocurre en algún lugar en algún momento»: un **suceso**. Un rayo que cae en la puerta delantera del tren al mediodía es un suceso; también lo es un fotón golpeando tu retina. Todo lo que ocurre es una colección de sucesos.",
        },
        {
          en: "Here is the deep point: all observers agree on *which* events happened — the flashes, the marks on the train, the meetings of clocks. What they disagree about is the *coordinates* they assign: different times, different positions. The events are the shared reality; the coordinate labels are the observer's perspective.",
          es: "Y aquí el punto profundo: todos los observadores están de acuerdo en *qué* sucesos ocurrieron —los destellos, las marcas en el tren, los encuentros de relojes—. En lo que discrepan es en las *coordenadas* que asignan: tiempos distintos, posiciones distintas. Los sucesos son la realidad compartida; las etiquetas de coordenadas son la perspectiva del observador.",
        },
        {
          en: "This is the doorway to the next module. If events are the real stuff and coordinates are just labels, perhaps space and time are not two separate things with labels attached — perhaps they are one unified thing: **spacetime**.",
          es: "Esta es la puerta al próximo módulo. Si los sucesos son lo real y las coordenadas son solo etiquetas, quizá el espacio y el tiempo no sean dos cosas separadas con etiquetas pegadas; quizá sean una sola cosa unificada: el **espaciotiempo**.",
        },
      ],
      keyIdea: {
        en: "Observers dispute coordinates but never events. Reality is made of happenings; “when” and “where” are frame-dependent descriptions.",
        es: "Los observadores discuten las coordenadas, nunca los sucesos. La realidad está hecha de acontecimientos; el «cuándo» y el «dónde» son descripciones que dependen del sistema.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Objects physically flatten like pancakes when they move fast.",
        es: "Los objetos se aplanan físicamente como tortitas cuando se mueven rápido.",
      },
      reality: {
        en: "Nothing compresses the object — its rest length is unchanged and the crew notices nothing. Contraction is a measurement effect: “both ends at the same time” picks out different pairs of events in different frames.",
        es: "Nada comprime el objeto: su longitud en reposo no cambia y la tripulación no nota nada. La contracción es un efecto de medida: «ambos extremos al mismo tiempo» selecciona pares distintos de sucesos en cada sistema.",
      },
    },
    {
      myth: {
        en: "The relativity of simultaneity is just about slow light signals fooling us.",
        es: "La relatividad de la simultaneidad es solo que las señales lentas de luz nos engañan.",
      },
      reality: {
        en: "Both train observers already corrected for light travel time — and still disagreed. The effect survives every correction: it is a property of spacetime, not of sluggish signals.",
        es: "Ambas observadoras del tren ya corrigieron el tiempo de viaje de la luz… y aun así discreparon. El efecto sobrevive a toda corrección: es una propiedad del espaciotiempo, no de señales perezosas.",
      },
    },
    {
      myth: {
        en: "If simultaneity is relative, the past could change.",
        es: "Si la simultaneity es relativa, el pasado podría cambiar.",
      },
      reality: {
        en: "No. Observers only ever reorder events that are spacelike separated — events so far apart that no signal could connect them. Cause and effect are never reversed; causality is fully protected.",
        es: "No. Los observadores solo reordenan sucesos separados espacialmente: tan distantes que ninguna señal podría conectarlos. La causa y el efecto jamás se invierten; la causalidad está totalmente protegida.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "A 100 m spaceship (rest length) passes Earth at 0.8c, where γ = 1.667. What length do Earth observers measure?",
        es: "Una nave de 100 m (longitud en reposo) pasa junto a la Tierra a 0,8c, donde γ = 1,667. ¿Qué longitud miden los observadores terrestres?",
      },
      options: [
        { en: "100 m", es: "100 m" },
        { en: "167 m", es: "167 m" },
        { en: "60 m", es: "60 m" },
        { en: "80 m", es: "80 m" },
      ],
      answer: 2,
      why: {
        en: "L = L₀/γ = 100/1.667 ≈ 60 m. The moving ship is measured shorter along its motion — while its crew measures the full 100 m.",
        es: "L = L₀/γ = 100/1,667 ≈ 60 m. La nave en movimiento se mide más corta en su dirección de movimiento, mientras su tripulación mide los 100 m completos.",
      },
    },
    {
      q: {
        en: "Lightning strikes the front and rear of a moving train simultaneously for the platform observer. What does the passenger in the middle of the train conclude?",
        es: "Caen rayos en la parte delantera y trasera de un tren en movimiento, simultáneos para la observadora del andén. ¿Qué concluye la pasajera en mitad del tren?",
      },
      options: [
        {
          en: "Both strikes were simultaneous",
          es: "Ambos impactos fueron simultáneos",
        },
        {
          en: "The front strike happened first",
          es: "El impacto delantero ocurrió primero",
        },
        {
          en: "The rear strike happened first",
          es: "El impacto trasero ocurrió primero",
        },
        {
          en: "No lightning struck at all",
          es: "No cayó ningún rayo",
        },
      ],
      answer: 1,
      why: {
        en: "She rushes toward the front flash and away from the rear one, so the front light reaches her first. After correcting for travel time, she judges the front strike earlier — simultaneity is relative.",
        es: "Ella se acerca al destello delantero y se aleja del trasero, así que la luz delantera le llega primero. Tras corregir los tiempos de viaje, juzga anterior el impacto delantero: la simultaneidad es relativa.",
      },
    },
    {
      q: {
        en: "Why does length contraction happen?",
        es: "¿Por qué ocurre la contracción de la longitud?",
      },
      options: [
        {
          en: "High speeds physically compress matter",
          es: "Las altas velocidades comprimen físicamente la materia",
        },
        {
          en: "Measuring length requires marking both ends simultaneously, and simultaneity differs between frames",
          es: "Medir una longitud exige marcar ambos extremos simultáneamente, y la simultaneidad difiere entre sistemas",
        },
        {
          en: "Air resistance squeezes fast objects",
          es: "La resistencia del aire aplasta los objetos rápidos",
        },
        {
          en: "It is an optical illusion caused by Doppler shift",
          es: "Es una ilusión óptica causada por el efecto Doppler",
        },
      ],
      answer: 1,
      why: {
        en: "Length measurement is a simultaneity measurement in disguise. Different frames slice “now” differently, so they pair up different events as “the two ends.”",
        es: "Medir una longitud es, disfrazada, una medida de simultaneidad. Cada sistema corta el «ahora» de forma distinta, así que empareja sucesos distintos como «los dos extremos».",
      },
    },
    {
      q: {
        en: "The Lorentz transformations replace Galileo's x′ = x − vt, t′ = t. What is their key new feature?",
        es: "Las transformaciones de Lorentz reemplazan las de Galileo x′ = x − vt, t′ = t. ¿Cuál es su novedad clave?",
      },
      options: [
        {
          en: "They make time absolute again",
          es: "Vuelven a hacer absoluto el tiempo",
        },
        {
          en: "They mix space and time, so the transformed time depends on position",
          es: "Mezclan espacio y tiempo, de modo que el tiempo transformado depende de la posición",
        },
        {
          en: "They only work for light, not for objects",
          es: "Solo funcionan para la luz, no para los objetos",
        },
        {
          en: "They remove the speed limit c",
          es: "Eliminan el límite de velocidad c",
        },
      ],
      answer: 1,
      why: {
        en: "The term vx/c² in t′ means distant clocks desynchronize between frames — the mathematics of relative simultaneity — while keeping c identical for everyone.",
        es: "El término vx/c² en t′ significa que los relojes distantes se desincronizan entre sistemas —las matemáticas de la simultaneidad relativa— manteniendo c idéntica para todos.",
      },
    },
  ],
};
