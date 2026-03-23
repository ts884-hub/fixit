'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthed, logout } from '@/lib/auth';
import { getProfile } from '@/lib/api';
import { Button } from './Button';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const isLoggedIn = isAuthed();
    setAuthed(isLoggedIn);

    // If logged in and not already on settings, check for profile.
    // If no profile exists, redirect to settings to complete setup.
    if (isLoggedIn && !pathname.startsWith('/dashboard/settings')) {
      getProfile().then((profile) => {
        if (!profile) {
          router.replace('/dashboard/settings');
        }
      }).catch(() => {
        // Silently ignore — don't block the UI if profile check fails
      });
    }
  }, [pathname, router]);

  function handleLogout() {
    logout();
    setAuthed(false);
    router.push('/login');
  }

  const navLink = (href: string, label: string, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        href={href}
        className={[
          'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-[#1F3A5F]/10 text-[#1F3A5F]'
            : 'text-[#2E2E2E] hover:bg-[#F6F7F8] hover:text-[#1F3A5F]',
        ].join(' ')}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E5E7] sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="font-bold text-[#1F3A5F] text-base sm:text-lg tracking-tight">
            FixIt
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {authed ? (
              <>
                {navLink('/dashboard', 'Tickets', true)}
                {navLink('/dashboard/properties', 'Properties')}
                {navLink('/dashboard/settings', 'Settings')}
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-[#2E2E2E]">
                  Logout
                </Button>
              </>
            ) : (
              <>
                {navLink('/login', 'Log In', true)}
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

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>

      <footer className="bg-white border-t border-[#E2E5E7] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FixIt &mdash; Property Maintenance Management
          </p>
          <div className="flex items-center gap-3">
            <a
              href="tel:6108238139"
              className="text-sm text-[#1F3A5F] hover:underline"
            >
              (610) 823-8139
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="mailto:singh.tarneer@gmail.com"
              className="text-sm text-[#1F3A5F] hover:underline"
            >
              singh.tarneer@gmail.com
            </a>
            <a
              href="mailto:singh.tarneer@gmail.com"
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#1F3A5F] text-white hover:bg-[#172d4a] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
