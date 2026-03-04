'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#1F3A5F] text-white font-semibold hover:bg-[#172d4a] focus-visible:ring-[#1F3A5F] disabled:bg-[#1F3A5F]/40 disabled:text-white/60',
  secondary:
    'bg-white text-[#1F3A5F] border border-[#E2E5E7] hover:bg-[#F6F7F8] focus-visible:ring-[#1F3A5F] disabled:text-[#1F3A5F]/40',
  accent:
    'bg-[#3F7D58] text-white font-semibold hover:bg-[#316347] focus-visible:ring-[#3F7D58] disabled:bg-[#3F7D58]/40',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
  ghost:
    'bg-transparent text-[#2E2E2E] hover:bg-[#F6F7F8] focus-visible:ring-[#E2E5E7] disabled:text-[#2E2E2E]/40',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
