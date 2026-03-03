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
  photo_url?: string;
  manager_notes?: string;
  /** Supabase Auth UID of the manager who owns this ticket (set via property token). */
  manager_id?: string;
  /** FK to the properties table (set via property token). */
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
  photo?: File;
  /**
   * When provided, the server looks up the matching property and
   * automatically assigns manager_id + property_id to the ticket.
   * Tenants never see or choose a manager — the token routes silently.
   */
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
  /** Human-readable label, e.g. "Sunset Apartments Block A". */
  name: string;
  /** Street address stored in ticket.property when submitted via this link. */
  address: string;
  /** Random 32-char hex slug — forms the tenant URL: /request/<token> */
  token: string;
  /** Supabase Auth UID of the manager who created this property. */
  manager_id: string;
}

export interface CreatePropertyPayload {
  /** Human-readable label for the property. */
  name: string;
  /** Street / mailing address of the property. */
  address: string;
}

/** Public-safe subset returned by GET /api/properties/:token (no manager_id). */
export interface PublicProperty {
  id: string;
  name: string;
  address: string;
  token: string;
}
