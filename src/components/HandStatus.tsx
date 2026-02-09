/**
 * HandStatus - Inline status display during active hand
 */

import { calculateHandValue } from '../game/deck';
import type { Card } from '../game/types';
import './HandStatus.css';

interface HandStatusProps {
  playerCards: Card[];
  dealerCard: Card;
  actionsCount: number;
}

export function HandStatus({ playerCards, dealerCard, actionsCount }: HandStatusProps) {
  const { total, isSoft } = calculateHandValue(playerCards);
  const dealerValue = dealerCard.value;
  
  // Generate status message
  let message = '';
  let className = 'hand-status';
  
  if (total > 21) {
    message = `Bust! (${total})`;
    className += ' hand-status--bust';
  } else if (total === 21) {
    message = `Twenty-one! (${total})`;
    className += ' hand-status--blackjack';
  } else {
    const softText = isSoft ? ' (soft)' : '';
    message = `You have ${total}${softText} vs dealer's ${dealerValue}`;
    
    // Add hint
    if (total < 12) {
      message += ' • Safe to hit';
    } else if (total >= 17) {
      message += ' • Strong hand';
    } else if (dealerValue >= 7) {
      message += ' • Dealer shows strength';
    } else if (dealerValue <= 6) {
      message += ' • Dealer likely to bust';
    }
  }
  
  if (actionsCount > 0) {
    className += ' hand-status--active';
  }
  
  return (
    <div className={className}>
      <div className="hand-status__message">{message}</div>
      {actionsCount > 0 && (
        <div className="hand-status__count">
          {actionsCount} {actionsCount === 1 ? 'action' : 'actions'} taken
        </div>
      )}
    </div>
  );
}
