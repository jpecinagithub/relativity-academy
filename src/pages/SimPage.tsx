import { Suspense } from "react";
import { useParams, Navigate } from "react-router-dom";
import { simById } from "../sims/registry";
import { SimPageLoader, LabBackLink } from "./LabHub";

export default function SimPage() {
  const { simId } = useParams();
  const meta = simId ? simById(simId) : undefined;
  if (!meta) return <Navigate to="/lab" replace />;
  const Sim = meta.component;
  return (
    <Suspense fallback={<SimPageLoader />}>
      <Sim />
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <LabBackLink />
      </div>
    </Suspense>
  );
}
