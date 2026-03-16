"use client";

import { useState } from "react";

export default function CollectorRunner() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/collector/run",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to run collector");
      }
      const data = await res.json();
      setResult(
        `Success! Collected ${data.articles ?? 0} articles, ${data.incidents ?? 0} incidents.`
      );
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-900 rounded-lg border border-slate-800">
      <h1 className="text-xl font-bold mb-4">Run RSS Collector</h1>
      <label className="block mb-2 text-sm font-medium">Admin Password</label>
      <input
        type="password"
        className="w-full p-2 mb-4 rounded border border-slate-700 bg-slate-800 text-slate-200"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button
        className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
        onClick={handleRun}
        disabled={loading || !password}
      >
        {loading ? "Running..." : "Run Collector Now"}
      </button>
      {result && <div className="mt-4 text-green-400">{result}</div>}
      {error && <div className="mt-4 text-red-400">{error}</div>}
    </div>
  );
}
