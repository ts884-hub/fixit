import React from 'react';
import type { TicketStatus, TicketUrgency } from '@/lib/types';

type BadgeVariant = TicketStatus | TicketUrgency | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  // Status
  new: 'bg-[#1F3A5F]/10 text-[#1F3A5F] ring-1 ring-[#1F3A5F]/20',
  in_progress: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  done: 'bg-[#3F7D58]/10 text-[#3F7D58] ring-1 ring-[#3F7D58]/20',
  // Urgency
  low: 'bg-[#3F7D58]/10 text-[#3F7D58]',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  high: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  // Default
  default: 'bg-gray-100 text-gray-600',
};

const variantLabels: Record<string, string> = {
  new: 'New',
  in_progress: 'In Progress',
  done: 'Done',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <Badge variant={status}>{variantLabels[status] ?? status}</Badge>;
}

export function UrgencyBadge({ urgency }: { urgency: TicketUrgency }) {
  return <Badge variant={urgency}>{variantLabels[urgency] ?? urgency}</Badge>;
}
