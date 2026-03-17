"use client";

import "./globals.css";
import Topbar from "../components/layout/Topbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Incidents", href: "/incidents" },
    { label: "Daily Brief", href: "/report" },
  ];

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="flex min-h-screen">
          <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-800 bg-slate-900/90">
            <div className="p-4 text-xl font-semibold tracking-tight">
              OSINT Monitor
            </div>
            <nav className="px-4 space-y-2 text-sm">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded transition-colors ${
                      isActive
                        ? "bg-slate-800 text-white font-medium"
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
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

