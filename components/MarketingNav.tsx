'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Product',       href: '/product' },
  { label: 'How It Works',  href: '/how-it-works' },
  { label: 'Pricing',       href: '/pricing' },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white border-b border-[#E2E5E7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="font-bold text-[#1F3A5F] text-lg tracking-tight shrink-0"
        >
          FixIt
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'transition-colors',
                pathname === link.href
                  ? 'text-[#1F3A5F] font-semibold'
                  : 'text-[#2E2E2E] hover:text-[#1F3A5F]',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[#2E2E2E] hover:text-[#1F3A5F] transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-[#1F3A5F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#172d4a] transition-colors"
          >
            Start Free Trial
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#2E2E2E] hover:text-[#1F3A5F] text-xl leading-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden bg-white border-b border-[#E2E5E7] px-4 pb-5 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'py-2.5 text-sm transition-colors',
                pathname === link.href
                  ? 'text-[#1F3A5F] font-semibold'
                  : 'text-[#2E2E2E] hover:text-[#1F3A5F]',
              ].join(' ')}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-[#2E2E2E] hover:text-[#1F3A5F] py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="mt-2 bg-[#1F3A5F] text-white font-semibold px-4 py-3 rounded-lg text-center text-sm hover:bg-[#172d4a] transition-colors"
            onClick={() => setOpen(false)}
          >
            Start Free Trial
          </Link>
        </nav>
      )}
    </header>
  );
}
