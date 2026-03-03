import { redirect } from 'next/navigation';

// Tenants access maintenance forms via /request/[token] — a unique link per property.
// Redirect anyone who hits the generic /request path to the marketing homepage.
export default function RequestRedirect() {
  redirect('/');
}
