
"use client";

import React from "react";

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
    "/api/incidents?limit=500",
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
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Incidents</h1>
          <p className="text-xs text-slate-400">
            Latest detected security-related incidents from open sources.
          </p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-xs shadow-inner">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <span className="text-slate-400">Category</span>
          <select
            className="rounded bg-slate-900 border border-slate-700 px-2 py-1 text-slate-100"
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
        
        <div className="flex flex-col gap-1.5 flex-1 min-w-[180px]">
          <div className="flex justify-between items-end">
            <span className="text-slate-400">Min score</span>
            <span className="text-slate-200">{minScore}</span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            className="w-full accent-blue-500"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <span className="text-slate-400">Time range</span>
          <div className="flex gap-1 bg-slate-900 p-1 rounded border border-slate-700">
            {['24h', '7d', 'all'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`flex-1 px-2 py-1 rounded text-[10px] transition-all ${
                  range === r ? 'bg-slate-800 text-slate-100 font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filtered.map((inc) => (
          <div key={inc.id} className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-700 bg-slate-900 ${scoreColor(inc.threat_score)}`}>
                {inc.category.replace("_", " ")}
              </span>
              <span className={`text-sm font-semibold ${scoreColor(inc.threat_score)}`}>
                {inc.threat_score.toFixed(1)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200 line-clamp-1">
                {inc.location ?? "Unknown location"}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {new Date(inc.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
             No incidents available yet.
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase tracking-wide border-b border-slate-800">
              <tr>
                <th className="px-3 py-2 text-left">Time</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-right">Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((inc) => (
                <tr
                  key={inc.id}
                  className="hover:bg-slate-800/60 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap text-slate-300">
                    {new Date(inc.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {inc.location ?? (
                      <span className="text-slate-500 italic">Unknown</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {inc.category.replace("_", " ")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={`font-semibold ${scoreColor(inc.threat_score)}`}
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
                    No incidents available yet.
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

