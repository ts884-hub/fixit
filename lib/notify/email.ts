/**
 * Send an email to a property manager via Resend REST API (no SDK dependency).
 *
 * FROM defaults to "FixIt Alerts <onboarding@resend.dev>" — this works on
 * all Resend accounts with no domain verification required.
 * Set RESEND_FROM_EMAIL to override once you have a verified custom domain.
 *
 * Silently skips if RESEND_API_KEY is not set.
 */
export async function sendManagerEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  // Default includes display name — works without a verified domain
  const fromAddress =
    process.env.RESEND_FROM_EMAIL ?? 'FixIt Alerts <onboarding@resend.dev>';

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email notification.');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromAddress, to: [to], subject, text, html }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)');
    throw new Error(`Resend email error ${res.status}: ${body}`);
  }
}
