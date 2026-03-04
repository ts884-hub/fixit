'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { requireAuth } from '@/lib/auth';
import { getTicket, updateTicket } from '@/lib/api';
import type { Ticket, TicketStatus, TicketLocationArea } from '@/lib/types';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/Badge';
import { PageSpinner } from '@/components/Spinner';
import { Alert, useToast } from '@/components/Toast';

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'new',         label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
];

const LOCATION_LABELS: Record<TicketLocationArea, string> = {
  kitchen:     'Kitchen',
  bathroom:    'Bathroom',
  living_room: 'Living Room',
  bedroom:     'Bedroom',
  hallway:     'Hallway',
  laundry:     'Laundry',
  exterior:    'Exterior',
  common_area: 'Common Area',
  other:       'Other',
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 py-3 border-b border-[#E2E5E7] last:border-0">
      <dt className="text-sm font-medium text-gray-500 sm:w-40 shrink-0">{label}</dt>
      <dd className="text-sm text-[#2E2E2E] mt-0.5 sm:mt-0">{value}</dd>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { showToast } = useToast();

  const [authChecked, setAuthChecked] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [status, setStatus] = useState<TicketStatus>('new');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const authed = requireAuth(router);
    if (!authed) return;
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked || !id) return;
    setLoading(true);
    setFetchError('');
    getTicket(id)
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setNotes(data.manager_notes ?? '');
      })
      .catch((err) => {
        setFetchError(err instanceof Error ? err.message : 'Failed to load ticket details.');
      })
      .finally(() => setLoading(false));
  }, [authChecked, id]);

  async function handleSave() {
    if (!ticket) return;
    setSaving(true);
    setSaveError('');
    try {
      const updated = await updateTicket(id, { status, manager_notes: notes });
      setTicket(updated);
      setDirty(false);
      showToast('Ticket updated.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.';
      setSaveError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  if (!authChecked || loading) return <PageSpinner />;

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Link href="/dashboard" className="text-sm text-[#1F3A5F] hover:underline">&larr; Back</Link>
        <Alert type="error" message={fetchError} />
      </div>
    );
  }

  if (!ticket) return null;

  const locationDisplay = ticket.location_area
    ? `${LOCATION_LABELS[ticket.location_area] ?? ticket.location_area}${ticket.location_notes ? ` — ${ticket.location_notes}` : ''}`
    : '—';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-[#1F3A5F] hover:underline">
        &larr; Back to Tickets
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Ticket #{ticket.id.slice(0, 8)}</h1>
        <StatusBadge status={ticket.status} />
        <UrgencyBadge urgency={ticket.urgency} />
      </div>
      <p className="text-sm text-gray-400">Submitted {formatDate(ticket.created_at)}</p>

      {/* Details */}
      <Card>
        <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Ticket Details</h2>
        <dl>
          <DetailRow label="Property" value={ticket.property} />
          <DetailRow label="Unit" value={ticket.unit} />
          <DetailRow label="Location" value={<span className="font-medium">{locationDisplay}</span>} />
          <DetailRow label="Tenant" value={ticket.tenant_name} />
          <DetailRow label="Phone" value={
            <a href={`tel:${ticket.tenant_phone}`} className="text-[#1F3A5F] hover:underline">
              {ticket.tenant_phone}
            </a>
          } />
          <DetailRow label="Category" value={<Badge className="capitalize">{ticket.category}</Badge>} />
          <DetailRow label="Urgency" value={<UrgencyBadge urgency={ticket.urgency} />} />
          <DetailRow label="Description" value={
            <p className="whitespace-pre-wrap text-[#2E2E2E]">{ticket.description}</p>
          } />
        </dl>
      </Card>

      {/* Photo */}
      {ticket.photo_url && (
        <Card>
          <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Attached Photo</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ticket.photo_url}
            alt="Maintenance issue photo"
            className="rounded-lg max-h-80 object-contain border border-[#E2E5E7]"
          />
        </Card>
      )}

      {/* Manager actions */}
      <Card>
        <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Manager Actions</h2>

        {saveError && (
          <div className="mb-4">
            <Alert type="error" message={saveError} onDismiss={() => setSaveError('')} />
          </div>
        )}

        <div className="space-y-4">
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => { setStatus(e.target.value as TicketStatus); setDirty(true); }}
          />
          <Textarea
            label="Manager Notes"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setDirty(true); }}
            placeholder="Add internal notes, next steps, or resolution details..."
            rows={4}
            hint="Notes are internal and not visible to the tenant."
          />
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} loading={saving} disabled={!dirty}>
              Save Changes
            </Button>
            {!dirty && !saving && <span className="text-xs text-gray-400">No unsaved changes.</span>}
            {dirty && !saving && <span className="text-xs text-amber-600">You have unsaved changes.</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}
