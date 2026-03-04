'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthed, logout } from '@/lib/auth';
import { Button } from './Button';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthed());
  }, [pathname]);

  function handleLogout() {
    logout();
    setAuthed(false);
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E5E7] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="font-bold text-[#1F3A5F] text-base sm:text-lg tracking-tight"
          >
            FixIt
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {authed ? (
              <>
                <Link
                  href="/dashboard"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith('/dashboard') &&
                    !pathname.startsWith('/dashboard/properties')
                      ? 'bg-[#1F3A5F]/10 text-[#1F3A5F]'
                      : 'text-[#2E2E2E] hover:bg-[#F6F7F8] hover:text-[#1F3A5F]',
                  ].join(' ')}
                >
                  Tickets
                </Link>
                <Link
                  href="/dashboard/properties"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith('/dashboard/properties')
                      ? 'bg-[#1F3A5F]/10 text-[#1F3A5F]'
                      : 'text-[#2E2E2E] hover:bg-[#F6F7F8] hover:text-[#1F3A5F]',
                  ].join(' ')}
                >
                  Properties
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-[#2E2E2E]"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/login'
                      ? 'bg-[#1F3A5F]/10 text-[#1F3A5F]'
                      : 'text-[#2E2E2E] hover:bg-[#F6F7F8] hover:text-[#1F3A5F]',
                  ].join(' ')}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/signup'
                      ? 'bg-[#1F3A5F]/10 text-[#1F3A5F]'
                      : 'bg-[#1F3A5F] text-white hover:bg-[#172d4a]',
                  ].join(' ')}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E5E7] py-4 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} FixIt &mdash; Property Maintenance Management
      </footer>
    </div>
  );
}
