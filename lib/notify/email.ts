/**
 * Send an email to a property manager via Resend REST API (no SDK dependency).
 *
 * FROM is hardcoded to alerts@usefixit.cv (verified domain).
 * Silently skips if RESEND_API_KEY is not set.
 */

// Hardcoded — no env var so nothing in Vercel can accidentally override it
const FROM_ADDRESS = 'FixIt Alerts <alerts@usefixit.cv>';

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

  const fromAddress = FROM_ADDRESS;

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
