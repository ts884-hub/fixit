const TOKEN_KEY = 'auth_token';

export function isAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Call this inside a useEffect on protected pages.
 * Redirects to /login if the user is not authenticated.
 */
export function requireAuth(router: { replace: (path: string) => void }): boolean {
  if (!isAuthed()) {
    router.replace('/login');
    return false;
  }
  return true;
}
