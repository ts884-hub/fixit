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
        <label htmlFor={inputId} className="text-sm font-medium text-[#2E2E2E]">
          {label}
          {props.required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'rounded-lg border px-3 py-2 text-sm text-[#2E2E2E] placeholder-gray-400 bg-white',
          'focus:outline-none focus:ring-2 focus:ring-[#1F3A5F] focus:border-transparent',
          'disabled:bg-[#F6F7F8] disabled:text-gray-400 disabled:cursor-not-allowed',
          error ? 'border-red-400 bg-red-50' : 'border-[#E2E5E7]',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}
