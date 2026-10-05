import type { LessonContent } from "./types";

export const content: LessonContent = {
  intro: {
    en: "Push the logic of curved spacetime far enough and it breaks — gracefully, and with precise mathematics. A black hole is what remains when so much mass gathers in so little space that spacetime seals itself off: a region where all paths lead inward. This module approaches them honestly — no science fiction, no myths.",
    es: "Lleva la lógica del espaciotiempo curvo bastante lejos y se rompe, con elegancia y matemáticas precisas. Un agujero negro es lo que queda cuando tanta masa se reúne en tan poco espacio que el espaciotiempo se sella: una región donde todos los caminos llevan hacia dentro. Este módulo los aborda con honestidad, sin ciencia ficción ni mitos.",
  },
  sections: [
    {
      heading: {
        en: "How fast must you go to leave?",
        es: "¿A qué velocidad hay que ir para escapar?",
      },
      paragraphs: [
        {
          en: "Every world has an **escape velocity**: fire a cannonball from Earth faster than 11.2 km/s and it never falls back. The number grows with mass and shrinks with size — a denser, heavier world grips harder. Now keep squeezing: what if the escape velocity reached the speed of light?",
          es: "Todo mundo tiene una **velocidad de escape**: dispara una bala de cañón desde la Tierra a más de 11,2 km/s y nunca volverá a caer. El número crece con la masa y se reduce con el tamaño: un mundo más denso y pesado agarra más fuerte. Ahora sigue comprimiendo: ¿y si la velocidad de escape alcanzara la velocidad de la luz?",
        },
        {
          en: "Nothing outruns light — that is special relativity's iron rule. So a body compact enough that light itself cannot escape would be truly black: no signal, no image, no warning could ever leave it. This Newtonian-flavored intuition gets the right idea but the wrong details; general relativity refines it into something stranger and more precise.",
          es: "Nada supera a la luz: esa es la regla de hierro de la relatividad especial. Así que un cuerpo tan compacto que ni la propia luz pueda escapar sería verdaderamente negro: ninguna señal, imagen o aviso podría salir jamás de él. Esta intuición de sabor newtoniano acierta con la idea pero falla en los detalles; la relatividad general la refina en algo más extraño y preciso.",
        },
      ],
      keyIdea: {
        en: "Squeeze enough mass into a small enough space and even light cannot climb out. That is the seed of a black hole.",
        es: "Comprime bastante masa en un espacio bastante pequeño y ni la luz podrá salir. Esa es la semilla de un agujero negro.",
      },
    },
    {
      heading: {
        en: "The point of no return",
        es: "El punto de no retorno",
      },
      paragraphs: [
        {
          en: "For a non-rotating mass, general relativity draws a sharp boundary: the **event horizon**, a sphere of radius **r_s = 2GM/c²** — the **Schwarzschild radius**. Cross it, and every future path — every geodesic — points deeper inward. It is not a wall or a surface you could touch; it is a one-way boundary in the causal structure of spacetime, like the edge of a waterfall in a river of time.",
          es: "Para una masa sin rotación, la relatividad general traza un límite nítido: el **horizonte de sucesos**, una esfera de radio **r_s = 2GM/c²**, el **radio de Schwarzschild**. Al cruzarlo, todo camino futuro —toda geodésica— apunta hacia dentro. No es un muro ni una superficie que pudieras tocar; es un límite unidireccional en la estructura causal del espaciotiempo, como el borde de una cascada en un río de tiempo.",
        },
        {
          en: "The formula is disarmingly simple: the radius grows in direct proportion to mass. A solar-mass black hole spans about 3 km; the black hole at our galaxy's center, some 4 million solar masses, spans about 12 million km. Open the build-a-black-hole lab, drag the mass slider from one Sun to billions, and compare the horizon against the Earth, the Sun and the Solar System.",
          es: "La fórmula es engañosamente simple: el radio crece en proporción directa a la masa. Un agujero negro de una masa solar mide unos 3 km; el del centro de nuestra galaxia, unos 4 millones de masas solares, mide unos 12 millones de km. Abre el laboratorio de construir agujeros negros, arrastra el deslizador de masa desde un Sol hasta miles de millones y compara el horizonte con la Tierra, el Sol y el Sistema Solar.",
        },
        {
          en: "Just outside the horizon lies the **photon sphere** (at 1.5 r_s), where gravity can bend light into unstable circular orbits — the origin of the glowing ring photographed around M87* and Sagittarius A*.",
          es: "Justo fuera del horizonte está la **esfera de fotones** (a 1,5 r_s), donde la gravedad puede curvar la luz en órbitas circulares inestables: el origen del anillo brillante fotografiado alrededor de M87* y Sagitario A*.",
        },
      ],
      equation: "r_s = \\frac{2GM}{c^2}",
      equationCaption: {
        en: "Schwarzschild radius: the event-horizon size for a non-rotating mass M.",
        es: "Radio de Schwarzschild: el tamaño del horizonte de sucesos para una masa M sin rotación.",
      },
    },
    {
      heading: {
        en: "Two observers, two stories",
        es: "Dos observadores, dos historias",
      },
      paragraphs: [
        {
          en: "Now the famous scenario: you fall in while a friend watches from far away. **Your story** is surprisingly uneventful at the horizon itself — nothing special happens there; your wristwatch ticks normally, and you cross in finite **proper time**. (Tidal forces may have other plans for your body, but that is a separate, spaghettifying issue.)",
          es: "Ahora el escenario famoso: tú caes mientras un amigo observa desde lejos. **Tu historia** es sorprendentemente tranquila en el propio horizonte: allí no ocurre nada especial; tu reloj de pulsera avanza con normalidad y lo cruzas en un **tiempo propio** finito. (Las fuerzas de marea pueden tener otros planes para tu cuerpo, pero ese es otro asunto espaguetizante.)",
        },
        {
          en: "**Your friend's story** is different: light climbing out of the deepening gravity arrives ever more **redshifted** and delayed. Your image dims, reddens and freezes — but this is the distant coordinate description of signals struggling outward, not what you experience. You do not hang suspended at the horizon; from your own frame you fall straight through. Confusing the two descriptions is the source of the 'frozen astronaut' myth.",
          es: "**La historia de tu amigo** es distinta: la luz que asciende desde la gravedad cada vez más intensa llega cada vez más **corrida al rojo** y retrasada. Tu imagen se atenúa, enrojece y se congela, pero esta es la descripción coordenada y distante de señales que luchan por salir, no lo que tú experimentas. No quedas suspendido en el horizonte; desde tu propio marco caes directamente. Confundir ambas descripciones es el origen del mito del «astronauta congelado».",
        },
      ],
      keyIdea: {
        en: "The infaller crosses the horizon in finite proper time feeling nothing special; the distant observer sees the image fade and redshift forever. Both descriptions are correct — they are different frames.",
        es: "Quien cae cruza el horizonte en un tiempo propio finito sin notar nada especial; el observador lejano ve la imagen atenuarse y correrse al rojo para siempre. Ambas descripciones son correctas: son marcos distintos.",
      },
    },
    {
      heading: {
        en: "Black holes don't suck — but they do glow",
        es: "Los agujeros negros no succionan, pero sí brillan",
      },
      paragraphs: [
        {
          en: "Get the myth out of the way first: a black hole is not a cosmic vacuum cleaner. Replace the Sun with a solar-mass black hole and Earth's orbit would not change at all — same mass, same gravity at a distance. You must wander dangerously close before the difference matters; only inside the horizon is return impossible.",
          es: "Quitemos primero el mito: un agujero negro no es una aspiradora cósmica. Sustituye el Sol por un agujero negro de una masa solar y la órbita terrestre no cambiaría en absoluto: misma masa, misma gravedad a distancia. Hay que acercarse peligrosamente para que la diferencia importe; solo dentro del horizonte el retorno es imposible.",
        },
        {
          en: "What makes black holes brilliant — literally — is their **accretion disk**: gas spiraling inward heats to millions of degrees and outshines entire galaxies before vanishing past the horizon. That glowing disk, bent by the hole's own gravity into a ring around the shadow, is what the Event Horizon Telescope photographed in 2019. The lensing lab lets you bend a starfield around a mass yourself — the same physics, tamed into a sandbox.",
          es: "Lo que hace a los agujeros negros brillantes —literalmente— es su **disco de acreción**: el gas que espirala hacia dentro se calienta a millones de grados y eclipsa galaxias enteras antes de desaparecer tras el horizonte. Ese disco brillante, curvado por la propia gravedad del agujero en un anillo alrededor de la sombra, es lo que fotografió el Telescopio del Horizonte de Sucesos en 2019. El laboratorio de lentes te deja curvar tú mismo un campo de estrellas alrededor de una masa: la misma física, domesticada en un arenero.",
        },
      ],
      keyIdea: {
        en: "A black hole's gravity at a distance is ordinary; its accretion disk is extraordinary. The drama lives near the horizon, not light-years away.",
        es: "La gravedad de un agujero negro a distancia es ordinaria; su disco de acreción es extraordinario. El drama vive cerca del horizonte, no a años luz.",
      },
    },
  ],
  misconceptions: [
    {
      myth: {
        en: "Black holes suck everything around them like cosmic vacuum cleaners.",
        es: "Los agujeros negros succionan todo a su alrededor como aspiradoras cósmicas.",
      },
      reality: {
        en: "At a distance their gravity is identical to any object of the same mass — Earth's orbit would be unchanged if the Sun became a black hole. Only near and inside the horizon does escape become impossible.",
        es: "A distancia su gravedad es idéntica a la de cualquier objeto de la misma masa: la órbita terrestre no cambiaría si el Sol se convirtiera en un agujero negro. Solo cerca y dentro del horizonte la huida se vuelve imposible.",
      },
    },
    {
      myth: {
        en: "A falling astronaut freezes at the event horizon, stuck forever.",
        es: "Un astronauta en caída se congela en el horizonte de sucesos, atrapado para siempre.",
      },
      reality: {
        en: "The infaller crosses in finite proper time and notices nothing special at the horizon. The 'frozen' image is what a distant observer sees — redshifted light struggling out — a coordinate effect, not the infaller's experience.",
        es: "Quien cae cruza en un tiempo propio finito sin notar nada especial en el horizonte. La imagen «congelada» es lo que ve un observador lejano —luz corrida al rojo luchando por salir—, un efecto coordenado, no la experiencia de quien cae.",
      },
    },
    {
      myth: {
        en: "The event horizon is a physical surface you could stand on.",
        es: "El horizonte de sucesos es una superficie física sobre la que podrías posarte.",
      },
      reality: {
        en: "There is nothing there to touch — no wall, no membrane, no signpost. It is a boundary in causality: the set of points beyond which all paths lead inward. Locally, spacetime at the horizon of a large black hole feels perfectly ordinary.",
        es: "Allí no hay nada que tocar: ni muro, ni membrana, ni señal. Es un límite en la causalidad: el conjunto de puntos más allá de los cuales todos los caminos llevan hacia dentro. Localmente, el espaciotiempo en el horizonte de un agujero negro grande se siente perfectamente ordinario.",
      },
    },
  ],
  quiz: [
    {
      q: {
        en: "What is the event horizon?",
        es: "¿Qué es el horizonte de sucesos?",
      },
      options: [
        {
          en: "A one-way causal boundary: once crossed, all future paths lead inward",
          es: "Un límite causal unidireccional: al cruzarlo, todos los caminos futuros llevan hacia dentro",
        },
        {
          en: "A solid shell surrounding the black hole",
          es: "Una corteza sólida que rodea el agujero negro",
        },
        {
          en: "The glowing ring seen in black hole photos",
          es: "El anillo brillante de las fotos de agujeros negros",
        },
        {
          en: "The point where gravity becomes infinite",
          es: "El punto donde la gravedad se vuelve infinita",
        },
      ],
      answer: 0,
      why: {
        en: "The horizon is not a surface but a point of no return in spacetime's causal structure; the singularity (not the horizon) is where known physics breaks down.",
        es: "El horizonte no es una superficie sino un punto de no retorno en la estructura causal del espaciotiempo; la singularidad (no el horizonte) es donde la física conocida se rompe.",
      },
    },
    {
      q: {
        en: "A 10-solar-mass black hole has a Schwarzschild radius of ~30 km. What is the horizon radius of a 20-solar-mass black hole?",
        es: "Un agujero negro de 10 masas solares tiene un radio de Schwarzschild de ~30 km. ¿Cuál es el radio del horizonte de uno de 20 masas solares?",
      },
      options: [
        { en: "~60 km", es: "~60 km" },
        { en: "~30 km", es: "~30 km" },
        { en: "~120 km", es: "~120 km" },
        { en: "~300 km", es: "~300 km" },
      ],
      answer: 0,
      why: {
        en: "r_s = 2GM/c² is directly proportional to mass — double the mass, double the radius.",
        es: "r_s = 2GM/c² es directamente proporcional a la masa: doble masa, doble radio.",
      },
    },
    {
      q: {
        en: "You fall into a large black hole while a distant friend watches. What happens at the horizon?",
        es: "Caes en un agujero negro grande mientras un amigo lejano observa. ¿Qué ocurre en el horizonte?",
      },
      options: [
        {
          en: "You cross in finite proper time feeling nothing special; your friend sees your image redshift and fade",
          es: "Cruzas en un tiempo propio finito sin notar nada especial; tu amigo ve tu imagen correrse al rojo y atenuarse",
        },
        {
          en: "You freeze at the horizon forever",
          es: "Te congelas en el horizonte para siempre",
        },
        {
          en: "You bounce off the horizon",
          es: "Rebotas en el horizonte",
        },
        {
          en: "Time stops for both of you",
          es: "El tiempo se detiene para ambos",
        },
      ],
      answer: 0,
      why: {
        en: "The infaller's proper time to the horizon is finite; the 'frozen' view is the distant observer's redshifted, delayed light — a frame-dependent description.",
        es: "El tiempo propio de quien cae hasta el horizonte es finito; la visión «congelada» es la luz corrida al rojo y retrasada del observador lejano: una descripción que depende del marco.",
      },
    },
    {
      q: {
        en: "If the Sun were replaced by a black hole of the same mass, what would happen to Earth's orbit?",
        es: "Si el Sol fuera sustituido por un agujero negro de la misma masa, ¿qué pasaría con la órbita terrestre?",
      },
      options: [
        {
          en: "Nothing — the orbit would stay exactly the same",
          es: "Nada: la órbita seguiría exactamente igual",
        },
        {
          en: "Earth would be sucked in immediately",
          es: "La Tierra sería succionada de inmediato",
        },
        {
          en: "Earth would fly off into space",
          es: "La Tierra saldría volando al espacio",
        },
        {
          en: "The year would become shorter",
          es: "El año se haría más corto",
        },
      ],
      answer: 0,
      why: {
        en: "Outside the horizon, a black hole's gravity is identical to any spherical mass of the same M. 'Sucking' is a myth.",
        es: "Fuera del horizonte, la gravedad de un agujero negro es idéntica a la de cualquier masa esférica de la misma M. La «succión» es un mito.",
      },
    },
  ],
};
