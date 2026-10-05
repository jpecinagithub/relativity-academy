import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "Before Einstein rewrote physics, the world seemed beautifully simple: space was a fixed stage, time ticked the same everywhere, and Newton's laws predicted everything from falling apples to orbiting planets. This module explores that clockwork universe — and the one experiment with light that refused to fit inside it.",
    es: "Antes de que Einstein reescribiera la física, el mundo parecía bellamente simple: el espacio era un escenario fijo, el tiempo avanzaba igual en todas partes y las leyes de Newton predecían todo, desde manzanas que caen hasta planetas en órbita. Este módulo explora ese universo mecánico… y el único experimento con la luz que se negó a encajar en él.",
  },
  sections: [
    {
      heading: {
        en: "Newton's Clockwork Universe",
        es: "El universo mecánico de Newton",
      },
      paragraphs: [
        {
          en: "In the late 1600s, Isaac Newton assembled one of the most successful theories in history. Three laws of motion plus universal gravitation could predict the flight of a cannonball, the ocean tides, and the return of comets. Physics looked like clockwork: know the starting conditions, and the future follows mechanically.",
          es: "A finales del siglo XVII, Isaac Newton construyó una de las teorías más exitosas de la historia. Tres leyes del movimiento más la gravitación universal podían predecir el vuelo de una bala de cañón, las mareas y el regreso de los cometas. La física parecía un mecanismo de relojería: conoce las condiciones iniciales y el futuro se deduce mecánicamente.",
        },
        {
          en: "Newton also assumed something deeper, almost silently: **absolute space** and **absolute time**. Space was a fixed, invisible stage on which everything moved; time flowed uniformly everywhere, the same for a sailor in London and an astronomer in Paris. A single universal “now” existed, and everyone shared it.",
          es: "Newton también asumió algo más profundo, casi en silencio: el **espacio absoluto** y el **tiempo absoluto**. El espacio era un escenario fijo e invisible sobre el que todo se movía; el tiempo fluía uniformemente en todas partes, igual para un marinero en Londres que para un astrónomo en París. Existía un único “ahora” universal, compartido por todos.",
        },
        {
          en: "For more than two centuries this picture worked spectacularly. Engineers built bridges and steam engines with it; astronomers discovered new planets with it. Nobody doubted that the stage itself — space and time — was absolute.",
          es: "Durante más de dos siglos esta imagen funcionó de forma espectacular. Los ingenieros construyeron puentes y máquinas de vapor con ella; los astrónomos descubrieron nuevos planetas con ella. Nadie dudaba de que el escenario mismo —el espacio y el tiempo— fuera absoluto.",
        },
      ],
      keyIdea: {
        en: "Classical physics assumed space and time were a fixed, universal background — the same stage for every observer, everywhere.",
        es: "La física clásica asumía que el espacio y el tiempo eran un fondo fijo y universal: el mismo escenario para todo observador, en todas partes.",
      },
    },
    {
      heading: {
        en: "Motion Is Relative — Galileo Knew",
        es: "El movimiento es relativo: Galileo ya lo sabía",
      },
      paragraphs: [
        {
          en: "Long before Newton, Galileo Galilei noticed something profound. Imagine sitting in the cabin of a smoothly sailing ship: drop a ball, and it falls straight down at your feet — exactly as it would on dry land. No experiment performed inside the closed cabin can tell you whether the ship is moving or at rest.",
          es: "Mucho antes de Newton, Galileo Galilei notó algo profundo. Imagina que estás en el camarote de un barco que navega suavemente: sueltas una pelota y cae recta a tus pies, exactamente igual que en tierra firme. Ningún experimento realizado dentro del camarote cerrado puede decirte si el barco se mueve o está en reposo.",
        },
        {
          en: "This is **Galilean relativity**: the laws of mechanics are identical in any frame moving at constant velocity. Such frames are called **inertial reference frames** — a smoothly gliding train or a plane at cruising altitude counts, as long as it doesn't accelerate or turn.",
          es: "Esto es la **relatividad de Galileo**: las leyes de la mecánica son idénticas en cualquier sistema que se mueva a velocidad constante. Esos sistemas se llaman **sistemas de referencia inerciales**: un tren que avanza suavemente o un avión en crucero cuentan como tales, mientras no aceleren ni giren.",
        },
        {
          en: "And velocities simply add. If a train moves at 100 km/h and you walk toward the front at 5 km/h, someone standing on the platform sees you moving at 105 km/h. Everyone agrees on the rule: the observed velocity is the sum of the parts.",
          es: "Y las velocidades simplemente se suman. Si un tren avanza a 100 km/h y tú caminas hacia el frente a 5 km/h, alguien en el andén te ve moverse a 105 km/h. Todos están de acuerdo en la regla: la velocidad observada es la suma de las partes.",
        },
      ],
      equation: "u' = u + v",
      equationCaption: {
        en: "Galilean velocity addition: the platform observer adds the train's speed (v) to the walker's speed (u).",
        es: "Suma galileana de velocidades: el observador del andén suma la velocidad del tren (v) a la del caminante (u).",
      },
      keyIdea: {
        en: "There is no absolute motion — only motion relative to a chosen observer. But the rule for combining velocities was taken as absolute.",
        es: "No existe el movimiento absoluto, solo el movimiento relativo a un observador elegido. Pero la regla para combinar velocidades se daba por absoluta.",
      },
    },
    {
      heading: {
        en: "Maxwell: Light Gets a Speed — With No Address",
        es: "Maxwell: la luz recibe una velocidad… sin dirección de envío",
      },
      paragraphs: [
        {
          en: "In the 1860s, James Clerk Maxwell unified electricity and magnetism into four elegant equations. Hidden inside them was a shock: electromagnetic waves must propagate at one specific speed, computed purely from two measured constants of nature.",
          es: "En la década de 1860, James Clerk Maxwell unificó la electricidad y el magnetismo en cuatro ecuaciones elegantes. Escondida en ellas había una sorpresa: las ondas electromagnéticas deben propagarse a una velocidad concreta, calculada solo a partir de dos constantes de la naturaleza medidas en el laboratorio.",
        },
        {
          en: "That speed was about 300,000 km/s — the measured speed of light. Light, Maxwell realized, **is** an electromagnetic wave. But the equations named no reference frame. Speed relative to *what*? A speed with no address was deeply strange.",
          es: "Esa velocidad era de unos 300 000 km/s: la velocidad medida de la luz. La luz, comprendió Maxwell, **es** una onda electromagnética. Pero las ecuaciones no nombraban ningún sistema de referencia. ¿Velocidad respecto a *qué*? Una velocidad sin destinatario era algo profundamente extraño.",
        },
      ],
      equation: "c = \\frac{1}{\\sqrt{\\varepsilon_0 \\mu_0}}",
      equationCaption: {
        en: "Maxwell's equations predict the speed of light from two constants of electricity and magnetism — with no reference frame mentioned.",
        es: "Las ecuaciones de Maxwell predicen la velocidad de la luz a partir de dos constantes de la electricidad y el magnetismo, sin mencionar ningún sistema de referencia.",
      },
      keyIdea: {
        en: "Maxwell's theory hands us a speed of light but refuses to say who measures it. That silence is the first crack in the clockwork.",
        es: "La teoría de Maxwell nos entrega una velocidad de la luz pero se niega a decir quién la mide. Ese silencio es la primera grieta en el mecanismo.",
      },
    },
    {
      heading: {
        en: "Hunting the Ether Wind",
        es: "A la caza del viento del éter",
      },
      paragraphs: [
        {
          en: "Nineteenth-century physicists assumed waves needed a medium: sound needs air, so light must need something too. They called it the **luminiferous ether**, an invisible substance filling all of space. If Earth moves through the ether, light should travel slightly faster “downwind” than “upwind” — like a swimmer helped or hindered by a river's current.",
          es: "Los físicos del siglo XIX asumían que las ondas necesitaban un medio: el sonido necesita el aire, así que la luz debía necesitar algo. Lo llamaron el **éter luminífero**, una sustancia invisible que llenaba todo el espacio. Si la Tierra se mueve a través del éter, la luz debería viajar un poco más rápido «a favor del viento» que «en contra», como un nadador ayudado o frenado por la corriente de un río.",
        },
        {
          en: "In 1887, Albert Michelson and Edward Morley built an exquisitely sensitive interferometer to detect this **ether wind**. The result: nothing. No drift in any direction, at any time of year — far below what the ether theory predicted.",
          es: "En 1887, Albert Michelson y Edward Morley construyeron un interferómetro exquisitamente sensible para detectar ese **viento del éter**. El resultado: nada. Ninguna deriva en ninguna dirección, en ninguna época del año, muy por debajo de lo que predecía la teoría del éter.",
        },
        {
          en: "Be careful with the legend: the experiment did not single-handedly “kill” the ether overnight. Physicists proposed clever patches — for instance, that objects contract slightly along their direction of motion. But the null result never went away, and every patch made the ether more ghostly and undetectable. A medium you can never detect starts to look like no medium at all.",
          es: "Cuidado con la leyenda: el experimento no «mató» al éter de un plumazo. Los físicos propusieron parches ingeniosos, como que los objetos se contraen ligeramente en su dirección de movimiento. Pero el resultado nulo nunca desapareció, y cada parche hacía al éter más fantasmal e indetectable. Un medio que jamás puedes detectar empieza a parecerse a ningún medio.",
        },
      ],
      keyIdea: {
        en: "The most famous “failed” experiment in physics found nothing — and that nothing changed everything.",
        es: "El experimento «fallido» más famoso de la física no encontró nada… y esa nada lo cambió todo.",
      },
    },
    {
      heading: {
        en: "The Crisis: What If Light Obeyed the Old Rules?",
        es: "La crisis: ¿y si la luz obedeciera las reglas antiguas?",
      },
      paragraphs: [
        {
          en: "Now put the pieces together. If Galilean velocity addition applied to light, then light fired forward from a fast-moving source should travel at c + v, and light fired backward at c − v. Maxwell's equations, however, insist the speed is always c. And Michelson and Morley found no wind to reconcile the two.",
          es: "Ahora junta las piezas. Si la suma galileana de velocidades se aplicara a la luz, la luz emitida hacia adelante desde una fuente rápida debería viajar a c + v, y hacia atrás a c − v. Las ecuaciones de Maxwell, sin embargo, insisten en que la velocidad siempre es c. Y Michelson y Morley no encontraron ningún viento que reconciliara ambas cosas.",
        },
        {
          en: "Something had to give: either Maxwell was wrong about light (unlikely — his theory worked brilliantly), or the innocent-looking rule u′ = u + v was wrong when applied to light (unthinkable — it was common sense itself).",
          es: "Algo tenía que ceder: o Maxwell estaba equivocado sobre la luz (improbable: su teoría funcionaba de maravilla), o la inocente regla u′ = u + v era falsa aplicada a la luz (impensable: era el sentido común en persona).",
        },
        {
          en: "This is the crisis Einstein inherited in 1905. Classical physics could not explain why every measurement of light's speed gave the same answer, no matter how the measurer moved. The stage of absolute space and absolute time was about to collapse.",
          es: "Esta es la crisis que Einstein heredó en 1905. La física clásica no podía explicar por qué cada medida de la velocidad de la luz daba la misma respuesta, sin importar cómo se moviera quien medía. El escenario del espacio y el tiempo absolutos estaba a punto de derrumbarse.",
        },
      ],
      keyIdea: {
        en: "Physics in 1905: two magnificent theories, each confirmed by experiment — and quietly contradicting each other.",
        es: "La física en 1905: dos teorías magníficas, cada una confirmada por experimentos… y contradiciéndose en silencio.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "The Michelson–Morley experiment instantly proved the ether doesn't exist.",
        es: "El experimento de Michelson y Morley demostró al instante que el éter no existe.",
      },
      reality: {
        en: "It found no ether drift, but physicists spent years inventing workarounds. The ether faded because it became unnecessary and undetectable — Einstein simply showed that physics works perfectly without it.",
        es: "No encontró deriva del éter, pero los físicos pasaron años inventando soluciones alternativas. El éter se desvaneció porque se volvió innecesario e indetectable: Einstein simplemente mostró que la física funciona perfectamente sin él.",
      },
    },
    {
      myth: {
        en: "Einstein proved Newton wrong.",
        es: "Einstein demostró que Newton estaba equivocado.",
      },
      reality: {
        en: "Newton's laws remain spectacularly accurate at everyday speeds — engineers still use them daily. Relativity reveals them as a superb approximation, valid whenever velocities are far below the speed of light.",
        es: "Las leyes de Newton siguen siendo espectacularmente precisas a velocidades cotidianas: los ingenieros las usan a diario. La relatividad las revela como una aproximación magnífica, válida siempre que las velocidades estén muy por debajo de la velocidad de la luz.",
      },
    },
    {
      myth: {
        en: "Galileo's relativity was thrown in the trash.",
        es: "La relatividad de Galileo se tiró a la basura.",
      },
      reality: {
        en: "Galilean relativity survives as the low-speed limit of Einstein's theory. At walking speed, driving speed, even jet speed, velocities really do add the simple way — to extraordinary precision.",
        es: "La relatividad de Galileo sobrevive como el límite de bajas velocidades de la teoría de Einstein. A velocidad de paseo, de coche o incluso de avión, las velocidades sí se suman de la forma simple, con una precisión extraordinaria.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "A train moves at 100 km/h. A passenger throws a ball forward at 20 km/h relative to the train. What speed does an observer on the platform measure (classically)?",
        es: "Un tren avanza a 100 km/h. Un pasajero lanza una pelota hacia adelante a 20 km/h respecto al tren. ¿Qué velocidad mide un observador en el andén (clásicamente)?",
      },
      options: [
        { en: "80 km/h", es: "80 km/h" },
        { en: "100 km/h", es: "100 km/h" },
        { en: "120 km/h", es: "120 km/h" },
        { en: "20 km/h", es: "20 km/h" },
      ],
      answer: 2,
      why: {
        en: "Galilean addition: 100 + 20 = 120 km/h. This simple rule works beautifully at everyday speeds — the trouble only starts with light.",
        es: "Suma galileana: 100 + 20 = 120 km/h. Esta regla simple funciona de maravilla a velocidades cotidianas; los problemas solo empiezan con la luz.",
      },
    },
    {
      q: {
        en: "What did the Michelson–Morley experiment actually observe?",
        es: "¿Qué observó realmente el experimento de Michelson y Morley?",
      },
      options: [
        {
          en: "A strong ether wind pushing light along Earth's motion",
          es: "Un fuerte viento del éter empujando la luz en la dirección del movimiento terrestre",
        },
        {
          en: "No detectable ether drift, in any direction",
          es: "Ninguna deriva detectable del éter, en ninguna dirección",
        },
        {
          en: "Light slowing down measurably in glass",
          es: "La luz frenándose de forma medible en el vidrio",
        },
        {
          en: "That the speed of light depends on the season",
          es: "Que la velocidad de la luz depende de la estación del año",
        },
      ],
      answer: 1,
      why: {
        en: "The famous null result: no drift was found, far below the ether theory's prediction. It didn't kill the ether overnight, but the result never went away.",
        es: "El famoso resultado nulo: no se encontró deriva alguna, muy por debajo de lo que predecía la teoría del éter. No mató al éter de la noche a la mañana, pero el resultado nunca desapareció.",
      },
    },
    {
      q: {
        en: "Maxwell's equations predicted the speed of light from…",
        es: "Las ecuaciones de Maxwell predijeron la velocidad de la luz a partir de…",
      },
      options: [
        {
          en: "The density of the luminiferous ether",
          es: "La densidad del éter luminífero",
        },
        {
          en: "Two measured constants of electricity and magnetism",
          es: "Dos constantes medidas de la electricidad y el magnetismo",
        },
        {
          en: "Newton's laws of motion",
          es: "Las leyes del movimiento de Newton",
        },
        {
          en: "The measured speed of sound in air",
          es: "La velocidad medida del sonido en el aire",
        },
      ],
      answer: 1,
      why: {
        en: "The speed c = 1/√(ε₀μ₀) drops out of electromagnetic theory with no reference frame attached — the detail that started the whole crisis.",
        es: "La velocidad c = 1/√(ε₀μ₀) surge de la teoría electromagnética sin ningún sistema de referencia asociado: el detalle que inició toda la crisis.",
      },
    },
    {
      q: {
        en: "Why was a fixed, universal speed of light troubling before Einstein?",
        es: "¿Por qué una velocidad de la luz fija y universal era preocupante antes de Einstein?",
      },
      options: [
        {
          en: "It contradicted Galilean velocity addition, which said light's measured speed should depend on the source's motion",
          es: "Contradecía la suma galileana de velocidades, que decía que la velocidad medida de la luz debería depender del movimiento de la fuente",
        },
        {
          en: "It violated the conservation of energy",
          es: "Violaba la conservación de la energía",
        },
        {
          en: "It proved that absolute time was correct",
          es: "Demostraba que el tiempo absoluto era correcto",
        },
        {
          en: "It showed Maxwell's equations were wrong",
          es: "Mostraba que las ecuaciones de Maxwell estaban equivocadas",
        },
      ],
      answer: 0,
      why: {
        en: "Common sense said a moving source should add its speed to the light it emits (c + v). Every experiment said otherwise — and classical physics had no explanation.",
        es: "El sentido común decía que una fuente en movimiento debería sumar su velocidad a la luz que emite (c + v). Cada experimento decía lo contrario, y la física clásica no tenía explicación.",
      },
    },
  ],
};
