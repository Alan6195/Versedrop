import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { fetchUserProfile, fetchMyPickups } from '../lib/api';

interface UserStats {
  total_pickups: number;
  total_drops: number;
  streak_days: number;
}

interface Pickup {
  id: string;
  verse_reference: string;
  verse_text: string;
  picked_up_at?: string;
  created_at: string;
}

function getBadges(stats: UserStats) {
  return [
    { icon: '\u{1F331}', label: 'First Steps', unlocked: stats.total_pickups >= 1 },
    { icon: '\u{270D}\u{FE0F}', label: 'First Drop', unlocked: stats.total_drops >= 1 },
    { icon: '\u{1F4DA}', label: 'Collector', unlocked: stats.total_pickups >= 5 },
    { icon: '\u{1F525}', label: 'On Fire', unlocked: stats.streak_days >= 3 },
    { icon: '\u{1F30D}', label: 'Spreader', unlocked: stats.total_drops >= 5 },
    { icon: '\u{2B50}', label: 'Devoted', unlocked: stats.streak_days >= 7 },
  ];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardScreen() {
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setShowComposer = useAppStore((s) => s.setShowComposer);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchUserProfile().catch(() => null),
      fetchMyPickups().catch(() => ({ drops: [] })),
    ]).then(([profile, pickupData]) => {
      if (profile) setStats(profile);
      if (pickupData?.drops) setPickups(pickupData.drops);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  const safeStats = stats || { total_pickups: 0, total_drops: 0, streak_days: 0 };
  const badges = getBadges(safeStats);
  const recentPickups = pickups.slice(0, 5);

  // Weekly goal: count pickups from the last 7 days
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyCount = pickups.filter((p) => {
    const d = new Date(p.picked_up_at || p.created_at).getTime();
    return d >= weekAgo;
  }).length;
  const weeklyGoal = 7;
  const weeklyPct = Math.min((weeklyCount / weeklyGoal) * 100, 100);

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px 100px' }}>
      <div className="screen-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        {/* Stats Row */}
        <div className="dashboard-stats-row">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">{safeStats.total_drops}</div>
            <div className="dashboard-stat-label">Drops</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">{safeStats.total_pickups}</div>
            <div className="dashboard-stat-label">Pickups</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">{safeStats.streak_days}</div>
            <div className="dashboard-stat-label">Streak</div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="dashboard-section">
          <div className="dashboard-section-title">Weekly Goal</div>
          <div className="dashboard-weekly-goal">
            <div className="dashboard-weekly-label">
              <span>Verses this week</span>
              <span>{weeklyCount} / {weeklyGoal}</span>
            </div>
            <div className="dashboard-progress-bar">
              <div className="dashboard-progress-fill" style={{ width: `${weeklyPct}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <div className="dashboard-section-title">Quick Actions</div>
          <div className="dashboard-quick-actions">
            <button
              className="dashboard-action-btn"
              onClick={() => setShowComposer(true)}
            >
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Drop a Verse
            </button>
            <button
              className="dashboard-action-btn"
              onClick={() => setActiveTab('map')}
            >
              <svg viewBox="0 0 24 24">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Explore Map
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="dashboard-section-title">Recent Activity</div>
          {recentPickups.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              <div className="empty-icon">📖</div>
              <div className="empty-desc">No pickups yet. Explore the map to find verses!</div>
            </div>
          ) : (
            recentPickups.map((p) => (
              <div key={p.id} className="dashboard-activity-item">
                <div className="dashboard-activity-dot" />
                <div className="dashboard-activity-info">
                  <div className="dashboard-activity-ref">{p.verse_reference}</div>
                  <div className="dashboard-activity-date">
                    {formatDate(p.picked_up_at || p.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Achievements Preview */}
        <div className="dashboard-section dashboard-achievements-preview">
          <div className="dashboard-section-title">Achievements</div>
          <div className="badge-row">
            {badges.slice(0, 3).map((badge) => (
              <div key={badge.label} className={`badge ${badge.unlocked ? '' : 'locked'}`}>
                <span className="badge-icon">{badge.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{badge.label}</span>
              </div>
            ))}
          </div>
          <button
            className="dashboard-view-all"
            onClick={() => setActiveTab('profile')}
          >
            View All &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
