import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useAppStore } from '../store/appStore';

export function useLocation() {
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      // Get initial position
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (mounted) {
        setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }

      // Watch for updates
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          if (mounted) {
            setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
          }
        }
      );
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
    };
  }, [setUserLocation]);
}
