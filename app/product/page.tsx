import Link from 'next/link';
import { MarketingNav } from '@/components/MarketingNav';
import { DemoTabs } from '@/components/demo/DemoTabs';

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#F6F7F8] text-[#2E2E2E]">
      <MarketingNav />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold text-[#3F7D58] uppercase tracking-widest mb-3">
            Interactive Preview
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F3A5F] leading-tight mb-4">
            See exactly how FixIt works — no account needed.
          </h1>
          <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            Submit a demo maintenance request as a tenant, then switch to the manager
            view to see how it shows up in the dashboard. Try editing status and adding notes.
          </p>
        </div>
      </section>

      {/* ── Interactive demo ──────────────────────────────────────────────── */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <DemoTabs />

          <p className="text-xs text-gray-400 text-center mt-4">
            This is a fully interactive demo. No data is saved or sent anywhere.
          </p>
        </div>
      </section>

      {/* ── Feature highlights ────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-white border-y border-[#E2E5E7]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-[#1F3A5F] mb-10 text-center">
            What you get out of the box
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Per-property tenant links',
                desc: 'Each property gets its own unique submission link. No app or login needed for tenants.',
              },
              {
                title: 'Urgency + location tagging',
                desc: 'Tenants classify every request so you can prioritize what matters most.',
              },
              {
                title: 'Photo attachments',
                desc: 'Tenants can upload photos alongside their request for full context.',
              },
              {
                title: 'Manager dashboard',
                desc: 'All requests in one place with filters, search, and status updates.',
              },
              {
                title: 'Manager notes',
                desc: 'Add internal notes to each ticket — next steps, vendor info, costs.',
              },
              {
                title: 'SMS + email alerts',
                desc: 'Get notified the moment a new maintenance request is submitted.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-xl p-5"
              >
                <h3 className="font-semibold text-[#1F3A5F] mb-1.5 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1F3A5F] mb-3">
            Ready to use it for your properties?
          </h2>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Free for the first month. No credit card required.
            Add your first property in under five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-[#1F3A5F] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#172d4a] transition-colors text-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center bg-white text-[#1F3A5F] font-semibold px-6 py-3 rounded-lg border border-[#E2E5E7] hover:bg-[#F6F7F8] transition-colors text-sm"
            >
              View Pricing
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
