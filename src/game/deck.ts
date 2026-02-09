/**
 * Deck management - dealing, shuffling, card values
 */

import { Card, Rank, Suit } from './types';

/**
 * Get the blackjack value for a rank
 */
export function getRankValue(rank: Rank): number {
  switch (rank) {
    case Rank.ACE:
      return 11; // Initially 11, adjusted to 1 if needed
    case Rank.TWO:
      return 2;
    case Rank.THREE:
      return 3;
    case Rank.FOUR:
      return 4;
    case Rank.FIVE:
      return 5;
    case Rank.SIX:
      return 6;
    case Rank.SEVEN:
      return 7;
    case Rank.EIGHT:
      return 8;
    case Rank.NINE:
      return 9;
    case Rank.TEN:
    case Rank.JACK:
    case Rank.QUEEN:
    case Rank.KING:
      return 10;
  }
}

/**
 * Create a standard 52-card deck
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  const suits = Object.values(Suit);
  const ranks = Object.values(Rank);

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        value: getRankValue(rank),
      });
    }
  }

  return deck;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal a random card (for practice, we don't need full shoe simulation)
 */
export function dealRandomCard(): Card {
  const deck = createDeck();
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

/**
 * Deal a random hand (2 cards for player, 1 for dealer)
 */
export function dealHand(): { playerCards: Card[]; dealerCard: Card } {
  return {
    playerCards: [dealRandomCard(), dealRandomCard()],
    dealerCard: dealRandomCard(),
  };
}

/**
 * Calculate hand value, accounting for soft aces
 */
export function calculateHandValue(cards: Card[]): { total: number; isSoft: boolean } {
  let total = 0;
  let aces = 0;

  for (const card of cards) {
    total += card.value;
    if (card.rank === Rank.ACE) {
      aces++;
    }
  }

  // Adjust aces from 11 to 1 if needed
  let isSoft = aces > 0 && total <= 21;
  while (total > 21 && aces > 0) {
    total -= 10; // Convert one ace from 11 to 1
    aces--;
    isSoft = aces > 0; // Still soft if we have more aces
  }

  return { total, isSoft };
}

/**
 * Check if hand is a pair (for split option)
 */
export function isPair(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  return cards[0].value === cards[1].value;
}
