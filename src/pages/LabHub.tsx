import { useState } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft, ArrowRight } from "lucide-react";
import { useG, DifficultyBadge } from "../components/ui";
import { sims, categoryLabel, type SimCategory } from "../sims/registry";
import { cn } from "../utils/cn";

const STRINGS = {
  en: {
    title: "Spacetime Laboratory",
    sub: "Every experiment is free to explore — no course order required. Change a variable, watch the universe respond.",
    all: "All",
    open: "Launch Experiment",
    count: (n: number) => `${n} experiments`,
  },
  es: {
    title: "Laboratorio del espaciotiempo",
    sub: "Todos los experimentos son libres de explorar, sin orden obligatorio. Cambia una variable y mira cómo responde el universo.",
    all: "Todos",
    open: "Abrir experimento",
    count: (n: number) => `${n} experimentos`,
  },
} as const;

export default function LabHub() {
  const { lang } = useG();
  const s = STRINGS[lang];
  const [cat, setCat] = useState<SimCategory | "all">("all");
  const cats: Array<SimCategory | "all"> = ["all", "time", "space", "light", "spacetime", "gravity", "blackholes", "cosmos"];
  const list = sims.filter((m) => cat === "all" || m.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <header className="pb-8 pt-10">
        <p className="chip mb-3"><FlaskConical size={13} /> {s.count(sims.length)}</p>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{s.title}</h1>
        <p className="mt-2 max-w-3xl text-lg" style={{ color: "var(--text-dim)" }}>{s.sub}</p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={s.all}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn("chip transition-all")}
            style={
              cat === c
                ? { background: "var(--cyan-dim)", borderColor: "var(--cyan)", color: "var(--cyan)", cursor: "pointer" }
                : { cursor: "pointer" }
            }
          >
            {c === "all" ? s.all : categoryLabel[c][lang]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m, i) => (
          <Link
            key={m.id}
            to={`/lab/${m.id}`}
            className="panel group flex flex-col p-5 transition-transform hover:-translate-y-1"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <DifficultyBadge level={m.difficulty} />
              <span className="text-[0.7rem] font-semibold uppercase tracking-wider" style={{ color: "var(--violet)" }}>
                {categoryLabel[m.category][lang]}
              </span>
            </div>
            {/* animated thumbnail motif */}
            <div className="inset mb-4 flex h-28 items-center justify-center overflow-hidden">
              <SimThumb id={m.id} />
            </div>
            <h2 className="font-display text-lg font-bold">{m.title[lang]}</h2>
            <p className="mt-1 flex-1 text-sm" style={{ color: "var(--text-dim)" }}>{m.concept[lang]}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--cyan)" }}>
              {s.open} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <LabBackLink />
      </div>
    </div>
  );
}

/** Tiny animated SVG motif per simulator — decorative but physics-evocative. */
function SimThumb({ id }: { id: string }) {
  const c = "var(--cyan)", a = "var(--amber)", v = "var(--violet)";
  const common = "w-full h-full";
  switch (id) {
    case "light-clock":
      return (<svg viewBox="0 0 200 90" className={common}><rect x="60" y="12" width="80" height="6" rx="3" fill={c} /><rect x="60" y="72" width="80" height="6" rx="3" fill={c} /><line x1="100" y1="18" x2="100" y2="72" stroke={a} strokeWidth="2.5" strokeDasharray="5 4"><animate attributeName="x1" values="100;100" dur="1s" /></line><circle cx="100" cy="45" r="5" fill={a}><animate attributeName="cy" values="22;68;22" dur="1.6s" repeatCount="indefinite" /></circle></svg>);
    case "journey":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="20" cy="45" r="10" fill={c} /><circle cx="180" cy="45" r="6" fill={a} /><line x1="30" y1="45" x2="174" y2="45" stroke="var(--border)" strokeDasharray="4 4" /><path d="M100 38 l14 7 -14 7 z" fill={v}><animateTransform attributeName="transform" type="translate" values="0 0;40 0;0 0" dur="3s" repeatCount="indefinite" /></path></svg>);
    case "twin-paradox":
      return (<svg viewBox="0 0 200 90" className={common}><line x1="100" y1="8" x2="100" y2="82" stroke={c} strokeWidth="2" /><polyline points="100,8 160,82 100,82" fill="none" stroke={a} strokeWidth="2" /><circle cx="100" cy="45" r="4" fill={c} /><circle cx="130" cy="45" r="4" fill={a} /></svg>);
    case "chasing-light":
      return (<svg viewBox="0 0 200 90" className={common}><path d="M20 60 l30 -15 30 15" fill="none" stroke={c} strokeWidth="3" /><circle cx="120" cy="45" r="5" fill={a}><animate attributeName="cx" values="60;190;60" dur="2.2s" repeatCount="indefinite" /></circle><line x1="20" y1="75" x2="190" y2="75" stroke="var(--border)" /></svg>);
    case "einstein-train":
      return (<svg viewBox="0 0 200 90" className={common}><rect x="40" y="35" width="120" height="26" rx="6" fill="none" stroke={c} strokeWidth="2.5" /><line x1="10" y1="70" x2="190" y2="70" stroke="var(--border)" strokeWidth="3" /><path d="M40 35 l-8 -14 M160 35 l8 -14" stroke={a} strokeWidth="2.5"><animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" /></path></svg>);
    case "length-contraction":
      return (<svg viewBox="0 0 200 90" className={common}><rect x="30" y="38" width="90" height="14" rx="7" fill={c} opacity="0.85" /><rect x="30" y="60" width="45" height="14" rx="7" fill={a} opacity="0.9"><animate attributeName="width" values="90;35;90" dur="2.4s" repeatCount="indefinite" /></rect></svg>);
    case "minkowski":
      return (<svg viewBox="0 0 200 90" className={common}><line x1="100" y1="5" x2="100" y2="85" stroke={c} strokeWidth="2" /><line x1="10" y1="45" x2="190" y2="45" stroke={c} strokeWidth="2" /><line x1="60" y1="85" x2="140" y2="5" stroke={a} strokeWidth="2" /><line x1="60" y1="5" x2="140" y2="85" stroke={a} strokeWidth="2" opacity="0.5" /><line x1="100" y1="5" x2="130" y2="85" stroke={v} strokeWidth="2" strokeDasharray="5 4" /></svg>);
    case "causality":
      return (<svg viewBox="0 0 200 90" className={common}><polygon points="100,45 70,5 130,5" fill="none" stroke={a} strokeWidth="2" /><polygon points="100,45 70,85 130,85" fill="none" stroke={a} strokeWidth="2" /><circle cx="100" cy="45" r="5" fill={v} /><circle cx="140" cy="45" r="5" fill={c}><animate attributeName="cx" values="140;80;140" dur="3s" repeatCount="indefinite" /></circle></svg>);
    case "particle-accelerator":
      return (<svg viewBox="0 0 200 90" className={common}><ellipse cx="100" cy="45" rx="80" ry="28" fill="none" stroke={c} strokeWidth="2.5" /><circle cx="100" cy="17" r="6" fill={a}><animateTransform attributeName="transform" type="rotate" from="0 100 45" to="360 100 45" dur="1.8s" repeatCount="indefinite" /></circle></svg>);
    case "elevator":
      return (<svg viewBox="0 0 200 90" className={common}><rect x="80" y="20" width="40" height="50" rx="4" fill="none" stroke={c} strokeWidth="2.5" /><circle cx="100" cy="35" r="4" fill={a}><animate attributeName="cy" values="30;62;30" dur="1.6s" repeatCount="indefinite" /></circle><path d="M90 20 l-6 -10 M110 20 l6 -10" stroke="var(--border)" strokeWidth="2" /></svg>);
    case "bending-light":
      return (<svg viewBox="0 0 200 90" className={common}><path d="M10 45 Q100 45 190 20" fill="none" stroke={a} strokeWidth="2.5" /><circle cx="100" cy="52" r="12" fill={c} opacity="0.8" /></svg>);
    case "curvature-lab":
      return (<svg viewBox="0 0 200 90" className={common}>{[20, 35, 50, 65].map((y) => (<path key={y} d={`M10 ${y} Q100 ${y + 22} 190 ${y}`} fill="none" stroke={c} strokeWidth="1.5" opacity="0.7" />))}<circle cx="100" cy="42" r="10" fill={a} /></svg>);
    case "orbits":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="100" cy="45" r="12" fill={a} /><ellipse cx="100" cy="45" rx="70" ry="26" fill="none" stroke={c} strokeWidth="2" /><circle cx="170" cy="45" r="5" fill={c}><animateTransform attributeName="transform" type="rotate" from="0 100 45" to="360 100 45" dur="4s" repeatCount="indefinite" /></circle></svg>);
    case "gravity-clock":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="70" cy="45" r="20" fill="none" stroke={c} strokeWidth="2.5" /><circle cx="130" cy="45" r="20" fill="none" stroke={a} strokeWidth="2.5" /><line x1="70" y1="45" x2="70" y2="30" stroke={c} strokeWidth="2.5" /><line x1="130" y1="45" x2="140" y2="35" stroke={a} strokeWidth="2.5" /></svg>);
    case "gps":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="100" cy="45" r="16" fill={c} opacity="0.85" /><ellipse cx="100" cy="45" rx="72" ry="30" fill="none" stroke={a} strokeWidth="1.5" strokeDasharray="5 4" /><circle cx="172" cy="45" r="4" fill={a}><animateTransform attributeName="transform" type="rotate" from="0 100 45" to="360 100 45" dur="5s" repeatCount="indefinite" /></circle></svg>);
    case "black-hole":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="100" cy="45" r="18" fill="#000" stroke={a} strokeWidth="2.5" /><ellipse cx="100" cy="45" rx="46" ry="12" fill="none" stroke={v} strokeWidth="2" transform="rotate(-18 100 45)" /></svg>);
    case "lensing":
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="100" cy="45" r="26" fill="none" stroke={a} strokeWidth="3" /><circle cx="100" cy="45" r="8" fill={c} /><circle cx="40" cy="45" r="4" fill={v} /></svg>);
    case "gravitational-waves":
      return (<svg viewBox="0 0 200 90" className={common}>{[0, 1, 2].map((i) => (<ellipse key={i} cx="100" cy="45" rx={18 + i * 16} ry={10 + i * 9} fill="none" stroke={c} strokeWidth="1.5" opacity={0.9 - i * 0.25}><animate attributeName="rx" values={`${18 + i * 16};${26 + i * 16};${18 + i * 16}`} dur="2s" repeatCount="indefinite" /></ellipse>))}<circle cx="94" cy="45" r="5" fill={a} /><circle cx="106" cy="45" r="5" fill={a} /></svg>);
    default:
      return (<svg viewBox="0 0 200 90" className={common}><circle cx="100" cy="45" r="20" fill="none" stroke={c} strokeWidth="2" /></svg>);
  }
}

export function LabBackLink() {
  const { g } = useG();
  return (
    <Link to="/lab" className="btn-ghost mt-10 inline-flex text-sm">
      <ArrowLeft size={15} /> {g.actions.backToLab}
    </Link>
  );
}

export function SimPageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--cyan)", borderTopColor: "transparent" }} />
    </div>
  );
}
