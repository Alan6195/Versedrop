import { useAuthStore } from '../store/authStore';
import type { Drop } from '../store/appStore';

const BASE = '/api';

async function request(path: string, options: RequestInit = {}) {
  const token = useAuthStore.getState().userToken;
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-token': token,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw { status: res.status, ...err };
  }
  return res.json();
}

export async function fetchNearbyDrops(lat: number, lng: number, radius = 500): Promise<Drop[]> {
  const data = await request(`/drops/nearby?lat=${lat}&lng=${lng}&radius_meters=${radius}`);
  return data.drops;
}

export async function createDrop(body: {
  verse_reference: string;
  verse_text: string;
  custom_message?: string;
  latitude: number;
  longitude: number;
}) {
  return request('/drops', { method: 'POST', body: JSON.stringify(body) });
}

export async function pickupDrop(dropId: string) {
  return request(`/drops/${dropId}/pickup`, { method: 'POST' });
}

export async function reactToDrop(dropId: string, reactionType: string) {
  return request(`/drops/${dropId}/react`, {
    method: 'POST',
    body: JSON.stringify({ reaction_type: reactionType }),
  });
}

export async function fetchMyPickups() {
  return request('/drops/my-pickups');
}

export async function fetchUserProfile() {
  return request('/users/me');
}

export async function searchVerses(query: string) {
  const data = await request(`/verses/search?q=${encodeURIComponent(query)}`);
  return data.verses as { reference: string; text: string }[];
}

export async function addNoteToDrop(dropId: string, text: string) {
  return request(`/drops/${dropId}/note`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function fetchDropNotes(dropId: string) {
  const data = await request(`/drops/${dropId}/notes`);
  return data.notes as { id: string; user_token: string; text: string; created_at: string }[];
}
