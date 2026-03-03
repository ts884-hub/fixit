'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="font-black text-zinc-100 text-base sm:text-lg tracking-tight flex items-center gap-2 shrink-0"
        >
          <span className="text-sky-400">⚒</span>
          <span>Fix<span className="text-sky-400">It</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#offer" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            What We Offer
          </a>
          <a href="#benefits" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Benefits
          </a>
          <a href="#setup" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            How It Works
          </a>
          <Link href="/login" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-sky-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg hover:bg-sky-300 transition-colors"
          >
            Get Started Free
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-100 text-xl leading-none"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="md:hidden bg-zinc-950 border-b border-zinc-800 px-4 pb-5 pt-2 flex flex-col gap-1">
          <a
            href="#offer"
            className="text-zinc-400 hover:text-zinc-100 py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            What We Offer
          </a>
          <a
            href="#benefits"
            className="text-zinc-400 hover:text-zinc-100 py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            Benefits
          </a>
          <a
            href="#setup"
            className="text-zinc-400 hover:text-zinc-100 py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            How It Works
          </a>
          <Link
            href="/login"
            className="text-zinc-400 hover:text-zinc-100 py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="mt-2 bg-sky-400 text-zinc-950 font-semibold px-4 py-3 rounded-lg text-center text-sm hover:bg-sky-300 transition-colors"
            onClick={() => setOpen(false)}
          >
            Get Started Free
          </Link>
        </nav>
      )}
    </header>
  );
}
