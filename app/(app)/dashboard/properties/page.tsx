'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { listProperties, createProperty } from '@/lib/api';
import type { Property, CreatePropertyPayload } from '@/lib/types';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { PageSpinner } from '@/components/Spinner';
import { Alert } from '@/components/Toast';

function getSubmissionUrl(token: string): string {
  if (typeof window === 'undefined') return `/request/${token}`;
  return `${window.location.origin}/request/${token}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface CreateFormErrors {
  name?: string;
  address?: string;
}

function validate(payload: CreatePropertyPayload): CreateFormErrors {
  const errors: CreateFormErrors = {};
  if (!payload.name.trim()) errors.name = 'Property name is required.';
  if (!payload.address.trim()) errors.address = 'Street address is required.';
  return errors;
}

function useCopied() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function fallbackCopy(id: string, text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // silent fail
    } finally {
      document.body.removeChild(el);
    }
  }

  function copy(id: string, text: string) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch(() => fallbackCopy(id, text));
    } else {
      fallbackCopy(id, text);
    }
  }

  return { copiedId, copy };
}

export default function PropertiesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePropertyPayload>({ name: '', address: '' });
  const [formErrors, setFormErrors] = useState<CreateFormErrors>({});
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const { copiedId, copy } = useCopied();

  useEffect(() => {
    const authed = requireAuth(router);
    if (!authed) return;
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    fetchProperties();
  }, [authChecked]);

  async function fetchProperties() {
    setLoading(true);
    setFetchError('');
    try {
      const data = await listProperties();
      setProperties(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof CreateFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const newProp = await createProperty(formData);
      setProperties((prev) => [newProp, ...prev]);
      setFormData({ name: '', address: '' });
      setShowForm(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create property.');
    } finally {
      setCreating(false);
    }
  }

  function cancelCreate() {
    setShowForm(false);
    setFormData({ name: '', address: '' });
    setFormErrors({});
    setCreateError('');
  }

  if (!authChecked || loading) return <PageSpinner />;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Properties</h1>
          <p className="text-sm text-gray-500 mt-1">
            Each property gets a unique submission link you can share with tenants.
            Tickets submitted through a link are automatically routed to your dashboard.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm">
            + Add Property
          </Button>
        )}
      </div>

      {fetchError && (
        <Alert type="error" message={fetchError} onDismiss={() => setFetchError('')} />
      )}

      {/* Create form */}
      {showForm && (
        <Card>
          <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Add a Property</h2>

          {createError && (
            <div className="mb-4">
              <Alert type="error" message={createError} onDismiss={() => setCreateError('')} />
            </div>
          )}

          <form onSubmit={handleCreate} noValidate className="space-y-4">
            <Input
              label="Property Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder='e.g. "Maple Street Duplex"'
              hint="A label to help you identify this property in your dashboard."
              error={formErrors.name}
              required
            />
            <Input
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="123 Main St, Springfield, IL 62701"
              hint="This is stored on every ticket submitted through this property's link."
              error={formErrors.address}
              required
            />
            <div className="flex gap-3">
              <Button type="submit" loading={creating}>
                Create Property
              </Button>
              <Button type="button" variant="secondary" onClick={cancelCreate}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Properties list */}
      {properties.length === 0 && !showForm ? (
        <Card className="text-center py-12 space-y-4">
          <p className="text-[#2E2E2E] font-medium">No properties added yet.</p>
          <p className="text-sm text-gray-500">
            Add your first property to generate a unique submission link for your tenants.
          </p>
          <Button onClick={() => setShowForm(true)}>+ Add Property</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => {
            const submissionUrl = getSubmissionUrl(prop.token);
            const isCopied = copiedId === prop.id;

            return (
              <Card key={prop.id} className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1F3A5F]">{prop.name}</h3>
                    <p className="text-sm text-gray-500">{prop.address}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    Added {formatDate(prop.created_at)}
                  </p>
                </div>

                <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-lg px-4 py-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tenant Submission Link
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="text-sm text-[#2E2E2E] break-all flex-1">
                      {submissionUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => copy(prop.id, submissionUrl)}
                      className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        isCopied
                          ? 'bg-[#3F7D58]/10 border-[#3F7D58]/30 text-[#3F7D58]'
                          : 'bg-white border-[#E2E5E7] text-[#1F3A5F] hover:bg-[#F6F7F8]'
                      }`}
                    >
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Share this link with your tenants. Submissions go directly to your dashboard.
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
