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

export default function ReportPage() {
  const { data, isLoading, mutate } = useSWR<ReportResponse>(
    "http://localhost:8000/api/report/generate",
    (url: string) => postFetcher(url, {})
  );

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Daily Intelligence Brief</h1>
          <p className="text-xs text-slate-400">
            Automated narrative plus list of high-risk incidents in the last
            24 hours.
          </p>
        </div>
        <button
          onClick={() => mutate()}
          className="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800"
        >
          Regenerate
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold">Narrative summary</h2>
          {isLoading && (
            <p className="mt-2 text-xs text-slate-400">
              Generating latest brief...
            </p>
          )}
          {data && (
            <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-200">
              {data.summary_text}
            </pre>
          )}
          {!isLoading && !data && (
            <p className="mt-2 text-xs text-slate-400">
              No brief available yet. Trigger generation using the button above.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold">High-risk incidents (24h)</h2>
          <div className="mt-2 space-y-2 max-h-72 overflow-auto pr-1 text-xs">
            {data?.high_risk_incidents?.length ? (
              data.high_risk_incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="rounded border border-slate-800 bg-slate-900/80 p-2"
                >
                  <div className="flex justify-between gap-2">
                    <span className="font-medium text-slate-100">
                      {inc.location ?? "Unknown location"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(inc.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase text-slate-400">
                      {inc.category}
                    </span>
                    <span className="text-[11px] font-semibold text-red-400">
                      {inc.threat_score.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">
                No high-risk incidents found in the last 24 hours.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

