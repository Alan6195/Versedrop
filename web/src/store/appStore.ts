import { create } from 'zustand';

export interface Drop {
  id: string;
  user_token: string;
  verse_reference: string;
  verse_text: string;
  custom_message?: string | null;
  latitude: number;
  longitude: number;
  distance_meters?: number;
  pickup_count: number;
  is_picked_up?: boolean;
  picked_up_at?: string;
  reactions: {
    amen: number;
    heart: number;
    pray: number;
    user_reaction?: string | null;
  };
  created_at: string;
}

export type Tab = 'map' | 'library' | 'profile';

interface AppStore {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  nearbyDrops: Drop[];
  setNearbyDrops: (drops: Drop[]) => void;

  selectedDrop: Drop | null;
  setSelectedDrop: (drop: Drop | null) => void;

  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number }) => void;

  showComposer: boolean;
  setShowComposer: (show: boolean) => void;

  toast: string | null;
  showToast: (msg: string) => void;

  updateDrop: (dropId: string, updates: Partial<Drop>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  activeTab: 'map',
  setActiveTab: (tab) => set({ activeTab: tab }),

  nearbyDrops: [],
  setNearbyDrops: (drops) => set({ nearbyDrops: drops }),

  selectedDrop: null,
  setSelectedDrop: (drop) => set({ selectedDrop: drop }),

  userLocation: null,
  setUserLocation: (loc) => set({ userLocation: loc }),

  showComposer: false,
  setShowComposer: (show) => set({ showComposer: show }),

  toast: null,
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 2500);
  },

  updateDrop: (dropId, updates) =>
    set((state) => ({
      nearbyDrops: state.nearbyDrops.map((d) =>
        d.id === dropId ? { ...d, ...updates } : d
      ),
      selectedDrop:
        state.selectedDrop?.id === dropId
          ? { ...state.selectedDrop, ...updates }
          : state.selectedDrop,
    })),
}));
