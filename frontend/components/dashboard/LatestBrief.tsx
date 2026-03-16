"use client";

import useSWR from "swr";
import { postFetcher } from "../../lib/api";

interface HighRiskIncident {
  id: number;
  category: string;
  location: string | null;
  threat_score: number;
  timestamp: string;
}

interface ReportResponse {
  date: string;
  summary_text: string;
  high_risk_incidents: HighRiskIncident[];
}

export default function LatestBrief() {
  const { data, isLoading } = useSWR<ReportResponse>(
    "http://localhost:8000/api/report/generate",
    (url: string) => postFetcher(url, {})
  );

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
      <h2 className="text-sm font-semibold mb-2">Latest Intelligence Brief</h2>
      {isLoading && <p className="text-xs text-slate-400">Generating...</p>}
      {data && (
        <div className="space-y-3">
          <pre className="whitespace-pre-wrap text-xs text-slate-200">
            {data.summary_text}
          </pre>
          {data.high_risk_incidents?.length ? (
            <div className="border-t border-slate-800 pt-2">
              <p className="mb-1 text-[11px] font-semibold text-slate-300">
                High-risk incidents (24h)
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400">
                {data.high_risk_incidents.slice(0, 3).map((inc) => (
                  <li key={inc.id}>
                    [{inc.category}] {inc.location ?? "Unknown"} —{" "}
                    {inc.threat_score.toFixed(1)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

