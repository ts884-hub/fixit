import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#2E2E2E]">
      <MarketingNav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1F3A5F] leading-tight mb-6">
            Stop paying for the same repair twice.
          </h1>
          <p className="text-lg text-[#2E2E2E] mb-4 leading-relaxed">
            You keep track of your rent down to the dollar. Maintenance should be just as clear.
          </p>
          <p className="text-base text-gray-600 mb-10 leading-relaxed max-w-2xl">
            FixIt gives small landlords a simple way to track every maintenance request — by unit
            and by building — so you can see patterns, reduce repeat fixes, and make better
            decisions over time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-base"
            >
              Start Free Trial
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center bg-white text-[#1F3A5F] font-semibold px-6 py-3 rounded-lg border border-[#E2E5E7] hover:bg-[#F6F7F8] transition-colors text-base"
            >
              See How It Works
            </Link>
          </div>

          <div className="border-t border-[#E2E5E7] pt-8">
            <p className="text-sm text-gray-500 mb-3">Used by landlords managing 1&ndash;50 units:</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#2E2E2E]">
              <span>Single-family homes</span>
              <span>Duplexes and triplexes</span>
              <span>Small apartment buildings</span>
              <span>Mixed-use properties</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 Benefit cards ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-10 text-center">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                ),
                title: 'Unique tenant link per property',
                desc: 'Tenants submit requests through a link. No app, no login, no friction.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: 'Full repair history by unit',
                desc: 'Every request is stored under the right unit so you can spot recurring problems.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                ),
                title: 'Instant SMS and email alerts',
                desc: 'Get notified the moment a new request comes in — no need to check manually.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-xl p-6"
              >
                <div className="text-[#3F7D58] mb-4">{card.icon}</div>
                <h3 className="font-semibold text-[#1F3A5F] mb-2 text-sm">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-[#E2E5E7] rounded-2xl p-8 sm:p-10 shadow-sm text-center">
            <p className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-3">
              Interactive Demo
            </p>
            <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
              See it in action before you sign up.
            </h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
              Submit a test request as a tenant, then switch to the manager view and watch it
              appear in the dashboard — all in your browser, no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/product"
                className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-sm"
              >
                Try the Interactive Demo
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-white text-[#1F3A5F] font-semibold px-6 py-3 rounded-lg border border-[#E2E5E7] hover:bg-[#F6F7F8] transition-colors text-sm"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E2E5E7] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-[#1F3A5F]">FixIt</p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FixIt &mdash; Property Maintenance Management
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/product" className="hover:text-[#1F3A5F] transition-colors">Product</Link>
            <Link href="/how-it-works" className="hover:text-[#1F3A5F] transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-[#1F3A5F] transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-[#1F3A5F] transition-colors">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
