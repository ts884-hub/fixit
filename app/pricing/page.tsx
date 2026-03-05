import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#2E2E2E]">
      <MarketingNav />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] leading-tight mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            One plan. No add-ons. No contracts. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Pricing card ─────────────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          {/* Trial card */}
          <div className="bg-white border border-[#E2E5E7] rounded-2xl shadow-sm overflow-hidden mb-6">
            <div className="bg-[#1F3A5F] px-8 py-6 text-center">
              <p className="text-xs font-semibold text-[#3F7D58]/80 uppercase tracking-widest mb-2" style={{color: 'rgba(100,200,140,0.9)'}}>
                Start Here
              </p>
              <h2 className="text-2xl font-bold text-white mb-1">Free for 30 Days</h2>
              <p className="text-sm text-white/70">No credit card required</p>
            </div>

            <div className="px-8 py-8">
              <p className="text-sm font-medium text-[#2E2E2E] mb-5">Everything included during your trial:</p>

              <ul className="space-y-3 mb-8">
                {[
                  'Up to 10 properties',
                  'Unlimited tenant requests',
                  'Full repair history per unit',
                  'Photo attachments',
                  'Urgency and location tagging',
                  'Status tracking and manager notes',
                  'SMS and email alerts on new requests',
                  'Manager settings and profile',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#2E2E2E]">
                    <svg className="w-4 h-4 text-[#3F7D58] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="block w-full bg-[#1F3A5F] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-[#172d4a] transition-colors text-sm text-center"
              >
                Start Free Trial
              </Link>

              <p className="text-xs text-center text-gray-400 mt-4">
                No credit card. No commitment. Cancel anytime.
              </p>
            </div>
          </div>

          {/* After trial */}
          <div className="bg-white border border-[#E2E5E7] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">After trial</p>
                <p className="font-semibold text-[#1F3A5F]">Monthly Plan</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1F3A5F]">$19<span className="text-sm font-normal text-gray-500">/mo</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              All features included. Billed month to month.
              Cancel from your account settings at any time — no questions asked.
            </p>
            <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500">
                Managing more than 10 properties or need custom features?{' '}
                <Link href="/login" className="text-[#1F3A5F] font-medium hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compare / clarify ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-[#1F3A5F] mb-8 text-center">
            What you are paying for
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Organized records',
                desc: 'Every repair request is stored by unit and property, permanently. No more digging through text chains.',
              },
              {
                title: 'Instant alerts',
                desc: 'Get an SMS and email the moment a tenant submits a request — so nothing slips through.',
              },
              {
                title: 'Clear history',
                desc: 'See which units have had repeated problems, what was fixed, and when. Useful at tax time and at renewal.',
              },
              {
                title: 'Simple tenant experience',
                desc: 'Tenants submit via a link. No app. No account. They describe the problem; you handle it.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#3F7D58] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-[#1F3A5F] mb-1 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
            Start with 30 days free.
          </h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Add your first property and send the tenant link today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="/product"
              className="inline-flex items-center justify-center bg-white text-[#1F3A5F] font-semibold px-6 py-3 rounded-lg border border-[#E2E5E7] hover:bg-[#F6F7F8] transition-colors text-sm"
            >
              See the Product First
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E2E5E7] py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold text-[#1F3A5F]">FixIt</p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} FixIt &mdash; Property Maintenance Management
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/login" className="hover:text-[#1F3A5F] transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-[#1F3A5F] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
