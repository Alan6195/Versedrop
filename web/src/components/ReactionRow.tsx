import React from 'react';

const REACTIONS = [
  { type: 'amen', emoji: '🙏', label: 'Amen' },
  { type: 'heart', emoji: '❤️', label: '' },
  { type: 'pray', emoji: '🙌', label: 'Pray' },
] as const;

interface Props {
  reactions: { amen: number; heart: number; pray: number; user_reaction?: string | null };
  onReact: (type: string) => void;
}

export default function ReactionRow({ reactions, onReact }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {REACTIONS.map(({ type, emoji, label }) => {
        const isActive = reactions.user_reaction === type;
        const count = reactions[type];
        return (
          <button
            key={type}
            className={`reaction-btn ${isActive ? 'active' : ''}`}
            onClick={() => onReact(type)}
          >
            <span className="emoji">{emoji}</span>
            {label && <span>{label}</span>}
            {count > 0 && <span className="count">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
