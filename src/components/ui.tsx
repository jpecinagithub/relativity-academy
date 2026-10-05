import { useEffect, useRef, useState, type ReactNode } from "react";
import { BlockMath, InlineMath } from "react-katex";
import { AlertTriangle, FlaskConical, Info, Pause, Play, RotateCcw, Maximize2 } from "lucide-react";
import { useApp } from "../stores/app";
import { globalStrings, type Lang } from "../i18n/global";
import { cn } from "../utils/cn";

export function useG() {
  const lang = useApp((s) => s.lang);
  return { lang, g: globalStrings[lang] };
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
export function DifficultyBadge({ level }: { level: 1 | 2 | 3 }) {
  const { g } = useG();
  const label =
    level === 1 ? g.common.beginner : level === 2 ? g.common.intermediate : g.common.advanced;
  return (
    <span className="chip" title={`${g.common.difficulty}: ${label}`}>
      <span className="flex gap-[3px]" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="inline-block h-[7px] w-[7px] rounded-full"
            style={{ background: i <= level ? "var(--amber)" : "var(--border)" }}
          />
        ))}
      </span>
      {label}
    </span>
  );
}

// ─── Parameter slider (accessible) ────────────────────────────────────────────
interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  accent?: "cyan" | "amber" | "violet";
  disabled?: boolean;
}

export function ParamSlider({
  label, value, min, max, step, onChange, format, accent = "cyan", disabled,
}: ParamSliderProps) {
  const id = useRef(`sl-${Math.random().toString(36).slice(2)}`).current;
  const fill = ((value - min) / (max - min)) * 100;
  const accentVar = accent === "amber" ? "var(--amber)" : accent === "violet" ? "var(--violet)" : "var(--cyan)";
  return (
    <div className="w-full" style={{ ["--cyan" as string]: accentVar } as React.CSSProperties}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium" style={{ color: "var(--text-dim)" }}>
          {label}
        </label>
        <span className="font-mono2 text-sm font-semibold" style={{ color: "var(--text)" }} aria-live="polite">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="rfa-slider"
        style={{ ["--fill" as string]: `${fill}%` } as React.CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={format ? format(value) : String(value)}
      />
    </div>
  );
}

// ─── Physics readout ──────────────────────────────────────────────────────────
export function PhysicsValue({
  label, value, unit, accent, title,
}: {
  label: string; value: string; unit?: string;
  accent?: "cyan" | "amber" | "violet" | "green";
  title?: string;
}) {
  const color =
    accent === "amber" ? "var(--amber)" : accent === "violet" ? "var(--violet)"
    : accent === "green" ? "var(--green)" : "var(--cyan)";
  return (
    <div className="inset px-3 py-2.5" title={title}>
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>
        {label}
      </div>
      <div className="font-mono2 text-lg font-semibold leading-tight" style={{ color }}>
        {value}
        {unit && <span className="ml-1 text-xs font-normal" style={{ color: "var(--text-dim)" }}>{unit}</span>}
      </div>
    </div>
  );
}

// ─── Equation card (KaTeX) ────────────────────────────────────────────────────
export function EquationCard({ tex, caption, dark }: { tex: string; caption?: string; dark?: boolean }) {
  return (
    <div className={cn("panel p-5 text-center", dark && "panel-elev")}>
      <BlockMath math={tex} />
      {caption && (
        <p className="mt-2 text-sm" style={{ color: "var(--text-dim)" }}>{caption}</p>
      )}
    </div>
  );
}

export function IM({ tex }: { tex: string }) {
  return <InlineMath math={tex} />;
}

/** Only renders children when math mode is "mathematical". */
export function MathOnly({ children }: { children: ReactNode }) {
  const mathMode = useApp((s) => s.mathMode);
  if (mathMode !== "mathematical") return null;
  return <>{children}</>;
}

// ─── Panels ───────────────────────────────────────────────────────────────────
export function AssumptionsPanel({ items }: { items: string[] }) {
  const { g } = useG();
  const [open, setOpen] = useState(false);
  return (
    <div className="panel overflow-hidden">
      <button
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <AlertTriangle size={16} style={{ color: "var(--amber)" }} />
        <span>{g.common.assumptions}</span>
        <span className="ml-auto" style={{ color: "var(--text-faint)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="space-y-2 border-t px-4 py-3 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-dim)" }}>
          {items.map((it, i) => (
            <li key={i} className="flex gap-2"><span aria-hidden>•</span><span>{it}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function InfoPanel({ title, children, icon }: { title: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <div className="panel p-4">
      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--text)" }}>
        {icon ?? <Info size={15} style={{ color: "var(--cyan)" }} />}
        {title}
      </h4>
      <div className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{children}</div>
    </div>
  );
}

// ─── Controls ─────────────────────────────────────────────────────────────────
export function PlayPauseControls({
  playing, onToggle, onReset, extra,
}: {
  playing: boolean; onToggle: () => void; onReset?: () => void; extra?: ReactNode;
}) {
  const { g } = useG();
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn-primary !px-4 !py-2 text-sm"
        onClick={onToggle}
        aria-pressed={playing}
        aria-label={playing ? g.actions.pause : g.actions.play}
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
        {playing ? g.actions.pause : g.actions.play}
      </button>
      {onReset && (
        <button className="btn-ghost !px-3 !py-2 text-sm" onClick={onReset} aria-label={g.actions.reset}>
          <RotateCcw size={15} /> {g.actions.reset}
        </button>
      )}
      {extra}
    </div>
  );
}

export function SegmentedControl<T extends string | number>({
  options, value, onChange, label,
}: {
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div>
      {label && (
        <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>{label}</div>
      )}
      <div className="inset flex flex-wrap gap-1 p-1" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            )}
            style={
              value === o.value
                ? { background: "var(--cyan-dim)", color: "var(--cyan)", border: "1px solid var(--cyan)" }
                : { color: "var(--text-dim)", border: "1px solid transparent" }
            }
          >
            {o.icon}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PresetBar({ presets, onPick }: { presets: Array<{ label: string; hint?: string }>; onPick: (i: number) => void }) {
  const { g } = useG();
  return (
    <div>
      <div className="mb-1.5 text-sm font-medium" style={{ color: "var(--text-dim)" }}>{g.common.presets}</div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            title={p.hint}
            className="chip transition-transform hover:-translate-y-px"
            style={{ cursor: "pointer" }}
          >
            <FlaskConical size={12} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Try-this challenge card ──────────────────────────────────────────────────
export function TryThis({
  prompt, check, children,
}: {
  prompt: string;
  /** returns true when solved */
  check: () => boolean;
  children?: ReactNode;
}) {
  const { g } = useG();
  const [solved, setSolved] = useState(false);
  useEffect(() => {
    if (!solved && check()) setSolved(true);
  });
  return (
    <div
      className="panel p-4"
      style={solved ? { borderColor: "var(--green)" } : undefined}
      role="status"
      aria-live="polite"
    >
      <div className="mb-1 text-sm font-semibold" style={{ color: solved ? "var(--green)" : "var(--amber)" }}>
        {solved ? g.common.challengeSolved : `⚗ ${g.common.tryThis}`}
      </div>
      <p className="text-sm" style={{ color: "var(--text-dim)" }}>{prompt}</p>
      {!solved && children}
    </div>
  );
}

// ─── Fullscreen wrapper ───────────────────────────────────────────────────────
export function FullscreenLab({ children, label }: { children: ReactNode; label?: string }) {
  const { g } = useG();
  const ref = useRef<HTMLDivElement>(null);
  const [fs, setFs] = useState(false);
  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await ref.current?.requestFullscreen();
        setFs(true);
      } else {
        await document.exitFullscreen();
        setFs(false);
      }
    } catch { /* ignore */ }
  };
  useEffect(() => {
    const h = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  return (
    <div ref={ref} className={cn("relative", fs && "overflow-auto p-4")} style={fs ? { background: "var(--bg)" } : undefined}>
      {children}
      <button
        onClick={toggle}
        className="btn-ghost absolute right-3 top-3 !px-3 !py-1.5 text-xs"
        aria-label={g.actions.fullscreen}
      >
        <Maximize2 size={13} /> {label ?? g.actions.fullscreen}
      </button>
    </div>
  );
}

// ─── The standard simulator shell ─────────────────────────────────────────────
interface SimulationShellProps {
  simId: string;
  title: string;
  subtitle?: string;
  difficulty: 1 | 2 | 3;
  concept: string;
  visualization: ReactNode;
  controls: ReactNode;
  whatYouSee: ReactNode;
  physics: ReactNode;
  equation?: ReactNode;
  mathEquation?: ReactNode;
  assumptions: string[];
  tryThis?: ReactNode;
  related?: Array<{ to: string; label: string }>;
}

export function SimulationShell(props: SimulationShellProps) {
  const { g } = useG();
  const attemptExperiment = useApp((s) => s.attemptExperiment);
  const mathMode = useApp((s) => s.mathMode);
  useEffect(() => {
    attemptExperiment(props.simId);
  }, [props.simId, attemptExperiment]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <header className="pb-6 pt-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <DifficultyBadge level={props.difficulty} />
          <span className="chip">{props.concept}</span>
        </div>
        <h1 className="font-display text-3xl font-bold md:text-4xl">{props.title}</h1>
        {props.subtitle && (
          <p className="mt-2 max-w-3xl text-lg" style={{ color: "var(--text-dim)" }}>{props.subtitle}</p>
        )}
      </header>

      <FullscreenLab>
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="panel overflow-hidden">{props.visualization}</div>
          <div className="panel space-y-5 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>
              {g.common.controls}
            </h2>
            {props.controls}
          </div>
        </div>
      </FullscreenLab>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <InfoPanel title={g.common.whatYouSee}>{props.whatYouSee}</InfoPanel>
        <InfoPanel title={g.common.physics} icon={<FlaskConical size={15} style={{ color: "var(--violet)" }} />}>
          {props.physics}
        </InfoPanel>
      </div>

      {(props.equation || (props.mathEquation && mathMode === "mathematical")) && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-faint)" }}>
            {g.common.equation}
          </h3>
          {props.equation}
          {mathMode === "mathematical" && props.mathEquation}
        </div>
      )}

      {props.tryThis && <div className="mt-4">{props.tryThis}</div>}

      <div className="mt-4">
        <AssumptionsPanel items={props.assumptions} />
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
export function KeyIdea({ children }: { children: ReactNode }) {
  const { g } = useG();
  return (
    <div className="panel my-4 border-l-4 p-4" style={{ borderLeftColor: "var(--cyan)" }}>
      <div className="mb-1 text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--cyan)" }}>
        {g.common.keyIdea}
      </div>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

export function MisconceptionCard({ myth, reality }: { myth: string; reality: string }) {
  const { g } = useG();
  return (
    <div className="panel p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-[0.1em]" style={{ color: "var(--amber)" }}>
        {g.common.misconception}
      </div>
      <p className="font-semibold">“{myth}”</p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{reality}</p>
    </div>
  );
}

export type { Lang };
