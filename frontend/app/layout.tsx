"use client";

import "./globals.css";
import Topbar from "../components/layout/Topbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Incidents", href: "/incidents" },
    { label: "Daily Brief", href: "/report" },
  ];

  const NavContent = () => (
    <>
      <div className="p-4 text-xl font-semibold tracking-tight border-b border-slate-800 mb-2">
        OSINT Monitor
      </div>
      <nav className="px-4 space-y-2 text-sm">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded transition-colors ${
                isActive
                  ? "bg-slate-800 text-white font-medium shadow-sm"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex md:flex-col md:w-64 border-r border-slate-800 bg-slate-900/90 shadow-xl z-20">
            <NavContent />
          </aside>

          {/* Mobile Overlay & Sidebar */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <NavContent />
          </aside>

          <main className="flex-1 p-4 md:p-6 relative">
            {/* Mobile Header (Fixed Logo & Right Burger) */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
              <span className="text-lg font-bold tracking-tighter text-slate-100">OSINT</span>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-md bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            <div className="mx-auto w-full max-w-7xl space-y-4 pt-16 md:pt-0">
              <Topbar />
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}


