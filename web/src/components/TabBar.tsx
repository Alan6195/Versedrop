import React from 'react';
import { useAppStore, Tab } from '../store/appStore';

const MapIcon = () => (
  <svg viewBox="0 0 24 24">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const LibraryIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <line x1="8" y1="11" x2="13" y2="11" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const icons: Record<Tab, React.FC> = {
  map: MapIcon,
  library: LibraryIcon,
  profile: ProfileIcon,
};

const labels: Record<Tab, string> = {
  map: 'Map',
  library: 'Library',
  profile: 'Profile',
};

export default function TabBar() {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <div className="tab-bar">
      {(['map', 'library', 'profile'] as Tab[]).map((tab) => {
        const Icon = icons[tab];
        return (
          <button
            key={tab}
            className={`tab-bar-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon"><Icon /></span>
            <span>{labels[tab]}</span>
          </button>
        );
      })}
    </div>
  );
}
