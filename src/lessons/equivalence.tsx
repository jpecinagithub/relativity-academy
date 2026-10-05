import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "In 1907 Einstein called it his 'happiest thought': a person falling from a roof feels no gravity. From that simple observation he built a bridge from special relativity to a completely new theory of gravity — and predicted that light itself must fall.",
    es: "En 1907 Einstein la llamó su 'pensamiento más feliz': una persona que cae de un tejado no siente la gravedad. De esa simple observación construyó un puente desde la relatividad especial hasta una teoría de la gravedad completamente nueva, y predijo que la propia luz debe caer.",
  },
  sections: [
    {
      heading: {
        en: "The happiest thought",
        es: "El pensamiento más feliz",
      },
      paragraphs: [
        {
          en: "Picture a painter slipping off a rooftop. During the fall — before air resistance matters — he feels weightless. Dropped tools float beside him. If he carries a scale, it reads zero. For those seconds, gravity has vanished from his personal experience, even though Earth is still pulling everything downward at 9.8 m/s².",
          es: "Imagina un pintor que resbala de un tejado. Durante la caída —antes de que importe la resistencia del aire— se siente ingrávido. Las herramientas flotan a su lado. Si lleva una báscula, marca cero. Durante esos segundos, la gravedad ha desaparecido de su experiencia personal, aunque la Tierra sigue tirando de todo hacia abajo a 9,8 m/s².",
        },
        {
          en: "Einstein's insight was that this is not a trick of perception: **locally, free fall abolishes gravity**. A freely falling laboratory is as good an inertial frame as deep space far from any mass. Gravity, unlike other forces, can be transformed away — and that smelled like a clue about its true nature.",
          es: "La idea de Einstein fue que esto no es un truco de la percepción: **localmente, la caída libre anula la gravedad**. Un laboratorio en caída libre es un sistema inercial tan bueno como el espacio profundo lejos de cualquier masa. La gravedad, a diferencia de otras fuerzas, puede hacerse desaparecer con un cambio de marco, y eso olía a pista sobre su verdadera naturaleza.",
        },
      ],
      keyIdea: {
        en: "In free fall, gravity disappears from your local experience — as if it were never a force at all.",
        es: "En caída libre, la gravedad desaparece de tu experiencia local, como si nunca hubiera sido una fuerza.",
      },
    },
    {
      heading: {
        en: "The elevator experiment",
        es: "El experimento del ascensor",
      },
      paragraphs: [
        {
          en: "Now seal the laboratory: a windowless elevator cabin. Scenario A: the cabin sits on Earth. Scenario B: the cabin floats in deep space while a rocket accelerates it upward at 9.8 m/s². Inside, you drop a ball — it falls to the floor. You stand on a scale — it reads your weight. You feel pressed to the floor.",
          es: "Ahora sella el laboratorio: una cabina de ascensor sin ventanas. Escenario A: la cabina reposa en la Tierra. Escenario B: la cabina flota en el espacio profundo mientras un cohete la acelera hacia arriba a 9,8 m/s². Dentro, sueltas una pelota: cae al suelo. Te subes a una báscula: marca tu peso. Te sientes pegado al suelo.",
        },
        {
          en: "No experiment performed entirely inside the cabin can tell the two scenarios apart. A ball falls for the same reason in both: in A, gravity pulls it down; in B, the floor accelerates up to meet it. **Locally, gravity and acceleration are indistinguishable.** Open the elevator simulator, toggle the external view, and try to catch the difference from inside — you can't.",
          es: "Ningún experimento realizado por completo dentro de la cabina puede distinguir ambos escenarios. La pelota cae por la misma razón en los dos: en A, la gravedad tira de ella; en B, el suelo acelera hacia arriba a su encuentro. **Localmente, gravedad y aceleración son indistinguibles.** Abre el simulador del ascensor, cambia a la vista externa e intenta notar la diferencia desde dentro: no podrás.",
        },
      ],
      keyIdea: {
        en: "In a small sealed cabin, no experiment distinguishes standing still in gravity from accelerating through empty space.",
        es: "En una cabina pequeña y sellada, ningún experimento distingue estar quieto en un campo gravitatorio de acelerar en el vacío.",
      },
    },
    {
      heading: {
        en: "Light must fall too",
        es: "La luz también debe caer",
      },
      paragraphs: [
        {
          en: "Here the thought experiment turns prophetic. Fire a laser horizontally across the accelerating elevator. While the photon crosses the cabin, the elevator keeps moving upward — so the beam strikes the far wall slightly lower than where it started. To the passenger, **the light beam bends downward**.",
          es: "Aquí el experimento mental se vuelve profético. Dispara un láser horizontal a través del ascensor en aceleración. Mientras el fotón cruza la cabina, el ascensor sigue subiendo, así que el rayo impacta la pared opuesta un poco más abajo de donde partió. Para el pasajero, **el rayo de luz se curva hacia abajo**.",
        },
        {
          en: "Now apply the equivalence principle: if acceleration bends light, gravity must bend light too — because no local experiment can tell them apart. In 1907, eight years before general relativity existed, Einstein had predicted **gravitational light bending**. The bending-light simulator lets you watch the curve form inside the elevator, then connects it to starlight grazing the Sun.",
          es: "Aplica ahora el principio de equivalencia: si la aceleración curva la luz, la gravedad también debe curvarla, porque ningún experimento local puede distinguirlas. En 1907, ocho años antes de que existiera la relatividad general, Einstein ya había predicho la **curvatura gravitatoria de la luz**. El simulador de luz curvada te deja ver cómo se forma la curva dentro del ascensor y luego la conecta con la luz de estrellas que roza el Sol.",
        },
      ],
      keyIdea: {
        en: "Equivalence turns an elevator observation into a prediction about the universe: gravity bends light.",
        es: "La equivalencia convierte una observación en un ascensor en una predicción sobre el universo: la gravedad curva la luz.",
      },
    },
    {
      heading: {
        en: "The fine print: \u201Clocal\u201D",
        es: "La letra pequeña: \u201Clocal\u201D",
      },
      paragraphs: [
        {
          en: "There is one word doing heavy lifting in this module: **local**. Make the elevator enormous — kilometers wide — and the trick fails. On Earth, two balls dropped far apart fall toward Earth's center along slightly converging lines; in the accelerating rocket, they fall on perfectly parallel lines. These **tidal effects** betray the difference.",
          es: "Hay una palabra que sostiene todo este módulo: **local**. Haz el ascensor enorme —de kilómetros de ancho— y el truco falla. En la Tierra, dos pelotas soltadas lejos una de otra caen hacia el centro terrestre por líneas ligeramente convergentes; en el cohete en aceleración, caen en líneas perfectamente paralelas. Estos **efectos de marea** delatan la diferencia.",
        },
        {
          en: "That failure is the doorway to general relativity. Gravity's true signature is not the local pull you feel — which acceleration can fake — but the way gravity varies from place to place. And 'the way gravity varies from place to place' is exactly what mathematicians call **curvature**. The next module follows that clue.",
          es: "Ese fallo es la puerta a la relatividad general. La verdadera firma de la gravedad no es el tirón local que sientes —que la aceleración puede falsificar—, sino cómo la gravedad varía de un lugar a otro. Y 'cómo varía la gravedad de un lugar a otro' es exactamente lo que los matemáticos llaman **curvatura**. El próximo módulo sigue esa pista.",
        },
      ],
      keyIdea: {
        en: "Equivalence is strictly local. The moment you look at a wide enough region, tidal differences reveal gravity — and point toward curved spacetime.",
        es: "La equivalencia es estrictamente local. En cuanto miras una región bastante amplia, las diferencias de marea revelan la gravedad y apuntan al espaciotiempo curvo.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "The equivalence principle says gravity IS acceleration.",
        es: "El principio de equivalencia dice que la gravedad ES aceleración.",
      },
      reality: {
        en: "Only locally and approximately. Globally, gravity has tidal effects — it pulls different parts of a large object in different directions — which no uniform acceleration can mimic. Those tides are the footprint of curvature.",
        es: "Solo localmente y de forma aproximada. Globalmente, la gravedad tiene efectos de marea —tira de distintas partes de un objeto grande en distintas direcciones—, algo que ninguna aceleración uniforme puede imitar. Esas mareas son la huella de la curvatura.",
      },
    },
    {
      myth: {
        en: "Astronauts in orbit feel no gravity because they are far from Earth.",
        es: "Los astronautas en órbita no sienten gravedad porque están lejos de la Tierra.",
      },
      reality: {
        en: "At the ISS altitude gravity is still about 90% of its surface value. Astronauts feel weightless because they are in continuous free fall around Earth — Einstein's happiest thought, running permanently.",
        es: "A la altura de la ISS la gravedad aún vale alrededor del 90% de la terrestre. Los astronautas se sienten ingrávidos porque están en caída libre continua alrededor de la Tierra: el pensamiento más feliz de Einstein, funcionando sin parar.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "Inside a sealed cabin you drop a ball and it falls to the floor. What can you conclude?",
        es: "Dentro de una cabina sellada sueltas una pelota y cae al suelo. ¿Qué puedes concluir?",
      },
      options: [
        {
          en: "Nothing by itself — a rocket accelerating at 1g in deep space would look identical",
          es: "Nada por sí solo: un cohete acelerando a 1g en el espacio se vería igual",
        },
        {
          en: "The cabin must be sitting on a planet",
          es: "La cabina debe estar sobre un planeta",
        },
        {
          en: "The cabin must be accelerating through space",
          es: "La cabina debe estar acelerando por el espacio",
        },
        { en: "Gravity does not exist", es: "La gravedad no existe" },
      ],
      answer: 0,
      why: {
        en: "Local experiments cannot distinguish gravity from acceleration — that indistinguishability is the principle itself.",
        es: "Los experimentos locales no distinguen gravedad de aceleración; esa indistinguibilidad es el principio mismo.",
      },
    },
    {
      q: {
        en: "Why did the elevator thought experiment predict that gravity bends light?",
        es: "¿Por qué el experimento del ascensor predijo que la gravedad curva la luz?",
      },
      options: [
        {
          en: "Because light bends in an accelerating elevator, and gravity is locally indistinguishable from acceleration",
          es: "Porque la luz se curva en un ascensor acelerado y la gravedad es localmente indistinguible de la aceleración",
        },
        {
          en: "Because photons have rest mass",
          es: "Porque los fotones tienen masa en reposo",
        },
        {
          en: "Because the elevator's walls are magnetic",
          es: "Porque las paredes del ascensor son magnéticas",
        },
        {
          en: "Because light always travels in curves",
          es: "Porque la luz siempre viaja en curvas",
        },
      ],
      answer: 0,
      why: {
        en: "Equivalence transfers every local effect of acceleration — including the bending beam — to gravity.",
        es: "La equivalencia traslada a la gravedad todo efecto local de la aceleración, incluido el rayo curvado.",
      },
    },
    {
      q: {
        en: "Two balls are dropped 10 km apart inside an enormously wide elevator. On Earth their paths converge slightly; in a rocket accelerating in deep space they stay parallel. What does this show?",
        es: "Dos pelotas se sueltan a 10 km de distancia dentro de un ascensor gigantesco. En la Tierra sus trayectorias convergen un poco; en un cohete que acelera en el espacio se mantienen paralelas. ¿Qué demuestra esto?",
      },
      options: [
        {
          en: "The equivalence principle holds only locally; tides reveal true gravity",
          es: "El principio de equivalencia solo vale localmente; las mareas revelan la gravedad real",
        },
        {
          en: "The equivalence principle is wrong",
          es: "El principio de equivalencia es falso",
        },
        {
          en: "Rockets cannot accelerate uniformly",
          es: "Los cohetes no pueden acelerar uniformemente",
        },
        {
          en: "Balls fall more slowly when far apart",
          es: "Las pelotas caen más despacio cuando están lejos",
        },
      ],
      answer: 0,
      why: {
        en: "Tidal (non-uniform) effects cannot be mimicked by uniform acceleration — they are gravity's unmistakable signature.",
        es: "Los efectos de marea (no uniformes) no pueden imitarse con aceleración uniforme: son la firma inconfundible de la gravedad.",
      },
    },
    {
      q: {
        en: "Einstein called the falling-observer insight his 'happiest thought' because…",
        es: "Einstein llamó a la idea del observador en caída su 'pensamiento más feliz' porque…",
      },
      options: [
        {
          en: "it suggested gravity could be abolished by choosing the right frame — a clue toward a geometric theory",
          es: "sugería que la gravedad puede anularse eligiendo el marco adecuado: una pista hacia una teoría geométrica",
        },
        {
          en: "it proved Newton wrong about everything",
          es: "demostraba que Newton se equivocaba en todo",
        },
        {
          en: "it showed that elevators are dangerous",
          es: "mostraba que los ascensores son peligrosos",
        },
        {
          en: "it explained why apples fall from trees",
          es: "explicaba por qué caen las manzanas de los árboles",
        },
      ],
      answer: 0,
      why: {
        en: "If gravity can be transformed away locally, perhaps it is not a force at all but an effect of spacetime geometry.",
        es: "Si la gravedad puede hacerse desaparecer localmente, quizá no sea una fuerza sino un efecto de la geometría del espaciotiempo.",
      },
    },
  ],
};
