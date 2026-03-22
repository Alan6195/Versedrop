import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/appStore';
import MapScreen from './screens/MapScreen';
import LibraryScreen from './screens/LibraryScreen';
import ProfileScreen from './screens/ProfileScreen';
import DropComposer from './screens/DropComposer';
import TabBar from './components/TabBar';
import Toast from './components/Toast';

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

function OnboardingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="onboarding">
          <div className="onboarding-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2 L12 22 M4 8 L20 8" />
              <circle cx="12" cy="18" r="2" fill="white" stroke="none" />
            </svg>
          </div>
          <h2>Welcome to VerseDrop</h2>
          <p>Drop Bible verses at real-world locations. Walk to discover scripture left by others.</p>

          <div className="onboarding-steps">
            <div className="onboarding-step">
              <div className="step-num">1</div>
              <div className="step-text"><strong>Explore</strong> — Walk around to find glowing verse drops on the map</div>
            </div>
            <div className="onboarding-step">
              <div className="step-num">2</div>
              <div className="step-text"><strong>Pick up</strong> — Get within 50m of a drop to collect it in your library</div>
            </div>
            <div className="onboarding-step">
              <div className="step-num">3</div>
              <div className="step-text"><strong>Drop</strong> — Leave verses at your location for others to discover</div>
            </div>
          </div>

          <button className="gold-btn" onClick={onClose}>
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const activeTab = useAppStore((s) => s.activeTab);
  const showComposer = useAppStore((s) => s.showComposer);
  const toast = useAppStore((s) => s.toast);
  const setUserLocation = useAppStore((s) => s.setUserLocation);

  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Hide splash after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Show onboarding for first visit
      const visited = localStorage.getItem('versedrop_visited');
      if (!visited) {
        setShowOnboarding(true);
        localStorage.setItem('versedrop_visited', '1');
      }
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
          {activeTab === 'library' && <LibraryScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>
      </div>
      <TabBar />
      {showComposer && <DropComposer />}
      {toast && <Toast message={toast} />}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </>
  );
}
