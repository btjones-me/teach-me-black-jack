/**
 * Card component - CSS-based playing card
 */

import type { Card as CardType } from '../game/types';
import { Suit } from '../game/types';

interface CardProps {
  card: CardType;
  hidden?: boolean;
  className?: string;
}

export const Card = ({ card, hidden = false, className = '' }: CardProps) => {
  const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;
  const suitColor = isRed ? 'red' : 'black';

  if (hidden) {
    return (
      <div className={`card card--hidden ${className}`} aria-label="Hidden card">
        <div className="card__back">
          <div className="card__back-pattern"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card card--${suitColor} ${className}`}
      aria-label={`${card.rank} of ${card.suit}`}
    >
      <div className="card__content">
        <div className="card__corner card__corner--top">
          <span className="card__rank">{card.rank}</span>
          <span className="card__suit">{card.suit}</span>
        </div>
        <div className="card__center">
          <span className="card__suit card__suit--large">{card.suit}</span>
        </div>
        <div className="card__corner card__corner--bottom">
          <span className="card__rank">{card.rank}</span>
          <span className="card__suit">{card.suit}</span>
        </div>
      </div>
    </div>
  );
};
