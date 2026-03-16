"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/api";

interface Incident {
  id: number;
  category: string;
  location: string | null;
  threat_score: number;
  timestamp: string;
  article_id: number;
}

const scoreColor = (score: number) => {
  if (score >= 8) return "text-red-400";
  if (score >= 5) return "text-amber-400";
  return "text-emerald-400";
};

export default function IncidentsPage() {
  const { data } = useSWR<Incident[]>(
    "http://localhost:8000/api/incidents?limit=500",
    fetcher
  );

  const incidents = (data ?? []).slice().sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [minScore, setMinScore] = React.useState<number>(0);
  const [range, setRange] = React.useState<string>("24h");

  const now = new Date().getTime();
  const filtered = incidents.filter((inc) => {
    if (selectedCategory !== "all" && inc.category !== selectedCategory) {
      return false;
    }
    if (inc.threat_score < minScore) {
      return false;
    }
    const ts = new Date(inc.timestamp).getTime();
    const ageMs = now - ts;
    if (range === "24h" && ageMs > 24 * 60 * 60 * 1000) return false;
    if (range === "7d" && ageMs > 7 * 24 * 60 * 60 * 1000) return false;
    if (range === "30d" && ageMs > 30 * 24 * 60 * 60 * 1000) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Incidents</h1>
          <p className="text-xs text-slate-400">
            Latest detected security-related incidents from open sources.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-semibold">{filtered.length}</span> of{" "}
          <span className="font-semibold">{incidents.length}</span>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Category</span>
          <select
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All</option>
            <option value="terrorism">Terrorism</option>
            <option value="border_infiltration">Border infiltration</option>
            <option value="arms_smuggling">Arms smuggling</option>
            <option value="naxal_activity">Naxal activity</option>
            <option value="communal_violence">Communal violence</option>
            <option value="cyber_attack">Cyber attack</option>
            <option value="organized_crime">Organized crime</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Min score</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
          <span className="w-6 text-right text-slate-200">{minScore}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Range</span>
          <select
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Threat</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  className="border-t border-slate-800 hover:bg-slate-800/60"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-slate-300">
                    {new Date(inc.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    {inc.location ?? (
                      <span className="text-slate-500 italic">Unknown</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {inc.category.replace("_", " ")}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded-full border border-slate-700 px-2 py-0.5 text-[10px] font-semibold ${scoreColor(
                        inc.threat_score
                      )}`}
                    >
                      {inc.threat_score.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-slate-500"
                  >
                    No incidents available yet. Run the collector or seed demo
                    data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

