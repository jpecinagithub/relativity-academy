import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, FlaskConical, Lightbulb, Trophy, Check, Circle, Loader,
} from "lucide-react";
import { useApp } from "../stores/app";
import { useG, ParamSlider, PhysicsValue, DifficultyBadge } from "../components/ui";
import { usePrefersReducedMotion } from "../hooks/useAnimation";
import { lorentzFactor } from "../physics/specialRelativity";
import { C } from "../physics/constants";
import { fmt } from "../physics/units";
import { modules } from "../data/modules";
import { sims, categoryLabel, simById } from "../sims/registry";
import { AUTHOR } from "../data/config";

const STRINGS = {
  en: {
    heroKicker: "An interactive physics laboratory",
    titleA: "RELATIVITY",
    titleB: "Fundamentals Academy",
    sub: "Space bends. Time stretches. Light sets the rules.",
    sub2: "Learn Einstein's universe by experimenting with it.",
    dragHint: "Move your cursor — the mass follows, spacetime bends",
    miniTitle: "Touch spacetime in 10 seconds",
    miniSub: "Drag the slider. Watch what happens to time and space as you approach the speed of light.",
    velocity: "Velocity",
    gamma: "Lorentz factor γ",
    traveller: "1 year for the traveller",
    earth: "…passes on Earth",
    contracted: "Length seen from Earth",
    moonNote: (s: string) => `At this speed you'd cross the Earth–Moon distance in ${s}.`,
    pathTitle: "The learning path",
    pathSub: "From Newton to black holes — every step is an experiment.",
    featuredKicker: "Featured experiment",
    featuredTitle: "The Light Clock",
    featuredText: "A photon bouncing between two mirrors. Watch it from the ship — then from Earth — and discover why moving clocks run slow. This single experiment contains the whole of special relativity.",
    openSim: "Open the experiment",
    srTitle: "Special Relativity",
    srText: "The physics of high speed: time dilation, length contraction, and the cosmic speed limit. Everything follows from two postulates.",
    grTitle: "General Relativity",
    grText: "Gravity is not a force — it is the curvature of spacetime. Clocks tick differently, orbits precess, light bends.",
    explore: "Explore the modules",
    labTitle: "Spacetime Laboratory",
    labSub: "Every experiment, free to explore — no course order required.",
    thoughtTitle: "Einstein's Thought Experiments",
    thoughtSub: "The imagined laboratories where relativity was born.",
    thoughtCta: "Enter the stories",
    challengeTitle: "The Einstein Challenge",
    challengeSub: "18 questions. Six categories. Can you think like Einstein?",
    challengeCta: "Take the challenge",
    aboutKicker: "About this project",
    aboutText: "Relativity Fundamentals Academy is an educational initiative to make Einstein's ideas tangible through interactive technology — a laboratory disguised as a course. All simulations run locally in your browser; no account, no server.",
    startCourse: "Start the course",
  },
  es: {
    heroKicker: "Un laboratorio de física interactivo",
    titleA: "RELATIVIDAD",
    titleB: "Academia de Fundamentos",
    sub: "El espacio se curva. El tiempo se estira. La luz pone las reglas.",
    sub2: "Aprende el universo de Einstein experimentando con él.",
    dragHint: "Mueve el cursor: la masa te sigue y el espaciotiempo se curva",
    miniTitle: "Toca el espaciotiempo en 10 segundos",
    miniSub: "Arrastra el deslizador. Observa qué le ocurre al tiempo y al espacio al acercarte a la velocidad de la luz.",
    velocity: "Velocidad",
    gamma: "Factor de Lorentz γ",
    traveller: "1 año para el viajero",
    earth: "…pasan en la Tierra",
    contracted: "Longitud vista desde la Tierra",
    moonNote: (s: string) => `A esta velocidad cruzarías la distancia Tierra–Luna en ${s}.`,
    pathTitle: "La ruta de aprendizaje",
    pathSub: "De Newton a los agujeros negros: cada paso es un experimento.",
    featuredKicker: "Experimento destacado",
    featuredTitle: "El reloj de luz",
    featuredText: "Un fotón rebotando entre dos espejos. Obsérvalo desde la nave — y luego desde la Tierra — y descubre por qué los relojes en movimiento atrasan. Este solo experimento contiene toda la relatividad especial.",
    openSim: "Abrir el experimento",
    srTitle: "Relatividad especial",
    srText: "La física de las altas velocidades: dilatación del tiempo, contracción de la longitud y el límite cósmico de velocidad. Todo se deduce de dos postulados.",
    grTitle: "Relatividad general",
    grText: "La gravedad no es una fuerza: es la curvatura del espaciotiempo. Los relojes marcan distinto, las órbitas precesan, la luz se curva.",
    explore: "Explorar los módulos",
    labTitle: "Laboratorio del espaciotiempo",
    labSub: "Todos los experimentos, libres para explorar, sin orden obligatorio.",
    thoughtTitle: "Experimentos mentales de Einstein",
    thoughtSub: "Los laboratorios imaginarios donde nació la relatividad.",
    thoughtCta: "Entrar en las historias",
    challengeTitle: "El desafío Einstein",
    challengeSub: "18 preguntas. Seis categorías. ¿Puedes pensar como Einstein?",
    challengeCta: "Aceptar el desafío",
    aboutKicker: "Sobre este proyecto",
    aboutText: "Relativity Fundamentals Academy es una iniciativa educativa para hacer tangibles las ideas de Einstein mediante tecnología interactiva: un laboratorio disfrazado de curso. Todas las simulaciones se ejecutan en tu navegador; sin cuentas ni servidores.",
    startCourse: "Empezar el curso",
  },
} as const;

// ─── Hero: interactive spacetime grid ─────────────────────────────────────────
function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouse = useRef({ x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.tx = (e.clientX - r.left) / r.width;
      mouse.current.ty = (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const dark = () => document.documentElement.dataset.theme !== "light";

    const draw = (t: number) => {
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.06;
      m.y += (m.ty - m.y) * 0.06;
      const mx = m.x * w, my = m.y * h;
      const breathe = reduced ? 0 : Math.sin(t / 2400) * 6;

      ctx.clearRect(0, 0, w, h);
      const horizon = h * 0.52;
      const massR = Math.min(w, h) * 0.055;

      // mass glow (subtle)
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, massR * 6);
      const cyan = dark() ? "62,230,255" : "8,145,178";
      glow.addColorStop(0, `rgba(${cyan},0.16)`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // warped grid
      const N = 26;
      ctx.lineWidth = 1;
      const warp = (x: number, y: number) => {
        const dx = x - mx, dy = y - my;
        const d2 = dx * dx + dy * dy;
        const depth = (massR * massR * 900) / (d2 + massR * massR * 60);
        return y + Math.min(depth, h * 0.35);
      };
      ctx.strokeStyle = dark() ? "rgba(120,170,255,0.13)" : "rgba(30,60,120,0.14)";
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * w;
        for (let j = 0; j < 60; j++) {
          const y0 = horizon + (j / 60) * (h - horizon);
          const y1 = horizon + ((j + 1) / 60) * (h - horizon);
          const wy0 = warp(x, y0), wy1 = warp(x, y1);
          if (j === 0) ctx.moveTo(x, wy0); else ctx.lineTo(x, wy0);
          void wy1;
        }
      }
      // horizontal lines
      for (let j = 0; j <= 14; j++) {
        const y = horizon + (j / 14) * (h - horizon);
        ctx.moveTo(0, warp(0, y));
        for (let i = 1; i <= 40; i++) {
          const x = (i / 40) * w;
          ctx.lineTo(x, warp(x, y));
        }
      }
      ctx.stroke();

      // the mass
      ctx.beginPath();
      ctx.arc(mx, my + breathe * 0.3, massR, 0, Math.PI * 2);
      ctx.fillStyle = dark() ? "#f5a524" : "#b45309";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mx, my + breathe * 0.3, massR * 1.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${cyan},0.35)`;
      ctx.stroke();

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    if (reduced) draw(0);
    else raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

// ─── Mini experiment ──────────────────────────────────────────────────────────
type HomeStrings = (typeof STRINGS)[keyof typeof STRINGS];

function MiniExperiment({ s }: { s: HomeStrings }) {
  const { lang } = useG();
  const [x, setX] = useState(0.72);
  const beta = Math.pow(x, 2.4) * 0.999;
  const v = beta * C;
  const gamma = lorentzFactor(v);
  const earthYears = gamma; // 1 traveller year
  const contractedPct = 100 / gamma;
  const moonS = 384_400_000 / Math.max(v, 1);

  return (
    <div className="panel mx-auto max-w-4xl p-6 md:p-8" style={{ boxShadow: "var(--shadow)" }}>
      <div className="mb-1 flex items-center gap-2">
        <FlaskConical size={18} style={{ color: "var(--cyan)" }} />
        <h2 className="font-display text-xl font-bold md:text-2xl">{s.miniTitle}</h2>
      </div>
      <p className="mb-6 text-sm" style={{ color: "var(--text-dim)" }}>{s.miniSub}</p>
      <ParamSlider
        label={s.velocity}
        value={x}
        min={0}
        max={1}
        step={0.001}
        onChange={setX}
        format={() => `${beta.toFixed(3)}c`}
      />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <PhysicsValue label={s.gamma} value={gamma >= 100 ? "22.4+" : gamma.toFixed(2)} accent="cyan" />
        <PhysicsValue
          label={s.traveller}
          value={earthYears >= 10 ? earthYears.toFixed(1) : earthYears.toFixed(2)}
          unit={lang === "es" ? "años" : "yrs"}
          accent="amber"
          title={s.earth}
        />
        <PhysicsValue label={s.contracted} value={`${contractedPct.toFixed(1)}%`} accent="violet" />
        <PhysicsValue label="v" value={fmt(v / 1000, lang)} unit="km/s" accent="green" />
      </div>
      {moonS < 3600 && (
        <p className="mt-4 text-sm italic" style={{ color: "var(--text-dim)" }}>
          {s.moonNote(moonS < 60 ? `${moonS.toFixed(2)} s` : `${(moonS / 60).toFixed(1)} min`)}
        </p>
      )}
      <Link to="/lab/light-clock" className="btn-primary mt-6 text-sm">
        {s.openSim} <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// ─── Learning path ────────────────────────────────────────────────────────────
function LearningPath({ s }: { s: HomeStrings }) {
  const { lang } = useG();
  const completed = useApp((st) => st.completedModules);
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="font-display text-2xl font-bold md:text-3xl">{s.pathTitle}</h2>
      <p className="mb-8 mt-2" style={{ color: "var(--text-dim)" }}>{s.pathSub}</p>
      <ol className="relative space-y-0">
        {modules.map((m, i) => {
          const done = completed.includes(m.id);
          const next = !done && (i === 0 || completed.includes(modules[i - 1].id));
          return (
            <li key={m.id} className="relative flex gap-4 pb-6 last:pb-0">
              {i < modules.length - 1 && (
                <span className="absolute left-[19px] top-10 h-[calc(100%-2rem)] w-px" style={{ background: "var(--border)" }} aria-hidden />
              )}
              <span
                className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono2 text-sm font-bold"
                style={
                  done
                    ? { background: "var(--green)", borderColor: "var(--green)", color: "#04140a" }
                    : next
                      ? { background: "var(--cyan-dim)", borderColor: "var(--cyan)", color: "var(--cyan)" }
                      : { background: "var(--bg-panel)", borderColor: "var(--border)", color: "var(--text-faint)" }
                }
              >
                {done ? <Check size={16} /> : next ? <Loader size={15} /> : <Circle size={12} />}
              </span>
              <Link to={`/learn/${m.id}`} className="panel group flex-1 p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold">
                    <span className="mr-2 font-mono2 text-xs" style={{ color: "var(--text-faint)" }}>
                      {String(i).padStart(2, "0")}
                    </span>
                    {m.title[lang]}
                  </h3>
                  <ArrowRight size={16} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--cyan)" }} />
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{m.tagline[lang]}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ─── Sim card ─────────────────────────────────────────────────────────────────
function SimCard({ id }: { id: string }) {
  const { lang } = useG();
  const meta = simById(id);
  if (!meta) return null;
  return (
    <Link to={`/lab/${id}`} className="panel group p-4 transition-transform hover:-translate-y-1">
      <div className="mb-2 flex items-center justify-between">
        <DifficultyBadge level={meta.difficulty} />
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider" style={{ color: "var(--violet)" }}>
          {categoryLabel[meta.category][lang]}
        </span>
      </div>
      <h3 className="font-display font-bold">{meta.title[lang]}</h3>
      <p className="mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{meta.concept[lang]}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
        <FlaskConical size={14} />
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { lang, g } = useG();
  const s = STRINGS[lang];
  const reduced = usePrefersReducedMotion();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, var(--bg) 100%)" }} aria-hidden />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start px-4 pb-24 pt-20 md:pb-32 md:pt-28">
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="chip mb-5"
          >
            {s.heroKicker}
          </motion.p>
          <motion.h1
            initial={reduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display text-5xl font-bold leading-[1.02] md:text-7xl"
          >
            {s.titleA}
            <span className="block text-3xl font-medium md:text-5xl" style={{ color: "var(--cyan)" }}>
              {s.titleB}
            </span>
          </motion.h1>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="font-display mt-5 max-w-2xl text-xl md:text-2xl"
          >
            {s.sub}
          </motion.p>
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-2 max-w-xl text-lg"
            style={{ color: "var(--text-dim)" }}
          >
            {s.sub2}
          </motion.p>
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-auto mt-8 flex flex-wrap gap-3"
          >
            <Link to="/learn" className="btn-primary">
              {g.actions.startLearning} <ArrowRight size={17} />
            </Link>
            <Link to="/lab" className="btn-ghost">
              <FlaskConical size={17} /> {g.actions.openLab}
            </Link>
          </motion.div>
          <p className="mt-6 text-xs italic" style={{ color: "var(--text-faint)" }}>{s.dragHint}</p>
        </div>
      </section>

      {/* MINI EXPERIMENT */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4">
        <MiniExperiment s={s} />
      </section>

      {/* LEARNING PATH */}
      <LearningPath s={s} />

      {/* FEATURED: LIGHT CLOCK */}
      <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <p className="chip mb-4">{s.featuredKicker}</p>
            <h2 className="font-display text-3xl font-bold">{s.featuredTitle}</h2>
            <p className="mt-4 leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.featuredText}</p>
            <Link to="/lab/light-clock" className="btn-primary mt-6">
              {s.openSim} <ArrowRight size={16} />
            </Link>
          </div>
          <Link to="/lab/light-clock" className="panel group relative overflow-hidden p-8 text-center" aria-label={s.featuredTitle}>
            {/* stylized light-clock motif */}
            <svg viewBox="0 0 300 220" className="mx-auto w-full max-w-sm" role="img" aria-hidden>
              <rect x="60" y="30" width="180" height="12" rx="6" fill="var(--cyan)" opacity="0.9" />
              <rect x="60" y="178" width="180" height="12" rx="6" fill="var(--cyan)" opacity="0.9" />
              <line x1="150" y1="42" x2="150" y2="178" stroke="var(--amber)" strokeWidth="3" strokeDasharray="8 6" />
              <circle cx="150" cy="110" r="10" fill="var(--amber)">
                {!reduced && <animate attributeName="cy" values="46;174;46" dur="2.4s" repeatCount="indefinite" />}
              </circle>
              <line x1="150" y1="42" x2="238" y2="178" stroke="var(--violet)" strokeWidth="2" strokeDasharray="5 5" opacity="0.8" />
              <line x1="238" y1="178" x2="150" y2="42" stroke="var(--violet)" strokeWidth="2" opacity="0.25" />
              <text x="150" y="212" textAnchor="middle" fill="var(--text-faint)" fontSize="12">τ vs t = γτ</text>
            </svg>
            <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
              {s.openSim} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* SR / GR */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: "var(--cyan)" }}>{s.srTitle}</h2>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.srText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["light-clock", "journey", "einstein-train", "minkowski"].map((id) => (
              <SimCard key={id} id={id} />
            ))}
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: "var(--amber)" }}>{s.grTitle}</h2>
          <p className="mt-3 leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.grText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["elevator", "gravity-clock", "black-hole", "lensing"].map((id) => (
              <SimCard key={id} id={id} />
            ))}
          </div>
        </div>
      </section>

      {/* LAB PREVIEW */}
      <section className="border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">{s.labTitle}</h2>
              <p className="mt-2" style={{ color: "var(--text-dim)" }}>{s.labSub}</p>
            </div>
            <Link to="/lab" className="btn-ghost text-sm">{g.common.viewAll} <ArrowRight size={15} /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sims.slice(0, 6).map((m) => (
              <SimCard key={m.id} id={m.id} />
            ))}
          </div>
        </div>
      </section>

      {/* THOUGHT EXPERIMENTS + CHALLENGE */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-2">
        <Link to="/thought-experiments" className="panel group p-6 transition-transform hover:-translate-y-1">
          <Lightbulb size={22} style={{ color: "var(--amber)" }} />
          <h2 className="font-display mt-3 text-xl font-bold">{s.thoughtTitle}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>{s.thoughtSub}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
            {s.thoughtCta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
        <Link to="/challenge" className="panel group p-6 transition-transform hover:-translate-y-1">
          <Trophy size={22} style={{ color: "var(--violet)" }} />
          <h2 className="font-display mt-3 text-xl font-bold">{s.challengeTitle}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>{s.challengeSub}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
            {s.challengeCta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      {/* AUTHOR */}
      <section className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-panel)" }}>
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="chip mx-auto mb-4">{s.aboutKicker}</p>
          <p className="mx-auto max-w-2xl leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.aboutText}</p>
          <p className="font-display mt-6 text-lg font-bold">
            {g.common.by} <span style={{ color: "var(--cyan)" }}>{AUTHOR}</span>
          </p>
          <Link to="/about" className="btn-ghost mt-5 text-sm">{g.nav.about}</Link>
        </div>
      </section>
    </div>
  );
}
