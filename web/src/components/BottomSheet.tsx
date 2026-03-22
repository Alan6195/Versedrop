import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAppStore, Drop } from '../store/appStore';
import { pickupDrop, reactToDrop, addNoteToDrop, fetchDropNotes } from '../lib/api';
import ReactionRow from './ReactionRow';

const PICKUP_RANGE = 50;

interface Note {
  id: string;
  user_token: string;
  text: string;
  created_at: string;
}

export default function BottomSheet({ drop }: { drop: Drop }) {
  const setSelectedDrop = useAppStore((s) => s.setSelectedDrop);
  const updateDrop = useAppStore((s) => s.updateDrop);
  const showToast = useAppStore((s) => s.showToast);
  const [isPickingUp, setIsPickingUp] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  const isInRange = (drop.distance_meters ?? Infinity) <= PICKUP_RANGE;
  const isPickedUp = drop.is_picked_up;

  const distanceText = drop.distance_meters != null
    ? drop.distance_meters < 1000
      ? `${Math.round(drop.distance_meters)}m away`
      : `${(drop.distance_meters / 1000).toFixed(1)}km away`
    : '';

  // Load notes for this drop
  useEffect(() => {
    fetchDropNotes(drop.id).then(setNotes).catch(() => {});
  }, [drop.id]);

  const handlePickup = async () => {
    setIsPickingUp(true);
    try {
      await pickupDrop(drop.id);
      updateDrop(drop.id, {
        is_picked_up: true,
        pickup_count: drop.pickup_count + 1,
      });
      showToast(`Collected ${drop.verse_reference}`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#C8973A', '#E8B84B', '#FFFFFF', '#FFD700'],
      });
    } catch (err: any) {
      if (err?.status === 409) {
        showToast('Already in your library');
      }
    }
    setIsPickingUp(false);
  };

  const handleReact = async (type: string) => {
    try {
      const data = await reactToDrop(drop.id, type);
      updateDrop(drop.id, { reactions: data.reactions });
    } catch {}
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const { note } = await addNoteToDrop(drop.id, noteText.trim());
      setNotes((prev) => [note, ...prev]);
      setNoteText('');
      setShowNoteInput(false);
      showToast('Note added');
    } catch {
      showToast('Failed to add note');
    }
    setSubmittingNote(false);
  };

  const timeSince = () => {
    const diff = Date.now() - new Date(drop.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="sheet-overlay" onClick={() => setSelectedDrop(null)}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* Verse display card */}
        <div className="verse-display">
          <div className="verse-ref">{drop.verse_reference}</div>
          <div className="verse-text">&ldquo;{drop.verse_text}&rdquo;</div>
        </div>

        {drop.custom_message && (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 12, fontSize: 13, paddingLeft: 4 }}>
            &ldquo;{drop.custom_message}&rdquo;
          </p>
        )}

        {/* Meta row */}
        <div className="verse-meta">
          <div className="pill">
            {isPickedUp ? '✓ Collected' : distanceText}
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {drop.pickup_count} {drop.pickup_count === 1 ? 'pickup' : 'pickups'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 'auto' }}>
            {timeSince()}
          </span>
        </div>

        <div className="sheet-divider" />

        <ReactionRow reactions={drop.reactions} onReact={handleReact} />

        {/* Notes section */}
        {(isPickedUp || isInRange) && (
          <>
            <div className="sheet-divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Notes {notes.length > 0 && `(${notes.length})`}
              </span>
              {!showNoteInput && (
                <button
                  onClick={() => setShowNoteInput(true)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--gold)',
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Add note
                </button>
              )}
            </div>

            {showNoteInput && (
              <div style={{ marginBottom: 10 }}>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Share your thoughts about this verse or location..."
                  maxLength={500}
                  style={{
                    width: '100%',
                    minHeight: 70,
                    padding: 10,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: 13,
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{noteText.length}/500</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => { setShowNoteInput(false); setNoteText(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim() || submittingNote}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        background: noteText.trim() ? 'var(--gold)' : 'var(--border)',
                        color: 'white',
                        border: 'none',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: noteText.trim() ? 'pointer' : 'default',
                      }}
                    >
                      {submittingNote ? '...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  marginBottom: 6,
                }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)', marginBottom: 4 }}>
                  {note.text}
                </p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {' · '}
                  {note.user_token.slice(0, 6)}...
                </span>
              </div>
            ))}

            {notes.length === 0 && !showNoteInput && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '8px 0' }}>
                No notes yet. Be the first to leave one!
              </p>
            )}
          </>
        )}

        <div style={{ marginTop: 14 }}>
          {isPickedUp ? (
            <button className="gold-btn" disabled>
              In Your Library ✓
            </button>
          ) : isInRange ? (
            <button className="gold-btn" onClick={handlePickup} disabled={isPickingUp}>
              {isPickingUp ? 'Collecting...' : 'Pick Up This Verse'}
            </button>
          ) : (
            <button className="gold-btn" disabled>
              Get closer to pick up ({distanceText})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
