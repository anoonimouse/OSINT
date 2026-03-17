import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-8xl font-black text-slate-800 tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold text-slate-100">Intelligence Gap</h2>
        <p className="max-w-md text-slate-400">
          The requested asset or location could not be identified by the monitor. 
          It may have been moved, deleted, or never existed in our database.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className="px-6 py-2.5 bg-slate-100 text-slate-950 font-bold rounded-md hover:bg-slate-200 transition-colors shadow-lg shadow-white/5"
        >
          Return to HQ
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-slate-800 text-slate-300 font-medium rounded-md border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          Previous Track
        </button>
      </div>

      <div className="pt-8 flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest animate-pulse">
        <span className="w-2 h-2 rounded-full bg-slate-600" />
        Scanning for alternative routes...
      </div>
    </div>
  );
}
