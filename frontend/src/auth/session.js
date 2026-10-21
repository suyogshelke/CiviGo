/** Small helpers around the persisted session (token + user snapshot). */

import { TOKEN_KEY, USER_KEY } from '../api/client';

export function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    fullName: user.fullName || user.full_name || '',
    departmentName: user.departmentName || user.department_name || '',
    departmentId: user.departmentId ?? user.department_id ?? null,
  };
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('civicpulse.token');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('civicpulse.user');
    return raw ? normalizeUser(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  const normalized = normalizeUser(user);
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (normalized) localStorage.setItem(USER_KEY, JSON.stringify(normalized));
}

export function updateStoredUser(user) {
  const normalized = normalizeUser(user);
  if (normalized) localStorage.setItem(USER_KEY, JSON.stringify(normalized));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('civicpulse.token');
  localStorage.removeItem('civicpulse.user');
}
