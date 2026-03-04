import React from 'react';
import Link from 'next/link';

interface TenantShellProps {
  children: React.ReactNode;
}

export function TenantShell({ children }: TenantShellProps) {
  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-[#E2E5E7] h-14 flex items-center px-4 sm:px-6">
        <Link
          href="/"
          className="font-bold text-[#1F3A5F] text-base tracking-tight"
        >
          FixIt
        </Link>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-[#E2E5E7] py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} FixIt
      </footer>
    </div>
  );
}
