'use client';

// ⚠️ DEMO ONLY — reads from DemoContext only. No backend calls.

import React, { useState, useEffect } from 'react';
import { useDemo } from './DemoProvider';
import { timeAgo, type DemoTicket, type DemoStatus, type DemoUrgency } from './mockTickets';

// ── Badges ────────────────────────────────────────────────────────────────────

const URGENCY_CLASSES: Record<DemoUrgency, string> = {
  high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  low:    'bg-[#3F7D58]/10 text-[#3F7D58] ring-1 ring-[#3F7D58]/20',
};

const STATUS_CLASSES: Record<DemoStatus, string> = {
  new:         'bg-[#1F3A5F]/10 text-[#1F3A5F] ring-1 ring-[#1F3A5F]/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  done:        'bg-[#3F7D58]/10 text-[#3F7D58] ring-1 ring-[#3F7D58]/20',
};

const STATUS_LABELS: Record<DemoStatus, string> = {
  new: 'New', in_progress: 'In Progress', done: 'Done',
};

function UBadge({ urgency }: { urgency: DemoUrgency }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${URGENCY_CLASSES[urgency]}`}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  );
}

function SBadge({ status }: { status: DemoStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  ticket,
  onClose,
}: {
  ticket: DemoTicket;
  onClose: () => void;
}) {
  const { updateTicket } = useDemo();
  const [status, setStatus] = useState<DemoStatus>(ticket.status);
  const [notes, setNotes]   = useState(ticket.managerNotes);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    setStatus(ticket.status);
    setNotes(ticket.managerNotes);
    setSaved(false);
  }, [ticket.id, ticket.status, ticket.managerNotes]);

  function handleSave() {
    updateTicket(ticket.id, { status, managerNotes: notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const dirty = status !== ticket.status || notes !== ticket.managerNotes;

  return (
    <div className="bg-white border border-[#E2E5E7] rounded-xl shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E5E7]">
        <div className="flex items-center gap-2 flex-wrap">
          <UBadge urgency={ticket.urgency} />
          <SBadge status={ticket.status} />
          {ticket.isNew && (
            <span className="bg-[#3F7D58] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              New
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">✕</button>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        {/* Details grid */}
        <dl className="space-y-2.5">
          {[
            ['Property',  ticket.property],
            ['Unit',      ticket.unit],
            ['Location',  ticket.location],
            ['Issue',     ticket.issue],
            ['Tenant',    ticket.tenantName],
            ['Phone',     ticket.tenantPhone],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3">
              <dt className="text-xs font-medium text-gray-400 w-20 shrink-0 pt-0.5">{label}</dt>
              <dd className="text-sm text-[#2E2E2E]">{value}</dd>
            </div>
          ))}
          <div className="flex gap-3">
            <dt className="text-xs font-medium text-gray-400 w-20 shrink-0 pt-0.5">Description</dt>
            <dd className="text-sm text-[#2E2E2E] whitespace-pre-wrap">{ticket.description}</dd>
          </div>
        </dl>

        <hr className="border-[#E2E5E7]" />

        {/* Status update */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value as DemoStatus); setSaved(false); }}
            className="w-full rounded-lg border border-[#E2E5E7] px-3 py-2 text-sm text-[#2E2E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F]"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Manager notes */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Manager Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
            placeholder="Add notes, next steps..."
            className="w-full rounded-lg border border-[#E2E5E7] px-3 py-2 text-sm text-[#2E2E2E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="bg-[#1F3A5F] text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-[#172d4a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
          {saved && <span className="text-xs text-[#3F7D58] font-medium">Saved</span>}
          {!saved && dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function ManagerDemoDashboard() {
  const { tickets } = useDemo();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Auto-select new demo ticket when it arrives
  useEffect(() => {
    const newest = tickets.find((t) => t.isNew);
    if (newest) setSelectedId(newest.id);
  }, [tickets]);

  const filtered = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.unit.toLowerCase().includes(q) ||
        t.issue.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q) ||
        t.tenantName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search unit, issue, location..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2E5E7] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] text-[#2E2E2E]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#E2E5E7] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] text-[#2E2E2E]"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Main layout — list + detail panel */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Ticket list */}
        <div className={selectedTicket ? 'lg:w-3/5' : 'w-full'}>
          <div className="bg-white border border-[#E2E5E7] rounded-xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[80px_1fr_60px_90px_90px_80px_90px] gap-2 px-4 py-2.5 bg-[#F6F7F8] border-b border-[#E2E5E7] text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>Time</span>
              <span>Property</span>
              <span>Unit</span>
              <span>Location</span>
              <span>Issue</span>
              <span>Urgency</span>
              <span>Status</span>
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">No tickets match your filter.</div>
            ) : (
              <div className="divide-y divide-[#E2E5E7]">
                {filtered.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedId(selectedId === ticket.id ? null : ticket.id)}
                    className={[
                      'w-full text-left px-4 py-3 transition-colors',
                      selectedId === ticket.id
                        ? 'bg-[#1F3A5F]/5'
                        : ticket.isNew
                        ? 'bg-[#3F7D58]/5 hover:bg-[#3F7D58]/10'
                        : 'hover:bg-[#F6F7F8]',
                    ].join(' ')}
                  >
                    {/* Mobile layout */}
                    <div className="sm:hidden space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1F3A5F] text-sm">{ticket.property} — {ticket.unit}</span>
                        {ticket.isNew && <span className="text-[10px] font-bold bg-[#3F7D58] text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-xs text-gray-500">{ticket.location}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-500">{ticket.issue}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{timeAgo(ticket.submittedAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <UBadge urgency={ticket.urgency} />
                        <SBadge status={ticket.status} />
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden sm:grid grid-cols-[80px_1fr_60px_90px_90px_80px_90px] gap-2 items-center">
                      <span className="text-xs text-gray-400">{timeAgo(ticket.submittedAt)}</span>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[#1F3A5F] truncate block">{ticket.property}</span>
                        {ticket.isNew && <span className="text-[9px] font-bold bg-[#3F7D58] text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                      </div>
                      <span className="text-sm text-[#2E2E2E] font-medium">{ticket.unit}</span>
                      <span className="text-xs text-gray-500 truncate">{ticket.location}</span>
                      <span className="text-xs text-gray-500 truncate">{ticket.issue}</span>
                      <UBadge urgency={ticket.urgency} />
                      <SBadge status={ticket.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selectedTicket && (
          <div className="lg:w-2/5">
            <DetailPanel ticket={selectedTicket} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>

      {!selectedTicket && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center">Click any row to view details and update status.</p>
      )}
    </div>
  );
}
