import React, { useEffect, useState } from 'react';
import { fetchMyPickups } from '../lib/api';
import type { Drop } from '../store/appStore';

export default function LibraryScreen() {
  const [drops, setDrops] = useState<(Drop & { picked_up_at?: string })[]>([]);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPickups()
      .then((data) => {
        setDrops(data.drops || []);
        setStreak(data.streak || 0);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px 16px 100px' }}>
      <div className="screen-content">
        <div className="library-header">
          <h1>Library</h1>
        </div>

        {/* Stats */}
        <div className="library-stats">
          {streak > 0 && (
            <div className="stat-chip">
              <span className="stat-icon">🔥</span>
              {streak} day streak
            </div>
          )}
          <div className="stat-chip">
            <span className="stat-icon">📖</span>
            {total} {total === 1 ? 'verse' : 'verses'}
          </div>
        </div>

        {/* Cards */}
        {drops.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📍</div>
            <div className="empty-title">No verses collected yet</div>
            <div className="empty-desc">
              Head to the map and walk near glowing verse drops to pick them up!
            </div>
          </div>
        ) : (
          drops.map((drop) => (
            <div key={drop.id} className="verse-card">
              <div className="verse-card-ref">
                {drop.verse_reference}
              </div>
              <div className="verse-card-text">
                &ldquo;{drop.verse_text}&rdquo;
              </div>
              <div className="verse-card-footer">
                {drop.picked_up_at && (
                  <span className="verse-card-date">
                    Collected {new Date(drop.picked_up_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                )}
                <div className="verse-card-badge">
                  <span>🙏</span>
                  {drop.pickup_count} {drop.pickup_count === 1 ? 'pickup' : 'pickups'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
