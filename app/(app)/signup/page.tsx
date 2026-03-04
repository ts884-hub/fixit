'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthed, setToken } from '@/lib/auth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Toast';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(form.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }
  return errors;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isAuthed()) {
      router.replace('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (errorMsg) setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          phone: form.phone,
        }),
      });
      const data = await res.json();

      if (!res.ok && !data.loginRedirect) {
        setErrorMsg(data.error || 'Signup failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.loginRedirect) {
        router.replace('/login');
        return;
      }

      setToken(data.token);
      router.replace('/dashboard/properties');
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1F3A5F] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="mb-8 text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Create your account</h1>
        <p className="text-sm text-gray-500">
          Start tracking maintenance across all your properties.
        </p>
      </div>

      <Card>
        {errorMsg && (
          <div className="mb-5">
            <Alert type="error" message={errorMsg} onDismiss={() => setErrorMsg('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            error={errors.phone}
            hint="Used for SMS maintenance alerts. Include country code for best results."
            autoComplete="tel"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            error={errors.password}
            autoComplete="new-password"
            hint="Must be at least 8 characters."
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1F3A5F] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
