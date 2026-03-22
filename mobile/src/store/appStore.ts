import { create } from 'zustand';
import type { Drop } from '../types';

interface AppStore {
  userLocation: { lat: number; lng: number } | null;
  nearbyDrops: Drop[];
  selectedDrop: Drop | null;
  toastMessage: string | null;

  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setNearbyDrops: (drops: Drop[]) => void;
  setSelectedDrop: (drop: Drop | null) => void;
  updateDrop: (id: string, updates: Partial<Drop>) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  userLocation: null,
  nearbyDrops: [],
  selectedDrop: null,
  toastMessage: null,

  setUserLocation: (loc) => set({ userLocation: loc }),
  setNearbyDrops: (drops) => set({ nearbyDrops: drops }),
  setSelectedDrop: (drop) => set({ selectedDrop: drop }),
  updateDrop: (id, updates) =>
    set((state) => ({
      nearbyDrops: state.nearbyDrops.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      selectedDrop: state.selectedDrop?.id === id ? { ...state.selectedDrop, ...updates } : state.selectedDrop,
    })),
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => set({ toastMessage: null }), 2500);
  },
  clearToast: () => set({ toastMessage: null }),
}));
