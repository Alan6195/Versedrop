import React, { useState, useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { searchVerses, createDrop } from '../lib/api';

interface VerseResult {
  reference: string;
  text: string;
}

export default function DropComposer() {
  const setShowComposer = useAppStore((s) => s.setShowComposer);
  const userLocation = useAppStore((s) => s.userLocation);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VerseResult[]>([]);
  const [selected, setSelected] = useState<VerseResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const verses = await searchVerses(query);
      setResults(verses);
    } catch {
      setResults([]);
    }
    setIsSearching(false);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDrop = async () => {
    if (!selected || !userLocation) return;
    setIsDropping(true);
    try {
      await createDrop({
        verse_reference: selected.reference,
        verse_text: selected.text,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });
      showToast(`Dropped ${selected.reference}`);
      setShowComposer(false);
    } catch {
      showToast('Failed to drop verse');
    }
    setIsDropping(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowComposer(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: 480, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <button
            onClick={() => setShowComposer(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 15, cursor: 'pointer', fontWeight: 500 }}
          >
            Cancel
          </button>
          <h2 style={{ color: 'var(--text)', fontSize: 17, fontWeight: 700 }}>Drop a Verse</h2>
          <div style={{ width: 50 }} />
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search verses... (love, faith, peace)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              padding: '0 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gold)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12, minHeight: 120 }}>
          {results.length === 0 && !isSearching && (
            <div className="empty-state" style={{ padding: '40px 16px' }}>
              <div className="empty-icon">🔍</div>
              <div className="empty-desc">Search for a verse to drop at your current location</div>
            </div>
          )}
          {isSearching && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          )}
          {results.map((v) => (
            <div
              key={v.reference}
              className={`composer-card ${selected?.reference === v.reference ? 'selected' : ''}`}
              onClick={() => setSelected(v)}
            >
              <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                {v.reference}
              </div>
              <div style={{ color: 'var(--text)', fontSize: 13, lineHeight: 1.5, opacity: 0.85 }}>
                {v.text.length > 140 ? v.text.slice(0, 140) + '...' : v.text}
              </div>
            </div>
          ))}
        </div>

        {/* Selected preview */}
        {selected && (
          <div className="verse-display" style={{ margin: '0 0 12px' }}>
            <div className="verse-ref" style={{ fontSize: 14 }}>{selected.reference}</div>
            <div className="verse-text" style={{ fontSize: 13 }}>
              {selected.text.length > 100 ? selected.text.slice(0, 100) + '...' : selected.text}
            </div>
          </div>
        )}

        {/* Drop button */}
        <button
          className="gold-btn"
          disabled={!selected}
          onClick={() => setShowConfirm(true)}
        >
          Drop Here
        </button>

        {/* Confirmation */}
        {showConfirm && selected && (
          <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: 'var(--text)', textAlign: 'center', marginBottom: 16, fontSize: 18, fontWeight: 700 }}>
                Drop this verse?
              </h3>

              <div className="verse-display">
                <div className="verse-ref">{selected.reference}</div>
                <div className="verse-text">{selected.text}</div>
              </div>

              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 13, margin: '14px 0 16px' }}>
                📍 At your current location
              </p>

              <button className="gold-btn" onClick={handleDrop} disabled={isDropping} style={{ marginBottom: 8 }}>
                {isDropping ? 'Dropping...' : 'Drop It'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  width: '100%',
                  padding: 10,
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
