import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { fetchNearbyDrops } from '../lib/api';

export function useDrops() {
  const userLocation = useAppStore((s) => s.userLocation);
  const setNearbyDrops = useAppStore((s) => s.setNearbyDrops);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    if (!userLocation) return;
    try {
      const drops = await fetchNearbyDrops(userLocation.lat, userLocation.lng, 500);
      setNearbyDrops(drops);
    } catch (err) {
      console.error('Failed to fetch drops:', err);
    }
  }, [userLocation, setNearbyDrops]);

  useEffect(() => {
    refresh();
    intervalRef.current = setInterval(refresh, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refresh]);

  return { refresh };
}
