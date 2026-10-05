import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "What if gravity is not a force at all, but the shape of spacetime itself? This module follows the equivalence principle to its destination: a universe where planets orbit because they travel straight lines through curved spacetime — and where time itself runs slower near a massive object.",
    es: "¿Y si la gravedad no fuera una fuerza, sino la forma del propio espaciotiempo? Este módulo sigue el principio de equivalencia hasta su destino: un universo donde los planetas orbitan porque viajan en línea recta por un espaciotiempo curvo, y donde el propio tiempo transcurre más despacio cerca de un objeto masivo.",
  },
  sections: [
    {
      heading: {
        en: "Matter curves spacetime; spacetime guides matter",
        es: "La materia curva el espaciotiempo; el espaciotiempo guía la materia",
      },
      paragraphs: [
        {
          en: "Physicist John Archibald Wheeler summarized general relativity in one sentence: **'Matter tells spacetime how to curve; curved spacetime tells matter how to move.'** Treat it as a conceptual simplification — a slogan, not the theory — but a remarkably faithful one. The Sun's mass dents the spacetime around it, and Earth, moving 'straight ahead' through that dented geometry, traces what we call an orbit.",
          es: "El físico John Archibald Wheeler resumió la relatividad general en una frase: **«La materia le dice al espaciotiempo cómo curvarse; el espaciotiempo curvo le dice a la materia cómo moverse»**. Tómala como una simplificación conceptual —un eslogan, no la teoría—, pero sorprendentemente fiel. La masa del Sol abolla el espaciotiempo a su alrededor, y la Tierra, avanzando «en línea recta» por esa geometría abollada, traza lo que llamamos órbita.",
        },
        {
          en: "The famous rubber-sheet picture — a heavy ball sagging on a stretched membrane while marbles spiral around it — captures the 'matter curves' half. But it is an **analogy**, and a flawed one: it borrows Earth's gravity to explain gravity, it shows only space curving (the curvature of time matters more for orbits), and it needs an invisible hand pulling things 'down' off the sheet. The curvature lab includes a 'What is misleading about this model?' button — press it; scientific honesty is part of the lesson.",
          es: "La famosa imagen de la lámina de goma —una bola pesada hundiéndose en una membrana tensa mientras las canicas espiralan a su alrededor— captura la mitad de «la materia curva». Pero es una **analogía** con defectos: toma prestada la gravedad terrestre para explicar la gravedad, muestra solo el espacio curvándose (la curvatura del tiempo importa más para las órbitas) y necesita una mano invisible que tire de las cosas «hacia abajo» fuera de la lámina. El laboratorio de curvatura incluye un botón «¿Qué tiene de engañoso este modelo?»: púlsalo; la honestidad científica es parte de la lección.",
        },
      ],
      keyIdea: {
        en: "Gravity is geometry. Objects in free fall follow the straightest possible paths — geodesics — through curved spacetime.",
        es: "La gravedad es geometría. Los objetos en caída libre siguen los caminos más rectos posibles —las geodésicas— a través del espaciotiempo curvo.",
      },
    },
    {
      heading: {
        en: "Geodesics: straight lines in a curved world",
        es: "Geodésicas: líneas rectas en un mundo curvo",
      },
      paragraphs: [
        {
          en: "A **geodesic** is the straightest path a worldline can take through spacetime. On a flat map the shortest route between two cities looks straight; on the real curved Earth it is a great-circle arc — yet pilots call it 'flying straight'. General relativity says the same about orbits: Earth is not being 'pulled' around the Sun; it is flying straight through spacetime that the Sun has curved.",
          es: "Una **geodésica** es el camino más recto que puede seguir una línea de universo a través del espaciotiempo. En un mapa plano la ruta más corta entre dos ciudades parece recta; en la Tierra real y curva es un arco de círculo máximo, y aun así los pilotos dicen que vuelan «recto». La relatividad general dice lo mismo de las órbitas: la Tierra no es «tirada» alrededor del Sol; vuela recto por un espaciotiempo que el Sol ha curvado.",
        },
        {
          en: "This reframes free fall completely. The astronaut in orbit and the painter falling off the roof are both following geodesics — both are moving 'straight'. The person standing on Earth's surface, feeling their weight, is the one being pushed off their geodesic by the ground. In Einstein's universe, **feeling weight means you are accelerating**.",
          es: "Esto replantea por completo la caída libre. El astronauta en órbita y el pintor que cae del tejado siguen ambos geodésicas: ambos se mueven «recto». Quien está de pie sobre la Tierra, sintiendo su peso, es a quien el suelo empuja fuera de su geodésica. En el universo de Einstein, **sentir peso significa estar acelerando**.",
        },
      ],
    },
    {
      heading: {
        en: "The field equation — in words, not tensors",
        es: "La ecuación de campo, en palabras, no en tensores",
      },
      paragraphs: [
        {
          en: "Einstein's field equation is the mathematical statement of Wheeler's slogan. We will show it, not derive it — deriving it honestly requires tensor calculus, and this academy refuses to fake that. Read it as a sentence with two halves:",
          es: "La ecuación de campo de Einstein es la expresión matemática del eslogan de Wheeler. La mostraremos, no la derivaremos: derivarla con honestidad exige cálculo tensorial, y esta academia se niega a fingirlo. Léela como una frase con dos mitades:",
        },
        {
          en: "The symbols Gμν and Tμν are **tensors** — packages of numbers describing curvature and energy at each point of spacetime. You do not need their machinery to grasp the idea: the distribution of matter and energy dictates the shape of spacetime, and that shape dictates how everything moves. The cosmological constant Λ, the small extra term, gets its own story in the final module.",
          es: "Los símbolos Gμν y Tμν son **tensores**: paquetes de números que describen la curvatura y la energía en cada punto del espaciotiempo. No necesitas su maquinaria para captar la idea: la distribución de materia y energía dicta la forma del espaciotiempo, y esa forma dicta cómo se mueve todo. La constante cosmológica Λ, el pequeño término extra, tendrá su propia historia en el módulo final.",
        },
      ],
      bullets: [
        [
          {
            en: "**Left side (Gμν + Λgμν):** the geometry — how spacetime curves at each point.",
            es: "**Lado izquierdo (Gμν + Λgμν):** la geometría: cómo se curva el espaciotiempo en cada punto.",
          },
        ],
        [
          {
            en: "**Right side ((8πG/c⁴)Tμν):** the matter and energy — what is doing the curving.",
            es: "**Lado derecho ((8πG/c⁴)Tμν):** la materia y la energía: qué está causando la curvatura.",
          },
        ],
        [
          {
            en: "**The equals sign:** the two determine each other. Curvature and matter evolve together — neither is the stage and the other the actor.",
            es: "**El signo igual:** ambos se determinan mutuamente. Curvatura y materia evolucionan juntas: ninguna es el escenario y la otra el actor.",
          },
        ],
      ],
      equation: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}\\,T_{\\mu\\nu}",
      equationCaption: {
        en: "The Einstein field equation, 1915. Left: spacetime geometry. Right: matter and energy. Shown for orientation — not to compute with.",
        es: "La ecuación de campo de Einstein, 1915. Izquierda: geometría del espaciotiempo. Derecha: materia y energía. Se muestra para orientarse, no para calcular con ella.",
      },
      mathExtra: "\\mathrm{d}\\tau = \\mathrm{d}t\\,\\sqrt{1 - \\frac{r_s}{r}}",
      mathExtraCaption: {
        en: "Gravitational time dilation outside a spherical mass (Schwarzschild metric): a clock at radius r ticks slower than a distant clock by this factor. At Earth's surface the effect is about one part in a billion.",
        es: "Dilatación gravitatoria del tiempo fuera de una masa esférica (métrica de Schwarzschild): un reloj a radio r avanza más despacio que un reloj lejano según este factor. En la superficie terrestre el efecto es de una parte entre mil millones, aproximadamente.",
      },
    },
    {
      heading: {
        en: "Time runs slower near mass",
        es: "El tiempo transcurre más despacio cerca de la masa",
      },
      paragraphs: [
        {
          en: "The equivalence principle already whispers this: a clock on the accelerating rocket's floor ticks slower than one at the ceiling (light climbing between them is redshifted), so by equivalence a clock deeper in gravity must tick slower too. This is **gravitational time dilation**, and it is not theoretical decoration — your phone's GPS would fail within a day without correcting for it.",
          es: "El principio de equivalencia ya lo susurra: un reloj en el suelo del cohete acelerado avanza más despacio que uno en el techo (la luz que sube entre ellos se corre al rojo), así que por equivalencia un reloj más profundo en la gravedad también debe atrasar. Es la **dilatación gravitatoria del tiempo**, y no es decoración teórica: el GPS de tu móvil fallaría en un día sin corregirla.",
        },
        {
          en: "The numbers are beautifully concrete. A GPS satellite's clock loses about **7 microseconds per day** to special relativity (it moves fast) but gains about **45 microseconds per day** to general relativity (it sits higher, in weaker gravity). Engineers pre-correct a net **+38 µs/day**; uncorrected, positioning errors would grow by roughly 10 kilometers per day. Open the GPS lab to watch the two effects compete.",
          es: "Los números son maravillosamente concretos. El reloj de un satélite GPS pierde unos **7 microsegundos al día** por relatividad especial (se mueve rápido), pero gana unos **45 microsegundos al día** por relatividad general (está más alto, en gravedad más débil). Los ingenieros precorrigen un neto de **+38 µs/día**; sin corrección, los errores de posición crecerían unos 10 kilómetros al día. Abre el laboratorio GPS para ver competir ambos efectos.",
        },
        {
          en: "Set two clocks at different heights in the gravity-clock simulator — a valley and a mountaintop — and let them run for a simulated year. The difference is tiny but relentless, and it accumulates.",
          es: "Coloca dos relojes a distintas alturas en el simulador de relojes gravitatorios —un valle y una cima— y déjalos correr un año simulado. La diferencia es minúscula pero implacable, y se acumula.",
        },
      ],
    },
    {
      heading: {
        en: "The tests that convinced the world",
        es: "Las pruebas que convencieron al mundo",
      },
      paragraphs: [
        {
          en: "Einstein published general relativity in 1915; within years it faced measurements Newton could not explain. Mercury's orbit precesses — its perihelion slowly rotates — by 43 arcseconds per century more than Newtonian gravity predicts. That tiny excess, known since the 1850s, fell out of Einstein's equations exactly. The orbit lab includes a Mercury preset: run it with the relativistic correction and watch the ellipse itself rotate.",
          es: "Einstein publicó la relatividad general en 1915; en pocos años se enfrentó a mediciones que Newton no podía explicar. La órbita de Mercurio precesa —su perihelio rota lentamente— 43 segundos de arco por siglo más de lo que predice la gravedad newtoniana. Ese minúsculo exceso, conocido desde 1850, salía exactamente de las ecuaciones de Einstein. El laboratorio de órbitas incluye un ajuste preestablecido de Mercurio: ejecútalo con la corrección relativista y observa cómo rota la propia elipse.",
        },
        {
          en: "In 1919, Eddington's eclipse expedition measured starlight bending around the Sun, matching Einstein's prediction and making him world-famous. A century later, the same bending — now called **gravitational lensing** — maps dark matter, and gravitational-wave detectors listen to colliding black holes. Geometry, it turns out, was the right language all along.",
          es: "En 1919, la expedición del eclipse de Eddington midió la curvatura de la luz estelar alrededor del Sol, confirmando la predicción de Einstein y haciéndolo mundialmente famoso. Un siglo después, esa misma curvatura —hoy llamada **lente gravitatoria**— cartografía la materia oscura, y los detectores de ondas gravitatorias escuchan colisiones de agujeros negros. La geometría, al parecer, era el lenguaje correcto desde el principio.",
        },
      ],
      keyIdea: {
        en: "General relativity replaced gravitational force with spacetime geometry — and every precision test since 1915 has agreed.",
        es: "La relatividad general sustituyó la fuerza gravitatoria por geometría del espaciotiempo, y todas las pruebas de precisión desde 1915 le han dado la razón.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "The rubber-sheet picture shows what curved spacetime really looks like.",
        es: "La imagen de la lámina de goma muestra cómo es realmente el espaciotiempo curvo.",
      },
      reality: {
        en: "It is a 2D analogy for a 4D reality: it borrows Earth's gravity to explain gravity, hides the crucial curvature of time, and suggests space is 'pulled down' into something. Useful as a first sketch, misleading as a literal image.",
        es: "Es una analogía 2D de una realidad 4D: toma prestada la gravedad terrestre para explicar la gravedad, oculta la crucial curvatura del tiempo y sugiere que el espacio es 'tirado hacia abajo' dentro de algo. Útil como primer boceto, engañosa como imagen literal.",
      },
    },
    {
      myth: {
        en: "Gravity is just a force pulling things down.",
        es: "La gravedad es solo una fuerza que tira de las cosas hacia abajo.",
      },
      reality: {
        en: "In general relativity there is no gravitational force pulling you: in free fall you feel nothing because you follow a geodesic. 'Down' is simply the direction spacetime curvature carries you — and weight is the floor pushing you off your natural path.",
        es: "En relatividad general no hay fuerza gravitatoria que tire de ti: en caída libre no sientes nada porque sigues una geodésica. 'Abajo' es simplemente la dirección hacia la que te lleva la curvatura del espaciotiempo, y el peso es el suelo empujándote fuera de tu camino natural.",
      },
    },
    {
      myth: {
        en: "GPS works fine without relativity — the corrections are negligible.",
        es: "El GPS funciona bien sin relatividad: las correcciones son despreciables.",
      },
      reality: {
        en: "Uncorrected, the combined SR (−7 µs/day) and GR (+45 µs/day) effects accumulate to about +38 µs/day — roughly 10 km of positioning error per day. Relativity is engineered into every GPS satellite.",
        es: "Sin corregir, los efectos combinados de RE (−7 µs/día) y RG (+45 µs/día) acumulan unos +38 µs/día, equivalentes a unos 10 km de error de posición al día. La relatividad está integrada en cada satélite GPS.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What does the left side of Einstein's field equation describe?",
        es: "¿Qué describe el lado izquierdo de la ecuación de campo de Einstein?",
      },
      options: [
        {
          en: "The curvature of spacetime geometry",
          es: "La curvatura de la geometría del espaciotiempo",
        },
        { en: "The mass of the Sun", es: "La masa del Sol" },
        { en: "The speed of light", es: "La velocidad de la luz" },
        {
          en: "The force of gravity as Newton defined it",
          es: "La fuerza de gravedad tal como la definió Newton",
        },
      ],
      answer: 0,
      why: {
        en: "Gμν encodes how spacetime curves; the right side (Tμν) describes the matter and energy doing the curving.",
        es: "Gμν codifica cómo se curva el espaciotiempo; el lado derecho (Tμν) describe la materia y la energía que lo curvan.",
      },
    },
    {
      q: {
        en: "GPS satellites must correct their clocks by about +38 µs/day. Why?",
        es: "Los satélites GPS deben corregir sus relojes unos +38 µs/día. ¿Por qué?",
      },
      options: [
        {
          en: "Special relativity slows the fast-moving clock (−7) while weaker gravity speeds it up (+45); the GR effect wins",
          es: "La relatividad especial atrasa el reloj veloz (−7) mientras la gravedad más débil lo adelanta (+45); gana el efecto de RG",
        },
        {
          en: "The satellites' batteries run fast",
          es: "Las baterías de los satélites van rápido",
        },
        {
          en: "Engineers add a safety margin",
          es: "Los ingenieros añaden un margen de seguridad",
        },
        {
          en: "Solar wind pushes the clocks",
          es: "El viento solar empuja los relojes",
        },
      ],
      answer: 0,
      why: {
        en: "Both effects are real and measurable; the net correction is engineered into the system before launch.",
        es: "Ambos efectos son reales y medibles; la corrección neta se integra en el sistema antes del lanzamiento.",
      },
    },
    {
      q: {
        en: "Mercury's orbit was a key test of general relativity because…",
        es: "La órbita de Mercurio fue una prueba clave de la relatividad general porque…",
      },
      options: [
        {
          en: "its perihelion precesses 43″/century more than Newton predicts, exactly matching Einstein",
          es: "su perihelio precesa 43″/siglo más de lo que predice Newton, coincidiendo exactamente con Einstein",
        },
        {
          en: "Mercury is the largest planet",
          es: "Mercurio es el planeta más grande",
        },
        {
          en: "its orbit is a perfect circle",
          es: "su órbita es un círculo perfecto",
        },
        {
          en: "Newton never studied Mercury",
          es: "Newton nunca estudió Mercurio",
        },
      ],
      answer: 0,
      why: {
        en: "The unexplained 43 arcseconds per century of perihelion advance emerged naturally from curved spacetime.",
        es: "Los inexplicados 43 segundos de arco por siglo de avance del perihelio surgían de forma natural del espaciotiempo curvo.",
      },
    },
    {
      q: {
        en: "In general relativity, why does an astronaut in orbit feel weightless?",
        es: "En relatividad general, ¿por qué un astronauta en órbita se siente ingrávido?",
      },
      options: [
        {
          en: "They follow a geodesic — free fall is the natural, unforced motion",
          es: "Sigue una geodésica: la caída libre es el movimiento natural, sin fuerzas",
        },
        {
          en: "There is no gravity in space",
          es: "No hay gravedad en el espacio",
        },
        {
          en: "Their spacesuit cancels gravity",
          es: "Su traje espacial anula la gravedad",
        },
        {
          en: "They are moving too fast to feel it",
          es: "Se mueve demasiado rápido para sentirla",
        },
      ],
      answer: 0,
      why: {
        en: "Weight is felt only when something (like the ground) pushes you off your geodesic. Orbit is continuous free fall.",
        es: "El peso solo se siente cuando algo (como el suelo) te aparta de tu geodésica. La órbita es caída libre continua.",
      },
    },
  ],
};
