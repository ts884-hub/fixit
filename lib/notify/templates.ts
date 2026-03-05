export interface NotifyTicketData {
  id: string;
  property_name: string; // from properties.name
  property: string;      // address stored on ticket
  unit: string;
  location_area: string;
  location_notes?: string | null;
  category: string;
  urgency: string;
  description: string;
  photo_url?: string | null;
  tenant_name: string;
  tenant_phone: string;
}

const LOCATION_LABELS: Record<string, string> = {
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  hallway: 'Hallway',
  laundry: 'Laundry',
  exterior: 'Exterior',
  common_area: 'Common Area',
  other: 'Other',
};

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function locationLabel(area: string, notes?: string | null): string {
  const label = LOCATION_LABELS[area] ?? capitalise(area);
  return notes ? `${label} (${notes})` : label;
}

// ─── SMS ──────────────────────────────────────────────────────────────────────

export function formatSmsMessage(
  ticket: NotifyTicketData,
  appBaseUrl: string
): string {
  const truncatedDesc =
    ticket.description.length > 120
      ? ticket.description.slice(0, 120) + '...'
      : ticket.description;

  return [
    `FixIt – New Request [${ticket.urgency.toUpperCase()}]`,
    `Property: ${ticket.property_name}`,
    `Unit ${ticket.unit} – ${locationLabel(ticket.location_area, ticket.location_notes)}`,
    `Issue: ${capitalise(ticket.category)} – ${truncatedDesc}`,
    `Tenant: ${ticket.tenant_name} ${ticket.tenant_phone}`,
    `View: ${appBaseUrl}/dashboard/${ticket.id}`,
  ].join('\n');
}

// ─── Email ────────────────────────────────────────────────────────────────────
// Subject: "New maintenance request — HIGH — Maple Apartments, Unit 4B"

export function formatEmailSubject(ticket: NotifyTicketData): string {
  return `New maintenance request \u2014 ${ticket.urgency.toUpperCase()} \u2014 ${ticket.property_name}, Unit ${ticket.unit}`;
}

// Plain-text fallback (shown in email clients that prefer text/plain)
export function formatEmailText(
  ticket: NotifyTicketData,
  dashboardUrl: string
): string {
  const lines: string[] = [
    'FixIt \u2014 New Maintenance Request',
    '='.repeat(40),
    '',
    `Property:    ${ticket.property_name}`,
    `Address:     ${ticket.property}`,
    `Unit:        ${ticket.unit}`,
  ];

  if (ticket.location_area) {
    lines.push(`Location:    ${locationLabel(ticket.location_area, ticket.location_notes)}`);
  }

  lines.push(
    `Category:    ${capitalise(ticket.category)}`,
    `Urgency:     ${ticket.urgency.toUpperCase()}`,
    `Tenant:      ${ticket.tenant_name} \u2014 ${ticket.tenant_phone}`,
    '',
    'Description:',
    ticket.description,
  );

  if (ticket.photo_url) {
    lines.push('', `Photo:       ${ticket.photo_url}`);
  }

  lines.push(
    '',
    `Ticket ID:   ${ticket.id}`,
    `View ticket: ${dashboardUrl}`,
    '',
    '\u2014 FixIt Property Maintenance Management',
  );

  return lines.join('\n');
}

// HTML version
export function formatEmailHtml(
  ticket: NotifyTicketData,
  dashboardUrl: string
): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #E2E5E7;width:130px;color:#6B7A8D;font-size:14px;vertical-align:top;white-space:nowrap">${label}</td>
      <td style="padding:8px 0;border-bottom:1px solid #E2E5E7;font-size:14px;color:#2E2E2E">${value}</td>
    </tr>`;

  const urgencyColour =
    ticket.urgency === 'high'   ? '#B91C1C' :
    ticket.urgency === 'medium' ? '#B45309' : '#3F7D58';

  const locationRow = ticket.location_area
    ? row('Location', locationLabel(ticket.location_area, ticket.location_notes))
    : '';

  const photoRow = ticket.photo_url
    ? row('Photo', `<a href="${ticket.photo_url}" style="color:#1F3A5F">View attached photo</a>`)
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F7F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;border:1px solid #E2E5E7;overflow:hidden">

    <div style="background:#1F3A5F;padding:24px 28px">
      <p style="margin:0;color:#fff;font-size:18px;font-weight:700">FixIt \u2014 New Maintenance Request</p>
    </div>

    <div style="padding:24px 28px">
      <p style="margin:0 0 4px;font-size:22px;font-weight:700;color:#1F3A5F">${ticket.property_name}</p>
      <p style="margin:0 0 20px;font-size:14px;color:#6B7A8D">${ticket.property}</p>

      <span style="display:inline-block;background:${urgencyColour}1A;color:${urgencyColour};border:1px solid ${urgencyColour}33;border-radius:999px;padding:2px 12px;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:20px">
        ${ticket.urgency} urgency
      </span>

      <table style="width:100%;border-collapse:collapse">
        ${row('Unit', ticket.unit)}
        ${locationRow}
        ${row('Category', capitalise(ticket.category))}
        ${row('Tenant', `${ticket.tenant_name} &mdash; ${ticket.tenant_phone}`)}
        ${row('Description', ticket.description.replace(/\n/g, '<br>'))}
        ${photoRow}
        ${row('Ticket ID', `<span style="font-family:monospace;font-size:12px;color:#6B7A8D">${ticket.id}</span>`)}
      </table>

      <div style="margin-top:24px">
        <a href="${dashboardUrl}" style="display:inline-block;background:#1F3A5F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
          View Ticket in Dashboard &rarr;
        </a>
      </div>
    </div>

    <div style="padding:16px 28px;border-top:1px solid #E2E5E7;font-size:12px;color:#9CA3AF">
      FixIt &mdash; Property Maintenance Management
    </div>
  </div>
</body>
</html>`.trim();
}

// ─── Primary builder (pass result directly to sendManagerEmail) ───────────────

export function buildNewTicketEmail(
  ticket: NotifyTicketData,
  dashboardUrl: string
): { subject: string; text: string; html: string } {
  return {
    subject: formatEmailSubject(ticket),
    text:    formatEmailText(ticket, dashboardUrl),
    html:    formatEmailHtml(ticket, dashboardUrl),
  };
}
