'use client';

import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '_');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={[
          'rounded-lg border px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 bg-zinc-800 resize-y',
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
