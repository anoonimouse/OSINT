"use client";

import useSWR from "swr";
import { postFetcher } from "../../lib/api";

interface ReportResponse {
  date: string;
  summary_text: string;
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
        <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200">
          {data.summary_text}
        </pre>
      )}
    </section>
  );
}

