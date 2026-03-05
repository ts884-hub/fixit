'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createTicket, getPropertyByToken } from '@/lib/api';
import type {
  CreateTicketPayload,
  TicketCategory,
  TicketUrgency,
  TicketLocationArea,
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
  { value: 'plumbing',   label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'hvac',       label: 'HVAC / Heating & Cooling' },
  { value: 'appliance',  label: 'Appliance' },
  { value: 'pest',       label: 'Pest Control' },
  { value: 'lock',       label: 'Lock / Entry' },
  { value: 'other',      label: 'Other' },
];

const URGENCY_OPTIONS: { value: TicketUrgency; label: string }[] = [
  { value: 'low',    label: 'Low — Not urgent, fix when convenient' },
  { value: 'medium', label: 'Medium — Needs attention soon' },
  { value: 'high',   label: 'High — Urgent, requires immediate attention' },
];

const LOCATION_OPTIONS: { value: TicketLocationArea; label: string }[] = [
  { value: 'kitchen',     label: 'Kitchen' },
  { value: 'bathroom',    label: 'Bathroom' },
  { value: 'living_room', label: 'Living Room' },
  { value: 'bedroom',     label: 'Bedroom' },
  { value: 'hallway',     label: 'Hallway' },
  { value: 'laundry',     label: 'Laundry' },
  { value: 'exterior',    label: 'Exterior' },
  { value: 'common_area', label: 'Common Area' },
  { value: 'other',       label: 'Other' },
];

interface FormState {
  unit: string;
  tenant_name: string;
  tenant_phone: string;
  category: TicketCategory | '';
  urgency: TicketUrgency | '';
  location_area: TicketLocationArea | '';
  location_notes: string;
  description: string;
}

interface FormErrors {
  unit?: string;
  tenant_name?: string;
  tenant_phone?: string;
  category?: string;
  urgency?: string;
  location_area?: string;
  description?: string;
}

const INITIAL_FORM: FormState = {
  unit: '',
  tenant_name: '',
  tenant_phone: '',
  category: '',
  urgency: '',
  location_area: '',
  location_notes: '',
  description: '',
};

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.unit.trim())        errors.unit        = 'Unit number is required.';
  if (!form.tenant_name.trim()) errors.tenant_name = 'Your name is required.';
  if (!form.tenant_phone.trim()) {
    errors.tenant_phone = 'Phone number is required.';
  } else if (!/^[\+]?[\d\s\-\(\)]{7,15}$/.test(form.tenant_phone.trim())) {
    errors.tenant_phone = 'Enter a valid phone number.';
  }
  if (!form.category)     errors.category     = 'Please select a category.';
  if (!form.urgency)      errors.urgency      = 'Please select an urgency level.';
  if (!form.location_area) errors.location_area = 'Please select where the problem is located.';
  if (!form.description.trim()) {
    errors.description = 'Please describe the issue.';
  } else if (form.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }
  return errors;
}

type PageState = 'loading' | 'ready' | 'submitting' | 'success' | 'not_found' | 'error';

export default function TokenRequestPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [property, setProperty] = useState<PublicProperty | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [successId, setSuccessId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) { setPageState('not_found'); return; }
    getPropertyByToken(token)
      .then((prop) => { setProperty(prop); setPageState('ready'); })
      .catch(() => setPageState('not_found'));
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
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
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
        location_area: form.location_area as TicketLocationArea,
        location_notes: form.location_notes || null,
        description: form.description,
        property_token: token,
        ...(photo ? { photo } : {}),
      };
      const ticket = await createTicket(payload);
      setSuccessId(ticket.id);
      setPageState('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
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

  if (pageState === 'loading') return <TenantShell><PageSpinner /></TenantShell>;

  if (pageState === 'not_found') {
    return (
      <TenantShell>
        <div className="max-w-lg mx-auto py-8">
          <Card className="text-center space-y-4">
            <h2 className="text-xl font-bold text-[#1F3A5F]">Link Not Found</h2>
            <p className="text-gray-500 text-sm">
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
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1F3A5F]">Request Submitted</h2>
              <p className="text-gray-500">
                Your request was submitted. Your property manager has been notified.
              </p>
            </div>
            {successId && (
              <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-lg px-4 py-3">
                <p className="text-sm text-gray-500 font-medium">Reference Number</p>
                <p className="text-lg font-mono font-bold text-[#1F3A5F]">{successId}</p>
                <p className="text-xs text-gray-400 mt-1">Save this for your records.</p>
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
        {property && (
          <div className="mb-6 bg-[#1F3A5F]/5 border border-[#1F3A5F]/15 rounded-xl px-5 py-4">
            <p className="text-sm font-semibold text-[#1F3A5F]">{property.name}</p>
            <p className="text-sm text-gray-500">{property.address}</p>
          </div>
        )}

        <div className="mb-8 space-y-1">
          <h1 className="text-2xl font-bold text-[#1F3A5F]">Submit a Maintenance Request</h1>
          <p className="text-gray-500 text-sm">
            Fill out the form below and your property manager will follow up with you.
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
          {/* Your Information */}
          <Card>
            <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Your Information</h2>
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
                  hint="Used to follow up on your request."
                  required
                />
              </div>
            </div>
          </Card>

          {/* Issue Details */}
          <Card>
            <h2 className="text-base font-semibold text-[#1F3A5F] mb-4">Issue Details</h2>
            <div className="space-y-4">
              <Select
                label="Where is the problem?"
                name="location_area"
                value={form.location_area}
                onChange={handleChange}
                options={LOCATION_OPTIONS}
                placeholder="Select a location"
                error={errors.location_area}
                required
              />

              {form.location_area === 'other' && (
                <Input
                  label="Describe the location"
                  name="location_notes"
                  value={form.location_notes}
                  onChange={handleChange}
                  placeholder="e.g. Basement utility room, back porch..."
                  hint="Optional — helps the manager find the problem faster."
                />
              )}

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

          {/* Photo */}
          <Card>
            <h2 className="text-base font-semibold text-[#1F3A5F] mb-1">Photo (Optional)</h2>
            <p className="text-sm text-gray-500 mb-4">Attach a photo to help clarify the issue.</p>

            {photoPreview ? (
              <div className="space-y-3">
                <div className="inline-block rounded-lg overflow-hidden border border-[#E2E5E7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="max-h-48 max-w-full object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 truncate max-w-xs">{photo?.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removePhoto}>Remove</Button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 border-2 border-dashed border-[#E2E5E7] rounded-lg p-8 cursor-pointer hover:border-[#1F3A5F] hover:bg-[#1F3A5F]/5 transition-colors">
                <div className="text-center">
                  <span className="text-sm font-medium text-[#1F3A5F]">Click to upload</span>
                  <span className="text-sm text-gray-400"> or drag and drop</span>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10 MB</p>
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
            <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </TenantShell>
  );
}
