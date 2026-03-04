/**
 * Send an email via Resend REST API (no SDK dependency).
 * Silently skips if RESEND_API_KEY is not set.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const apiKey  = process.env.RESEND_API_KEY;
  const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

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
    body: JSON.stringify({ from: fromAddress, to: [to], subject, html }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '(no body)');
    throw new Error(`Resend email error ${res.status}: ${text}`);
  }
}
