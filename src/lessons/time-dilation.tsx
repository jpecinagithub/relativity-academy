import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "“Moving clocks run slow.” It sounds like a riddle, but it is one of the best-tested facts in physics. In this module you will see why it must be true — using nothing but the two postulates and a clock made of light — and then watch real particles prove it in Earth's atmosphere.",
    es: "«Los relojes en movimiento atrasan». Suena a acertijo, pero es uno de los hechos mejor comprobados de la física. En este módulo verás por qué tiene que ser verdad —solo con los dos postulados y un reloj hecho de luz— y luego verás partículas reales demostrarlo en la atmósfera terrestre.",
  },
  sections: [
    {
      heading: {
        en: "Einstein's Light Clock",
        es: "El reloj de luz de Einstein",
      },
      paragraphs: [
        {
          en: "Imagine the simplest possible clock: two mirrors facing each other, with a single photon bouncing up and down between them. Each round trip is one “tick.” Now put this clock aboard a spaceship, and watch it from two perspectives.",
          es: "Imagina el reloj más simple posible: dos espejos enfrentados, con un único fotón rebotando arriba y abajo entre ellos. Cada viaje de ida y vuelta es un «tic». Ahora coloca este reloj a bordo de una nave espacial y obsérvalo desde dos perspectivas.",
        },
        {
          en: "An astronaut travelling *with* the clock sees the photon bounce straight up and down — the shortest possible path. But you, watching from Earth as the ship speeds past, see something different: while the photon travels vertically, the mirrors move sideways, so the photon traces a diagonal zigzag — a longer path.",
          es: "Un astronauta que viaja *con* el reloj ve al fotón rebotar recto, arriba y abajo: el camino más corto posible. Pero tú, observando desde la Tierra mientras la nave pasa a toda velocidad, ves otra cosa: mientras el fotón viaja en vertical, los espejos se desplazan lateralmente, así que el fotón describe un zigzag diagonal, un camino más largo.",
        },
        {
          en: "Here is the punchline: postulate 2 says the photon travels at c for *both* observers. Same speed, longer path — so the Earth observer must measure *more time* between ticks. The moving clock ticks slower, not because it is broken, but because geometry plus an invariant light speed leaves no alternative.",
          es: "Y aquí el remate: el postulado 2 dice que el fotón viaja a c para *ambos* observadores. Misma velocidad, camino más largo: el observador terrestre debe medir *más tiempo* entre tics. El reloj en movimiento atrasa, no porque esté roto, sino porque la geometría más una velocidad de la luz invariante no deja otra alternativa.",
        },
      ],
      keyIdea: {
        en: "Longer light path at the same speed c means more time per tick. Time dilation is forced by the two postulates — no extra assumptions needed.",
        es: "Un camino de luz más largo a la misma velocidad c significa más tiempo por tic. La dilatación del tiempo la imponen los dos postulados, sin supuestos adicionales.",
      },
    },
    {
      heading: {
        en: "The Lorentz Factor γ",
        es: "El factor de Lorentz γ",
      },
      paragraphs: [
        {
          en: "How much slower? The answer is captured by a single number, the **Lorentz factor**, named after Hendrik Lorentz. It depends only on velocity, and it tells you exactly how much time stretches:",
          es: "¿Cuánto más lento? La respuesta la captura un solo número, el **factor de Lorentz**, nombrado en honor a Hendrik Lorentz. Solo depende de la velocidad y dice exactamente cuánto se estira el tiempo:",
        },
        {
          en: "At everyday speeds γ is essentially 1 — no measurable effect. At 0.5c it is about 1.15; at 0.9c about 2.29; at 0.99c about 7.09; at 0.999c it exceeds 22. The curve stays flat for a long time, then explodes upward as velocity approaches c. Try it in the Light Clock simulator: the divergence of the two clocks is gentle, then dramatic.",
          es: "A velocidades cotidianas γ es esencialmente 1: ningún efecto medible. A 0,5c es aproximadamente 1,15; a 0,9c, 2,29; a 0,99c, 7,09; a 0,999c supera 22. La curva permanece plana mucho tiempo y luego se dispara al acercarse a c. Pruébalo en el simulador del reloj de luz: la divergencia de los dos relojes es suave al principio y luego dramática.",
        },
      ],
      equation: "\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}",
      equationCaption: {
        en: "The Lorentz factor: the universal “stretch factor” of special relativity. It multiplies moving-clock times, divides moving lengths, and grows without bound as v approaches c.",
        es: "El factor de Lorentz: el «factor de estiramiento» universal de la relatividad especial. Multiplica los tiempos de relojes en movimiento, divide las longitudes en movimiento y crece sin límite cuando v se acerca a c.",
      },
    },
    {
      heading: {
        en: "Proper Time: The Clock That Travels",
        es: "Tiempo propio: el reloj que viaja",
      },
      paragraphs: [
        {
          en: "Physicists give a special name to the time measured by a clock that travels *with* the process it times: **proper time**, written τ. It is the time you feel on your wristwatch, the time your cells age by, the time a particle “experiences.”",
          es: "Los físicos dan un nombre especial al tiempo que mide un reloj que viaja *con* el proceso que cronometra: el **tiempo propio**, denotado τ. Es el tiempo que sientes en tu reloj de pulsera, el tiempo con el que envejecen tus células, el tiempo que una partícula «experimenta».",
        },
        {
          en: "An observer who sees that clock moving measures a longer, **dilated** time: Δt = γΔτ. The effect is perfectly symmetric — each inertial observer sees the *other's* clock running slow. That sounds paradoxical, and resolving it (the famous twin paradox) requires one twin to turn around — which breaks the symmetry.",
          es: "Un observador que ve ese reloj en movimiento mide un tiempo más largo, **dilatado**: Δt = γΔτ. El efecto es perfectamente simétrico: cada observador inercial ve el reloj *del otro* atrasar. Suena paradójico, y resolverlo (la famosa paradoja de los gemelos) exige que uno de los gemelos dé la vuelta, lo cual rompe la simetría.",
        },
      ],
      keyIdea: {
        en: "Proper time is what a clock reads along its own journey — and all observers agree on what each clock actually displayed.",
        es: "El tiempo propio es lo que un reloj marca a lo largo de su propio viaje, y todos los observadores están de acuerdo en lo que cada reloj mostró realmente.",
      },
      mathExtra: "\\Delta t = \\gamma\\,\\Delta\\tau",
      mathExtraCaption: {
        en: "Time dilation: the time Δt measured in a frame where the clock moves equals γ times the proper time Δτ read on the clock itself.",
        es: "Dilatación del tiempo: el tiempo Δt medido en un sistema donde el reloj se mueve es igual a γ veces el tiempo propio Δτ que marca el propio reloj.",
      },
    },
    {
      heading: {
        en: "Real Evidence: Muons Rain Down",
        es: "Evidencia real: lluvia de muones",
      },
      paragraphs: [
        {
          en: "This is not philosophy — it is measured daily. **Muons**, unstable particles created when cosmic rays strike the upper atmosphere (~10 km up), decay in about 2.2 microseconds. Even at nearly light speed, that lifetime should carry them only ~660 m. They should never reach the ground.",
          es: "Esto no es filosofía: se mide a diario. Los **muones**, partículas inestables creadas cuando los rayos cósmicos golpean la alta atmósfera (a unos 10 km de altura), decaen en unos 2,2 microsegundos. Incluso a casi la velocidad de la luz, esa vida media solo debería llevarlos unos 660 m. Jamás deberían llegar al suelo.",
        },
        {
          en: "Yet detectors at sea level count them by the thousands. Why? The muons travel at about 0.998c, where γ ≈ 16. In Earth's frame their internal clocks run 16 times slower, so they live 16 times longer — long enough to reach us. (From the muon's perspective, it is the *distance* that shrinks — length contraction, coming up next module.)",
          es: "Sin embargo, los detectores a nivel del mar los cuentan por miles. ¿Por qué? Los muones viajan a unos 0,998c, donde γ ≈ 16. En el sistema terrestre sus relojes internos van 16 veces más despacio, así que viven 16 veces más: lo suficiente para llegarnos. (Desde la perspectiva del muón, es la *distancia* la que se encoge: la contracción de la longitud, en el próximo módulo.)",
        },
        {
          en: "Particle accelerators confirm the same effect with exquisite precision: fast-moving unstable particles consistently outlive their rest lifetimes by exactly the factor γ. Nature does the light-clock experiment continuously, all around us.",
          es: "Los aceleradores de partículas confirman el mismo efecto con precisión exquisita: las partículas inestables rápidas superan sistemáticamente su vida media en reposo exactamente por el factor γ. La naturaleza repite el experimento del reloj de luz continuamente, a nuestro alrededor.",
        },
      ],
      keyIdea: {
        en: "Muons reach the ground only because their clocks run slow in our frame. Time dilation is an experimental fact, not a thought experiment.",
        es: "Los muones llegan al suelo solo porque sus relojes atrasan en nuestro sistema. La dilatación del tiempo es un hecho experimental, no un experimento mental.",
      },
    },
    {
      heading: {
        en: "A Journey to the Stars",
        es: "Un viaje a las estrellas",
      },
      paragraphs: [
        {
          en: "Now the human version. Proxima Centauri lies 4.24 light-years away. A ship cruising at 0.9c (γ ≈ 2.29) takes about 4.7 years of *Earth* time to get there — but the astronauts' clocks, their bodies, their proper time, record only about 2.05 years. They age less than half as much as the people they left behind.",
          es: "Ahora la versión humana. Próxima Centauri está a 4,24 años luz. Una nave a 0,9c (γ ≈ 2,29) tarda unos 4,7 años de tiempo *terrestre* en llegar, pero los relojes de los astronautas, sus cuerpos, su tiempo propio, registran solo unos 2,05 años. Envejecen menos de la mitad que quienes se quedaron atrás.",
        },
        {
          en: "A fair warning about the simulator: real journeys need acceleration and deceleration phases, which complicate the calculation. The Journey lab uses the standard idealization of instant turnaround at constant cruise speed — clearly labelled as an approximation, and excellent for building intuition.",
          es: "Una advertencia honesta sobre el simulador: los viajes reales necesitan fases de aceleración y frenado, que complican el cálculo. El laboratorio de viajes usa la idealización estándar de giro instantáneo a velocidad de crucero constante, claramente marcada como aproximación y excelente para construir intuición.",
        },
        {
          en: "And what if the traveller comes *back*? Then the two twins reunite with genuinely different ages — the famous **twin paradox**. It is not a logical contradiction (the travelling twin changes inertial frames; the stay-at-home twin doesn't), and the full animated resolution awaits in the Twin Paradox lab.",
          es: "¿Y si el viajero *regresa*? Entonces los dos gemelos se reencuentran con edades genuinamente distintas: la famosa **paradoja de los gemelos**. No es una contradicción lógica (el gemelo viajero cambia de sistema inercial; el que se queda, no), y la resolución animada completa te espera en el laboratorio de la paradoja de los gemelos.",
        },
      ],
      keyIdea: {
        en: "At 0.9c, astronauts age roughly 2.29 times slower than Earth. Near light speed, the stars come within a human lifetime — on the traveller's clock.",
        es: "A 0,9c, los astronautas envejecen unas 2,29 veces más despacio que la Tierra. Cerca de la velocidad de la luz, las estrellas quedan a una vida humana de distancia… según el reloj del viajero.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Moving clocks are broken, or time dilation is just an optical illusion.",
        es: "Los relojes en movimiento están rotos, o la dilatación del tiempo es solo una ilusión óptica.",
      },
      reality: {
        en: "Every physical process slows identically — atomic vibrations, heartbeats, particle decays, chemical reactions. It is not the clock malfunctioning; it is what time itself does along a fast-moving path. Muon decay proves it.",
        es: "Todo proceso físico se ralentiza por igual: vibraciones atómicas, latidos, desintegraciones de partículas, reacciones químicas. No es que el reloj funcione mal: es lo que el tiempo mismo hace a lo largo de una trayectoria rápida. La desintegración de los muones lo demuestra.",
      },
    },
    {
      myth: {
        en: "“Everything is relative,” so nothing about time is really true.",
        es: "«Todo es relativo», así que nada sobre el tiempo es realmente verdad.",
      },
      reality: {
        en: "The speed of light and each traveller's proper time are invariant — every observer agrees on what each clock actually read when they reunite. Relativity disagrees about coordinate labels, never about physical meetings of clocks.",
        es: "La velocidad de la luz y el tiempo propio de cada viajero son invariantes: todo observador está de acuerdo en lo que cada reloj marcó realmente al reencontrarse. La relatividad discrepa sobre etiquetas de coordenadas, nunca sobre encuentros físicos de relojes.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "A spaceship travels at 0.9c, where γ ≈ 2.29. Its onboard clock records 1 year of proper time. How much time elapses on Earth?",
        es: "Una nave viaja a 0,9c, donde γ ≈ 2,29. Su reloj de a bordo registra 1 año de tiempo propio. ¿Cuánto tiempo transcurre en la Tierra?",
      },
      options: [
        { en: "1 year", es: "1 año" },
        { en: "About 0.44 years", es: "Unos 0,44 años" },
        { en: "About 2.29 years", es: "Unos 2,29 años" },
        { en: "About 5.24 years", es: "Unos 5,24 años" },
      ],
      answer: 2,
      why: {
        en: "Earth-frame time is dilated: Δt = γΔτ = 2.29 × 1 year. The moving clock's single year stretches to 2.29 years as seen from Earth.",
        es: "El tiempo terrestre se dilata: Δt = γΔτ = 2,29 × 1 año. El único año del reloj en movimiento se estira hasta 2,29 años visto desde la Tierra.",
      },
    },
    {
      q: {
        en: "Muons created 10 km up reach Earth's surface even though their 2.2 μs lifetime should limit them to ~660 m. Why?",
        es: "Los muones creados a 10 km de altura llegan a la superficie aunque su vida media de 2,2 μs debería limitarlos a ~660 m. ¿Por qué?",
      },
      options: [
        {
          en: "They travel faster than light",
          es: "Viajan más rápido que la luz",
        },
        {
          en: "Time dilation: in Earth's frame their clocks run slow by the factor γ, so they live longer",
          es: "Dilatación del tiempo: en el sistema terrestre sus relojes atrasan por el factor γ, así que viven más",
        },
        {
          en: "They are unaffected by the atmosphere",
          es: "La atmósfera no les afecta",
        },
        {
          en: "Their mass increases so they fall faster",
          es: "Su masa aumenta y por eso caen más rápido",
        },
      ],
      answer: 1,
      why: {
        en: "At ~0.998c, γ ≈ 16, so muons live ~16 times longer in Earth's frame — exactly enough to reach the ground. A daily, measured confirmation of time dilation.",
        es: "A ~0,998c, γ ≈ 16, así que los muones viven ~16 veces más en el sistema terrestre: justo lo suficiente para llegar al suelo. Una confirmación diaria y medida de la dilatación del tiempo.",
      },
    },
    {
      q: {
        en: "In the light-clock experiment, why does the Earth observer measure slower ticks than the astronaut?",
        es: "En el experimento del reloj de luz, ¿por qué el observador terrestre mide tics más lentos que el astronauta?",
      },
      options: [
        {
          en: "The photon moves slower when watched from Earth",
          es: "El fotón se mueve más despacio cuando se observa desde la Tierra",
        },
        {
          en: "The photon travels a longer diagonal path at the same speed c, so each tick takes more time",
          es: "El fotón recorre un camino diagonal más largo a la misma velocidad c, así que cada tic tarda más",
        },
        {
          en: "The mirrors are heavier in Earth's frame",
          es: "Los espejos son más pesados en el sistema terrestre",
        },
        {
          en: "Gravity from Earth slows the photon down",
          es: "La gravedad terrestre frena al fotón",
        },
      ],
      answer: 1,
      why: {
        en: "Postulate 2 fixes the photon's speed at c for both observers. The outside observer sees a longer zigzag path, and longer path ÷ same speed = more time per tick.",
        es: "El postulado 2 fija la velocidad del fotón en c para ambos observadores. El observador externo ve un zigzag más largo, y camino más largo ÷ misma velocidad = más tiempo por tic.",
      },
    },
    {
      q: {
        en: "Bob travels to a star at near-light speed and returns, while Alice stays on Earth. On reunion, Bob is younger. What resolves the apparent paradox?",
        es: "Bob viaja a una estrella a velocidad cercana a la luz y regresa, mientras Alice se queda en la Tierra. Al reencontrarse, Bob es más joven. ¿Qué resuelve la aparente paradoja?",
      },
      options: [
        {
          en: "Bob's clock was faulty during the trip",
          es: "El reloj de Bob falló durante el viaje",
        },
        {
          en: "The situation is not symmetric: Bob accelerates and changes inertial frames, Alice does not",
          es: "La situación no es simétrica: Bob acelera y cambia de sistema inercial, Alice no",
        },
        {
          en: "Alice actually travelled and Bob stayed still",
          es: "En realidad fue Alice quien viajó y Bob quien se quedó quieto",
        },
        {
          en: "Time dilation only works in one direction",
          es: "La dilatación del tiempo solo funciona en una dirección",
        },
      ],
      answer: 1,
      why: {
        en: "Each sees the other's clock slow while cruising — but Bob must turn around, switching inertial frames. That asymmetry picks out the traveller, and both frames agree: Bob ages less.",
        es: "Cada uno ve atrasar el reloj del otro durante el crucero, pero Bob debe dar la vuelta, cambiando de sistema inercial. Esa asimetría señala al viajero, y ambos sistemas están de acuerdo: Bob envejece menos.",
      },
    },
    {
      q: {
        en: "Which of these is the same for all inertial observers?",
        es: "¿Cuál de estas magnitudes es la misma para todos los observadores inerciales?",
      },
      options: [
        {
          en: "The tick rate of a moving clock",
          es: "El ritmo de un reloj en movimiento",
        },
        {
          en: "The speed of light in vacuum",
          es: "La velocidad de la luz en el vacío",
        },
        {
          en: "The simultaneity of distant events",
          es: "La simultaneidad de sucesos distantes",
        },
        {
          en: "The measured length of a moving ship",
          es: "La longitud medida de una nave en movimiento",
        },
      ],
      answer: 1,
      why: {
        en: "Postulate 2: c is invariant. Tick rates, simultaneity, and lengths all depend on the observer's frame — that frame-dependence is exactly what the invariant c forces.",
        es: "Postulado 2: c es invariante. Los ritmos, la simultaneidad y las longitudes dependen del sistema del observador; esa dependencia es justo lo que la c invariante obliga.",
      },
    },
  ],
};
