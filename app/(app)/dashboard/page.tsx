'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { listTickets } from '@/lib/api';
import type { Ticket, TicketStatus } from '@/lib/types';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Badge, StatusBadge, UrgencyBadge } from '@/components/Badge';
import { SkeletonRow, PageSpinner } from '@/components/Spinner';
import { Alert } from '@/components/Toast';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="text-center py-16 space-y-3">
      <div className="text-4xl">📭</div>
      <p className="text-zinc-300 font-medium">
        {filtered ? 'No tickets match your filters.' : 'No tickets yet.'}
      </p>
      <p className="text-sm text-zinc-500">
        {filtered
          ? 'Try adjusting your search or status filter.'
          : 'Maintenance requests will appear here once submitted.'}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const authed = requireAuth(router);
    if (!authed) return;
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetchTickets();
  }, [authChecked]);

  async function fetchTickets() {
    setLoading(true);
    setError('');
    try {
      const data = await listTickets();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return tickets.filter((t) => {
      const matchStatus =
        statusFilter === 'all' || t.status === statusFilter;
      const matchSearch =
        !term ||
        t.property.toLowerCase().includes(term) ||
        t.unit.toLowerCase().includes(term) ||
        t.tenant_name.toLowerCase().includes(term);
      return matchStatus && matchSearch;
    });
  }, [tickets, statusFilter, search]);

  if (!authChecked) {
    return <PageSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Maintenance Tickets</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {loading ? 'Loading…' : `${tickets.length} total ticket${tickets.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="text-sm text-sky-400 hover:underline self-start sm:self-auto"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search property, unit, or tenant name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Select
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <Alert
          type="error"
          message={error}
          onDismiss={() => setError('')}
        />
      )}

      {/* Ticket list */}
      <Card padding="none">
        {loading ? (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filtered={search !== '' || statusFilter !== 'all'} />
        ) : (
          <>
            {/* Table header – hidden on mobile */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-4 py-3 border-b border-zinc-800 bg-zinc-800/50 rounded-t-xl text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              <span>Property / Tenant</span>
              <span>Category</span>
              <span>Urgency</span>
              <span>Status</span>
              <span>Date</span>
              <span className="sr-only">Action</span>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-zinc-800">
              {filtered.map((ticket) => (
                <li key={ticket.id}>
                  <Link
                    href={`/dashboard/${ticket.id}`}
                    className="grid sm:grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 sm:gap-4 px-4 py-4 hover:bg-zinc-800 transition-colors items-center group"
                  >
                    {/* Property / tenant */}
                    <div>
                      <p className="font-medium text-zinc-100 text-sm group-hover:text-sky-400 transition-colors">
                        {ticket.property}
                        <span className="text-zinc-500 font-normal"> · {ticket.unit}</span>
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{ticket.tenant_name}</p>
                    </div>

                    {/* Category */}
                    <div className="flex items-center">
                      <Badge className="capitalize">{ticket.category}</Badge>
                    </div>

                    {/* Urgency */}
                    <div className="flex items-center">
                      <UrgencyBadge urgency={ticket.urgency} />
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <StatusBadge status={ticket.status} />
                    </div>

                    {/* Date */}
                    <div className="text-xs text-zinc-500 whitespace-nowrap">
                      {formatDate(ticket.created_at)}
                    </div>

                    {/* Arrow */}
                    <div className="text-zinc-600 group-hover:text-sky-400 text-sm transition-colors">→</div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Footer count */}
            {filtered.length > 0 && (
              <div className="px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500 text-right">
                Showing {filtered.length} of {tickets.length} tickets
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
