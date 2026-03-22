import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { fetchUserProfile } from '../lib/api';

interface UserStats {
  total_pickups: number;
  total_drops: number;
  streak_days: number;
}

function getBadges(stats: UserStats) {
  return [
    { icon: '🌱', label: 'First Steps', desc: 'Pick up your first verse', unlocked: stats.total_pickups >= 1 },
    { icon: '✍️', label: 'First Drop', desc: 'Drop your first verse', unlocked: stats.total_drops >= 1 },
    { icon: '📚', label: 'Collector', desc: 'Pick up 5 verses', unlocked: stats.total_pickups >= 5 },
    { icon: '🔥', label: 'On Fire', desc: '3 day streak', unlocked: stats.streak_days >= 3 },
    { icon: '🌍', label: 'Spreader', desc: 'Drop 5 verses', unlocked: stats.total_drops >= 5 },
    { icon: '⭐', label: 'Devoted', desc: '7 day streak', unlocked: stats.streak_days >= 7 },
  ];
}

export default function ProfileScreen() {
  const userToken = useAuthStore((s) => s.userToken);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const badges = getBadges(stats);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px 100px' }}>
      <div className="screen-content">
        {/* Hero */}
        <div className="profile-hero">
          <div className="profile-avatar">VD</div>
          <div className="profile-name">Anonymous Explorer</div>
          <div className="profile-token">{userToken.slice(0, 8)}...</div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total_drops}</div>
            <div className="stat-label">Drops</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.total_pickups}</div>
            <div className="stat-label">Pickups</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.streak_days}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements">
          <h3>Achievements ({unlockedCount}/{badges.length})</h3>
          <div className="badge-row">
            {badges.map((badge) => (
              <div key={badge.label} className={`badge ${badge.unlocked ? '' : 'locked'}`}>
                <span className="badge-icon">{badge.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{badge.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 400 }}>{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plus */}
        <div className="plus-card">
          <h3>VerseDrop Plus</h3>
          <p>Add personal messages to your drops and unlock exclusive features. Coming soon!</p>
        </div>
      </div>
    </div>
  );
}
