import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  Property,
  CreatePropertyPayload,
  PublicProperty,
  ManagerProfile,
  UpsertProfilePayload,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore parse error
    }
    const err = new Error(message) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json() as Promise<T>;
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

export async function listTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/api/tickets`, {
    headers: { ...getAuthHeaders() },
    cache: 'no-store',
  });
  return handleResponse<Ticket[]>(res);
}

export async function getTicket(id: string): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/api/tickets/${id}`, {
    headers: { ...getAuthHeaders() },
    cache: 'no-store',
  });
  return handleResponse<Ticket>(res);
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  let body: BodyInit;
  let headers: Record<string, string> = {};

  if (payload.photo) {
    const form = new FormData();
    form.append('property', payload.property);
    form.append('unit', payload.unit);
    form.append('tenant_name', payload.tenant_name);
    form.append('tenant_phone', payload.tenant_phone);
    form.append('category', payload.category);
    form.append('description', payload.description);
    form.append('urgency', payload.urgency);
    form.append('location_area', payload.location_area);
    if (payload.location_notes) form.append('location_notes', payload.location_notes);
    form.append('photo', payload.photo);
    if (payload.property_token) form.append('property_token', payload.property_token);
    body = form;
  } else {
    const { photo: _photo, ...rest } = payload;
    body = JSON.stringify(rest);
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}/api/tickets`, {
    method: 'POST',
    headers,
    body,
  });
  return handleResponse<Ticket>(res);
}

export async function updateTicket(id: string, patch: UpdateTicketPayload): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/api/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(patch),
  });
  return handleResponse<Ticket>(res);
}

// ─── Properties ──────────────────────────────────────────────────────────────

export async function listProperties(): Promise<Property[]> {
  const res = await fetch(`${BASE_URL}/api/properties`, {
    headers: { ...getAuthHeaders() },
    cache: 'no-store',
  });
  return handleResponse<Property[]>(res);
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const res = await fetch(`${BASE_URL}/api/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse<Property>(res);
}

export async function getPropertyByToken(token: string): Promise<PublicProperty> {
  const res = await fetch(`${BASE_URL}/api/properties/${token}`, { cache: 'no-store' });
  return handleResponse<PublicProperty>(res);
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginRequest(email: string, password: string): Promise<{ token: string }> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<{ token: string }>(res);
}

// ─── Manager Profile ──────────────────────────────────────────────────────────

/**
 * Fetch the authenticated manager's profile.
 * Returns null if no profile exists yet (404).
 */
export async function getProfile(): Promise<ManagerProfile | null> {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    headers: { ...getAuthHeaders() },
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  return handleResponse<ManagerProfile>(res);
}

/** Create or update the authenticated manager's profile. */
export async function upsertProfile(payload: UpsertProfilePayload): Promise<ManagerProfile> {
  const res = await fetch(`${BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  return handleResponse<ManagerProfile>(res);
}
