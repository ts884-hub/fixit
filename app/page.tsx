import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';

// ─── Simple SVG icons ─────────────────────────────────────────────────────────

function IconLink() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

function IconList() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconRepeat() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function IconDollar() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconMessage() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
            FixIt helps you keep a record of every repair request — by unit and by building — so you can see patterns, reduce repeat fixes, and make better decisions over time.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-base"
            >
              Create a Free Account
            </Link>
            <a
              href="#setup"
              className="inline-flex items-center justify-center bg-white text-[#1F3A5F] font-semibold px-6 py-3 rounded-lg border border-[#E2E5E7] hover:bg-[#F6F7F8] transition-colors text-base"
            >
              See How It Works
            </a>
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

      {/* ── Problem ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-6">
            Most small landlords handle maintenance through texts and calls.
          </h2>
          <p className="text-base text-[#2E2E2E] mb-4 leading-relaxed">
            When something breaks, you fix it. Then you move on.
          </p>
          <p className="text-base text-[#2E2E2E] mb-6 leading-relaxed">
            But over time, you lose track of:
          </p>
          <ul className="space-y-2 mb-8 text-base text-[#2E2E2E]">
            <li className="flex items-start gap-2">
              <span className="text-[#1F3A5F] mt-1">&#8212;</span>
              Which unit has had three plumbing issues this year
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1F3A5F] mt-1">&#8212;</span>
              Which tenant keeps reporting the same problem
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1F3A5F] mt-1">&#8212;</span>
              Which repair you&apos;ve already paid for twice
            </li>
          </ul>

          <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-xl px-6 py-5 mb-8">
            <p className="text-base text-[#2E2E2E] leading-relaxed italic">
              One landlord spent nearly $3,000 over two years fixing small plumbing leaks in the same unit. A full pipe replacement would have cost $1,200. He didn&apos;t see the pattern early enough.
            </p>
          </div>

          <p className="text-base text-[#2E2E2E] leading-relaxed">
            FixIt helps you see where your maintenance dollars are going &mdash; by unit, by issue, and over time &mdash; so you can make informed decisions instead of reacting every time something breaks.
          </p>
        </div>
      </section>

      {/* ── What We Offer ─────────────────────────────────────────────────── */}
      <section id="offer" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
              Everything you need to stay organized &mdash; without adding complexity.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <IconLink />,
                title: 'Unique tenant links',
                desc: 'Each property gets its own link. Tenants submit requests through it. No app required.',
              },
              {
                icon: <IconList />,
                title: 'Per-unit repair history',
                desc: 'Every repair is logged under the unit so you can see what has been fixed and when.',
              },
              {
                icon: <IconSearch />,
                title: 'Repeat issue visibility',
                desc: 'If the same problem shows up multiple times, you will notice it.',
              },
              {
                icon: <IconClock />,
                title: 'Urgency tagging',
                desc: 'Tenants mark urgency so you know what needs attention first.',
              },
              {
                icon: <IconCamera />,
                title: 'Photo attachments',
                desc: 'Tenants can include photos to clarify the issue.',
              },
              {
                icon: <IconCheck />,
                title: 'Clear status tracking',
                desc: 'Move requests from New to In Progress to Done and keep everything in one place.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[#E2E5E7] rounded-xl p-6 shadow-sm"
              >
                <div className="text-[#3F7D58] mb-4">{item.icon}</div>
                <h3 className="font-semibold text-[#1F3A5F] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What It Helps You Do ──────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
              FixIt helps you manage maintenance with clarity.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              {
                icon: <IconRepeat />,
                title: 'Identify recurring problems early',
                desc: 'Spot patterns before small repairs turn into large expenses.',
              },
              {
                icon: <IconDollar />,
                title: 'Understand cost per unit',
                desc: 'See which units generate the most maintenance activity.',
              },
              {
                icon: <IconCalendar />,
                title: 'Plan ahead',
                desc: 'When you can see repair history over time, budgeting becomes easier.',
              },
              {
                icon: <IconMessage />,
                title: 'Keep communication organized',
                desc: 'All requests are stored in one place instead of scattered across texts.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="text-[#3F7D58] mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-[#1F3A5F] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Setup Works ───────────────────────────────────────────────── */}
      <section id="setup" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1F3A5F] mb-2">
              Simple setup. No technical experience required.
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Add your property',
                desc: 'Enter the property name and address in your dashboard.',
              },
              {
                step: '2',
                title: 'Share the tenant link',
                desc: 'Each property gets a unique link. Send it to tenants or include it in your lease.',
              },
              {
                step: '3',
                title: 'Track requests in one place',
                desc: 'Requests appear in your dashboard where you can update status and keep notes.',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="w-9 h-9 rounded-full bg-[#1F3A5F] text-white font-bold flex items-center justify-center text-sm shrink-0">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-[#1F3A5F] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-xl p-8 shadow-sm">
            <p className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-3">
              Free 1-Month Trial
            </p>
            <h2 className="text-3xl font-bold text-[#1F3A5F] mb-6">No credit card required.</h2>

            <ul className="text-left space-y-3 mb-8">
              {[
                'Up to 10 properties',
                'Unlimited tenant requests',
                'Full repair history',
                'Photo attachments',
                'Status tracking and notes',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#2E2E2E]">
                  <svg className="w-4 h-4 text-[#3F7D58] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-500 mb-6">No contracts. No credit card required.</p>

            <Link
              href="/signup"
              className="block w-full bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-base text-center"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-4">
            Ready to get a clearer picture of your maintenance costs?
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Create your account and add your first property in a few minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-base"
          >
            Get Started
          </Link>
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
            <Link href="/login" className="hover:text-[#1F3A5F] transition-colors">Log In</Link>
            <Link href="/signup" className="hover:text-[#1F3A5F] transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
