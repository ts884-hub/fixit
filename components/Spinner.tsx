import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <svg
      className={['animate-spin text-[#1F3A5F]', sizeClasses[size], className].join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
      role="status"
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
  );
}

export function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="animate-pulse flex gap-4 p-4 border-b border-[#E2E5E7]">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-4 bg-gray-200 rounded w-32" />
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
    </div>
  );
}
