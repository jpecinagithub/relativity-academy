import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "General relativity does not stop at planets and black holes — it describes the universe as a whole. This final chapter is an appetizer, not a cosmology course: a stretching cosmos, ripples in spacetime you can hear, and the strange energy accelerating it all.",
    es: "La relatividad general no se detiene en planetas y agujeros negros: describe el universo en su conjunto. Este capítulo final es un aperitivo, no un curso de cosmología: un cosmos que se estira, ondulaciones del espaciotiempo que puedes oír y la extraña energía que lo acelera todo.",
  },
  sections: [
    {
      heading: {
        en: "Space itself can stretch",
        es: "El propio espacio puede estirarse",
      },
      paragraphs: [
        {
          en: "Einstein's equations do not require spacetime to sit still. The geometry of the whole universe can expand — distances between distant galaxies grow because **space itself stretches**, like dots on an inflating balloon drifting apart without moving across the rubber. The galaxies are not racing through space; more space keeps appearing between them.",
          es: "Las ecuaciones de Einstein no exigen que el espaciotiempo esté quieto. La geometría del universo entero puede expandirse: las distancias entre galaxias lejanas crecen porque **el propio espacio se estira**, como puntos en un globo que se infla y se separan sin moverse sobre la goma. Las galaxias no corren por el espacio; sigue apareciendo más espacio entre ellas.",
        },
        {
          en: "This resolves a famous puzzle: distant galaxies can recede from us faster than light, yet nothing violates relativity. The speed limit c applies to motion **through** space — to worldlines inside light cones, the causality you explored in the Minkowski lab. Expansion is space itself doing the stretching, and no signal outruns any other because of it. The rule 'nothing moves faster than light' was never about the stretching of the stage itself.",
          es: "Esto resuelve un enigma famoso: las galaxias lejanas pueden alejarse de nosotros más rápido que la luz sin violar la relatividad. El límite c se aplica al movimiento **a través** del espacio: a las líneas de universo dentro de los conos de luz, la causalidad que exploraste en el laboratorio de Minkowski. La expansión es el propio espacio estirándose, y ninguna señal adelanta a otra por ello. La regla «nada se mueve más rápido que la luz» nunca trató del estiramiento del escenario mismo.",
        },
      ],
      keyIdea: {
        en: "The universe expands because spacetime is dynamic. Recession faster than c is not motion through space — so causality stands.",
        es: "El universo se expande porque el espaciotiempo es dinámico. Una recesión más rápida que c no es movimiento por el espacio, así que la causalidad se mantiene.",
      },
    },
    {
      heading: {
        en: "Ripples in spacetime",
        es: "Ondulaciones en el espaciotiempo",
      },
      paragraphs: [
        {
          en: "If mass curves spacetime, then violent motion of mass should make the curvature **ripple** — waves of stretching and squeezing propagating outward at c. Einstein predicted these **gravitational waves** in 1916, but they are so faint that detecting them took a century: in 2015, LIGO felt the shiver of two colliding black holes over a billion light-years away, squeezing its 4-km detectors by less than a proton's width.",
          es: "Si la masa curva el espaciotiempo, el movimiento violento de la masa debería hacer que la curvatura **ondule**: ondas de estiramiento y compresión que se propagan a c. Einstein predijo estas **ondas gravitatorias** en 1916, pero son tan tenues que detectarlas llevó un siglo: en 2015, LIGO sintió el estremecimiento de dos agujeros negros en colisión a más de mil millones de años luz, comprimiendo sus detectores de 4 km menos que el ancho de un protón.",
        },
        {
          en: "Open the gravitational-wave lab: choose black-hole pairs or neutron-star pairs, watch the orbit shrink as energy radiates away, and listen to the **chirp** — the waveform translated into sound, rising in pitch as the objects spiral together. You are hearing spacetime itself vibrate, generated locally in your browser with the Web Audio API.",
          es: "Abre el laboratorio de ondas gravitatorias: elige parejas de agujeros negros o estrellas de neutrones, observa cómo la órbita se encoge mientras la energía se irradia y escucha el **chirp**: la forma de onda traducida a sonido, subiendo de tono mientras los objetos espiralan juntos. Estás oyendo vibrar al propio espaciotiempo, generado localmente en tu navegador con la Web Audio API.",
        },
      ],
    },
    {
      heading: {
        en: "The Big Bang, stated carefully",
        es: "El Big Bang, dicho con cuidado",
      },
      paragraphs: [
        {
          en: "Run the cosmic expansion backward and the universe was once hotter, denser and smaller — an extremely hot, dense early state about 13.8 billion years ago. That is the **Big Bang**: not an explosion **in** space, flinging matter into a pre-existing void, but the expansion **of** space itself from that dense state. There was no 'outside' for it to explode into; the question 'where did it happen?' has the same answer everywhere — everywhere.",
          es: "Rebobina la expansión cósmica y el universo fue una vez más caliente, denso y pequeño: un estado inicial extremadamente caliente y denso hace unos 13 800 millones de años. Ese es el **Big Bang**: no una explosión **en** el espacio que lanzara materia a un vacío preexistente, sino la expansión **del** propio espacio desde ese estado denso. No había un «afuera» hacia el que explotar; la pregunta «¿dónde ocurrió?» tiene la misma respuesta en todas partes: en todas partes.",
        },
        {
          en: "This is deliberately a one-paragraph story. The full physics of the early universe — inflation, nucleosynthesis, the cosmic microwave background — is a course of its own. What matters here is the conceptual correction: the Big Bang is a statement about the geometry of spacetime, and it belongs to general relativity.",
          es: "Es deliberadamente una historia de un párrafo. La física completa del universo primitivo —inflación, nucleosíntesis, fondo cósmico de microondas— es un curso propio. Lo que importa aquí es la corrección conceptual: el Big Bang es una afirmación sobre la geometría del espaciotiempo, y pertenece a la relatividad general.",
        },
      ],
      keyIdea: {
        en: "The Big Bang was not an explosion in space — it was the beginning of the expansion of space, from a hot dense state.",
        es: "El Big Bang no fue una explosión en el espacio, sino el comienzo de la expansión del espacio desde un estado caliente y denso.",
      },
    },
    {
      heading: {
        en: "Λ: the \u201Cblunder\u201D that came back",
        es: "Λ: el \u201Cerror\u201D que volvió",
      },
      paragraphs: [
        {
          en: "Einstein's field equation contains a small extra term, the **cosmological constant Λ**. He introduced it to keep the universe static, then discarded it when expansion was discovered — legend calls it his 'greatest blunder'. The irony: since 1998 we know the cosmic expansion is **accelerating**, driven by something dubbed **dark energy** — and the simplest mathematical description of dark energy is exactly Λ, back in the equation.",
          es: "La ecuación de campo de Einstein contiene un pequeño término extra, la **constante cosmológica Λ**. Einstein la introdujo para mantener el universo estático y la descartó al descubrirse la expansión; la leyenda la llama su «mayor error». La ironía: desde 1998 sabemos que la expansión cósmica se **acelera**, impulsada por algo llamado **energía oscura**, y la descripción matemática más simple de la energía oscura es exactamente Λ, de vuelta en la ecuación.",
        },
        {
          en: "Nobody knows what dark energy *is* — only what it does. It is a standing invitation: the universe's biggest mystery is written in the language you have just learned.",
          es: "Nadie sabe qué *es* la energía oscura, solo qué hace. Es una invitación permanente: el mayor misterio del universo está escrito en el lenguaje que acabas de aprender.",
        },
      ],
    },
    {
      heading: {
        en: "Neutron stars: relativity laboratories",
        es: "Estrellas de neutrones: laboratorios de relatividad",
      },
      paragraphs: [
        {
          en: "Between ordinary stars and black holes sit **neutron stars**: the collapsed cores of massive stars, packing more than the Sun's mass into a sphere the size of a city. Their surface gravity is around 200 billion times Earth's, their spin can exceed 700 rotations per second, and their mergers — like the one LIGO heard in 2017 — forge heavy elements like gold while shaking spacetime.",
          es: "Entre las estrellas ordinarias y los agujeros negros están las **estrellas de neutrones**: los núcleos colapsados de estrellas masivas, con más masa que el Sol en una esfera del tamaño de una ciudad. Su gravedad superficial es unas 200 000 millones de veces la terrestre, su rotación puede superar 700 vueltas por segundo y sus fusiones —como la que LIGO oyó en 2017— forjan elementos pesados como el oro mientras sacuden el espaciotiempo.",
        },
        {
          en: "Because their gravity is extreme but not horizon-sealed, neutron stars test general relativity in regimes no laboratory can reach. Every pulsar tick and every merger chirp is relativity, speaking loudly.",
          es: "Como su gravedad es extrema pero sin horizonte sellado, las estrellas de neutrones ponen a prueba la relatividad general en regímenes que ningún laboratorio alcanza. Cada tic de púlsar y cada chirp de fusión es la relatividad hablando en voz alta.",
        },
      ],
      keyIdea: {
        en: "The universe is still running relativity experiments — louder and more extreme than anything we can build.",
        es: "El universo sigue realizando experimentos de relatividad, más ruidosos y extremos que nada que podamos construir.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "The Big Bang was a giant explosion at a point in space.",
        es: "El Big Bang fue una explosión gigante en un punto del espacio.",
      },
      reality: {
        en: "There was no pre-existing space to explode into. The Big Bang describes space itself expanding from an extremely hot, dense state — it happened everywhere at once.",
        es: "No había un espacio preexistente hacia el que explotar. El Big Bang describe al propio espacio expandiéndose desde un estado extremadamente caliente y denso: ocurrió en todas partes a la vez.",
      },
    },
    {
      myth: {
        en: "Distant galaxies receding faster than light disproves relativity.",
        es: "Que galaxias lejanas se alejen más rápido que la luz refuta la relatividad.",
      },
      reality: {
        en: "The light-speed limit governs motion through space. Cosmological recession is space itself stretching between galaxies — no object outruns its own light cone, and no signal travels faster than c.",
        es: "El límite de la velocidad de la luz gobierna el movimiento a través del espacio. La recesión cosmológica es el propio espacio estirándose entre galaxias: ningún objeto adelanta a su cono de luz ni señal alguna viaja más rápido que c.",
      },
    },
    {
      myth: {
        en: "The universe is expanding into something — there must be an outside.",
        es: "El universo se expande dentro de algo: tiene que haber un afuera.",
      },
      reality: {
        en: "Expansion is described intrinsically: distances grow, with no need for an external space to grow 'into'. Asking what lies beyond the universe assumes a container that general relativity does not require.",
        es: "La expansión se describe de forma intrínseca: las distancias crecen sin necesidad de un espacio externo hacia el que crecer. Preguntar qué hay más allá del universo supone un contenedor que la relatividad general no necesita.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "Why doesn't superluminal recession of distant galaxies violate relativity?",
        es: "¿Por qué la recesión superlumínica de galaxias lejanas no viola la relatividad?",
      },
      options: [
        {
          en: "The c limit applies to motion through space; recession is space itself stretching",
          es: "El límite c se aplica al movimiento a través del espacio; la recesión es el propio espacio estirándose",
        },
        {
          en: "Relativity only works nearby",
          es: "La relatividad solo funciona cerca",
        },
        {
          en: "Galaxies have warp drives",
          es: "Las galaxias tienen motores warp",
        },
        {
          en: "Light is slower in deep space",
          es: "La luz es más lenta en el espacio profundo",
        },
      ],
      answer: 0,
      why: {
        en: "Nothing moves through space faster than c; expanding space carries galaxies apart without any local speed limit being broken.",
        es: "Nada se mueve por el espacio más rápido que c; el espacio en expansión separa las galaxias sin romper ningún límite local de velocidad.",
      },
    },
    {
      q: {
        en: "What did LIGO detect in 2015?",
        es: "¿Qué detectó LIGO en 2015?",
      },
      options: [
        {
          en: "Gravitational waves from two merging black holes",
          es: "Ondas gravitatorias de dos agujeros negros en fusión",
        },
        { en: "A new planet", es: "Un planeta nuevo" },
        {
          en: "Signals from extraterrestrials",
          es: "Señales de extraterrestres",
        },
        {
          en: "The sound of the Big Bang",
          es: "El sonido del Big Bang",
        },
      ],
      answer: 0,
      why: {
        en: "LIGO measured ripples in spacetime itself — stretching and squeezing at the scale of a fraction of a proton over 4 km.",
        es: "LIGO midió ondulaciones del propio espaciotiempo: estiramientos y compresiones a escala de una fracción de protón en 4 km.",
      },
    },
    {
      q: {
        en: "Which best describes the Big Bang?",
        es: "¿Qué describe mejor el Big Bang?",
      },
      options: [
        {
          en: "Space itself expanding from an extremely hot, dense early state",
          es: "El propio espacio expandiéndose desde un estado inicial extremadamente caliente y denso",
        },
        {
          en: "A huge explosion at one point in pre-existing space",
          es: "Una enorme explosión en un punto del espacio preexistente",
        },
        {
          en: "The moment the first stars ignited",
          es: "El momento en que se encendieron las primeras estrellas",
        },
        {
          en: "A black hole exploding",
          es: "Un agujero negro explotando",
        },
      ],
      answer: 0,
      why: {
        en: "The Big Bang is the expansion of space from a hot dense state — everywhere at once, not an explosion into a void.",
        es: "El Big Bang es la expansión del espacio desde un estado caliente y denso: en todas partes a la vez, no una explosión hacia un vacío.",
      },
    },
    {
      q: {
        en: "What is the cosmological constant Λ, in modern terms?",
        es: "¿Qué es la constante cosmológica Λ, en términos modernos?",
      },
      options: [
        {
          en: "The simplest description of dark energy, driving accelerated expansion",
          es: "La descripción más simple de la energía oscura, que impulsa la expansión acelerada",
        },
        {
          en: "Einstein's proof that the universe is static",
          es: "La prueba de Einstein de que el universo es estático",
        },
        {
          en: "A fudge factor with no physical meaning",
          es: "Un ajuste sin significado físico",
        },
        {
          en: "The speed of gravitational waves",
          es: "La velocidad de las ondas gravitatorias",
        },
      ],
      answer: 0,
      why: {
        en: "Since 1998, observations show expansion accelerating; Λ is the simplest term in Einstein's equation that produces exactly that.",
        es: "Desde 1998 las observaciones muestran que la expansión se acelera; Λ es el término más simple de la ecuación de Einstein que produce exactamente eso.",
      },
    },
  ],
};
