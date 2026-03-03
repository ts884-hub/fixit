import React from 'react';
import type { TicketStatus, TicketUrgency } from '@/lib/types';

type BadgeVariant =
  | TicketStatus
  | TicketUrgency
  | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  // Status
  new: 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30',
  in_progress: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30',
  done: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30',
  // Urgency
  low: 'bg-zinc-700 text-zinc-300',
  medium: 'bg-orange-400/15 text-orange-300 ring-1 ring-orange-400/30',
  high: 'bg-red-400/15 text-red-300 ring-1 ring-red-400/30',
  // Default
  default: 'bg-zinc-700 text-zinc-300',
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
