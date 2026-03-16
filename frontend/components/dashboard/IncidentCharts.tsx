"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Incident {
  id: number;
  timestamp: string;
}

export default function IncidentCharts() {
  const { data } = useSWR<Incident[]>(
    "http://localhost:8000/api/incidents?limit=200",
    fetcher
  );

  const countsByDate: Record<string, number> = {};
  data?.forEach((i) => {
    const d = i.timestamp.slice(0, 10);
    countsByDate[d] = (countsByDate[d] || 0) + 1;
  });
  const chartData = Object.entries(countsByDate)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, count]) => ({ date, count }));

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 h-[280px] md:h-[360px]">
      <h2 className="text-sm font-semibold mb-2">Incident Frequency</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1e293b",
              color: "#e2e8f0",
              fontSize: 12,
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

