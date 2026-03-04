export type TicketCategory =
  | 'plumbing'
  | 'electrical'
  | 'hvac'
  | 'appliance'
  | 'pest'
  | 'lock'
  | 'other';

export type TicketUrgency = 'low' | 'medium' | 'high';

export type TicketStatus = 'new' | 'in_progress' | 'done';

export type TicketLocationArea =
  | 'kitchen'
  | 'bathroom'
  | 'living_room'
  | 'bedroom'
  | 'hallway'
  | 'laundry'
  | 'exterior'
  | 'common_area'
  | 'other';

export interface Ticket {
  id: string;
  created_at: string;
  property: string;
  unit: string;
  tenant_name: string;
  tenant_phone: string;
  category: TicketCategory;
  description: string;
  urgency: TicketUrgency;
  status: TicketStatus;
  /** Where inside the unit the problem is located. */
  location_area: TicketLocationArea;
  /** Free-text notes when location_area is "other". */
  location_notes?: string | null;
  photo_url?: string;
  manager_notes?: string;
  manager_id?: string;
  property_id?: string;
}

export interface CreateTicketPayload {
  property: string;
  unit: string;
  tenant_name: string;
  tenant_phone: string;
  category: TicketCategory;
  description: string;
  urgency: TicketUrgency;
  location_area: TicketLocationArea;
  location_notes?: string | null;
  photo?: File;
  property_token?: string;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  manager_notes?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// ─── Properties ───────────────────────────────────────────────────────────────

export interface Property {
  id: string;
  created_at: string;
  name: string;
  address: string;
  token: string;
  manager_id: string;
}

export interface CreatePropertyPayload {
  name: string;
  address: string;
}

export interface PublicProperty {
  id: string;
  name: string;
  address: string;
  token: string;
}

// ─── Manager Profile ──────────────────────────────────────────────────────────

export interface ManagerProfile {
  id: string;
  created_at: string;
  phone: string;
  email: string;
}

export interface UpsertProfilePayload {
  phone: string;
  email: string;
}
