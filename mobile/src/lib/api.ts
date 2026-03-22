import { useAuthStore } from '../store/authStore';
import type { Drop, VerseResult, Note, UserStats } from '../types';

// Change this to your server's URL
// For local development with Expo Go on a physical device, use your computer's local IP
// For emulator: Android uses 10.0.2.2, iOS simulator uses localhost
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:3001' // Android emulator default
  : 'https://your-production-api.com';

// Override for iOS simulator or physical device
// const BASE_URL = 'http://localhost:3001';
// const BASE_URL = 'http://192.168.1.XXX:3001'; // Your local IP for physical device

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().userToken;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-user-token': token } : {}),
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
  const data = await request<{ drops: Drop[] }>(`/drops/nearby?lat=${lat}&lng=${lng}&radius_meters=${radius}`);
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
  return request<{ drops: Drop[]; streak: number; total: number }>('/drops/my-pickups');
}

export async function fetchUserProfile(): Promise<UserStats> {
  return request<UserStats>('/users/me');
}

export async function searchVerses(query: string): Promise<VerseResult[]> {
  const data = await request<{ verses: VerseResult[] }>(`/verses/search?q=${encodeURIComponent(query)}`);
  return data.verses;
}

export async function addNoteToDrop(dropId: string, text: string) {
  return request(`/drops/${dropId}/note`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function fetchDropNotes(dropId: string): Promise<Note[]> {
  const data = await request<{ notes: Note[] }>(`/drops/${dropId}/notes`);
  return data.notes;
}
