import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <MarketingNav />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-sky-400/10 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full border border-sky-400/20 mb-8 uppercase tracking-widest">
          Built for small landlords
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
          Stop losing money on<br />
          <span className="text-sky-400">repeat repairs.</span>
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          You track your rent down to the dollar. Why don&apos;t you track your maintenance the same
          way? FixIt gives you a clear picture of every repair request — per unit, per building —
          so you can stop patching and start fixing problems for good.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-sky-400 text-zinc-950 font-bold px-8 py-4 rounded-xl hover:bg-sky-300 transition-colors text-base"
          >
            Create a Free Account
          </Link>
          <a
            href="#setup"
            className="border border-zinc-700 text-zinc-300 font-semibold px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors text-base"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* ── Social proof bar ─────────────────────────────────────────────── */}
      <section className="py-10 border-y border-zinc-800/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-5 font-semibold">
            Used by landlords managing 1–50 units
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-zinc-600 text-sm">
            <span>Single-family homes</span>
            <span className="hidden sm:inline text-zinc-800">·</span>
            <span>Duplexes &amp; triplexes</span>
            <span className="hidden sm:inline text-zinc-800">·</span>
            <span>Small apartment buildings</span>
            <span className="hidden sm:inline text-zinc-800">·</span>
            <span>Mixed-use properties</span>
          </div>
        </div>
      </section>

      {/* ── Problem story ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12">
            <div className="text-4xl mb-6">💸</div>
            <p className="text-zinc-300 leading-relaxed mb-6 text-lg">
              Most small landlords handle maintenance through texts, calls, and sticky notes. When
              something breaks, you fix it. But you never see the bigger picture — which unit is a
              money pit, which tenant keeps reporting the same thing, which repair you&apos;ve paid
              for three times already.
            </p>
            <blockquote className="border-l-2 border-sky-400 pl-6 my-8">
              <p className="text-zinc-300 italic leading-relaxed">
                &ldquo;One landlord had a unit that cost him $3,000 in plumbing fixes over two
                years. If he&apos;d seen the pattern earlier, he would&apos;ve replaced the pipe
                for $1,200 and saved $1,800 — not to mention all the emergency calls.&rdquo;
              </p>
            </blockquote>
            <p className="text-zinc-400 leading-relaxed">
              That&apos;s what FixIt is for.{' '}
              <strong className="text-zinc-100">We show you where your money is going</strong> —
              by unit, by category, over time — so you can make smarter decisions before a $200 fix
              becomes a $2,000 problem.
            </p>
          </div>
        </div>
      </section>

      {/* ── What we offer ─────────────────────────────────────────────────── */}
      <section id="offer" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What we offer</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              Everything you need to manage maintenance — without the spreadsheet chaos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: '🔗',
                title: 'Unique tenant links',
                desc: 'Each property gets a shareable link. Tenants submit requests through it — no app download, no account required.',
              },
              {
                icon: '📋',
                title: 'Per-unit request history',
                desc: 'See every repair logged per unit. Spot repeat issues before they turn into expensive replacements.',
              },
              {
                icon: '🔍',
                title: 'Pattern detection',
                desc: 'The same leak three times in six months? FixIt surfaces it so you can decide: patch again or fix it right.',
              },
              {
                icon: '⚡',
                title: 'Urgency triage',
                desc: 'Tenants flag urgency on every request, so you know what needs a call today vs. what can wait.',
              },
              {
                icon: '📸',
                title: 'Photo attachments',
                desc: "Tenants attach photos of the problem. No more back-and-forth figuring out what's actually broken.",
              },
              {
                icon: '📊',
                title: 'Status tracking',
                desc: 'Move tickets from New → In Progress → Done. Know at a glance what\'s still open across all properties.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-zinc-100 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <section id="benefits" className="py-20 px-4 sm:px-6 bg-zinc-900/40 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">What it helps you do</h2>
            <p className="text-zinc-400 text-lg">
              We help you stop losing money on repeat repairs and surprise maintenance.
            </p>
          </div>
          <div className="space-y-10">
            {[
              {
                icon: '🔄',
                title: 'Catch repeat issues early',
                desc: "If a unit shows up three times in six months with the same type of problem, you'll see it. That's the difference between a $500 fix and a $5,000 replacement.",
              },
              {
                icon: '💰',
                title: 'Know your cost per unit',
                desc: "Which building is your most expensive to maintain? Which tenant causes the most requests? FixIt gives you the data to make decisions — not just react to them.",
              },
              {
                icon: '📅',
                title: 'Plan ahead, not in panic mode',
                desc: 'When you can see patterns over months, maintenance stops being a surprise and starts being something you can actually budget for.',
              },
              {
                icon: '💬',
                title: 'Stop managing via text',
                desc: 'Instead of juggling WhatsApp threads and voicemails, every request lands in one place. You can respond with actual information instead of "wait, what was the issue again?"',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-5 sm:gap-8 items-start">
                <div className="text-3xl shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-zinc-100 text-lg mb-2">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How setup works ───────────────────────────────────────────────── */}
      <section id="setup" className="py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How setup works</h2>
            <p className="text-zinc-400 text-lg">
              Three steps and you&apos;re live. No IT department required.
            </p>
          </div>
          <div className="space-y-5">
            {[
              {
                step: '1',
                title: 'Create your properties',
                desc: 'Add each property or building to your dashboard. Give it a name and address. Takes about 30 seconds.',
              },
              {
                step: '2',
                title: 'Share the tenant link',
                desc: "Each property gets a unique link. Text it or paste it in your lease. Tenants click it to submit — no app, no login.",
              },
              {
                step: '3',
                title: 'Track, triage, and spot patterns',
                desc: "Requests land in your dashboard. Update status, add internal notes, and start building a maintenance history per unit.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-5 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-6"
              >
                <div className="h-10 w-10 rounded-full bg-sky-400/10 border border-sky-400/20 text-sky-400 font-black text-lg flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 mb-1">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing placeholder ───────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-zinc-900/40">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-2xl font-black mb-3">Pricing</h2>
          <p className="text-zinc-400 mb-8 text-sm">Simple and honest.</p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <p className="text-5xl font-black text-zinc-100 mb-1">Free</p>
            <p className="text-zinc-500 text-sm mb-6">to get started</p>
            <ul className="text-left space-y-3 text-sm text-zinc-400 mb-8">
              {[
                'Unlimited properties',
                'Unlimited tenant requests',
                'Full ticket history',
                'Photo attachments',
                'Status tracking + manager notes',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="block w-full bg-sky-400 text-zinc-950 font-bold py-3 rounded-xl hover:bg-sky-300 transition-colors text-sm text-center"
            >
              Create a Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to stop flying blind?
          </h2>
          <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
            Set up your first property in under five minutes. No credit card. No contracts.
          </p>
          <Link
            href="/signup"
            className="inline-flex bg-sky-400 text-zinc-950 font-bold px-10 py-4 rounded-xl hover:bg-sky-300 transition-colors text-base"
          >
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-black text-zinc-100 flex items-center gap-2">
            <span className="text-sky-400">⚒</span>
            <span>Fix<span className="text-sky-400">It</span></span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <a href="#offer" className="hover:text-zinc-300 transition-colors">
              What We Offer
            </a>
            <a href="#benefits" className="hover:text-zinc-300 transition-colors">
              Benefits
            </a>
            <a href="#setup" className="hover:text-zinc-300 transition-colors">
              How It Works
            </a>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="hover:text-zinc-300 transition-colors">
              Sign Up
            </Link>
          </div>
          <p className="text-xs text-zinc-700">
            &copy; {new Date().getFullYear()} FixIt. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
