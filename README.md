# Relativity Fundamentals Academy

**Understand Einstein's universe by experimenting with it.** An interactive, bilingual (EN/ES) educational web app — a spacetime laboratory disguised as a learning portal. Manipulate velocities, masses, clocks and reference frames, and watch relativity respond.

Created by **Jon Peciña**.

## Stack

Vite + React + TypeScript · Tailwind CSS v4 · React Router · Zustand · Framer Motion · KaTeX · Three.js (@react-three/fiber) · Vitest · Vercel Analytics · PWA (service worker + manifest)

100% client-side. No backend, no auth, no database, no LLM APIs.

## Project structure

```
src/
  physics/        pure physics functions (specialRelativity, generalRelativity, constants, units) + Vitest suite
  components/     ui.tsx — shared contract (SimulationShell, ParamSlider, PhysicsValue, …), layout.tsx
  sims/           18 simulators + registry.ts (id → lazy component + metadata)
  lessons/        10 lesson content files (types.ts contract) + ModulePage renderer
  pages/          Home, LearnHub, ModulePage, LabHub, SimPage, ThoughtExperiments, Tools, Glossary, Challenge, About
  data/           modules, glossary, timeline, challenge questions, config (author/links)
  stores/         app.ts — zustand store (language, theme, math mode, progress; persisted)
  hooks/          useAnimation (rAF clock, reduced-motion)
  i18n/           global.ts — global UI strings; features keep local STRINGS = { en, es }
public/           manifest.webmanifest, sw.js (offline shell), icons, favicon
```

## Conventions

- **i18n:** every feature defines its own `const STRINGS = { en: {...}, es: {...} }` and reads language via `useG()` from `components/ui`. No hardcoded single-language strings.
- **Simulators:** default-export a component, no props; wrap in `SimulationShell`; all displayed numbers must derive from live simulation state; clamp v < c; respect `prefers-reduced-motion`; never show NaN/Infinity.
- **Physics first:** formulas live in `src/physics/` and are unit-tested (`npx vitest run`).
- **Typecheck:** `npx tsc --noEmit -p tsconfig.app.json` (the root tsconfig is solution-style — plain `tsc --noEmit` checks nothing).
- **Author:** Jon Peciña — referenced in footer, About page, and certificate. Links configurable in `src/data/config.ts`.

## Development

```bash
npm install
npm run dev        # dev server
npx vitest run     # physics tests
npm run build      # production build
```

## Deployment

Push to GitHub and import in Vercel (static/Vite preset). Analytics via `@vercel/analytics`.
