export type DemoUrgency = 'low' | 'medium' | 'high';
export type DemoStatus  = 'new' | 'in_progress' | 'done';

export interface DemoTicket {
  id: string;
  submittedAt: string;
  property: string;
  unit: string;
  location: string;
  issue: string;
  urgency: DemoUrgency;
  status: DemoStatus;
  description: string;
  managerNotes: string;
  tenantName: string;
  tenantPhone: string;
  isNew?: boolean; // highlight freshly submitted demo tickets
}

const now = Date.now();

export const INITIAL_MOCK_TICKETS: DemoTicket[] = [
  {
    id: 'demo-1',
    submittedAt: new Date(now - 90 * 60 * 1000).toISOString(),
    property: 'Maple Street Duplex',
    unit: '2B',
    location: 'Bathroom',
    issue: 'Plumbing',
    urgency: 'high',
    status: 'new',
    description: 'Toilet leaking at the base. Water is pooling on the floor. Needs immediate attention.',
    managerNotes: '',
    tenantName: 'Sarah Johnson',
    tenantPhone: '(555) 201-4892',
  },
  {
    id: 'demo-2',
    submittedAt: new Date(now - 27 * 60 * 60 * 1000).toISOString(),
    property: 'Oakview Apartments',
    unit: '1A',
    location: 'Bedroom',
    issue: 'Electrical',
    urgency: 'medium',
    status: 'in_progress',
    description: 'Outlet near the window is dead. TV and lamp both stopped working.',
    managerNotes: 'Electrician scheduled for Thursday at 2pm.',
    tenantName: 'Marcus Webb',
    tenantPhone: '(555) 318-0044',
  },
  {
    id: 'demo-3',
    submittedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    property: 'Pine Court',
    unit: '3C',
    location: 'Living Room',
    issue: 'HVAC',
    urgency: 'low',
    status: 'done',
    description: 'HVAC making a loud rattling sound when heating turns on. Not urgent but getting worse.',
    managerNotes: 'Filter replaced. Noise resolved.',
    tenantName: 'David Kim',
    tenantPhone: '(555) 447-9901',
  },
];

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 2)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}
