import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { useG } from "../components/ui";
import { glossaryTerms } from "../data/glossary";

const STRINGS = {
  en: {
    title: "Glossary",
    sub: "The language of relativity — every term explained plainly.",
    search: "Search terms…",
    noResults: "No terms match your search.",
    related: "Related",
    count: (n: number) => `${n} terms`,
  },
  es: {
    title: "Glosario",
    sub: "El lenguaje de la relatividad: cada término explicado con claridad.",
    search: "Buscar términos…",
    noResults: "Ningún término coincide con tu búsqueda.",
    related: "Relacionado",
    count: (n: number) => `${n} términos`,
  },
} as const;

export default function Glossary() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return glossaryTerms;
    return glossaryTerms.filter(
      (t) =>
        t.term.en.toLowerCase().includes(needle) ||
        t.term.es.toLowerCase().includes(needle) ||
        t.definition.en.toLowerCase().includes(needle) ||
        t.definition.es.toLowerCase().includes(needle),
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <header className="pb-6 pt-10">
        <p className="chip mb-3"><BookOpen size={13} /> {s.count(glossaryTerms.length)}</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mt-2 text-lg" style={{ color: "var(--text-dim)" }}>{s.sub}</p>
      </header>

      <div className="relative mb-6">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={s.search}
          aria-label={s.search}
          className="inset w-full py-3 pl-11 pr-4 text-sm"
          style={{ color: "var(--text)" }}
        />
      </div>

      {list.length === 0 && (
        <p className="py-10 text-center" style={{ color: "var(--text-dim)" }}>{s.noResults}</p>
      )}

      <div className="space-y-3">
        {list.map((t) => {
          const open = openId === t.id;
          return (
            <article key={t.id} id={t.id} className="panel overflow-hidden">
              <button
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpenId(open ? null : t.id)}
                aria-expanded={open}
              >
                <span className="font-display text-lg font-bold">{t.term[lang]}</span>
                <span style={{ color: "var(--text-faint)" }} aria-hidden>{open ? "−" : "+"}</span>
              </button>
              {open && (
                <div className="border-t px-5 py-4" style={{ borderColor: "var(--border)" }}>
                  <p className="leading-relaxed" style={{ color: "var(--text-dim)" }}>{t.definition[lang]}</p>
                  {t.related.length > 0 && (
                    <p className="mt-3 text-sm">
                      <span className="font-semibold" style={{ color: "var(--text-faint)" }}>{s.related}: </span>
                      {t.related.map((r, i) => {
                        const rt = glossaryTerms.find((g) => g.id === r);
                        if (!rt) return null;
                        return (
                          <span key={r}>
                            {i > 0 && ", "}
                            <button
                              className="font-medium hover:underline"
                              style={{ color: "var(--cyan)" }}
                              onClick={() => setOpenId(r)}
                            >
                              {rt.term[lang]}
                            </button>
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <Link to="/learn" className="btn-ghost mt-8 inline-flex text-sm">
        {lang === "es" ? "Volver a Aprender" : "Back to Learn"} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
