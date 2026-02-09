/**
 * Jack - Your friendly blackjack dealer guide
 * SVG avatar (sprite-ready for future upgrade)
 */

import { CSSProperties } from 'react';

interface JackProps {
  size?: number;
  mood?: 'neutral' | 'happy' | 'thinking' | 'encouraging';
  style?: CSSProperties;
}

export const Jack = ({ size = 120, mood = 'neutral', style }: JackProps) => {
  return (
    <div className="jack-avatar" style={{ width: size, height: size, ...style }}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Jack the dealer"
      >
        {/* Dealer hat */}
        <ellipse cx="60" cy="25" rx="35" ry="8" fill="#1a1a1a" />
        <rect x="30" y="20" width="60" height="15" rx="2" fill="#1a1a1a" />
        <rect x="45" y="12" width="30" height="8" rx="2" fill="#1a1a1a" />
        
        {/* Hat band */}
        <rect x="30" y="28" width="60" height="4" fill="#d4af37" />
        
        {/* Face */}
        <circle cx="60" cy="60" r="30" fill="#f4c2a4" />
        
        {/* Eyes */}
        {mood === 'happy' ? (
          <>
            {/* Happy eyes (curved) */}
            <path
              d="M 48 55 Q 52 58 56 55"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 64 55 Q 68 58 72 55"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Normal eyes */}
            <circle cx="50" cy="55" r="3" fill="#1a1a1a" />
            <circle cx="70" cy="55" r="3" fill="#1a1a1a" />
          </>
        )}
        
        {/* Smile */}
        {mood === 'happy' ? (
          <path
            d="M 48 70 Q 60 78 72 70"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        ) : mood === 'thinking' ? (
          <line
            x1="50"
            y1="72"
            x2="70"
            y2="72"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 50 70 Q 60 74 70 70"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}
        
        {/* Bow tie */}
        <path
          d="M 50 85 L 45 90 L 50 95 L 55 90 Z"
          fill="#dc143c"
        />
        <path
          d="M 70 85 L 75 90 L 70 95 L 65 90 Z"
          fill="#dc143c"
        />
        <rect x="53" y="88.5" width="14" height="3" fill="#dc143c" />
        <circle cx="60" cy="90" r="2" fill="#fff" opacity="0.8" />
        
        {/* Thinking bubble (only in thinking mood) */}
        {mood === 'thinking' && (
          <>
            <circle cx="85" cy="40" r="3" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
            <circle cx="92" cy="32" r="5" fill="#fff" stroke="#1a1a1a" strokeWidth="1" />
          </>
        )}
        
        {/* Sparkle (only in happy mood) */}
        {mood === 'happy' && (
          <>
            <path
              d="M 90 50 L 92 54 L 96 52 L 92 56 L 94 60 L 90 58 L 86 60 L 88 56 L 84 52 L 88 54 Z"
              fill="#d4af37"
            />
          </>
        )}
      </svg>
    </div>
  );
};

interface JackDialogueProps {
  message: string;
  mood?: 'neutral' | 'happy' | 'thinking' | 'encouraging';
  onClose?: () => void;
}

export const JackDialogue = ({ message, mood = 'neutral', onClose }: JackDialogueProps) => {
  return (
    <div className="jack-dialogue">
      <div className="jack-dialogue__avatar">
        <Jack size={80} mood={mood} />
      </div>
      <div className="jack-dialogue__content">
        <div className="jack-dialogue__header">
          <span className="jack-dialogue__name">Jack says:</span>
        </div>
        <p className="jack-dialogue__message">{message}</p>
        {onClose && (
          <button className="jack-dialogue__close" onClick={onClose} aria-label="Continue">
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
