'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '_');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'rounded-lg border px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 bg-zinc-800',
          'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent',
          'disabled:bg-zinc-800/50 disabled:text-zinc-600 disabled:cursor-not-allowed',
          error ? 'border-red-500 bg-red-900/20' : 'border-zinc-700',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}
