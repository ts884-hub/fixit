import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#2E2E2E]">
      <MarketingNav />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] leading-tight mb-4">
            Simple setup. No technical experience required.
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            FixIt is designed to be up and running in minutes — not days.
            Here is exactly how it works.
          </p>
        </div>
      </section>

      {/* ── Manager setup steps ───────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-8">
            Getting started — for property managers
          </h2>

          <div className="space-y-0">
            {[
              {
                step: '01',
                title: 'Create your account',
                desc: 'Sign up with your email and phone number. No credit card required for the first month.',
                detail: 'Your account is your dashboard. Everything — every property, every request — lives here.',
              },
              {
                step: '02',
                title: 'Add your properties',
                desc: 'Enter each property you manage. FixIt generates a unique submission link for each one.',
                detail: 'You can manage multiple properties from a single account. Each gets its own isolated ticket stream.',
              },
              {
                step: '03',
                title: 'Share the tenant link',
                desc: 'Send the link to your tenants by text, email, or include it in your lease agreement.',
                detail: 'Tenants do not need to create an account or download anything. They just open the link and fill out the form.',
              },
              {
                step: '04',
                title: 'Receive and manage requests',
                desc: 'When a tenant submits a request, you get an SMS and email alert instantly.',
                detail: 'Open your dashboard to see the full details: unit, location, issue type, urgency, description, and any attached photos.',
              },
              {
                step: '05',
                title: 'Update status and add notes',
                desc: 'Move requests from New → In Progress → Done. Add internal notes at any stage.',
                detail: 'Notes are private — only you can see them. Use them to track vendor info, costs, or next steps.',
              },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex gap-6">
                {/* Step indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#1F3A5F] text-white font-bold flex items-center justify-center text-xs">
                    {item.step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 flex-1 bg-[#E2E5E7] my-2" />
                  )}
                </div>

                {/* Content */}
                <div className={i < arr.length - 1 ? 'pb-10' : 'pb-0'}>
                  <h3 className="font-semibold text-[#1F3A5F] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[#2E2E2E] mb-2 leading-relaxed">{item.desc}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tenant experience ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-8">
            The tenant experience
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Open the link',
                desc: 'The tenant opens the link you gave them. No account, no download, no login.',
              },
              {
                title: 'Describe the problem',
                desc: 'They fill out a short form: unit, location, issue type, urgency, and a description. Photo optional.',
              },
              {
                title: 'Submit',
                desc: 'The request is sent. They receive a reference number. You get an alert.',
              },
            ].map((item, i) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-[#3F7D58]/10 text-[#3F7D58] font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1F3A5F] mb-1 text-sm">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#F6F7F8] border border-[#E2E5E7] rounded-xl p-6">
            <p className="text-sm font-semibold text-[#1F3A5F] mb-2">Want to try it yourself?</p>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              The product page has a fully interactive demo. Submit a test request as a tenant,
              then switch to the manager view — no account required.
            </p>
            <Link
              href="/product"
              className="inline-flex items-center text-sm font-semibold text-[#1F3A5F] hover:underline"
            >
              Try the interactive demo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-8">
            Common questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Do my tenants need to create an account?',
                a: 'No. Tenants open a link and fill out a form. That is it. No signup, no app, no password.',
              },
              {
                q: 'Can I manage multiple properties?',
                a: 'Yes. Each property gets its own unique link and its own ticket stream. You see all of them in one dashboard.',
              },
              {
                q: 'How do I get notified about new requests?',
                a: 'You receive an SMS and email the moment a tenant submits a request. Notifications can be configured in your account settings.',
              },
              {
                q: 'Is there a mobile app?',
                a: 'FixIt is a web app that works on any device — phone, tablet, or desktop. No download required for managers or tenants.',
              },
              {
                q: 'What happens after the free trial?',
                a: 'Your account continues at our standard monthly rate. You can cancel anytime. No long-term contract.',
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-[#E2E5E7] pb-6">
                <h3 className="font-semibold text-[#1F3A5F] mb-2 text-sm">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-t border-[#E2E5E7]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
            Add your first property today.
          </h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Free for the first month. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-sm"
          >
            Start Free Trial
          </Link>
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
