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
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="font-black text-zinc-100 text-base sm:text-lg tracking-tight flex items-center gap-2"
          >
            <span className="text-sky-400">⚒</span>
            <span>
              Fix<span className="text-sky-400">It</span>
            </span>
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
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                  ].join(' ')}
                >
                  Tickets
                </Link>
                <Link
                  href="/dashboard/properties"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith('/dashboard/properties')
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                  ].join(' ')}
                >
                  Properties
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-zinc-400"
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
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                  ].join(' ')}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname === '/signup'
                      ? 'bg-sky-400/10 text-sky-400'
                      : 'bg-sky-400 text-zinc-950 hover:bg-sky-300',
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
      <footer className="bg-zinc-950 border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} FixIt &mdash; Property Maintenance Management
      </footer>
    </div>
  );
}
