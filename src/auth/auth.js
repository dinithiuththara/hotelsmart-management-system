const KEY = "hotel_auth_v1";

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function login({ role, name, email }) {
  const payload = { role, name, email };
  localStorage.setItem(KEY, JSON.stringify(payload));
  return payload;
}

export function logout() {
  localStorage.removeItem(KEY);
}