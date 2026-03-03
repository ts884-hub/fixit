import React from 'react';
import Link from 'next/link';

interface TenantShellProps {
  children: React.ReactNode;
}

export function TenantShell({ children }: TenantShellProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Minimal header — no manager nav */}
      <header className="bg-zinc-950 border-b border-zinc-800 h-14 flex items-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-black text-zinc-100 text-base tracking-tight flex items-center gap-2"
        >
          <span className="text-sky-400">⚒</span>
          <span>Fix<span className="text-sky-400">It</span></span>
        </Link>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
