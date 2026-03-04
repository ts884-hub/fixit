'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function MarketingNav() {
  const [open, setOpen] = useState(false);

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
          <a href="#offer" className="text-[#2E2E2E] hover:text-[#1F3A5F] transition-colors">
            What We Offer
          </a>
          <a href="#benefits" className="text-[#2E2E2E] hover:text-[#1F3A5F] transition-colors">
            What It Helps You Do
          </a>
          <a href="#setup" className="text-[#2E2E2E] hover:text-[#1F3A5F] transition-colors">
            How It Works
          </a>
          <Link href="/login" className="text-[#2E2E2E] hover:text-[#1F3A5F] transition-colors">
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-[#1F3A5F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#172d4a] transition-colors"
          >
            Sign Up
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
          <a
            href="#offer"
            className="text-[#2E2E2E] hover:text-[#1F3A5F] py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            What We Offer
          </a>
          <a
            href="#benefits"
            className="text-[#2E2E2E] hover:text-[#1F3A5F] py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            What It Helps You Do
          </a>
          <a
            href="#setup"
            className="text-[#2E2E2E] hover:text-[#1F3A5F] py-2.5 text-sm transition-colors"
            onClick={() => setOpen(false)}
          >
            How It Works
          </a>
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
            Sign Up
          </Link>
        </nav>
      )}
    </header>
  );
}
