import { Link } from "react-router-dom";
import {
  Train, Zap, Clock, Ruler, Boxes, Atom, ArrowDownUp, Orbit, CircleDot, Telescope,
  Check, ArrowRight, RotateCcw,
} from "lucide-react";
import { useApp } from "../stores/app";
import { useG, DifficultyBadge } from "../components/ui";
import { modules } from "../data/modules";

const ICONS: Record<string, typeof Train> = {
  Train, Zap, Clock, Ruler, Boxes, Atom, ArrowDownUp, Orbit, CircleDot, Telescope,
};

const STRINGS = {
  en: {
    title: "Learn Relativity",
    sub: "Ten modules, one journey: from Newton's clockwork universe to black holes. Each module pairs short explanations with hands-on experiments.",
    modules: (n: number) => `${n} of ${modules.length} completed`,
    start: "Start",
    continue: "Continue",
    review: "Review",
    reset: "Reset progress",
    resetConfirm: "Erase all local progress?",
  },
  es: {
    title: "Aprende relatividad",
    sub: "Diez módulos, un viaje: del universo mecánico de Newton a los agujeros negros. Cada módulo combina explicaciones breves con experimentos prácticos.",
    modules: (n: number) => `${n} de ${modules.length} completados`,
    start: "Empezar",
    continue: "Continuar",
    review: "Repasar",
    reset: "Borrar progreso",
    resetConfirm: "¿Borrar todo el progreso local?",
  },
} as const;

export default function LearnHub() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const completed = useApp((st) => st.completedModules);
  const resetProgress = useApp((st) => st.resetProgress);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="pb-8 pt-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mt-2 max-w-3xl text-lg" style={{ color: "var(--text-dim)" }}>{s.sub}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="h-2.5 w-64 overflow-hidden rounded-full" style={{ background: "var(--bg-elev)" }} role="progressbar" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={modules.length}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(completed.length / modules.length) * 100}%`, background: "var(--cyan)" }}
            />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-dim)" }}>
            {s.modules(completed.length)}
          </span>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => {
          const done = completed.includes(m.id);
          const Icon = ICONS[m.icon] ?? Atom;
          return (
            <Link
              key={m.id}
              to={`/learn/${m.id}`}
              className="panel group flex gap-4 p-5 transition-transform hover:-translate-y-1"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                style={
                  done
                    ? { background: "var(--green)", borderColor: "var(--green)", color: "#04140a" }
                    : { background: "var(--cyan-dim)", borderColor: "var(--cyan)", color: "var(--cyan)" }
                }
              >
                {done ? <Check size={20} /> : <Icon size={20} />}
              </span>
              <span className="flex-1">
                <span className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono2 text-xs" style={{ color: "var(--text-faint)" }}>
                    {String(m.index).padStart(2, "0")}
                  </span>
                  <DifficultyBadge level={m.difficulty} />
                </span>
                <span className="font-display block text-lg font-bold">{m.title[lang]}</span>
                <span className="mt-1 block text-sm" style={{ color: "var(--text-dim)" }}>
                  {m.description[lang]}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
                  {done ? s.review : completed.length === m.index ? s.start : s.continue}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      {completed.length > 0 && (
        <button
          className="btn-ghost mt-8 text-sm"
          onClick={() => {
            if (window.confirm(s.resetConfirm)) resetProgress();
          }}
        >
          <RotateCcw size={14} /> {s.reset}
        </button>
      )}
    </div>
  );
}
