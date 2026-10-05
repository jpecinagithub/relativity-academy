import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "In 1905, a 26-year-old patent clerk published a paper that opened with two sentences of pure audacity. He would not patch the old theories or invent new machinery — he would simply declare two principles, and let logic do the rest. This module follows that act of intellectual courage.",
    es: "En 1905, un empleado de patentes de 26 años publicó un artículo que empezaba con dos frases de pura audacia. No remendaría las viejas teorías ni inventaría maquinaria nueva: simplemente declararía dos principios y dejaría que la lógica hiciera el resto. Este módulo sigue ese acto de coraje intelectual.",
  },
  sections: [
    {
      heading: {
        en: "Two Postulates, Zero Compromise",
        es: "Dos postulados, cero concesiones",
      },
      paragraphs: [
        {
          en: "Einstein's 1905 paper on special relativity rests on just two assumptions — called **postulates** because they are starting points, not conclusions:",
          es: "El artículo de Einstein de 1905 sobre la relatividad especial se apoya en solo dos supuestos, llamados **postulados** porque son puntos de partida, no conclusiones:",
        },
      ],
      bullets: [
        [
          {
            en: "Postulate 1 — The laws of physics are the same in all inertial frames. No experiment can detect absolute, uniform motion.",
            es: "Postulado 1: las leyes de la física son las mismas en todos los sistemas inerciales. Ningún experimento puede detectar el movimiento absoluto y uniforme.",
          },
          {
            en: "Postulate 2 — The speed of light in vacuum is the same for all inertial observers, regardless of the motion of the source.",
            es: "Postulado 2: la velocidad de la luz en el vacío es la misma para todos los observadores inerciales, sin importar el movimiento de la fuente.",
          },
        ],
      ],
      keyIdea: {
        en: "Everything in special relativity — time dilation, length contraction, E = mc² — is a logical consequence of these two sentences.",
        es: "Todo en la relatividad especial —dilatación del tiempo, contracción de la longitud, E = mc²— es consecuencia lógica de estas dos frases.",
      },
    },
    {
      heading: {
        en: "Postulate 1: No Experiment Reveals Absolute Motion",
        es: "Postulado 1: ningún experimento revela el movimiento absoluto",
      },
      paragraphs: [
        {
          en: "The first postulate is Galileo's old insight, extended to all of physics — including electromagnetism. Maxwell's equations, Einstein insisted, must work identically in every inertial frame. There is no privileged laboratory, no cosmic “at rest” against which everything else moves.",
          es: "El primer postulado es la vieja idea de Galileo, extendida a toda la física, incluido el electromagnetismo. Las ecuaciones de Maxwell, insistió Einstein, deben funcionar igual en todo sistema inercial. No hay un laboratorio privilegiado, ningún «reposo» cósmico respecto al cual todo lo demás se mueva.",
        },
        {
          en: "Try the intuition: you are in a windowless spaceship drifting at constant velocity. You run every experiment you can — pendulums, magnets, light beams. Nothing tells you your speed. You might be “moving” at a million km/h relative to some star, but inside your ship, physics behaves exactly as if you were at rest. Motion, at constant velocity, is genuinely undetectable from the inside.",
          es: "Prueba la intuición: estás en una nave sin ventanas a la deriva a velocidad constante. Haces todos los experimentos que puedes: péndulos, imanes, rayos de luz. Nada te dice tu velocidad. Podrías estar «moviéndote» a un millón de km/h respecto a alguna estrella, pero dentro de tu nave la física se comporta exactamente como si estuvieras en reposo. El movimiento a velocidad constante es realmente indetectable desde dentro.",
        },
      ],
      keyIdea: {
        en: "“Am I moving?” is a meaningless question unless you add: relative to whom?",
        es: "«¿Me estoy moviendo?» es una pregunta sin sentido a menos que añadas: ¿respecto a quién?",
      },
    },
    {
      heading: {
        en: "Postulate 2: Chasing a Light Beam",
        es: "Postulado 2: persiguiendo un rayo de luz",
      },
      paragraphs: [
        {
          en: "As a teenager, Einstein imagined chasing a beam of light at nearly light speed. What would he see? A frozen wave, hovering beside him? Classical intuition says the light should crawl away from him slowly — after all, velocities subtract, just like a fast car seen from another fast car.",
          es: "De adolescente, Einstein imaginó perseguir un rayo de luz a casi la velocidad de la luz. ¿Qué vería? ¿Una onda congelada flotando a su lado? La intuición clásica dice que la luz debería alejarse de él lentamente: al fin y al cabo, las velocidades se restan, como un coche rápido visto desde otro coche rápido.",
        },
        {
          en: "Postulate 2 destroys that picture. Chase light at 0.9c, at 0.99c, at 0.999c — and every time you measure the beam, it recedes from you at exactly c. Not c minus your speed. Just c. Light refuses to slow down for anyone, because its speed is not a property of the source's motion — it is a property of spacetime itself.",
          es: "El postulado 2 destruye esa imagen. Persigue la luz a 0,9c, a 0,99c, a 0,999c… y cada vez que midas el rayo, se alejará de ti a exactamente c. No c menos tu velocidad. Solo c. La luz se niega a ir más despacio para nadie, porque su velocidad no es una propiedad del movimiento de la fuente: es una propiedad del espaciotiempo mismo.",
        },
        {
          en: "This is the radical break. Common sense said light's speed should depend on how you chase it. Experiment — and now principle — says it never does. Open the “Chasing a Light Beam” simulator in the lab and watch the classical prediction fail, velocity after velocity.",
          es: "Esta es la ruptura radical. El sentido común decía que la velocidad de la luz debería depender de cómo la persigas. El experimento —y ahora el principio— dice que nunca lo hace. Abre el simulador «Persiguiendo un rayo de luz» en el laboratorio y mira cómo falla la predicción clásica, velocidad tras velocidad.",
        },
      ],
      keyIdea: {
        en: "You cannot catch up with light, not even a little. Every inertial observer measures exactly c — always.",
        es: "No puedes alcanzar a la luz, ni siquiera un poco. Todo observador inercial mide exactamente c, siempre.",
      },
    },
    {
      heading: {
        en: "Why Two Postulates Are Enough",
        es: "Por qué bastan dos postulados",
      },
      paragraphs: [
        {
          en: "Here is the astonishing part: Einstein added nothing else. From these two principles alone — same laws for everyone, same light speed for everyone — the mathematics forces out time dilation, length contraction, the relativity of simultaneity, and the famous new rule for adding velocities.",
          es: "Y aquí lo asombroso: Einstein no añadió nada más. Solo con estos dos principios —las mismas leyes para todos, la misma velocidad de la luz para todos— las matemáticas obligan a que aparezcan la dilatación del tiempo, la contracción de la longitud, la relatividad de la simultaneidad y la famosa nueva regla para sumar velocidades.",
        },
        {
          en: "Notice what he did *not* do. He did not propose a new ether, new particles, or new forces. He took the experimental facts seriously — Maxwell's constant c, the null ether-drift results — and followed them to their logical end, even when the conclusion offended common sense.",
          es: "Fíjate en lo que *no* hizo. No propuso un éter nuevo, ni partículas nuevas, ni fuerzas nuevas. Tomó en serio los hechos experimentales —la c constante de Maxwell, los resultados nulos de la deriva del éter— y los siguió hasta su conclusión lógica, aunque esa conclusión ofendiera al sentido común.",
        },
      ],
      equation: "c = 299\\,792\\,458\\ \\text{m/s}",
      equationCaption: {
        en: "Postulate 2 in numbers: this exact speed is measured identically by every inertial observer.",
        es: "El postulado 2 en números: esta velocidad exacta la mide igual todo observador inercial.",
      },
    },
    {
      heading: {
        en: "The First Casualty: Absolute Simultaneity",
        es: "La primera víctima: la simultaneidad absoluta",
      },
      paragraphs: [
        {
          en: "If light always travels at c for everyone, something familiar must break — and it does: the idea that two distant events happen “at the same time” for everybody. Imagine lightning striking the front and rear of a moving train. We will see, in the next modules, that observers in different frames can legitimately disagree about whether the strikes were simultaneous.",
          es: "Si la luz viaja siempre a c para todos, algo familiar tiene que romperse, y se rompe: la idea de que dos sucesos distantes ocurren «al mismo tiempo» para todo el mundo. Imagina rayos que caen en la parte delantera y trasera de un tren en movimiento. Veremos, en los próximos módulos, que observadores en distintos sistemas pueden discrepar legítimamente sobre si los impactos fueron simultáneos.",
        },
        {
          en: "This is not an illusion and not a measurement error. Once c is the same for all observers, “now” itself becomes observer-dependent. The universal present of Newton — the single shared “now” — was the price of keeping light's speed constant.",
          es: "No es una ilusión ni un error de medida. Una vez que c es la misma para todos los observadores, el «ahora» mismo pasa a depender del observador. El presente universal de Newton —el único «ahora» compartido— fue el precio de mantener constante la velocidad de la luz.",
        },
      ],
      keyIdea: {
        en: "Keeping the speed of light absolute forced time itself to become relative. That trade is the heart of relativity.",
        es: "Mantener absoluta la velocidad de la luz obligó al tiempo mismo a volverse relativo. Ese intercambio es el corazón de la relatividad.",
      },
      mathExtra: "u' = \\frac{u + v}{1 + uv/c^2}",
      mathExtraCaption: {
        en: "Relativistic velocity addition replaces u′ = u + v. If u = c, the result is c for any v — and no combination of sub-light speeds ever reaches c. At low speeds it reduces to the familiar Galilean sum.",
        es: "La suma relativista de velocidades reemplaza a u′ = u + v. Si u = c, el resultado es c para cualquier v, y ninguna combinación de velocidades menores que c alcanza c. A bajas velocidades se reduce a la conocida suma galileana.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Einstein said everything is relative.",
        es: "Einstein dijo que todo es relativo.",
      },
      reality: {
        en: "The speed of light, each traveler's proper time, and the spacetime interval are absolute — identical for all observers. Relativity is better understood as a theory of what stays invariant.",
        es: "La velocidad de la luz, el tiempo propio de cada viajero y el intervalo del espaciotiempo son absolutos: idénticos para todos los observadores. La relatividad se entiende mejor como una teoría de lo que permanece invariante.",
      },
    },
    {
      myth: {
        en: "If you chased a light beam at nearly c, you'd see it crawl past you slowly.",
        es: "Si persiguieras un rayo de luz a casi c, lo verías pasar lentamente.",
      },
      reality: {
        en: "Postulate 2 forbids it: every inertial observer measures exactly c. There is no frame of reference in which light stands still or slows down — that was precisely young Einstein's paradox, and the postulate resolves it.",
        es: "El postulado 2 lo prohíbe: todo observador inercial mide exactamente c. No existe ningún sistema de referencia en el que la luz se detenga o vaya más despacio; esa era precisamente la paradoja del joven Einstein, y el postulado la resuelve.",
      },
    },
    {
      myth: {
        en: "The two postulates are just guesses Einstein made up.",
        es: "Los dos postulados son simples ocurrencias que Einstein inventó.",
      },
      reality: {
        en: "They are distilled from experiment: Maxwell's theory predicting a fixed c, and the repeated failure to detect any ether drift. Every prediction derived from them — from particle lifetimes to GPS corrections — has been confirmed.",
        es: "Están destilados del experimento: la teoría de Maxwell prediciendo una c fija y el fracaso repetido en detectar deriva del éter. Cada predicción derivada de ellos —desde la vida media de partículas hasta las correcciones del GPS— ha sido confirmada.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "Which of these is Einstein's first postulate of special relativity?",
        es: "¿Cuál de estos es el primer postulado de Einstein de la relatividad especial?",
      },
      options: [
        {
          en: "The laws of physics are the same in all inertial frames",
          es: "Las leyes de la física son las mismas en todos los sistemas inerciales",
        },
        {
          en: "Energy equals mass times the speed of light squared",
          es: "La energía es igual a la masa por la velocidad de la luz al cuadrado",
        },
        {
          en: "Gravity is the curvature of spacetime",
          es: "La gravedad es la curvatura del espaciotiempo",
        },
        {
          en: "Time flows at the same rate for everyone",
          es: "El tiempo fluye al mismo ritmo para todos",
        },
      ],
      answer: 0,
      why: {
        en: "Postulate 1 extends Galileo's insight to all of physics: no experiment inside a smoothly moving lab can reveal absolute motion.",
        es: "El postulado 1 extiende la idea de Galileo a toda la física: ningún experimento dentro de un laboratorio en movimiento uniforme puede revelar el movimiento absoluto.",
      },
    },
    {
      q: {
        en: "A spacecraft travels at 0.9c and fires a laser beam forward. What speed does a stationary observer measure for the light?",
        es: "Una nave viaja a 0,9c y dispara un láser hacia adelante. ¿Qué velocidad mide un observador en reposo para la luz?",
      },
      options: [
        { en: "1.9c", es: "1,9c" },
        { en: "0.1c", es: "0,1c" },
        { en: "c", es: "c" },
        { en: "0.9c", es: "0,9c" },
      ],
      answer: 2,
      why: {
        en: "Postulate 2: every inertial observer measures exactly c, regardless of the source's motion. The classical answer 1.9c is precisely what experiment rules out.",
        es: "Postulado 2: todo observador inercial mide exactamente c, sin importar el movimiento de la fuente. La respuesta clásica 1,9c es justo lo que el experimento descarta.",
      },
    },
    {
      q: {
        en: "Why does the relativistic velocity-addition formula matter?",
        es: "¿Por qué es importante la fórmula relativista de suma de velocidades?",
      },
      options: [
        {
          en: "It lets velocities add up to more than c",
          es: "Permite que las velocidades sumen más que c",
        },
        {
          en: "It guarantees no combination of sub-light speeds ever reaches c",
          es: "Garantiza que ninguna combinación de velocidades menores que c alcance c",
        },
        {
          en: "It only applies to light, not to material objects",
          es: "Solo se aplica a la luz, no a los objetos materiales",
        },
        {
          en: "It proves the ether exists after all",
          es: "Demuestra que el éter existe después de todo",
        },
      ],
      answer: 1,
      why: {
        en: "The formula u′ = (u + v)/(1 + uv/c²) keeps every result below c when u and v are below c — and returns exactly c when u = c. The speed limit is built into the arithmetic.",
        es: "La fórmula u′ = (u + v)/(1 + uv/c²) mantiene todo resultado por debajo de c cuando u y v están por debajo de c, y devuelve exactamente c cuando u = c. El límite de velocidad está integrado en la aritmética.",
      },
    },
    {
      q: {
        en: "If postulate 2 were false, what would physicists expect to observe?",
        es: "Si el postulado 2 fuera falso, ¿qué esperarían observar los físicos?",
      },
      options: [
        {
          en: "Light's measured speed depending on the motion of its source or observer",
          es: "Que la velocidad medida de la luz dependiera del movimiento de su fuente o del observador",
        },
        {
          en: "Clocks ticking at the same rate everywhere",
          es: "Relojes marcando el mismo ritmo en todas partes",
        },
        {
          en: "Gravity disappearing in deep space",
          es: "Que la gravedad desapareciera en el espacio profundo",
        },
        {
          en: "Nothing — the postulates have no observable consequences",
          es: "Nada: los postulados no tienen consecuencias observables",
        },
      ],
      answer: 0,
      why: {
        en: "Without postulate 2, Galilean addition would apply to light and its speed would vary with the source — exactly the ether-wind effect Michelson and Morley failed to find.",
        es: "Sin el postulado 2, la suma galileana se aplicaría a la luz y su velocidad variaría con la fuente: justo el efecto del viento del éter que Michelson y Morley no lograron encontrar.",
      },
    },
  ],
};
