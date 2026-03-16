"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/api";

interface Incident {
  id: number;
  threat_score: number;
}

export default function ThreatOverview() {
  const { data } = useSWR<Incident[]>(
    "/api/incidents?limit=500",
    fetcher
  );

  const high = data?.filter((i) => i.threat_score >= 8).length ?? 0;
  const moderate =
    data?.filter((i) => i.threat_score >= 5 && i.threat_score < 8).length ?? 0;
  const low = data?.filter((i) => i.threat_score < 5).length ?? 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="text-xs uppercase text-slate-400">High Risk</div>
        <div className="mt-2 text-3xl font-bold text-red-400">{high}</div>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="text-xs uppercase text-slate-400">Moderate</div>
        <div className="mt-2 text-3xl font-bold text-amber-400">{moderate}</div>
      </div>
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="text-xs uppercase text-slate-400">Low</div>
        <div className="mt-2 text-3xl font-bold text-emerald-400">{low}</div>
      </div>
    </section>
  );
}

