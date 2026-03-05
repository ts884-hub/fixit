'use client';

// ⚠️ DEMO ONLY — this component does NOT call any backend API.
// All submissions update client-side state only via DemoContext.

import React, { useState } from 'react';
import { useDemo } from './DemoProvider';
import type { DemoTicket, DemoUrgency } from './mockTickets';

const UNIT_OPTIONS    = ['1A', '1B', '2A', '2B'];
const LOCATION_OPTIONS = [
  'Kitchen', 'Bathroom', 'Living Room', 'Bedroom',
  'Hallway', 'Laundry', 'Exterior', 'Common Area', 'Other',
];
const ISSUE_OPTIONS = [
  'Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Pest', 'Lock', 'Other',
];
const URGENCY_OPTIONS: { value: DemoUrgency; label: string }[] = [
  { value: 'low',    label: 'Low — Not urgent' },
  { value: 'medium', label: 'Medium — Needs attention soon' },
  { value: 'high',   label: 'High — Urgent' },
];

interface FormState {
  tenantName: string;
  tenantPhone: string;
  unit: string;
  location: string;
  issue: string;
  urgency: DemoUrgency | '';
  description: string;
}

interface FormErrors {
  tenantName?: string;
  unit?: string;
  location?: string;
  issue?: string;
  urgency?: string;
  description?: string;
}

const INITIAL: FormState = {
  tenantName: '',
  tenantPhone: '',
  unit: '',
  location: '',
  issue: '',
  urgency: '',
  description: '',
};

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.tenantName.trim()) e.tenantName = 'Name is required.';
  if (!f.unit)              e.unit        = 'Select a unit.';
  if (!f.location)          e.location    = 'Select a location.';
  if (!f.issue)             e.issue       = 'Select an issue type.';
  if (!f.urgency)           e.urgency     = 'Select urgency.';
  if (f.description.trim().length < 10)
    e.description = 'Please describe the issue (at least 10 characters).';
  return e;
}

type PhotoState = 'none' | 'uploading' | 'attached';

interface TenantDemoFormProps {
  onSubmitted: () => void; // called so parent can switch to manager tab
}

// ── Field helpers ──────────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-[#2E2E2E] mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-600 mt-1">{msg}</p> : null;
}

const inputCls = (err?: string) =>
  [
    'w-full rounded-lg border px-3 py-2 text-sm text-[#2E2E2E] bg-white',
    'focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] focus:border-transparent',
    err ? 'border-red-400' : 'border-[#E2E5E7]',
  ].join(' ');

export function TenantDemoForm({ onSubmitted }: TenantDemoFormProps) {
  const { addTicket } = useDemo();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoState, setPhotoState] = useState<PhotoState>('none');
  const [submitted, setSubmitted] = useState(false);
  const [newTicketId, setNewTicketId] = useState('');

  function set(field: keyof FormState, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((p) => ({ ...p, [field]: undefined }));
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      setPhotoState('uploading');
      setTimeout(() => setPhotoState('attached'), 900);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const id = `demo-${Date.now()}`;
    const ticket: DemoTicket = {
      id,
      submittedAt: new Date().toISOString(),
      property: 'Maple Street Duplex',
      unit: form.unit,
      location: form.location,
      issue: form.issue,
      urgency: form.urgency as DemoUrgency,
      status: 'new',
      description: form.description,
      managerNotes: '',
      tenantName: form.tenantName || 'Demo Tenant',
      tenantPhone: form.tenantPhone || '(555) 000-0000',
      isNew: true,
    };

    addTicket(ticket);
    setNewTicketId(id);
    setSubmitted(true);
  }

  function reset() {
    setForm(INITIAL);
    setErrors({});
    setPhotoState('none');
    setSubmitted(false);
    setNewTicketId('');
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-5">
        <div className="w-14 h-14 rounded-full bg-[#3F7D58]/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-[#3F7D58]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1F3A5F]">Request Submitted</h3>
          <p className="text-sm text-gray-500 mt-1">Your demo request has been added to the manager dashboard.</p>
        </div>
        <div className="bg-[#F6F7F8] border border-[#E2E5E7] rounded-lg px-5 py-3 w-full max-w-xs">
          <p className="text-xs text-gray-500">Reference</p>
          <p className="font-mono text-sm font-bold text-[#1F3A5F]">{newTicketId}</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => { onSubmitted(); }}
            className="bg-[#1F3A5F] text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#172d4a] transition-colors"
          >
            See it in Manager Dashboard →
          </button>
          <button
            onClick={reset}
            className="bg-white text-[#1F3A5F] border border-[#E2E5E7] font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-[#F6F7F8] transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 p-1">
      {/* Tenant info */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label required>Your Name</Label>
          <input className={inputCls(errors.tenantName)} value={form.tenantName}
            onChange={(e) => set('tenantName', e.target.value)} placeholder="Jane Smith" />
          <FieldError msg={errors.tenantName} />
        </div>
        <div>
          <Label>Phone (optional)</Label>
          <input className={inputCls()} value={form.tenantPhone} type="tel"
            onChange={(e) => set('tenantPhone', e.target.value)} placeholder="(555) 000-0000" />
        </div>
      </div>

      {/* Unit */}
      <div>
        <Label required>Unit</Label>
        <select className={inputCls(errors.unit)} value={form.unit}
          onChange={(e) => set('unit', e.target.value)}>
          <option value="">Select unit</option>
          {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <FieldError msg={errors.unit} />
      </div>

      {/* Location + Issue */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label required>Where is the problem?</Label>
          <select className={inputCls(errors.location)} value={form.location}
            onChange={(e) => set('location', e.target.value)}>
            <option value="">Select location</option>
            {LOCATION_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <FieldError msg={errors.location} />
        </div>
        <div>
          <Label required>Issue Type</Label>
          <select className={inputCls(errors.issue)} value={form.issue}
            onChange={(e) => set('issue', e.target.value)}>
            <option value="">Select issue</option>
            {ISSUE_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <FieldError msg={errors.issue} />
        </div>
      </div>

      {/* Urgency */}
      <div>
        <Label required>Urgency</Label>
        <div className="flex gap-3 flex-wrap">
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('urgency', opt.value)}
              className={[
                'flex-1 min-w-[90px] px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                form.urgency === opt.value
                  ? opt.value === 'high'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : opt.value === 'medium'
                    ? 'bg-amber-50 border-amber-300 text-amber-700'
                    : 'bg-[#3F7D58]/10 border-[#3F7D58]/40 text-[#3F7D58]'
                  : 'bg-white border-[#E2E5E7] text-gray-500 hover:bg-[#F6F7F8]',
              ].join(' ')}
            >
              {opt.value === 'high' ? 'High' : opt.value === 'medium' ? 'Medium' : 'Low'}
            </button>
          ))}
        </div>
        <FieldError msg={errors.urgency} />
      </div>

      {/* Description */}
      <div>
        <Label required>Description</Label>
        <textarea
          rows={4}
          className={inputCls(errors.description) + ' resize-none'}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="Describe the issue in detail..."
        />
        <FieldError msg={errors.description} />
      </div>

      {/* Photo (fake upload) */}
      <div>
        <Label>Photo (optional)</Label>
        {photoState === 'none' && (
          <label className="flex items-center gap-3 border border-dashed border-[#E2E5E7] rounded-lg px-4 py-3 cursor-pointer hover:border-[#1F3A5F] hover:bg-[#1F3A5F]/5 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-gray-500">Click to attach a photo</span>
            <input type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
          </label>
        )}
        {photoState === 'uploading' && (
          <div className="flex items-center gap-2 border border-[#E2E5E7] rounded-lg px-4 py-3 bg-[#F6F7F8]">
            <svg className="w-4 h-4 animate-spin text-[#1F3A5F]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        )}
        {photoState === 'attached' && (
          <div className="flex items-center gap-2 border border-[#3F7D58]/30 rounded-lg px-4 py-3 bg-[#3F7D58]/5">
            <svg className="w-4 h-4 text-[#3F7D58]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-[#3F7D58] font-medium">Photo attached</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#1F3A5F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#172d4a] transition-colors text-sm"
      >
        Submit Demo Request
      </button>
    </form>
  );
}
