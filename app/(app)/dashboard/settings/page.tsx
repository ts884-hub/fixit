'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { getProfile, upsertProfile } from '@/lib/api';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Alert } from '@/components/Toast';
import { PageSpinner } from '@/components/Spinner';

interface FormState {
  phone: string;
  email: string;
}

interface FormErrors {
  phone?: string;
  email?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  return errors;
}

export default function SettingsPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormState>({ phone: '', email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isNewProfile, setIsNewProfile] = useState(false);

  useEffect(() => {
    const authed = requireAuth(router);
    if (!authed) return;
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    getProfile()
      .then((profile) => {
        if (profile) {
          setForm({ phone: profile.phone, email: profile.email });
        } else {
          setIsNewProfile(true);
        }
      })
      .catch(() => setIsNewProfile(true))
      .finally(() => setLoading(false));
  }, [authChecked]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (successMsg) setSuccessMsg('');
    if (errorMsg) setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await upsertProfile({ phone: form.phone, email: form.email });
      setSuccessMsg('Settings saved.');
      setIsNewProfile(false);
      // If this was the first save, redirect to the properties dashboard
      if (isNewProfile) {
        router.replace('/dashboard/properties');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  }

  if (!authChecked || loading) return <PageSpinner />;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your phone number is used to send SMS alerts when a tenant submits a maintenance request.
        </p>
      </div>

      {isNewProfile && (
        <Alert
          type="info"
          message="Please add your phone number to receive maintenance alerts. This is required before you can use your dashboard."
        />
      )}

      <Card>
        <h2 className="text-base font-semibold text-[#1F3A5F] mb-5">Contact Information</h2>

        {successMsg && (
          <div className="mb-5">
            <Alert type="success" message={successMsg} onDismiss={() => setSuccessMsg('')} />
          </div>
        )}
        {errorMsg && (
          <div className="mb-5">
            <Alert type="error" message={errorMsg} onDismiss={() => setErrorMsg('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            hint="You will receive an SMS at this number when a tenant submits a request."
            autoComplete="tel"
            required
          />
          <Input
            label="Notification Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            hint="You will receive email alerts at this address."
            autoComplete="email"
            required
          />

          <Button type="submit" loading={saving} size="lg">
            Save Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}
