"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">System Breach Detected</h1>
        <p className="max-w-md text-slate-400 mx-auto">
          The monitoring engine encountered an unexpected runtime exception. 
          Session integrity may be compromised.
        </p>
        <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-800 text-left">
           <code className="text-xs text-red-400 font-mono">
             {error.message || "ERR_RUNTIME_FAILURE"}
             {error.digest && <div className="mt-1 opacity-50">ID: {error.digest}</div>}
           </code>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset()}
          className="px-8 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95"
        >
          Reboot Session
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-slate-800 text-slate-300 font-medium rounded-md border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          Evacuate to HQ
        </button>
      </div>
    </div>
  );
}
