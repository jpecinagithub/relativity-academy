export interface TimelineEvent {
  year: string;
  title: { en: string; es: string };
  text: { en: string; es: string };
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: "1865",
    title: { en: "Maxwell's equations", es: "Las ecuaciones de Maxwell" },
    text: {
      en: "James Clerk Maxwell unifies electricity and magnetism, and his equations predict electromagnetic waves travelling at a fixed speed — the speed of light, c. Light turns out to be an electromagnetic wave, raising an awkward question: speed relative to what?",
      es: "James Clerk Maxwell unifica la electricidad y el magnetismo, y sus ecuaciones predicen ondas electromagnéticas que viajan a una velocidad fija: la velocidad de la luz, c. La luz resulta ser una onda electromagnética, lo que plantea una pregunta incómoda: ¿velocidad respecto a qué?",
    },
  },
  {
    year: "1887",
    title: { en: "Michelson–Morley experiment", es: "El experimento de Michelson y Morley" },
    text: {
      en: "Albert Michelson and Edward Morley try to detect Earth's motion through the hypothetical 'luminiferous ether' — and find nothing. The null result did not single-handedly 'disprove the ether', but it removed the expected evidence for it and left physics with the puzzle Einstein would soon solve: light's speed refuses to change.",
      es: "Albert Michelson y Edward Morley intentan detectar el movimiento de la Tierra a través del hipotético «éter luminífero»… y no encuentran nada. El resultado nulo no «refutó el éter» por sí solo, pero eliminó la evidencia esperada a su favor y dejó a la física con el enigma que Einstein resolvería pronto: la velocidad de la luz se niega a cambiar.",
    },
  },
  {
    year: "1905",
    title: { en: "Special Relativity", es: "La relatividad especial" },
    text: {
      en: "In 'On the Electrodynamics of Moving Bodies', a 26-year-old patent clerk named Albert Einstein derives special relativity from two postulates: physics is the same in all inertial frames, and the speed of light is the same for everyone. Absolute space and absolute time quietly fall apart.",
      es: "En «Sobre la electrodinámica de los cuerpos en movimiento», un empleado de patentes de 26 años llamado Albert Einstein deduce la relatividad especial a partir de dos postulados: la física es la misma en todos los sistemas inerciales y la velocidad de la luz es la misma para todos. El espacio y el tiempo absolutos se desmoronan en silencio.",
    },
  },
  {
    year: "1905",
    title: { en: "E = mc²", es: "E = mc²" },
    text: {
      en: "In the same miraculous year, Einstein shows that mass is a form of energy: even a body at rest carries energy E₀ = mc². A tiny amount of mass therefore hides an enormous amount of energy — the principle behind nuclear energy, decades before anyone could exploit it.",
      es: "En el mismo año milagroso, Einstein muestra que la masa es una forma de energía: incluso un cuerpo en reposo porta la energía E₀ = mc². Una cantidad minúscula de masa esconde así una energía enorme: el principio detrás de la energía nuclear, décadas antes de que nadie pudiera aprovecharla.",
    },
  },
  {
    year: "1907",
    title: { en: "The equivalence principle", es: "El principio de equivalencia" },
    text: {
      en: "Einstein has what he later calls his 'happiest thought': a freely falling observer feels no gravity, and gravity is locally indistinguishable from acceleration. This simple insight — the equivalence principle — becomes the bridge from special to general relativity.",
      es: "Einstein tiene lo que más tarde llamará su «pensamiento más feliz»: un observador en caída libre no siente la gravedad, y la gravedad es localmente indistinguible de la aceleración. Esta sencilla idea —el principio de equivalencia— se convierte en el puente entre la relatividad especial y la general.",
    },
  },
  {
    year: "1915",
    title: { en: "General Relativity", es: "La relatividad general" },
    text: {
      en: "After eight years of struggle, Einstein presents the field equations of general relativity: matter and energy curve spacetime, and curved spacetime guides matter. Gravity is no longer a force pulling across space — it is the geometry of spacetime itself.",
      es: "Tras ocho años de lucha, Einstein presenta las ecuaciones de campo de la relatividad general: la materia y la energía curvan el espaciotiempo, y el espaciotiempo curvo guía a la materia. La gravedad deja de ser una fuerza que tira a través del espacio: es la propia geometría del espaciotiempo.",
    },
  },
  {
    year: "1919",
    title: { en: "Eddington's eclipse expedition", es: "La expedición del eclipse de Eddington" },
    text: {
      en: "Arthur Eddington's teams observe starlight bending near the Sun during a total solar eclipse, broadly confirming Einstein's prediction. The measurements carried large uncertainties and the analysis was debated, but the result made Einstein world-famous and gave general relativity its first dramatic empirical test.",
      es: "Los equipos de Arthur Eddington observan la desviación de la luz de las estrellas cerca del Sol durante un eclipse total, confirmando a grandes rasgos la predicción de Einstein. Las mediciones tenían grandes incertidumbres y el análisis fue debatido, pero el resultado hizo mundialmente famoso a Einstein y dio a la relatividad general su primera prueba empírica espectacular.",
    },
  },
  {
    year: "1960s",
    title: { en: "Relativistic astrophysics is born", es: "Nace la astrofísica relativista" },
    text: {
      en: "The discoveries of quasars and pulsars — plus maturing black-hole mathematics — turn relativity from elegant theory into the toolkit of astrophysics. Extreme gravity stops being a thought experiment and becomes something telescopes can actually observe.",
      es: "El descubrimiento de los cuásares y los púlsares —junto con la madurez de las matemáticas de los agujeros negros— convierte la relatividad de elegante teoría en la caja de herramientas de la astrofísica. La gravedad extrema deja de ser un experimento mental y se vuelve algo que los telescopios pueden observar de verdad.",
    },
  },
  {
    year: "1970s",
    title: { en: "GPS needs relativity", es: "El GPS necesita la relatividad" },
    text: {
      en: "As satellite navigation is developed, engineers find that satellite clocks tick faster (weaker gravity, a general-relativistic effect) yet slower (orbital speed, a special-relativistic effect) than Earth clocks. Without correcting both, GPS positions would drift by kilometres per day — relativity becomes everyday engineering.",
      es: "Al desarrollar la navegación por satélite, los ingenieros descubren que los relojes de los satélites avanzan más rápido (gravedad más débil, efecto de relatividad general) y a la vez más lento (velocidad orbital, efecto de relatividad especial) que los relojes terrestres. Sin corregir ambos efectos, las posiciones del GPS derivarían kilómetros al día: la relatividad se vuelve ingeniería cotidiana.",
    },
  },
  {
    year: "2015",
    title: { en: "Gravitational waves detected", es: "Se detectan las ondas gravitatorias" },
    text: {
      en: "The LIGO observatories detect ripples in spacetime from two colliding black holes 1.3 billion light-years away — a century after Einstein predicted them. Humanity gains a new sense: we can now 'hear' the universe through gravity itself.",
      es: "Los observatorios LIGO detectan ondulaciones del espaciotiempo procedentes de dos agujeros negros en colisión a 1300 millones de años luz, un siglo después de que Einstein las predijera. La humanidad gana un nuevo sentido: ahora podemos «escuchar» el universo a través de la propia gravedad.",
    },
  },
  {
    year: "2019",
    title: { en: "First image of a black hole", es: "Primera imagen de un agujero negro" },
    text: {
      en: "The Event Horizon Telescope — a planet-sized virtual observatory — reveals the shadow of the supermassive black hole in galaxy M87. The glowing ring of superheated gas, bent by extreme gravity, matches general relativity's predictions in stunning detail.",
      es: "El Telescopio del Horizonte de Sucesos —un observatorio virtual del tamaño de un planeta— revela la sombra del agujero negro supermasivo de la galaxia M87. El anillo brillante de gas supercaliente, doblado por la gravedad extrema, coincide con las predicciones de la relatividad general con un detalle asombroso.",
    },
  },
];
