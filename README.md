# PropMaint – Property Maintenance Intake

A full-stack MVP for managing property maintenance requests.

- **Frontend**: Next.js App Router + TypeScript + Tailwind CSS
- **Backend**: Next.js API Route Handlers + Supabase (Postgres DB + Auth + Storage)

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and note your **Project URL** and **API keys**.

### 2. Run the schema

In **Supabase Dashboard → SQL Editor**, paste and run the contents of:

```
supabase/schema.sql
```

This creates the `tickets` table with proper constraints and Row Level Security policies.

### 3. Create the storage bucket

In **Supabase Dashboard → Storage**:

1. Click **New bucket**
2. Name it exactly: `ticket-photos`
3. Set it to **Public** (so `photo_url` links are directly accessible)

### 4. Create a manager user

In **Supabase Dashboard → Authentication → Users**:

1. Click **Invite user** (or **Add user**)
2. Enter the manager's email + password
3. Confirm the account (check email or use the dashboard)

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

Find these in **Supabase Dashboard → Project Settings → API**.

> **Security note**: `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and must never be exposed to the browser. It is only used in Next.js route handlers (server-side).

---

## Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Auth Flow

1. Manager calls `POST /api/auth/login` with `{ email, password }`
2. Server returns `{ token: "<supabase_access_token>" }`
3. Frontend stores token in `localStorage` as `auth_token`
4. Protected requests send `Authorization: Bearer <token>` header
5. Server validates via `supabase.auth.getUser(token)`

Token lifetime is Supabase's default (~1 hour). On expiry, the manager must log in again (token refresh not implemented in this MVP).

---

## API Reference

### Auth

#### `POST /api/auth/login`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manager@example.com","password":"secret123"}'
```

Response:
```json
{ "token": "eyJhbGci..." }
```

#### `POST /api/auth/logout`

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

Response: `{ "ok": true }`

#### `GET /api/auth/me`

```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

Response: `{ "authed": true, "user": { "id": "...", "email": "manager@example.com" } }`

---

### Tickets

#### `GET /api/tickets` — List all tickets (protected)

```bash
curl http://localhost:3000/api/tickets \
  -H "Authorization: Bearer <token>"

# With filters:
curl "http://localhost:3000/api/tickets?status=new&q=maple" \
  -H "Authorization: Bearer <token>"
```

Query params:
- `status` — `all` | `new` | `in_progress` | `done` (default: all)
- `q` — search term matched against property, unit, and tenant_name

Response: `Ticket[]` sorted newest-first

#### `POST /api/tickets` — Submit a ticket (public, no auth)

**JSON:**
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "property": "123 Maple St",
    "unit": "4B",
    "tenant_name": "Jane Smith",
    "tenant_phone": "555-0100",
    "category": "plumbing",
    "description": "Sink is leaking under the cabinet.",
    "urgency": "high"
  }'
```

**With photo:**
```bash
curl -X POST http://localhost:3000/api/tickets \
  -F "property=123 Maple St" \
  -F "unit=4B" \
  -F "tenant_name=Jane Smith" \
  -F "tenant_phone=555-0100" \
  -F "category=plumbing" \
  -F "description=Sink is leaking under the cabinet." \
  -F "urgency=high" \
  -F "photo=@/path/to/photo.jpg"
```

Response: `Ticket` object (HTTP 201)

#### `GET /api/tickets/:id` — Get a single ticket (protected)

```bash
curl http://localhost:3000/api/tickets/<uuid> \
  -H "Authorization: Bearer <token>"
```

Response: `Ticket` object

#### `PATCH /api/tickets/:id` — Update a ticket (protected)

```bash
curl -X PATCH http://localhost:3000/api/tickets/<uuid> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress", "manager_notes": "Plumber scheduled for Friday."}'
```

Response: updated `Ticket` object

---

## Ticket Shape

```typescript
interface Ticket {
  id: string;           // UUID
  created_at: string;   // ISO 8601 timestamp
  property: string;
  unit: string;
  tenant_name: string;
  tenant_phone: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'pest' | 'lock' | 'other';
  urgency: 'low' | 'medium' | 'high';
  status: 'new' | 'in_progress' | 'done';
  photo_url?: string | null;
  manager_notes?: string | null;
}
```

---

## Project Structure

```
property-maintenance/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts    # POST – sign in, return token
│   │   │   ├── logout/route.ts   # POST – invalidate session
│   │   │   └── me/route.ts       # GET  – validate token
│   │   └── tickets/
│   │       ├── route.ts          # GET (list) + POST (create)
│   │       └── [id]/route.ts     # GET (detail) + PATCH (update)
│   ├── dashboard/
│   │   ├── page.tsx              # Manager ticket list
│   │   └── [id]/page.tsx         # Manager ticket detail
│   ├── login/page.tsx
│   ├── request/page.tsx
│   └── layout.tsx
├── components/                   # Shared UI components
├── lib/
│   ├── supabase/
│   │   └── server.ts             # createAdminClient() – server only
│   ├── auth-server.ts            # requireAuth(), getTokenFromRequest()
│   ├── auth.ts                   # Client-side auth helpers
│   ├── api.ts                    # Frontend API client
│   └── types.ts                  # Shared TypeScript types
├── supabase/
│   └── schema.sql                # Run in Supabase SQL Editor
└── .env.example                  # Copy to .env.local
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Landing page with links to tenant request and manager login |
| `/request` | **Public** – Tenant maintenance intake form |
| `/login` | Manager login |
| `/dashboard` | **Protected** – Ticket list with search + status filter |
| `/dashboard/[id]` | **Protected** – Full ticket detail + manager editing |

---

## Known Limitations

1. **Token expiry**: Supabase access tokens expire in ~1 hour. No refresh logic is implemented — users must log in again.
2. **Photo upload failures are non-fatal**: If storage upload fails, the ticket is still created without a `photo_url`.
3. **No pagination**: `GET /api/tickets` returns all tickets. For large datasets, add `limit`/`offset` query params.
4. **Client-side filtering**: The dashboard also filters client-side after fetching all tickets. Server-side `?status=` and `?q=` filtering is supported but the frontend currently fetches all and filters in-memory.
5. **Single manager role**: All authenticated Supabase users are treated as managers. No role-based access control.
6. **No file type validation**: The backend accepts any file as a photo. Add MIME-type validation for production use.
