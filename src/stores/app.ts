import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "../i18n/global";

export type Theme = "dark" | "light";
export type MathMode = "conceptual" | "mathematical";

interface QuizResult {
  score: number;
  total: number;
  date: string;
}

interface AppState {
  lang: Lang;
  theme: Theme;
  mathMode: MathMode;
  units: "scientific" | "human";
  completedModules: string[];
  quizResults: Record<string, QuizResult>;
  experimentsAttempted: string[];
  challengeBest: QuizResult | null;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  setMathMode: (m: MathMode) => void;
  setUnits: (u: "scientific" | "human") => void;
  completeModule: (id: string) => void;
  recordQuiz: (id: string, score: number, total: number) => void;
  attemptExperiment: (id: string) => void;
  recordChallenge: (score: number, total: number) => void;
  resetProgress: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      lang: "en",
      theme: "dark",
      mathMode: "conceptual",
      units: "scientific",
      completedModules: [],
      quizResults: {},
      experimentsAttempted: [],
      challengeBest: null,
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      setMathMode: (mathMode) => set({ mathMode }),
      setUnits: (units) => set({ units }),
      completeModule: (id) =>
        set((s) =>
          s.completedModules.includes(id)
            ? s
            : { completedModules: [...s.completedModules, id] },
        ),
      recordQuiz: (id, score, total) =>
        set((s) => ({
          quizResults: {
            ...s.quizResults,
            [id]: { score, total, date: new Date().toISOString() },
          },
        })),
      attemptExperiment: (id) =>
        set((s) =>
          s.experimentsAttempted.includes(id)
            ? s
            : { experimentsAttempted: [...s.experimentsAttempted, id] },
        ),
      recordChallenge: (score, total) =>
        set((s) => ({
          challengeBest:
            !s.challengeBest || score > s.challengeBest.score
              ? { score, total, date: new Date().toISOString() }
              : s.challengeBest,
        })),
      resetProgress: () =>
        set({
          completedModules: [],
          quizResults: {},
          experimentsAttempted: [],
          challengeBest: null,
        }),
    }),
    { name: "relativity-academy" },
  ),
);

/** Convenience hook: current language + global strings. */
export function useLang() {
  const lang = useApp((s) => s.lang);
  return lang;
}

export function useStrings() {
  const lang = useApp((s) => s.lang);
  // dynamic import avoided; globalStrings imported directly where needed
  return lang;
}
