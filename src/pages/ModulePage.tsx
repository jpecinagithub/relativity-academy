import { Suspense, useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, FlaskConical } from "lucide-react";
import { useApp } from "../stores/app";
import {
  useG, EquationCard, KeyIdea, MisconceptionCard, MathOnly,
} from "../components/ui";
import { moduleById, modules } from "../data/modules";
import { simById } from "../sims/registry";
import type { LessonContent, LangText } from "../lessons/types";
import { cn } from "../utils/cn";

/** Render **bold** inline markup. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i}>{p.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

const STRINGS = {
  en: {
    quizTitle: "Knowledge check",
    quizSub: "Short conceptual questions — instant feedback.",
    check: "Check",
    correct: "Correct",
    notQuite: "Not quite",
    yourScore: "Your score",
    markComplete: "Mark module as complete",
    completed: "Module completed ✓",
    next: "Next module",
    backToLearn: "All modules",
    experimentInside: "Experiment inside this module",
    openInLab: "Open in full lab",
    noContent: "Lesson content is being prepared — check back soon.",
    loading: "Loading lesson…",
    misconceptions: "Common misconceptions",
  },
  es: {
    quizTitle: "Comprueba lo aprendido",
    quizSub: "Preguntas conceptuales breves con corrección inmediata.",
    check: "Comprobar",
    correct: "Correcto",
    notQuite: "Casi",
    yourScore: "Tu puntuación",
    markComplete: "Marcar módulo como completado",
    completed: "Módulo completado ✓",
    next: "Siguiente módulo",
    backToLearn: "Todos los módulos",
    experimentInside: "Experimento de este módulo",
    openInLab: "Abrir en el laboratorio",
    noContent: "El contenido de la lección se está preparando.",
    loading: "Cargando lección…",
    misconceptions: "Ideas erróneas comunes",
  },
} as const;

function EmbeddedSim({ simId }: { simId: string }) {
  const { lang } = useG();
  const s = STRINGS[lang];
  const meta = simById(simId);
  if (!meta) return null;
  const Sim = meta.component;
  return (
    <section className="my-8" aria-label={meta.title[lang]}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.1em]" style={{ color: "var(--cyan)" }}>
          <FlaskConical size={15} /> {s.experimentInside}: {meta.title[lang]}
        </h3>
        <Link to={`/lab/${simId}`} className="text-sm font-semibold hover:underline" style={{ color: "var(--cyan)" }}>
          {s.openInLab} →
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--cyan)" }}>
        <Suspense fallback={<div className="p-10 text-center" style={{ color: "var(--text-dim)" }}>…</div>}>
          <Sim />
        </Suspense>
      </div>
    </section>
  );
}

function Quiz({ quiz, moduleId }: { quiz: LessonContent["quiz"]; moduleId: string }) {
  const { lang } = useG();
  const s = STRINGS[lang];
  const recordQuiz = useApp((st) => st.recordQuiz);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const total = quiz.length;
  const score = quiz.filter((q, i) => checked[i] && picked[i] === q.answer).length;
  const allChecked = total > 0 && quiz.every((_, i) => checked[i]);

  useEffect(() => {
    if (allChecked) recordQuiz(moduleId, score, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChecked]);

  if (total === 0) return null;
  return (
    <section className="panel mt-10 p-5 md:p-7" aria-label={s.quizTitle}>
      <h2 className="font-display text-xl font-bold">{s.quizTitle}</h2>
      <p className="mb-5 mt-1 text-sm" style={{ color: "var(--text-dim)" }}>{s.quizSub}</p>
      <ol className="space-y-6">
        {quiz.map((q, i) => {
          const isChecked = !!checked[i];
          const ok = picked[i] === q.answer;
          return (
            <li key={i} className="inset p-4">
              <p className="font-semibold">
                <span className="mr-2 font-mono2 text-sm" style={{ color: "var(--text-faint)" }}>{i + 1}.</span>
                {q.q[lang]}
              </p>
              <div className="mt-3 space-y-2" role="radiogroup" aria-label={q.q[lang]}>
                {q.options.map((o, j) => {
                  const opt = o[lang];
                  const selected = picked[i] === j;
                  return (
                    <button
                      key={j}
                      role="radio"
                      aria-checked={selected}
                      disabled={isChecked}
                      onClick={() => setPicked((p) => ({ ...p, [i]: j }))}
                      className="block w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors"
                      style={{
                        borderColor: isChecked && j === q.answer ? "var(--green)"
                          : isChecked && selected ? "var(--red)"
                          : selected ? "var(--cyan)" : "var(--border)",
                        background: isChecked && j === q.answer ? "rgba(74,222,128,0.08)"
                          : isChecked && selected ? "rgba(248,113,113,0.08)"
                          : selected ? "var(--cyan-dim)" : "transparent",
                        cursor: isChecked ? "default" : "pointer",
                      }}
                    >
                      <span className="mr-2 font-mono2" style={{ color: "var(--text-faint)" }}>
                        {String.fromCharCode(65 + j)}
                      </span>
                      {opt}
                      {isChecked && j === q.answer && <Check size={14} className="ml-2 inline" style={{ color: "var(--green)" }} />}
                      {isChecked && selected && j !== q.answer && <X size={14} className="ml-2 inline" style={{ color: "var(--red)" }} />}
                    </button>
                  );
                })}
              </div>
              {!isChecked ? (
                <button
                  className="btn-ghost mt-3 !px-4 !py-1.5 text-sm"
                  disabled={picked[i] === undefined}
                  onClick={() => setChecked((c) => ({ ...c, [i]: true }))}
                >
                  {s.check}
                </button>
              ) : (
                <div
                  className="mt-3 rounded-lg border p-3 text-sm"
                  style={{
                    borderColor: ok ? "var(--green)" : "var(--amber)",
                    background: ok ? "rgba(74,222,128,0.06)" : "var(--amber-dim)",
                  }}
                  role="status"
                >
                  <span className="font-bold" style={{ color: ok ? "var(--green)" : "var(--amber)" }}>
                    {ok ? s.correct : s.notQuite}.{" "}
                  </span>
                  <span style={{ color: "var(--text-dim)" }}>{q.why[lang]}</span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {allChecked && (
        <p className="font-display mt-5 text-center text-lg font-bold">
          {s.yourScore}: {score}/{total}
        </p>
      )}
    </section>
  );
}

function LessonArticle({ content, meta }: { content: LessonContent; meta: (typeof modules)[number] }) {
  const { lang } = useG();
  const s = STRINGS[lang];
  return (
    <article>
      <p className="text-lg leading-relaxed" style={{ color: "var(--text)" }}>
        <Rich text={content.intro[lang]} />
      </p>

      {meta.simIds.slice(0, 1).map((id) => (
        <EmbeddedSim key={id} simId={id} />
      ))}

      {content.sections.map((sec, i) => (
        <section key={i} className="mt-10">
          <h2 className="font-display text-2xl font-bold">{sec.heading[lang]}</h2>
          <div className="rfa-prose mt-2">
            {sec.paragraphs.map((p, j) => (
              <p key={j}><Rich text={p[lang]} /></p>
            ))}
            {sec.bullets && (
              <ul>
                {sec.bullets.flat().map((b, j) => (
                  <li key={j}><Rich text={b[lang]} /></li>
                ))}
              </ul>
            )}
          </div>
          {sec.keyIdea && (
            <KeyIdea><Rich text={sec.keyIdea[lang]} /></KeyIdea>
          )}
          {sec.equation && (
            <div className="my-4">
              <EquationCard tex={sec.equation} caption={sec.equationCaption?.[lang]} />
            </div>
          )}
          <MathOnly>
            {sec.mathExtra && (
              <div className="my-4">
                <EquationCard tex={sec.mathExtra} caption={sec.mathExtraCaption?.[lang]} />
              </div>
            )}
          </MathOnly>
          {i === 0 && meta.simIds.slice(1).map((id) => <EmbeddedSim key={id} simId={id} />)}
        </section>
      ))}

      {content.misconceptions.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display mb-4 text-2xl font-bold">{s.misconceptions}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {content.misconceptions.map((m, i) => (
              <MisconceptionCard key={i} myth={m.myth[lang]} reality={m.reality[lang]} />
            ))}
          </div>
        </section>
      )}

      <Quiz quiz={content.quiz} moduleId={meta.id} />
    </article>
  );
}

export default function ModulePage() {
  const { moduleId } = useParams();
  const { lang } = useG();
  const s = STRINGS[lang];
  const meta = moduleId ? moduleById(moduleId) : undefined;
  const completeModule = useApp((st) => st.completeModule);
  const completed = useApp((st) => st.completedModules);
  const [content, setContent] = useState<LessonContent | "missing" | null>(null);

  useEffect(() => {
    setContent(null);
    if (!moduleId) return;
    import(`../lessons/${moduleId}.tsx`)
      .then((m) => setContent((m.content as LessonContent | undefined) ?? "missing"))
      .catch(() => setContent("missing"));
  }, [moduleId]);

  if (!meta) return <Navigate to="/learn" replace />;
  const idx = modules.findIndex((m) => m.id === meta.id);
  const prev = idx > 0 ? modules[idx - 1] : null;
  const nextM = idx < modules.length - 1 ? modules[idx + 1] : null;
  const done = completed.includes(meta.id);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <nav className="flex items-center gap-2 pt-8 text-sm" style={{ color: "var(--text-faint)" }} aria-label="Breadcrumb">
        <Link to="/learn" className="hover:underline">{s.backToLearn}</Link>
        <span aria-hidden>/</span>
        <span style={{ color: "var(--text)" }}>{meta.title[lang]}</span>
      </nav>

      <header className="pb-6 pt-4">
        <p className="font-mono2 mb-2 text-sm" style={{ color: "var(--cyan)" }}>
          {lang === "es" ? "Módulo" : "Module"} {String(meta.index).padStart(2, "0")}
        </p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{meta.title[lang]}</h1>
        <p className="mt-2 text-lg italic" style={{ color: "var(--text-dim)" }}>{meta.tagline[lang]}</p>
      </header>

      {content === null && (
        <p className="py-16 text-center" style={{ color: "var(--text-dim)" }}>{s.loading}</p>
      )}
      {content === "missing" && (
        <p className="py-16 text-center" style={{ color: "var(--text-dim)" }}>{s.noContent}</p>
      )}
      {content !== null && content !== "missing" && (
        <LessonArticle content={content} meta={meta} />
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-wrap gap-2">
          {prev ? (
            <Link to={`/learn/${prev.id}`} className="btn-ghost text-sm">
              <ArrowLeft size={15} /> {prev.title[lang]}
            </Link>
          ) : (
            <Link to="/learn" className="btn-ghost text-sm">
              <ArrowLeft size={15} /> {s.backToLearn}
            </Link>
          )}
          {nextM && (
            <Link to={`/learn/${nextM.id}`} className="btn-ghost text-sm">
              {nextM.title[lang]} <ArrowRight size={15} />
            </Link>
          )}
        </div>
        <button
          className={cn(done ? "btn-ghost" : "btn-primary", "text-sm")}
          onClick={() => completeModule(meta.id)}
          disabled={done}
          aria-pressed={done}
        >
          {done ? <><Check size={15} /> {s.completed}</> : s.markComplete}
        </button>
      </div>
    </div>
  );
}

export type { LangText };
