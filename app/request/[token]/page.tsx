'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createTicket, getPropertyByToken } from '@/lib/api';
import type {
  CreateTicketPayload,
  TicketCategory,
  TicketUrgency,
  PublicProperty,
} from '@/lib/types';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Toast';
import { PageSpinner } from '@/components/Spinner';
import { TenantShell } from '@/components/TenantShell';

const CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac', label: 'HVAC / Heating & Cooling' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'pest', label: 'Pest Control' },
  { value: 'lock', label: 'Lock / Entry' },
  { value: 'other', label: 'Other' },
];

const URGENCY_OPTIONS: { value: TicketUrgency; label: string }[] = [
  { value: 'low', label: 'Low – Not urgent, fix when convenient' },
  { value: 'medium', label: 'Medium – Needs attention soon' },
  { value: 'high', label: 'High – Urgent, requires immediate attention' },
];

interface FormState {
  unit: string;
  tenant_name: string;
  tenant_phone: string;
  category: TicketCategory | '';
  urgency: TicketUrgency | '';
  description: string;
}

interface FormErrors {
  unit?: string;
  tenant_name?: string;
  tenant_phone?: string;
  category?: string;
  urgency?: string;
  description?: string;
}

const INITIAL_FORM: FormState = {
  unit: '',
  tenant_name: '',
  tenant_phone: '',
  category: '',
  urgency: '',
  description: '',
};

function validatePhone(phone: string): boolean {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.trim());
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.unit.trim()) errors.unit = 'Unit number is required.';
  if (!form.tenant_name.trim()) errors.tenant_name = 'Your name is required.';
  if (!form.tenant_phone.trim()) {
    errors.tenant_phone = 'Phone number is required.';
  } else if (!validatePhone(form.tenant_phone)) {
    errors.tenant_phone = 'Enter a valid phone number.';
  }
  if (!form.category) errors.category = 'Please select a category.';
  if (!form.urgency) errors.urgency = 'Please select an urgency level.';
  if (!form.description.trim()) {
    errors.description = 'Please describe the issue.';
  } else if (form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  return errors;
}

type PageState = 'loading' | 'ready' | 'submitting' | 'success' | 'error' | 'not_found';

export default function TokenRequestPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [property, setProperty] = useState<PublicProperty | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) {
      setPageState('not_found');
      return;
    }
    getPropertyByToken(token)
      .then((prop) => {
        setProperty(prop);
        setPageState('ready');
      })
      .catch(() => {
        setPageState('not_found');
      });
  }, [token]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  }

  function removePhoto() {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setPageState('submitting');
    setErrorMsg('');

    try {
      const payload: CreateTicketPayload = {
        property: property!.address,
        unit: form.unit,
        tenant_name: form.tenant_name,
        tenant_phone: form.tenant_phone,
        category: form.category as TicketCategory,
        urgency: form.urgency as TicketUrgency,
        description: form.description,
        property_token: token,
        ...(photo ? { photo } : {}),
      };
      const ticket = await createTicket(payload);
      setSuccessId(ticket.id);
      setPageState('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMsg(message);
      setPageState('error');
    }
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    setErrors({});
    setPhoto(null);
    setPhotoPreview(null);
    setSuccessId('');
    setErrorMsg('');
    if (fileRef.current) fileRef.current.value = '';
    setPageState('ready');
  }

  // ── Render states ──────────────────────────────────────────────────────────

  if (pageState === 'loading') {
    return (
      <TenantShell>
        <PageSpinner />
      </TenantShell>
    );
  }

  if (pageState === 'not_found') {
    return (
      <TenantShell>
        <div className="max-w-lg mx-auto py-8">
          <Card className="text-center space-y-4">
            <div className="text-5xl">🔗</div>
            <h2 className="text-xl font-bold text-zinc-100">Link Not Found</h2>
            <p className="text-zinc-400 text-sm">
              This submission link is invalid or may have been removed. Please contact your
              property manager for a new link.
            </p>
          </Card>
        </div>
      </TenantShell>
    );
  }

  if (pageState === 'success') {
    return (
      <TenantShell>
        <div className="max-w-lg mx-auto py-8">
          <Card className="text-center space-y-6">
            <div className="text-5xl">✅</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-zinc-100">Request Submitted!</h2>
              <p className="text-zinc-400">
                Your maintenance request has been received. Our team will be in touch soon.
              </p>
            </div>
            {successId && (
              <div className="bg-sky-400/10 border border-sky-400/20 rounded-lg px-4 py-3">
                <p className="text-sm text-sky-300 font-medium">Ticket ID</p>
                <p className="text-lg font-mono font-bold text-sky-100">{successId}</p>
                <p className="text-xs text-sky-400 mt-1">Save this for your records.</p>
              </div>
            )}
            <Button onClick={handleReset} variant="secondary" className="w-full">
              Submit Another Request
            </Button>
          </Card>
        </div>
      </TenantShell>
    );
  }

  const isSubmitting = pageState === 'submitting';

  return (
    <TenantShell>
      <div className="max-w-2xl mx-auto">
        {/* Property banner */}
        {property && (
          <div className="mb-6 flex items-start gap-3 bg-sky-400/10 border border-sky-400/20 rounded-xl px-5 py-4">
            <span className="text-2xl mt-0.5">🏢</span>
            <div>
              <p className="text-sm font-semibold text-sky-100">{property.name}</p>
              <p className="text-sm text-sky-300">{property.address}</p>
            </div>
          </div>
        )}

        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-bold text-zinc-100">Submit a Maintenance Request</h1>
          <p className="text-zinc-400 text-sm">
            Fill out the form below and we&apos;ll schedule a repair as soon as possible.
          </p>
        </div>

        {pageState === 'error' && (
          <div className="mb-6">
            <Alert
              type="error"
              message={errorMsg || 'Submission failed. Please try again.'}
              onDismiss={() => setPageState('ready')}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Unit + tenant info */}
          <Card>
            <h2 className="text-base font-semibold text-zinc-100 mb-4">Your Information</h2>
            <div className="space-y-4">
              <Input
                label="Unit / Apt #"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="Unit 4B"
                error={errors.unit}
                required
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="tenant_name"
                  value={form.tenant_name}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  error={errors.tenant_name}
                  required
                />
                <Input
                  label="Phone Number"
                  name="tenant_phone"
                  type="tel"
                  value={form.tenant_phone}
                  onChange={handleChange}
                  placeholder="(555) 000-0000"
                  error={errors.tenant_phone}
                  hint="We'll use this to follow up on your request."
                  required
                />
              </div>
            </div>
          </Card>

          {/* Issue details */}
          <Card>
            <h2 className="text-base font-semibold text-zinc-100 mb-4">Issue Details</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  options={CATEGORY_OPTIONS}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                />
                <Select
                  label="Urgency"
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  options={URGENCY_OPTIONS}
                  placeholder="Select urgency level"
                  error={errors.urgency}
                  required
                />
              </div>
              <Textarea
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Please describe the issue in detail..."
                rows={5}
                error={errors.description}
                required
              />
            </div>
          </Card>

          {/* Photo upload */}
          <Card>
            <h2 className="text-base font-semibold text-zinc-100 mb-1">Photo (Optional)</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Attach a photo to help us understand the issue better.
            </p>

            {photoPreview ? (
              <div className="space-y-3">
                <div className="relative inline-block rounded-lg overflow-hidden border border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-48 max-w-full object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400 truncate max-w-xs">{photo?.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removePhoto}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 border-2 border-dashed border-zinc-700 rounded-lg p-8 cursor-pointer hover:border-sky-400 hover:bg-sky-400/5 transition-colors">
                <span className="text-3xl">📷</span>
                <div className="text-center">
                  <span className="text-sm font-medium text-sky-400">Click to upload</span>
                  <span className="text-sm text-zinc-400"> or drag and drop</span>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP up to 10 MB</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="w-full sm:w-auto"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </TenantShell>
  );
}
