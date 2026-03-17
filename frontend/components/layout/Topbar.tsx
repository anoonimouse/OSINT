"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/api";

interface Incident {
  id: number;
  threat_score: number;
  timestamp: string;
}

export default function Topbar() {
  const { data } = useSWR<Incident[]>(
    "/api/incidents?limit=500",
    fetcher
  );

  const now = new Date().getTime();
  const last24h = (data ?? []).filter((i) => {
    const ts = new Date(i.timestamp).getTime();
    return now - ts <= 24 * 60 * 60 * 1000;
  });

  const highLast24 = last24h.filter((i) => i.threat_score >= 8).length;
  const lastIncidentTime =
    data && data.length > 0
      ? new Date(data[0].timestamp).toLocaleString()
      : null;

  return (
    <header className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs">
      <div className="font-medium text-slate-200">
        Operational Picture{" "}
        <span className="ml-1 text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
          OSINT
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-slate-300">
            High-risk (24h): <span className="font-semibold">{highLast24}</span>
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Last incident:{" "}
          <span className="font-medium">
            {lastIncidentTime ?? "no data"}
          </span>
        </div>
      </div>
    </header>
  );
}

