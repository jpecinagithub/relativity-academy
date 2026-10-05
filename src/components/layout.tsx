import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Atom, Menu, X, Sun, Moon, Languages, Sigma, FlaskConical, BookOpen,
  Lightbulb, Wrench, Trophy, Info, Download,
} from "lucide-react";
import { useApp } from "../stores/app";
import { globalStrings } from "../i18n/global";
import { cn } from "../utils/cn";

const AUTHOR = "Jon Peciña";

function ThemeToggle() {
  const theme = useApp((s) => s.theme);
  const setTheme = useApp((s) => s.setTheme);
  return (
    <button
      className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-elev)]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function LangToggle() {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  return (
    <button
      className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold tracking-wide transition-colors hover:bg-[var(--bg-elev)]"
      style={{ borderColor: "var(--border-strong)" }}
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
    >
      <Languages size={14} />
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
}

function MathToggle() {
  const mathMode = useApp((s) => s.mathMode);
  const setMathMode = useApp((s) => s.setMathMode);
  const lang = useApp((s) => s.lang);
  const g = globalStrings[lang];
  const math = mathMode === "mathematical";
  return (
    <button
      className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors"
      style={
        math
          ? { borderColor: "var(--violet)", color: "var(--violet)", background: "var(--violet-dim)" }
          : { borderColor: "var(--border-strong)", color: "var(--text-dim)" }
      }
      onClick={() => setMathMode(math ? "conceptual" : "mathematical")}
      aria-pressed={math}
      title={math ? g.common.conceptualMode : g.common.mathMode}
    >
      <Sigma size={14} />
      <span className="hidden sm:inline">{math ? "∑" : g.common.mathMode}</span>
    </button>
  );
}

function ProgressPill() {
  const completedModules = useApp((s) => s.completedModules);
  const lang = useApp((s) => s.lang);
  const g = globalStrings[lang];
  return (
    <Link
      to="/learn"
      className="hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold md:flex"
      style={{ borderColor: "var(--border-strong)", color: "var(--text-dim)" }}
      title={g.common.progress}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: "var(--green)" }}
        aria-hidden
      />
      {completedModules.length}/9
    </Link>
  );
}

const NAV = [
  { to: "/learn", key: "learn", icon: BookOpen },
  { to: "/lab", key: "lab", icon: FlaskConical },
  { to: "/thought-experiments", key: "thought", icon: Lightbulb },
  { to: "/tools", key: "tools", icon: Wrench },
  { to: "/glossary", key: "glossary", icon: Info },
  { to: "/challenge", key: "challenge", icon: Trophy },
] as const;

function InstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const lang = useApp((s) => s.lang);
  const g = globalStrings[lang];
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  if (!prompt) return null;
  return (
    <button
      className="rounded-lg p-2 transition-colors hover:bg-[var(--bg-elev)]"
      onClick={() => {
        void prompt.prompt();
        setPrompt(null);
      }}
      aria-label={g.actions.installApp}
      title={g.actions.installApp}
    >
      <Download size={18} />
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const lang = useApp((s) => s.lang);
  const g = globalStrings[lang];
  const location = useLocation();

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-xl"
      style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Relativity Fundamentals Academy">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "var(--cyan-dim)", border: "1px solid var(--cyan)" }}
          >
            <Atom size={20} style={{ color: "var(--cyan)" }} />
          </span>
          <span className="font-display hidden text-[0.95rem] font-bold leading-none sm:block">
            RELATIVITY
            <span className="block text-[0.62rem] font-medium tracking-[0.22em]" style={{ color: "var(--text-faint)" }}>
              FUNDAMENTALS ACADEMY
            </span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink
              key={n.key}
              to={n.to}
              className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-colors")}
              style={({ isActive }) => ({
                color: isActive ? "var(--cyan)" : "var(--text-dim)",
                background: isActive ? "var(--cyan-dim)" : "transparent",
              })}
            >
              {g.nav[n.key]}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ProgressPill />
          <MathToggle />
          <LangToggle />
          <ThemeToggle />
          <InstallButton />
          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t px-4 py-3 lg:hidden" style={{ borderColor: "var(--border)" }} aria-label="Mobile">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = location.pathname.startsWith(n.to);
            return (
              <NavLink
                key={n.key}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium"
                style={{
                  color: active ? "var(--cyan)" : "var(--text-dim)",
                  background: active ? "var(--cyan-dim)" : "transparent",
                }}
              >
                <Icon size={17} />
                {g.nav[n.key]}
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const lang = useApp((s) => s.lang);
  const g = globalStrings[lang];
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-display text-lg font-bold">RELATIVITY <span style={{ color: "var(--cyan)" }}>FUNDAMENTALS ACADEMY</span></div>
          <p className="mt-2 max-w-sm text-sm" style={{ color: "var(--text-dim)" }}>{g.footer.tagline}</p>
          <p className="mt-4 text-sm font-semibold">{g.common.by} {AUTHOR}</p>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-faint)" }}>{g.footer.sections}</div>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
            <li><Link to="/learn" className="hover:text-[var(--cyan)]">{g.nav.learn}</Link></li>
            <li><Link to="/lab" className="hover:text-[var(--cyan)]">{g.nav.lab}</Link></li>
            <li><Link to="/thought-experiments" className="hover:text-[var(--cyan)]">{g.nav.thought}</Link></li>
            <li><Link to="/challenge" className="hover:text-[var(--cyan)]">{g.nav.challenge}</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-faint)" }}>{g.footer.resources}</div>
          <ul className="space-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
            <li><Link to="/tools" className="hover:text-[var(--cyan)]">{g.nav.tools}</Link></li>
            <li><Link to="/glossary" className="hover:text-[var(--cyan)]">{g.nav.glossary}</Link></li>
            <li><Link to="/about" className="hover:text-[var(--cyan)]">{g.nav.about}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-faint)" }}>
        {g.footer.rights}
      </div>
    </footer>
  );
}

export function Layout() {
  const theme = useApp((s) => s.theme);
  // Sync theme to <html> so canvas code reading CSS vars from
  // documentElement (via getComputedStyle) sees the active theme.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <div data-theme={theme} className="flex min-h-screen flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
