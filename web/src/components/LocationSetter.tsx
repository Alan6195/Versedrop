import React, { useState } from 'react';

interface Props {
  onSet: (lat: number, lng: number) => void;
  onClose: () => void;
}

const PRESETS = [
  { label: '📍 Times Square, NYC', lat: 40.7580, lng: -73.9855 },
  { label: '📍 Golden Gate Bridge, SF', lat: 37.8199, lng: -122.4783 },
  { label: '📍 Central Park, NYC', lat: 40.7829, lng: -73.9654 },
  { label: '📍 Washington Monument, DC', lat: 38.8895, lng: -77.0353 },
  { label: '📍 Civic Center Park, Denver', lat: 39.7392, lng: -104.9903 },
  { label: '📍 Navy Pier, Chicago', lat: 41.8917, lng: -87.6086 },
];

export default function LocationSetter({ onSet, onClose }: Props) {
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [error, setError] = useState('');

  const handleAddressSearch = async () => {
    if (!address.trim()) return;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        { headers: { 'Accept': 'application/json' } }
      );
      const data = await res.json();
      if (data.length > 0) {
        onSet(parseFloat(data[0].lat), parseFloat(data[0].lon));
      } else {
        setError('Location not found. Try a more specific address.');
      }
    } catch {
      setError('Search failed. Try entering coordinates instead.');
    }
    setSearching(false);
  };

  const handleCoordsSubmit = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid coordinates');
      return;
    }
    onSet(lat, lng);
  };

  const handleUseDevice = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => onSet(pos.coords.latitude, pos.coords.longitude),
      () => setError('Location access denied'),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Set Your Location</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer' }}>
            Close
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          Desktop browsers can't get precise GPS. Set your location by address, coordinates, or click the map directly.
        </p>

        {/* Address search */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
            Search by address
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="search-input"
              placeholder="123 Main St, Denver CO..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddressSearch()}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleAddressSearch}
              disabled={searching}
              style={{ padding: '0 14px', borderRadius: 'var(--radius-md)', background: 'var(--gold)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}
            >
              {searching ? '...' : 'Go'}
            </button>
          </div>
        </div>

        {/* Coordinates */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
            Or enter coordinates
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="search-input"
              placeholder="Latitude"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              className="search-input"
              placeholder="Longitude"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleCoordsSubmit}
              style={{ padding: '0 14px', borderRadius: 'var(--radius-md)', background: 'var(--gold)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
            >
              Set
            </button>
          </div>
        </div>

        {/* Quick presets */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
            Quick locations
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => onSet(p.lat, p.lng)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: 500,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Device location */}
        <button
          onClick={handleUseDevice}
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          📱 Use device location
        </button>

        {error && (
          <p style={{ color: '#EF4444', fontSize: 13, marginTop: 8, textAlign: 'center' }}>{error}</p>
        )}
      </div>
    </div>
  );
}
