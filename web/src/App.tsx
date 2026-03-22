import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import MapScreen from './screens/MapScreen';
import DashboardScreen from './screens/DashboardScreen';
import LibraryScreen from './screens/LibraryScreen';
import ProfileScreen from './screens/ProfileScreen';
import DropComposer from './screens/DropComposer';
import TabBar from './components/TabBar';
import Toast from './components/Toast';
import Onboarding from './components/Onboarding';

function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 2 L12 22 M4 8 L20 8" strokeWidth="2.5" />
          <circle cx="12" cy="18" r="2" fill="white" stroke="none" />
        </svg>
      </div>
      <div className="splash-title">VerseDrop</div>
      <div className="splash-subtitle">Discover Scripture Everywhere</div>
    </div>
  );
}


export default function App() {
  const activeTab = useAppStore((s) => s.activeTab);
  const showComposer = useAppStore((s) => s.showComposer);
  const toast = useAppStore((s) => s.toast);
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('versedrop_onboarded');
  });

  // Hide splash after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Get user location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setUserLocation({ lat: 39.7392, lng: -104.9903 });
      },
      { enableHighAccuracy: true }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setUserLocation]);

  return (
    <>
      {showSplash && <SplashScreen />}

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div className="screen-enter" key={activeTab}>
          {activeTab === 'map' && <MapScreen />}
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'library' && <LibraryScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>
      </div>
      <TabBar />
      {showComposer && <DropComposer />}
      {toast && <Toast message={toast} />}
      {showOnboarding && !showSplash && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  );
}
