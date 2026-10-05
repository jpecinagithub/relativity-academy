import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Layout } from "./components/layout";

const Home = lazy(() => import("./pages/Home"));
const LearnHub = lazy(() => import("./pages/LearnHub"));
const ModulePage = lazy(() => import("./pages/ModulePage"));
const LabHub = lazy(() => import("./pages/LabHub"));
const SimPage = lazy(() => import("./pages/SimPage"));
const ThoughtExperiments = lazy(() => import("./pages/ThoughtExperiments"));
const Tools = lazy(() => import("./pages/Tools"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Challenge = lazy(() => import("./pages/Challenge"));
const About = lazy(() => import("./pages/About"));

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "var(--cyan)", borderTopColor: "transparent" }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<LearnHub />} />
            <Route path="learn/:moduleId" element={<ModulePage />} />
            <Route path="lab" element={<LabHub />} />
            <Route path="lab/:simId" element={<SimPage />} />
            <Route path="thought-experiments" element={<ThoughtExperiments />} />
            <Route path="tools" element={<Tools />} />
            <Route path="glossary" element={<Glossary />} />
            <Route path="challenge" element={<Challenge />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}
