import { Atom, Code2, ExternalLink } from "lucide-react";
import { useG } from "../components/ui";
import { timelineEvents } from "../data/timeline";
import { AUTHOR, LINKS } from "../data/config";

const STRINGS = {
  en: {
    title: "About this project",
    intro: "Relativity Fundamentals Academy was created as an educational initiative to make complex scientific ideas accessible through interactive technology. Instead of asking you to believe that time slows down, it hands you the controls and lets you discover it.",
    principles: "Guiding principles",
    p1t: "Experiment first",
    p1d: "Every concept can be manipulated: velocities, masses, clocks, reference frames.",
    p2t: "Honest physics",
    p2d: "No fake effects. Every simulator states its assumptions and approximations plainly.",
    p3t: "No barriers",
    p3d: "Free, bilingual, installable, offline-capable. No account, no server, no tracking beyond anonymous usage counts.",
    timeline: "Einstein's century",
    timelineSub: "A concise timeline — without mythologizing. Science is a collective, gradual effort.",
    authorKicker: "Author",
    authorNote: "An interactive educational project about Einstein's universe.",
    stack: "Built with",
    stackD: "React, TypeScript, Tailwind CSS, Three.js, KaTeX — running entirely in your browser and deployed serverless.",
  },
  es: {
    title: "Acerca de este proyecto",
    intro: "Relativity Fundamentals Academy nació como iniciativa educativa para hacer accesibles las ideas científicas complejas mediante tecnología interactiva. En lugar de pedirte que creas que el tiempo se ralentiza, te entrega los controles y te deja descubrirlo.",
    principles: "Principios",
    p1t: "Primero el experimento",
    p1d: "Cada concepto se puede manipular: velocidades, masas, relojes, sistemas de referencia.",
    p2t: "Física honesta",
    p2d: "Sin efectos falsos. Cada simulador declara sus supuestos y aproximaciones con claridad.",
    p3t: "Sin barreras",
    p3d: "Gratis, bilingüe, instalable, funcional sin conexión. Sin cuentas, sin servidor, sin rastreo más allá de conteos anónimos de uso.",
    timeline: "El siglo de Einstein",
    timelineSub: "Una cronología concisa, sin mitificar. La ciencia es un esfuerzo colectivo y gradual.",
    authorKicker: "Autor",
    authorNote: "Un proyecto educativo interactivo sobre el universo de Einstein.",
    stack: "Construido con",
    stackD: "React, TypeScript, Tailwind CSS, Three.js, KaTeX: todo se ejecuta en tu navegador con despliegue serverless.",
  },
} as const;

export default function About() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const links = [
    LINKS.github && { href: LINKS.github, label: "GitHub", icon: Code2 },
    LINKS.linkedin && { href: LINKS.linkedin, label: "LinkedIn", icon: ExternalLink },
    LINKS.portfolio && { href: LINKS.portfolio, label: lang === "es" ? "Portafolio" : "Portfolio", icon: ExternalLink },
  ].filter(Boolean) as Array<{ href: string; label: string; icon: typeof Code2 }>;

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <header className="pb-8 pt-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.intro}</p>
      </header>

      <section>
        <h2 className="font-display mb-4 text-2xl font-bold">{s.principles}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: s.p1t, d: s.p1d, c: "var(--cyan)" },
            { t: s.p2t, d: s.p2d, c: "var(--amber)" },
            { t: s.p3t, d: s.p3d, c: "var(--violet)" },
          ].map((p, i) => (
            <div key={i} className="panel p-5">
              <h3 className="font-display font-bold" style={{ color: p.c }}>{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold">{s.timeline}</h2>
        <p className="mb-6 mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{s.timelineSub}</p>
        <ol className="relative ml-2 space-y-0 border-l pl-6" style={{ borderColor: "var(--border)" }}>
          {timelineEvents.map((e, i) => (
            <li key={i} className="relative pb-7 last:pb-0">
              <span
                className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2"
                style={{ borderColor: "var(--cyan)", background: "var(--bg)" }}
                aria-hidden
              />
              <p className="font-mono2 text-sm font-bold" style={{ color: "var(--amber)" }}>{e.year}</p>
              <h3 className="font-display mt-0.5 font-bold">{e.title[lang]}</h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{e.text[lang]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel mt-12 p-6 text-center md:p-8">
        <p className="chip mx-auto mb-4">{s.authorKicker}</p>
        <span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border"
          style={{ background: "var(--cyan-dim)", borderColor: "var(--cyan)" }}
        >
          <Atom size={30} style={{ color: "var(--cyan)" }} />
        </span>
        <h2 className="font-display mt-4 text-2xl font-bold">{AUTHOR}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: "var(--text-dim)" }}>{s.authorNote}</p>
        {links.length > 0 && (
          <div className="mt-4 flex justify-center gap-2">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !px-4 !py-2 text-sm"
                >
                  <Icon size={15} /> {l.label}
                </a>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-10 text-center">
        <h2 className="font-display text-lg font-bold">{s.stack}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm" style={{ color: "var(--text-dim)" }}>{s.stackD}</p>
      </section>
    </div>
  );
}
