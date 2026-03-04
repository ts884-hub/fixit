'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthed, setToken } from '@/lib/auth';
import { loginRequest } from '@/lib/api';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Toast';

interface FormState {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
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
  }
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

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
      const { token } = await loginRequest(form.email, form.password);
      setToken(token);
      router.replace('/dashboard');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Login failed. Check your credentials and try again.';
      setErrorMsg(message);
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
        <h1 className="text-2xl font-bold text-[#1F3A5F]">Manager Login</h1>
        <p className="text-sm text-gray-500">
          Sign in to access your maintenance dashboard.
        </p>
      </div>

      <Card>
        {errorMsg && (
          <div className="mb-5">
            <Alert
              type="error"
              message={errorMsg}
              onDismiss={() => setErrorMsg('')}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="manager@example.com"
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-[#1F3A5F] hover:underline font-medium">
            Sign up free
          </a>
        </p>
      </Card>
    </div>
  );
}
