import { useMemo, useState } from "react";
import { Trophy, ArrowRight, ArrowLeft, Check, X, RotateCcw, Award, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { useApp } from "../stores/app";
import { useG } from "../components/ui";
import { challengeQuestions, type ChallengeQuestion } from "../data/challenge";
import { AUTHOR } from "../data/config";
import { cn } from "../utils/cn";

const CATS: Record<ChallengeQuestion["category"], { en: string; es: string }> = {
  sr: { en: "Special Relativity", es: "Relatividad especial" },
  spacetime: { en: "Spacetime", es: "Espaciotiempo" },
  energy: { en: "Energy", es: "Energía" },
  gr: { en: "General Relativity", es: "Relatividad general" },
  blackholes: { en: "Black Holes", es: "Agujeros negros" },
};

const STRINGS = {
  en: {
    title: "The Einstein Challenge",
    sub: (n: number) => `${n} questions across 5 categories — concepts, diagrams, thought experiments, simple calculations.`,
    start: "Start the challenge",
    question: "Question",
    of: "of",
    next: "Next",
    finish: "See results",
    correct: "Correct",
    incorrect: "Not quite",
    results: "Your results",
    score: "Score",
    strengths: "Strengths",
    review: "Areas to review",
    retry: "Try again",
    pass: "You earned a certificate!",
    fail: (n: number) => `Score at least ${n} to earn the certificate.`,
    certName: "Your name for the certificate",
    certPlaceholder: "e.g. Ada Lovelace",
    download: "Download certificate (PDF)",
    best: "Best score",
    howItWorks: "Instant feedback after each answer. No time limit.",
  },
  es: {
    title: "El desafío Einstein",
    sub: (n: number) => `${n} preguntas en 5 categorías: conceptos, diagramas, experimentos mentales y cálculos sencillos.`,
    start: "Empezar el desafío",
    question: "Pregunta",
    of: "de",
    next: "Siguiente",
    finish: "Ver resultados",
    correct: "Correcto",
    incorrect: "Casi",
    results: "Tus resultados",
    score: "Puntuación",
    strengths: "Puntos fuertes",
    review: "A repasar",
    retry: "Reintentar",
    pass: "¡Has ganado un certificado!",
    fail: (n: number) => `Consigue al menos ${n} para obtener el certificado.`,
    certName: "Tu nombre para el certificado",
    certPlaceholder: "p. ej. Ada Lovelace",
    download: "Descargar certificado (PDF)",
    best: "Mejor puntuación",
    howItWorks: "Corrección inmediata tras cada respuesta. Sin límite de tiempo.",
  },
} as const;

const PASS = 12;

export default function Challenge() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const recordChallenge = useApp((st) => st.recordChallenge);
  const best = useApp((st) => st.challengeBest);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);
  const [name, setName] = useState("");

  const total = challengeQuestions.length;
  const q = challengeQuestions[idx];

  const catStats = useMemo(() => {
    if (!done) return null;
    const stats: Record<string, { ok: number; n: number }> = {};
    challengeQuestions.forEach((qq, i) => {
      const c = qq.category;
      stats[c] = stats[c] || { ok: 0, n: 0 };
      stats[c].n += 1;
      if (picked[i] === qq.answer) stats[c].ok += 1;
    });
    return stats;
  }, [done, picked]);

  const score = useMemo(
    () => challengeQuestions.filter((qq, i) => picked[i] === qq.answer).length,
    [picked],
  );

  const finish = () => {
    setDone(true);
    recordChallenge(score, total);
  };

  const reset = () => {
    setStarted(false); setIdx(0); setPicked({}); setDone(false);
  };

  const downloadCert = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297, H = 210;
    doc.setFillColor(7, 11, 20);
    doc.rect(0, 0, W, H, "F");
    doc.setDrawColor(62, 230, 255);
    doc.setLineWidth(1.2);
    doc.rect(12, 12, W - 24, H - 24);
    doc.setTextColor(62, 230, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("RELATIVITY FUNDAMENTALS ACADEMY", W / 2, 40, { align: "center" });
    doc.setTextColor(245, 165, 36);
    doc.setFontSize(30);
    doc.text(lang === "es" ? "Certificado de finalización" : "Certificate of Completion", W / 2, 62, { align: "center" });
    doc.setTextColor(239, 233, 218);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(
      lang === "es" ? "Otorgado a" : "Awarded to",
      W / 2, 84, { align: "center" },
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text(name.trim() || (lang === "es" ? "Estudiante" : "Learner"), W / 2, 100, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(163, 173, 191);
    const date = new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    doc.text(
      `${lang === "es" ? "Desafío Einstein" : "Einstein Challenge"} — ${score}/${total} — ${date}`,
      W / 2, 120, { align: "center" },
    );
    doc.setFontSize(11);
    doc.text(
      lang === "es"
        ? "Por completar el desafío final de la academia con éxito."
        : "For successfully completing the academy's final challenge.",
      W / 2, 134, { align: "center" },
    );
    doc.setTextColor(62, 230, 255);
    doc.setFontSize(12);
    doc.text(`${lang === "es" ? "Creado por" : "Created by"} ${AUTHOR}`, W / 2, 168, { align: "center" });
    doc.save("relativity-academy-certificate.pdf");
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-16 text-center">
        <Trophy size={40} className="mx-auto mb-4" style={{ color: "var(--violet)" }} />
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-lg" style={{ color: "var(--text-dim)" }}>{s.sub(challengeQuestions.length)}</p>
        <p className="mt-2 text-sm" style={{ color: "var(--text-faint)" }}>{s.howItWorks}</p>
        {best && (
          <p className="mt-3 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
            {s.best}: {best.score}/{best.total}
          </p>
        )}
        <button className="btn-primary mt-8" onClick={() => setStarted(true)}>
          {s.start} <ArrowRight size={17} />
        </button>
      </div>
    );
  }

  if (done && catStats) {
    const strong = Object.entries(catStats).filter(([, v]) => v.ok / v.n >= 0.7);
    const weak = Object.entries(catStats).filter(([, v]) => v.ok / v.n < 0.7);
    const passed = score >= PASS;
    return (
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-12">
        <h1 className="font-display text-center text-3xl font-bold">{s.results}</h1>
        <p className="font-display mt-6 text-center text-6xl font-bold" style={{ color: passed ? "var(--green)" : "var(--amber)" }}>
          {score}<span className="text-2xl" style={{ color: "var(--text-faint)" }}>/{total}</span>
        </p>
        <p className="mt-2 text-center text-sm" style={{ color: "var(--text-dim)" }}>{s.score}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="panel p-4">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--green)" }}>{s.strengths}</h2>
            {strong.length === 0 && <p className="text-sm" style={{ color: "var(--text-dim)" }}>—</p>}
            {strong.map(([c, v]) => (
              <p key={c} className="py-1 text-sm">{CATS[c as keyof typeof CATS][lang]} <span className="font-mono2" style={{ color: "var(--text-faint)" }}>{v.ok}/{v.n}</span></p>
            ))}
          </div>
          <div className="panel p-4">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider" style={{ color: "var(--amber)" }}>{s.review}</h2>
            {weak.length === 0 && <p className="text-sm" style={{ color: "var(--text-dim)" }}>—</p>}
            {weak.map(([c, v]) => (
              <p key={c} className="py-1 text-sm">{CATS[c as keyof typeof CATS][lang]} <span className="font-mono2" style={{ color: "var(--text-faint)" }}>{v.ok}/{v.n}</span></p>
            ))}
          </div>
        </div>

        <div className="panel mt-6 p-5 text-center">
          {passed ? (
            <>
              <Award size={30} className="mx-auto mb-2" style={{ color: "var(--amber)" }} />
              <p className="font-bold" style={{ color: "var(--green)" }}>{s.pass}</p>
              <label className="mt-4 block text-left text-sm font-medium" style={{ color: "var(--text-dim)" }}>
                {s.certName}
                <input
                  className="inset mt-1 w-full px-3 py-2 text-sm"
                  style={{ color: "var(--text)" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={s.certPlaceholder}
                  maxLength={60}
                />
              </label>
              <button className="btn-primary mt-4 text-sm" onClick={downloadCert}>
                <Download size={15} /> {s.download}
              </button>
            </>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-dim)" }}>{s.fail(PASS)}</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button className="btn-ghost text-sm" onClick={reset}>
            <RotateCcw size={14} /> {s.retry}
          </button>
        </div>
      </div>
    );
  }

  const answered = picked[idx] !== undefined;
  const ok = picked[idx] === q.answer;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10">
      <div className="mb-4 flex items-center justify-between text-sm" style={{ color: "var(--text-faint)" }}>
        <span>{s.question} {idx + 1} {s.of} {total}</span>
        <span className="chip">{CATS[q.category][lang]}</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full" style={{ background: "var(--bg-elev)" }} role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={total}>
        <div className="h-full rounded-full transition-all" style={{ width: `${((idx + 1) / total) * 100}%`, background: "var(--violet)" }} />
      </div>

      <div className="panel p-5 md:p-7">
        <p className="text-lg font-semibold leading-relaxed">{q.question[lang]}</p>
        <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={q.question[lang]}>
          {q.options[lang].map((opt, j) => {
            const selected = picked[idx] === j;
            return (
              <button
                key={j}
                role="radio"
                aria-checked={selected}
                disabled={answered}
                onClick={() => setPicked((p) => ({ ...p, [idx]: j }))}
                className={cn("block w-full rounded-xl border px-4 py-3 text-left text-[0.95rem] transition-colors")}
                style={{
                  borderColor: answered && j === q.answer ? "var(--green)"
                    : answered && selected ? "var(--red)"
                    : selected ? "var(--violet)" : "var(--border)",
                  background: answered && j === q.answer ? "rgba(74,222,128,0.08)"
                    : answered && selected ? "rgba(248,113,113,0.08)"
                    : selected ? "var(--violet-dim)" : "transparent",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                <span className="mr-2 font-mono2 font-bold" style={{ color: "var(--text-faint)" }}>
                  {String.fromCharCode(65 + j)}
                </span>
                {opt}
                {answered && j === q.answer && <Check size={15} className="ml-2 inline" style={{ color: "var(--green)" }} />}
                {answered && selected && j !== q.answer && <X size={15} className="ml-2 inline" style={{ color: "var(--red)" }} />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className="mt-4 rounded-xl border p-4 text-sm"
            style={{
              borderColor: ok ? "var(--green)" : "var(--amber)",
              background: ok ? "rgba(74,222,128,0.06)" : "var(--amber-dim)",
            }}
            role="status"
          >
            <span className="font-bold" style={{ color: ok ? "var(--green)" : "var(--amber)" }}>
              {ok ? s.correct : s.incorrect}.{" "}
            </span>
            <span style={{ color: "var(--text-dim)" }}>{q.explanation[lang]}</span>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            className="btn-ghost !px-4 !py-2 text-sm"
            disabled={idx === 0}
            onClick={() => setIdx((i) => i - 1)}
          >
            <ArrowLeft size={14} />
          </button>
          {idx < total - 1 ? (
            <button className="btn-primary !px-5 !py-2 text-sm" disabled={!answered} onClick={() => setIdx((i) => i + 1)}>
              {s.next} <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn-primary !px-5 !py-2 text-sm" disabled={!answered} onClick={finish}>
              {s.finish} <Trophy size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
