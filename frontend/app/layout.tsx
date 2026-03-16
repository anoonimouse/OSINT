import "./globals.css";
import Topbar from "../components/layout/Topbar";

export const metadata = {
  title: "OSINT Threat Monitoring",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="flex min-h-screen">
          <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-800 bg-slate-900/90">
            <div className="p-4 text-xl font-semibold tracking-tight">
              OSINT Monitor
            </div>
            <nav className="px-4 space-y-2 text-sm">
              <a href="/" className="block px-3 py-2 rounded bg-slate-800">
                Dashboard
              </a>
              <a
                href="/incidents"
                className="block px-3 py-2 rounded hover:bg-slate-800/80"
              >
                Incidents
              </a>
              <a
                href="/report"
                className="block px-3 py-2 rounded hover:bg-slate-800/80"
              >
                Daily Brief
              </a>
            </nav>
          </aside>
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-7xl space-y-4">
              <Topbar />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

