/**
 * Hand component - Display a hand of cards with total
 */

import type { Card as CardType } from '../game/types';
import { calculateHandValue } from '../game/deck';
import { Card } from './Card';

interface HandProps {
  cards: CardType[];
  label: string;
  showTotal?: boolean;
  hidden?: boolean;
  className?: string;
}

export const Hand = ({ 
  cards, 
  label, 
  showTotal = true, 
  hidden = false,
  className = '' 
}: HandProps) => {
  const handValue = calculateHandValue(cards);
  const displayTotal = hidden ? '?' : handValue.total;
  const softLabel = handValue.isSoft && !hidden ? ' (soft)' : '';

  return (
    <div className={`hand ${className}`}>
      <div className="hand__label">
        {label}
        {showTotal && (
          <span className="hand__total">
            {displayTotal}{softLabel}
          </span>
        )}
      </div>
      <div className="hand__cards">
        {cards.map((card, index) => (
          <Card
            key={`${card.suit}-${card.rank}-${index}`}
            card={card}
            hidden={hidden && index > 0} // Only show first card if hidden
            className="hand__card"
          />
        ))}
      </div>
    </div>
  );
};
