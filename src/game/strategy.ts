/**
 * Blackjack basic strategy table and optimal action lookup
 * Based on: 6-deck, dealer stands on soft 17, double after split allowed
 */

import { Action, Card, StrategyAction } from './types';
import { calculateHandValue, isPair } from './deck';

/**
 * Strategy table key for lookup
 */
interface StrategyKey {
  playerTotal: number;
  dealerCard: number;
  isSoft: boolean;
  isPair: boolean;
}

/**
 * Get dealer's card value (for strategy lookup)
 */
function getDealerValue(card: Card): number {
  return card.value;
}

/**
 * Get optimal actions with ranking for a given situation
 * Returns array ordered by rank (1 = best, 2 = second-best, etc.)
 */
export function getOptimalActions(
  playerCards: Card[],
  dealerCard: Card,
  canDouble: boolean = true,
  canSplit: boolean = true
): StrategyAction[] {
  const handValue = calculateHandValue(playerCards);
  const dealerValue = getDealerValue(dealerCard);
  const hasPair = isPair(playerCards);

  // Check pair splitting first (highest priority)
  if (hasPair && canSplit) {
    const pairAction = getPairStrategy(playerCards[0].value, dealerValue);
    if (pairAction.length > 0) {
      return pairAction;
    }
  }

  // Check soft hands (ace counted as 11)
  if (handValue.isSoft) {
    return getSoftStrategy(handValue.total, dealerValue, canDouble);
  }

  // Hard hands
  return getHardStrategy(handValue.total, dealerValue, canDouble);
}

/**
 * Pair splitting strategy
 */
function getPairStrategy(pairValue: number, dealerValue: number): StrategyAction[] {
  // Always split Aces and 8s
  if (pairValue === 11 || pairValue === 8) {
    return [
      { action: Action.SPLIT, rank: 1 },
      { action: Action.HIT, rank: 2 },
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Never split 10s or 5s
  if (pairValue === 10 || pairValue === 5) {
    return []; // Fall through to hard total strategy
  }

  // Split 9s against 2-9 except 7
  if (pairValue === 9) {
    if (dealerValue >= 2 && dealerValue <= 9 && dealerValue !== 7) {
      return [
        { action: Action.SPLIT, rank: 1 },
        { action: Action.STAND, rank: 2 },
        { action: Action.HIT, rank: 3 },
      ];
    }
    return [
      { action: Action.STAND, rank: 1 },
      { action: Action.SPLIT, rank: 2 },
      { action: Action.HIT, rank: 3 },
    ];
  }

  // Split 7s against 2-7
  if (pairValue === 7) {
    if (dealerValue >= 2 && dealerValue <= 7) {
      return [
        { action: Action.SPLIT, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.SPLIT, rank: 2 },
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Split 6s against 2-6
  if (pairValue === 6) {
    if (dealerValue >= 2 && dealerValue <= 6) {
      return [
        { action: Action.SPLIT, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.SPLIT, rank: 2 },
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Split 4s against 5-6 (if double after split allowed)
  if (pairValue === 4) {
    if (dealerValue === 5 || dealerValue === 6) {
      return [
        { action: Action.SPLIT, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.SPLIT, rank: 2 },
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Split 3s and 2s against 2-7
  if (pairValue === 3 || pairValue === 2) {
    if (dealerValue >= 2 && dealerValue <= 7) {
      return [
        { action: Action.SPLIT, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.SPLIT, rank: 2 },
      { action: Action.STAND, rank: 3 },
    ];
  }

  return []; // Fall through to hard total
}

/**
 * Soft hand strategy (hand with ace counted as 11)
 */
function getSoftStrategy(
  playerTotal: number,
  dealerValue: number,
  canDouble: boolean
): StrategyAction[] {
  // Soft 19+ (A,8+) - Always stand
  if (playerTotal >= 19) {
    return [
      { action: Action.STAND, rank: 1 },
      { action: Action.HIT, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];
  }

  // Soft 18 (A,7)
  if (playerTotal === 18) {
    if (dealerValue >= 9) {
      return [
        { action: Action.HIT, rank: 1 },
        { action: Action.STAND, rank: 2 },
        ...(canDouble ? [{ action: Action.DOUBLE, rank: 3 }] : []),
      ];
    }
    if (dealerValue >= 3 && dealerValue <= 6 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.STAND, rank: 2 },
        { action: Action.HIT, rank: 3 },
      ];
    }
    return [
      { action: Action.STAND, rank: 1 },
      { action: Action.HIT, rank: 2 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 3 }] : []),
    ];
  }

  // Soft 17 (A,6)
  if (playerTotal === 17) {
    if (dealerValue >= 3 && dealerValue <= 6 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Soft 15-16 (A,4-5)
  if (playerTotal === 15 || playerTotal === 16) {
    if (dealerValue >= 4 && dealerValue <= 6 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Soft 13-14 (A,2-3)
  if (playerTotal === 13 || playerTotal === 14) {
    if (dealerValue >= 5 && dealerValue <= 6 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
      { action: Action.STAND, rank: 3 },
    ];
  }

  // Default: hit
  return [
    { action: Action.HIT, rank: 1 },
    { action: Action.STAND, rank: 2 },
    ...(canDouble ? [{ action: Action.DOUBLE, rank: 3 }] : []),
  ];
}

/**
 * Hard hand strategy (no ace or ace counted as 1)
 */
function getHardStrategy(
  playerTotal: number,
  dealerValue: number,
  canDouble: boolean
): StrategyAction[] {
  // 17+ - Always stand
  if (playerTotal >= 17) {
    return [
      { action: Action.STAND, rank: 1 },
      { action: Action.HIT, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];
  }

  // 13-16 - Stand on dealer 2-6, hit on 7+
  if (playerTotal >= 13 && playerTotal <= 16) {
    if (dealerValue >= 2 && dealerValue <= 6) {
      return [
        { action: Action.STAND, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.DOUBLE, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];
  }

  // 12 - Stand on dealer 4-6, hit otherwise
  if (playerTotal === 12) {
    if (dealerValue >= 4 && dealerValue <= 6) {
      return [
        { action: Action.STAND, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.DOUBLE, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
      { action: Action.DOUBLE, rank: 3 },
    ];
  }

  // 11 - Always double if possible, else hit
  if (playerTotal === 11) {
    if (canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      { action: Action.STAND, rank: 2 },
    ];
  }

  // 10 - Double on dealer 2-9, hit on 10/A
  if (playerTotal === 10) {
    if (dealerValue >= 2 && dealerValue <= 9 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
      { action: Action.STAND, rank: 3 },
    ];
  }

  // 9 - Double on dealer 3-6, hit otherwise
  if (playerTotal === 9) {
    if (dealerValue >= 3 && dealerValue <= 6 && canDouble) {
      return [
        { action: Action.DOUBLE, rank: 1 },
        { action: Action.HIT, rank: 2 },
        { action: Action.STAND, rank: 3 },
      ];
    }
    return [
      { action: Action.HIT, rank: 1 },
      ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
      { action: Action.STAND, rank: 3 },
    ];
  }

  // 8 or less - Always hit
  return [
    { action: Action.HIT, rank: 1 },
    ...(canDouble ? [{ action: Action.DOUBLE, rank: 2 }] : []),
    { action: Action.STAND, rank: 3 },
  ];
}

/**
 * Get available actions for current hand state
 */
export function getAvailableActions(
  playerCards: Card[],
  isFirstAction: boolean = true
): Action[] {
  const actions: Action[] = [Action.HIT, Action.STAND];

  // Double only on first action (2 cards)
  if (isFirstAction && playerCards.length === 2) {
    actions.push(Action.DOUBLE);
  }

  // Split only on pairs
  if (isFirstAction && isPair(playerCards)) {
    actions.push(Action.SPLIT);
  }

  return actions;
}
